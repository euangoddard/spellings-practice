import {
  component$,
  useVisibleTask$,
  type ReadonlySignal,
} from "@builder.io/qwik";
import { type DocumentHead, Link, routeLoader$ } from "@builder.io/qwik-city";
import { BottomNav } from "~/components/bottom-nav/bottom-nav";
import { buildConfetti } from "~/shared/confetti";
import { type Challenge, resolveChallenge } from "~/shared/loader-helpers";
import { useScore } from "~/shared/loaders";
export { useScore } from "~/shared/loaders";

export default component$(() => {
  const challenge = useChallenge() as ReadonlySignal<Challenge>;
  const score = useScore();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    buildConfetti(0.5, 0.8);
  });

  return (
    <>
      <div class="mx-auto max-w-xl">
        <h2 class="mb-4 text-xl font-medium">You're done!</h2>
        <p class="text-l mb-4">
          You have finished{" "}
          <span class="text-accent">{challenge.value.name}</span> spelling
          challenge!
        </p>
        <div class="mb-4 flex justify-center">
          <div class="stats shadow">
            <div class="stat place-items-center">
              <div class="stat-title">You scored</div>
              <div class="stat-value text-secondary">{score.value}</div>
              <div class="stat-desc">
                out of a possible {challenge.value.spellings.length}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav>
        <Link href="/" class="btn btn-secondary btn-block mb-2">
          Create a new challenge
        </Link>
        <Link
          href={`/practice/${challenge.value.id}/`}
          class="btn btn-primary btn-block"
        >
          Play again
        </Link>
      </BottomNav>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const challenge = resolveValue(useChallenge);
  return {
    title: `Spelling practice: "${challenge!.name}" complete!`,
    meta: [
      {
        name: "description",
        content: `You finished "${challenge!.name}"`,
      },
    ],
  };
};

export const useChallenge = routeLoader$<Challenge | undefined>(
  async ({ params, platform, status }) => {
    const { SPELLINGS } = platform.env as { SPELLINGS: KVNamespace };
    const challenge = await resolveChallenge(params, SPELLINGS);

    if (!challenge?.spellings) {
      status(404);
    } else {
      return challenge;
    }
  },
);
