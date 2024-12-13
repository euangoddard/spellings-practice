import { component$, type QRL, useSignal } from "@builder.io/qwik";

export interface AnswerProps {
  number: number;
  word: string;
  audioUrl: string | null;
  onCorrect$: QRL<() => void>;
}

enum AnswerState {
  Pending,
  Incorrect,
  Correct,
}

export const Answer = component$<AnswerProps>(
  ({ number, word, audioUrl, onCorrect$ }) => {
    const state = useSignal(AnswerState.Pending);
    const audioRef = useSignal<HTMLAudioElement>();
    const answer = useSignal("");

    return (
      <div class="mb-2 flex items-center gap-1" style="height: 48px">
        <div class="kbd">{number}</div>

        {state.value == AnswerState.Correct ? (
          <>
            <svg
              class="fill-success pl-2"
              xmlns="http://www.w3.org/2000/svg"
              height="42"
              viewBox="0 -960 960 960"
              width="42"
            >
              <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
            <div class="text-2xl font-semibold text-success">{word}</div>
          </>
        ) : (
          <form
            preventdefault:submit
            onSubmit$={() => {
              if (answer.value === word) {
                onCorrect$();
                state.value = AnswerState.Correct;
              } else {
                state.value = AnswerState.Incorrect;
              }
            }}
            class="flex shrink grow items-center gap-1"
          >
            {audioUrl && <audio src={audioUrl} ref={audioRef} />}
            <input type="hidden" name="word" value={word} />
            <button
              class="btn btn-square btn-secondary"
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
                fill="#000000"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            </button>
            <input
              type="text"
              name="spelling"
              class={{
                input: true,
                "input-bordered": true,
                "w-48": true,
                grow: true,
                "border-error": state.value == AnswerState.Incorrect,
              }}
              placeholder="Spell the word you hear"
              spellcheck={false}
              autoComplete="off"
              autoCorrect="off"
              onInput$={(e) => {
                answer.value = (e.target as any)?.value
                  .trim()
                  .toLocaleLowerCase();
                state.value = AnswerState.Pending;
              }}
            />

            <button
              class="btn btn-primary"
              type="submit"
              disabled={!answer.value}
            >
              Check
            </button>
          </form>
        )}
      </div>
    );
  },
);
