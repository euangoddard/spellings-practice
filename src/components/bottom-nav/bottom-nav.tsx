import { component$, Slot } from "@builder.io/qwik";

export const BottomNav = component$(() => {
  return (
    <nav class="fixed bottom-4 left-4 right-4">
      <div class="mx-auto max-w-xl">
        <Slot />
      </div>
    </nav>
  );
});
