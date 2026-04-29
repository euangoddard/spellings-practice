import { component$, Slot } from "@builder.io/qwik";

export const BottomNav = component$(() => {
  return (
    <nav class="fixed right-4 bottom-4 left-4">
      <div class="mx-auto max-w-xl">
        <Slot />
      </div>
    </nav>
  );
});
