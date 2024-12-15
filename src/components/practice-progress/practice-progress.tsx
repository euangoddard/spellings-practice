import { component$, Slot } from "@builder.io/qwik";

export interface PracticeProgressProps {
  total: number;
  completed: number;
}

export const PracticeProgress = component$<PracticeProgressProps>(
  ({ completed, total }) => {
    return (
      <>
        <div class="flex items-center justify-between">
          <Slot />
          <h6 class="text-center text-xs font-medium">
            {completed} of {total}
          </h6>
        </div>
        <progress
          class="progress progress-accent mb-2 w-full"
          value={completed}
          max={total}
        ></progress>
      </>
    );
  },
);
