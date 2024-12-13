import { component$ } from "@builder.io/qwik";

export interface PracticeProgressProps {
  total: number;
  completed: number;
}

export const PracticeProgress = component$<PracticeProgressProps>(
  ({ completed, total }) => {
    return (
      <div>
        <h6 class="text-center text-xs font-medium">
          {completed} of {total}
        </h6>
        <progress
          class="progress progress-accent mb-4 w-full"
          value={completed}
          max={total}
        ></progress>
      </div>
    );
  },
);
