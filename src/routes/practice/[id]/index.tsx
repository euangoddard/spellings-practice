import { component$, useSignal, type ReadonlySignal } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeAction$,
  routeLoader$,
  useNavigate,
} from "@builder.io/qwik-city";
import { BottomNav } from "~/components/bottom-nav/bottom-nav";
import { quizCutOff, scoreCookieName } from "~/shared/constants";
import { type Challenge, resolveChallenge } from "~/shared/loader-helpers";

export default component$(() => {
  const challenge = useChallenge() as ReadonlySignal<Challenge>;
  const clearScore = useClearScore();
  const navigate = useNavigate();

  const quizUrl = useSignal(
    buildQuizUrl(challenge.value.id, challenge.value.spellings.length),
  );

  return (
    <>
      <div class="mx-auto max-w-xl">
        <h2 class="mb-4 text-xl font-medium">Practice spellings</h2>
        <h3 class="text-l mb-4 leading-relaxed">
          Welcome to <span class="text-accent">{challenge.value.name}</span>{" "}
          spelling challenge!
        </h3>
        <div class="mb-4 flex justify-center">
          <div class="stats shadow">
            <div class="stat place-items-center">
              <div class="stat-title">There are</div>
              <div class="stat-value text-secondary">
                {challenge.value.spellings.length}
              </div>
              <div class="stat-desc">words to practice</div>
            </div>
          </div>
        </div>
        <ol class="list-inside list-decimal leading-relaxed">
          <li class="mb-1">
            Listen to the word by clicking the{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              class="inline-block"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                class="fill-secondary"
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
              />
            </svg>{" "}
            button
          </li>
          <li class="mb-1">Type the word with the keyboard</li>
          <li class="mb-1">
            Tap the <strong>Check</strong> button to see if you spelled it
            correctly.
          </li>
        </ol>
      </div>
      <BottomNav>
        {quizUrl.value && (
          <button
            type="button"
            class="btn btn-secondary btn-block mb-2"
            onClick$={async () => {
              await clearScore.submit();
              navigate(quizUrl.value!);
            }}
          >
            Start quiz ({quizCutOff} random words)
          </button>
        )}
        <button
          type="button"
          class="btn btn-primary btn-block"
          onClick$={async () => {
            await clearScore.submit();
            navigate(`/practice/${challenge.value.id}/1/`);
          }}
        >
          Start challenge
        </button>
      </BottomNav>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const challenge = resolveValue(useChallenge);
  return {
    title: `Spelling practice: "${challenge!.name}"`,
    meta: [
      {
        name: "description",
        content: `Challenge "${challenge!.name}" containing ${challenge!.spellings.length} words`,
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

export const useClearScore = routeAction$((_, { cookie }) => {
  cookie.delete(scoreCookieName, { path: "/" });
  return {
    success: true,
  };
});

const buildQuizUrl = (
  challengeId: string,
  wordCount: number,
): string | null => {
  if (wordCount < quizCutOff) {
    return null;
  }
  const url = new URL(`/quiz/${challengeId}/1/`, import.meta.url);
  for (const index of getNRandomIndices(quizCutOff, wordCount)) {
    url.searchParams.append("i", index.toString());
  }

  return url.pathname + url.search;
};

function* getNRandomIndices(n: number, max: number) {
  const indices = new Set<number>();
  while (indices.size < n) {
    const index = Math.floor(Math.random() * max);
    if (!indices.has(index)) {
      indices.add(index);
      yield index;
    }
  }
}
