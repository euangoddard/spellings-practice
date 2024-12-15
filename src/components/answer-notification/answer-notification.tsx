import { component$, Slot, useStyles$, type JSXOutput } from "@builder.io/qwik";
import { AnswerState } from "~/shared/models";
import style from "./answer-notification.css?inline";

export interface AnswerNotificationProps {
  state: AnswerState;
  word: string;
  attempts: number;
}

export const AnswerNotification = component$<AnswerNotificationProps>(
  ({ state, word, attempts }) => {
    useStyles$(style);
    const classes = {
      border: "border-transparent",
      background: "bg-transparent",
      text: "text-transparent",
    };
    let alertText: string | JSXOutput = "-";
    if (state === AnswerState.Correct) {
      alertText = "That's correct!";
      classes.border = "border-success";
      classes.background = "bg-success-translucent";
      classes.text = "text-success";
    } else if (state === AnswerState.Mistake) {
      if (attempts === 1) {
        alertText = (
          <>
            Not quite right. <strong>Last try</strong>.
          </>
        );
      } else {
        alertText = (
          <>
            Not quite right. You have <strong>{attempts}</strong> tries left.
          </>
        );
      }
      classes.border = "border-warning";
      classes.background = "bg-warning-translucent";
      classes.text = "text-warning";
    } else if (state === AnswerState.Incorrect) {
      alertText = (
        <>
          Not quite right. The correct answer is <strong>{word}</strong>.
        </>
      );
      classes.border = "border-error";
      classes.background = "bg-error-translucent";
      classes.text = "text-error";
    }

    return (
      <div
        class={[
          "mt-4 border-t py-4 transition-all",
          classes.border,
          classes.background,
        ]}
      >
        <div class="mx-auto max-w-xl px-4">
          <p class={["pb-4 text-sm font-medium", classes.text]}>{alertText}</p>
          <Slot />
        </div>
      </div>
    );
  },
);
