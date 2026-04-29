import {
  component$,
  type QRL,
  useSignal,
  useStore,
  useStyles$,
} from "@builder.io/qwik";
import { Keyboard } from "../keyboard/keyboard";
import { AnswerState } from "~/shared/models";
import { AnswerNotification } from "../answer-notification/answer-notification";
import styles from "./spelling-challenge.css?inline";
import { ContinueButton } from "../continue-button/continue-button";
import { vibrate } from "~/shared/vibrate";
import { AnswerValue } from "../answer-value/answer-value";

export interface SpellingChallengeProps {
  word: string;
  hint?: string;
  audioUrl: string | null;
  nextUrl: string;
  onCorrect$: QRL<() => void>;
}

const maxAttempts = 3;

const redactWord = (hint: string, word: string): string => {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return hint.replace(new RegExp(escaped, "gi"), "_".repeat(word.length));
};

export const SpellingChallenge = component$<SpellingChallengeProps>(
  ({ word, hint, audioUrl, nextUrl, onCorrect$ }) => {
    useStyles$(styles);
    const store = useStore({
      state: AnswerState.Pending,
      answer: "",
      attempt: 1,
    });
    const audioRef = useSignal<HTMLAudioElement>();
    const correctSound = useSignal<HTMLAudioElement>();
    const incorrectSound = useSignal<HTMLAudioElement>();

    return (
      <>
        {audioUrl && <audio src={audioUrl} ref={audioRef} />}
        <audio src="/sounds/correct.mp3" ref={correctSound} />
        <audio src="/sounds/incorrect.mp3" ref={incorrectSound} />
        <button
          class="btn btn-secondary mb-4 w-full"
          type="button"
          onClick$={() => {
            if (audioRef.value) {
              audioRef.value.play();
            } else {
              const synth = window.speechSynthesis;
              const utterThis = new SpeechSynthesisUtterance(word);
              synth.speak(utterThis);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#fff"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              class="fill-secondary-content"
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
            />
          </svg>
          Listen to word
        </button>
        {hint && (
          <div class="rounded-box bg-base-200 mb-4 px-4 py-3">
            <p class="text-base-content/50 mb-1 text-xs font-medium tracking-wide uppercase">
              Hint
            </p>
            <p class="text-base-content/70 text-sm italic">
              "{redactWord(hint, word)}"
            </p>
          </div>
        )}
        <AnswerValue value={store.answer} />
        <div class="fixed right-0 bottom-0 left-0">
          <Keyboard
            onKey$={(key: string) => {
              if (key === "⌫") {
                store.answer = store.answer.slice(0, -1);
              } else if (key === "↵") {
                vibrate(50);
                if (store.answer === word) {
                  store.state = AnswerState.Correct;
                  correctSound.value?.play();
                  onCorrect$();
                } else if (store.attempt < maxAttempts) {
                  store.attempt += 1;
                  store.state = AnswerState.Mistake;
                  incorrectSound.value?.play();
                } else {
                  store.state = AnswerState.Incorrect;
                  incorrectSound.value?.play();
                }
              } else {
                store.answer += key;
              }
            }}
          />

          <AnswerNotification
            state={store.state}
            word={word}
            attempts={1 + maxAttempts - store.attempt}
          >
            {store.state === AnswerState.Pending ? (
              <button
                class="btn btn-primary w-full"
                disabled={store.answer === ""}
                type="button"
                onClick$={() => {
                  vibrate(50);
                  if (store.answer === word) {
                    store.state = AnswerState.Correct;
                    correctSound.value?.play();
                    onCorrect$();
                  } else if (store.attempt < maxAttempts) {
                    store.attempt += 1;
                    store.state = AnswerState.Mistake;
                    incorrectSound.value?.play();
                  } else {
                    store.state = AnswerState.Incorrect;
                    incorrectSound.value?.play();
                  }
                }}
              >
                Check
              </button>
            ) : store.state === AnswerState.Mistake ? (
              <button
                class="btn btn-warning w-full"
                type="button"
                onClick$={() => {
                  vibrate(50);
                  store.state = AnswerState.Pending;
                }}
              >
                Try again
              </button>
            ) : (
              <ContinueButton state={store.state} nextUrl={nextUrl} />
            )}
          </AnswerNotification>
        </div>
      </>
    );
  },
);
