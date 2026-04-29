import { component$ } from "@builder.io/qwik";

export interface AnswerValueProps {
  value: string;
}

export const AnswerValue = component$<AnswerValueProps>(({ value }) => {
  return (
    <div class="border-accent mb-4 flex border-b p-4 text-lg">
      {value}
      <div class="cursor border-neutral w-[1px] border-r"></div>
      {!value && (
        <span class="text-neutral-content select-none">
          Spell the word you hear
        </span>
      )}
    </div>
  );
});
