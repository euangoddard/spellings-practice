import { component$, type QRL } from "@builder.io/qwik";

export interface SaveButtonProps {
  isSaved: boolean;
  isSaving: boolean;
  onSave$: QRL<() => void>;
  onRemove$: QRL<() => void>;
}

export const SaveButton = component$<SaveButtonProps>(
  ({ isSaved, isSaving, onSave$, onRemove$ }) => {
    const buttonClasses = ["btn btn-accent w-full mb-2"];
    if (isSaving) {
      buttonClasses.push("btn-loading");
    }
    return (
      <button
        type="button"
        class={buttonClasses}
        onClick$={async () => {
          if (isSaved) {
            onRemove$();
          } else {
            onSave$();
          }
        }}
      >
        {isSaved ? "Remove saved practice" : "Save practice"}
      </button>
    );
  },
);
