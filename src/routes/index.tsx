import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { BottomNav } from "~/components/bottom-nav/bottom-nav";
import {
  type Challenge,
  getSavedChallenges,
  resolveChallenge,
} from "~/shared/loader-helpers";

export default component$(() => {
  const savedPractices = useSavedPractices();

  return (
    <>
      <div class="mx-auto max-w-xl pb-[5rem]">
        <h2 class="mb-4 text-xl font-medium">Welcome to spelling practice!</h2>
        <h3 class="text-l mb-4 font-medium">Saved practices</h3>
        {savedPractices.value.length === 0 ? (
          <p class="mb-4 italic opacity-75">
            You have no saved practices yet! Once you save a practice it will
            appear here
          </p>
        ) : (
          <ul class="list-inside list-disc">
            {savedPractices.value.map((practice) => (
              <li key={practice.id} class="mb-2">
                <Link class="link-secondary" href={`/practice/${practice.id}`}>
                  {practice.name} (
                  <span class="font-medium">{practice.spellings.length}</span>)
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <BottomNav>
        <Link class="btn btn-primary w-full" href="/create">
          Create a new practice
        </Link>
      </BottomNav>
    </>
  );
});

export const head: DocumentHead = {
  title: "Spelling practice",
  meta: [
    {
      name: "description",
      content: "Spelling practice game to help you improve your spelling",
    },
  ],
};

export const useSavedPractices = routeLoader$<readonly Challenge[]>(
  async ({ cookie, platform }) => {
    const { SPELLINGS } = platform.env as { SPELLINGS: KVNamespace };
    const savedPracticeIds = getSavedChallenges(cookie);
    const challengePromises = savedPracticeIds.map((challengeId) =>
      resolveChallenge(challengeId, SPELLINGS),
    );
    const challenges = await Promise.all(challengePromises);
    return challenges.filter((challenge) => challenge !== null);
  },
);
