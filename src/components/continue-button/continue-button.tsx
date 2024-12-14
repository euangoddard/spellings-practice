import { component$, useSignal } from "@builder.io/qwik";
import { AnswerState } from "~/shared/models";

export interface ContinueButtonProps {
  state: AnswerState;
  nextUrl: string;
}

export const ContinueButton = component$<ContinueButtonProps>(
  ({ state, nextUrl }) => {
    const isLoading = useSignal(false);
    const btnClasses = [
      "btn btn-block",
      state === AnswerState.Correct ? "btn-success" : "btn-error",
    ];
    if (isLoading.value) {
      btnClasses.push("btn-loading");
    }
    return (
      <a
        class={btnClasses}
        type="button"
        href={nextUrl}
        onPointerUp$={() => (isLoading.value = true)}
      >
        {isLoading.value ? (
          <span class="loading loading-spinner" />
        ) : (
          "Continue"
        )}
      </a>
    );
  },
);
