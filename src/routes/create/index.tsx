import { component$, useComputed$, useStore } from "@builder.io/qwik";
import {
  routeAction$,
  z,
  zod$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { generateBase62UUID } from "~/shared/random-id";

interface SpellingEntry {
  word: string;
  hint: string;
}

export default component$(() => {
  const updateSpellings = useUpdateSpellings();

  const state = useStore<{ name: string; spellings: SpellingEntry[] }>({
    name: "",
    spellings: [{ word: "", hint: "" }],
  });

  const canSubmit = useComputed$(
    () =>
      state.name.trim().length >= 2 &&
      state.spellings.some((s) => s.word.trim().length > 0),
  );

  const errorMessages = useComputed$(() =>
    Object.values(updateSpellings.value?.fieldErrors ?? {}).flat(),
  );

  return (
    <div class="mx-auto max-w-xl">
      <h2 class="mb-2 text-xl font-medium">Enter spellings</h2>
      <p class="mb-4 max-w-prose leading-relaxed">
        Name this spelling practice, e.g. "<em>Week 1 spellings</em>", then add
        the spellings below. Each word can have an optional hint sentence to
        give context during practice.
      </p>

      <form
        preventdefault:submit
        onSubmit$={async () => {
          const validSpellings = state.spellings
            .filter((s) => s.word.trim())
            .map((s) => ({
              word: s.word.trim().toLowerCase(),
              ...(s.hint.trim() ? { hint: s.hint.trim() } : {}),
            }));
          await updateSpellings.submit({
            name: state.name,
            spellings: JSON.stringify(validSpellings),
          });
        }}
      >
        <label
          class={{
            input: true,
            "input-bordered": false,
            "mb-6": true,
            flex: true,
            "items-center": true,
            "gap-2": true,
          }}
        >
          Name
          <input
            type="text"
            class="grow"
            placeholder="Name this practice"
            autoComplete="off"
            value={state.name}
            onInput$={(_, el) => (state.name = el.value)}
          />
        </label>

        <div class="mb-2">
          {state.spellings.map((spelling, i) => (
            <div key={i} class="card card-bordered bg-base-100 mb-3 shadow-sm">
              <div class="card-body gap-2 p-4">
                <div class="mb-1 flex items-center justify-between">
                  <span class="text-sm font-medium">Word {i + 1}</span>
                  {state.spellings.length > 1 && (
                    <button
                      type="button"
                      class="btn btn-ghost btn-xs text-error"
                      onClick$={() => state.spellings.splice(i, 1)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <label class="input input-bordered input-sm flex items-center gap-2">
                  <span class="text-base-content/50 w-8 shrink-0 text-xs">
                    Word
                  </span>
                  <input
                    type="text"
                    class="grow"
                    placeholder="e.g. beautiful"
                    autoComplete="off"
                    autoCapitalize="none"
                    value={spelling.word}
                    onInput$={(_, el) => (state.spellings[i].word = el.value)}
                  />
                </label>
                <label class="input input-bordered input-sm flex items-center gap-2">
                  <span class="text-base-content/50 w-8 shrink-0 text-xs">
                    Hint
                  </span>
                  <input
                    type="text"
                    class="grow"
                    placeholder="Optional sentence, e.g. The sunset was beautiful"
                    autoComplete="off"
                    value={spelling.hint}
                    onInput$={(_, el) => (state.spellings[i].hint = el.value)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          class="btn btn-ghost btn-sm mb-4 w-full"
          onClick$={() => state.spellings.push({ word: "", hint: "" })}
        >
          + Add another spelling
        </button>

        {updateSpellings.value?.failed && (
          <div role="alert" class="alert alert-error mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessages.value.join("; ")}</span>
          </div>
        )}

        <button
          class="btn btn-primary w-full"
          type="submit"
          disabled={!canSubmit.value}
        >
          Start
        </button>
      </form>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Spelling practice - update your spellings",
  meta: [
    {
      name: "description",
      content: "Spelling practice game to help you improve your spelling",
    },
  ],
};

export const useUpdateSpellings = routeAction$(
  async (form, { redirect, platform }) => {
    const { SPELLINGS } = platform.env as { SPELLINGS: KVNamespace };

    let spellings: Array<{ word: string; hint?: string }>;
    try {
      const parsed = JSON.parse(form.spellings);
      spellings = (parsed as Array<{ word?: string; hint?: string }>)
        .filter((s) => s.word?.trim())
        .map((s) => ({
          word: s.word!.trim().toLowerCase(),
          ...(s.hint?.trim() ? { hint: s.hint.trim() } : {}),
        }));
    } catch {
      return {
        failed: true,
        fieldErrors: { spellings: ["Invalid spellings data"] },
      };
    }

    if (spellings.length === 0) {
      return {
        failed: true,
        fieldErrors: { spellings: ["Enter at least one spelling"] },
      };
    }

    const id = generateBase62UUID();
    await SPELLINGS.put(
      id,
      JSON.stringify({ name: form.name.trim(), spellings }),
    );
    redirect(302, `/practice/${id}`);
    return { success: true };
  },
  zod$({
    name: z.string().min(2, "Name must be at least 2 characters"),
    spellings: z.string().min(1, "Enter at least one spelling"),
  }),
);
