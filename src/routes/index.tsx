import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  z,
  zod$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { generateBase62UUID } from "~/utils/random-id";

export default component$(() => {
  const updateSpellings = useUpdateSpellings();

  const errorMessages = Object.values(updateSpellings.value?.fieldErrors || {});

  return (
    <div class="mx-auto max-w-xl">
      <h2 class="mb-2 text-xl font-medium">Enter spellings</h2>
      <p class="mb-4 max-w-prose leading-relaxed">
        Choose a name for this spelling practice session, e.g. "
        <em>Week 1 spellings</em>", then enter the spellings you want to
        practice. You can enter as many spellings as you want. Each spelling
        should be on a new line.
      </p>

      <Form action={updateSpellings}>
        <label
          class={{
            input: true,
            "input-bordered": true,
            "mb-2": true,
            flex: true,
            "items-center": true,
            "gap-2": true,
            "input-error": updateSpellings.value?.fieldErrors?.name,
          }}
        >
          Name
          <input
            type="text"
            class="grow"
            placeholder="Something to identify these spellings"
            name="name"
            autoComplete="off"
          />
        </label>
        <div class="form-control">
          <textarea
            placeholder="Enter one spelling per line"
            class={{
              textarea: true,
              "textarea-bordered": true,
              "textarea-lg": true,
              "mb-2": true,
              "min-h-80": true,
              "w-full": true,
              "textarea-error": updateSpellings.value?.fieldErrors?.spellings,
            }}
            name="spellings"
          ></textarea>
        </div>
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
            <span>{errorMessages.join("; ")}</span>
          </div>
        )}
        <button class="btn btn-primary btn-block" type="submit">
          Start
        </button>
      </Form>
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
    const spellings = form.spellings
      .split("\n")
      .map((spelling: string) => spelling.trim().toLocaleLowerCase())
      .filter(Boolean);
    const id = generateBase62UUID();
    await SPELLINGS.put(
      id,
      JSON.stringify({ name: form.name.trim(), spellings }),
    );
    redirect(302, `/practice/${id}`);
    return {
      success: true,
    };
  },
  zod$({
    name: z.string().min(2, "Name must be at least 2 characters"),
    spellings: z.string().min(2, "Enter at least one spelling"),
  }),
);
