import { component$ } from "@builder.io/qwik";
import { AnswerState } from "~/shared/models";

export interface ContinueButtonProps {
  state: AnswerState;
  nextUrl: string;
}

export const ContinueButton = component$<ContinueButtonProps>(
  ({ state, nextUrl }) => {
    const btnClass =
      state === AnswerState.Correct ? "btn-success" : "btn-error";
    return (
      <a class={["btn btn-block", btnClass]} type="button" href={nextUrl}>
        Continue
      </a>
    );
  },
);
