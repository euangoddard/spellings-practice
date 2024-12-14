import {
  $,
  component$,
  type QRL,
  useSignal,
  useStore,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Keyboard } from "../keyboard/keyboard";
import { AnswerState } from "~/utils/models";
import { AnswerNotification } from "../answer-notification/answer-notification";
import styles from "./spelling-challenge.css?inline";
import { ContinueButton } from "../continue-button/continue-button";
import { sessionStore } from "~/utils/session-store";

export interface SpellingChallengeProps {
  word: string;
  audioUrl: string | null;
  nextUrl: string;
}

interface SpellingStore {
  state: AnswerState;
  answer: string;
  score: number;
  incrementScore: QRL<(this: SpellingStore) => void>;
}

export const SpellingChallenge = component$<SpellingChallengeProps>(
  ({ word, audioUrl, nextUrl }) => {
    useStyles$(styles);
    const store = useStore<SpellingStore>({
      state: AnswerState.Pending,
      answer: "",
      score: 0,
      incrementScore: $(function (this: SpellingStore) {
        this.score += 1;
        sessionStore.set("score", this.score);
      }),
    });
    const audioRef = useSignal<HTMLAudioElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      store.score = sessionStore.get("score") || 0;
    });

    return (
      <>
        {audioUrl && <audio src={audioUrl} ref={audioRef} />}
        <button
          class="btn btn-secondary btn-block mb-4"
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
        <div class="mb-4 flex border-b border-accent p-4 text-lg">
          {store.answer}
          <div class="cursor w-[1px] border-r border-neutral"></div>
          {!store.answer && (
            <span class="select-none text-neutral-content">
              Spell the word you hear
            </span>
          )}
        </div>
        <div class="fixed bottom-0 left-0 right-0">
          <Keyboard
            onKey$={(key: string) => {
              if (key === "⌫") {
                store.answer = store.answer.slice(0, -1);
              } else if (key === "↵") {
                navigator.vibrate(50);
                if (store.answer === word) {
                  store.state = AnswerState.Correct;
                  store.incrementScore();
                } else {
                  store.state = AnswerState.Incorrect;
                }
              } else {
                store.answer += key;
              }
            }}
          />

          <AnswerNotification state={store.state} word={word}>
            {store.state === AnswerState.Pending ? (
              <button
                class="btn btn-primary btn-block"
                disabled={store.answer === ""}
                type="button"
                onClick$={() => {
                  navigator.vibrate(50);
                  if (store.answer === word) {
                    store.state = AnswerState.Correct;
                    store.incrementScore();
                  } else {
                    store.state = AnswerState.Incorrect;
                  }
                }}
              >
                Check
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
