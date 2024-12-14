import { component$, type ReadonlySignal } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { PracticeProgress } from "~/components/practice-progress/practice-progress";
import { SpellingChallenge } from "~/components/spelling-challenge/spelling-challenge";
import { type Challenge, resolveChallenge } from "~/shared/loaders";

export default component$(() => {
  const challengeSession =
    useChallengeSession() as ReadonlySignal<ChallengeSession>;

  const nextUrl = getNextUrl(
    challengeSession.value.challenge,
    challengeSession.value.index,
  );

  return (
    <div class="mx-auto max-w-xl">
      <h2 class="text-xl font-medium">
        {challengeSession.value.challenge.name} challenge
      </h2>
      <PracticeProgress
        total={challengeSession.value.challenge.spellings.length}
        completed={challengeSession.value.index + 1}
      />

      <SpellingChallenge
        word={challengeSession.value.word}
        audioUrl={challengeSession.value.audioFile}
        nextUrl={nextUrl}
      />
    </div>
  );
});

const getNextUrl = (challenge: Challenge, index: number) => {
  if (index < challenge.spellings.length - 1) {
    return `/practice/${challenge.id}/${index + 2}/`;
  }
  return `/complete/${challenge.id}/`;
};

export const head: DocumentHead = ({ resolveValue }) => {
  const challengeSession = resolveValue(useChallengeSession);
  const challengeName = challengeSession?.challenge.name ?? "Spelling practice";
  const index = (challengeSession?.index ?? 0) + 1;
  return {
    title: `Spelling practice: "${challengeName}" - word ${index}`,
    meta: [
      {
        name: "description",
        content: `Challenge "${challengeName}", word ${index} of ${challengeSession!.challenge.spellings.length} words`,
      },
    ],
  };
};

interface ChallengeSession {
  index: number;
  word: string;
  audioFile: string | null;
  challenge: Challenge;
}

export const useChallengeSession = routeLoader$<ChallengeSession | undefined>(
  async ({ params, platform, redirect }) => {
    const { WORDS, SPELLINGS } = platform.env as {
      WORDS: KVNamespace;
      SPELLINGS: KVNamespace;
    };
    const indexParam = params["index"];

    // The index is 1-based in the URI, but 0-based in the array
    const index = parseInt(indexParam, 10) - 1;
    const challenge = await resolveChallenge(params, SPELLINGS);
    const spellings = challenge?.spellings ?? [];
    const word = spellings[index];
    if (word) {
      const audioFile = await WORDS.get(word);
      return { index, word, audioFile, challenge: challenge! };
    } else {
      redirect(302, "/");
    }
  },
);
