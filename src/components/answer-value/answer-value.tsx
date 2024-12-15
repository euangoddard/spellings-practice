import { component$ } from "@builder.io/qwik";

export interface AnswerValueProps {
  value: string;
}

export const AnswerValue = component$<AnswerValueProps>(({ value }) => {
  return (
    <div class="mb-4 flex border-b border-accent p-4 text-lg">
      {value}
      <div class="cursor w-[1px] border-r border-neutral"></div>
      {!value && (
        <span class="select-none text-neutral-content">
          Spell the word you hear
        </span>
      )}
    </div>
  );
});
