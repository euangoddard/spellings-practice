import { $, component$, useOnDocument, type QRL } from "@builder.io/qwik";
import { vibrate } from "~/utils/vibrate";

export interface KeyboardProps {
  onKey$: QRL<(key: string) => void>;
}

const keys = ["qwertyuiop", "asdfghjkl", "↵zxcvbnm⌫"] as const;

export const Keyboard = component$<KeyboardProps>(({ onKey$ }) => {
  useOnDocument(
    "keyup",
    $((event: KeyboardEvent) => {
      if (event.key.length === 1) {
        onKey$(event.key.toLowerCase());
      } else if (event.key === "Enter") {
        onKey$("↵");
      } else if (event.key === "Backspace") {
        onKey$("⌫");
      }
    }),
  );
  return (
    <div class="mb-4 px-4">
      {keys.map((row, index) => (
        <div class="mb-1 flex justify-center gap-1" key={index}>
          {row.split("").map((key) => (
            <button
              class="btn btn-lg grow px-[12px] md:flex-none md:px-4"
              key={key}
              onPointerUp$={() => {
                vibrate(10);
                onKey$(key);
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
});
