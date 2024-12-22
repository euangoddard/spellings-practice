import { component$, type ReadonlySignal } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { PracticeProgress } from "~/components/practice-progress/practice-progress";
import { SpellingChallenge } from "~/components/spelling-challenge/spelling-challenge";
import { quizCutOff } from "~/shared/constants";
import { type Challenge, resolveChallenge } from "~/shared/loader-helpers";
import { useIncrementScore } from "~/shared/actions";
export { useIncrementScore } from "~/shared/actions";

export default component$(() => {
  const quizSession = useQuizSession() as ReadonlySignal<QuizSession>;
  const incrementScore = useIncrementScore();

  const { challenge, index, indices } = quizSession.value;
  const nextUrl = getNextUrl(challenge, indices, index);

  return (
    <div class="mx-auto max-w-xl">
      <PracticeProgress total={quizCutOff} completed={index + 1}>
        <h2 class="mb-2 text-xl font-medium">{challenge.name} quiz</h2>
      </PracticeProgress>

      <SpellingChallenge
        word={quizSession.value.word}
        audioUrl={quizSession.value.audioFile}
        nextUrl={nextUrl}
        onCorrect$={() => incrementScore.submit()}
      />
    </div>
  );
});

const getNextUrl = (
  challenge: Challenge,
  indices: readonly number[],
  index: number,
) => {
  if (index < quizCutOff - 1) {
    const searchParams = new URLSearchParams();
    for (const i of indices) {
      searchParams.append("i", i.toString());
    }
    return `/quiz/${challenge.id}/${index + 2}/?${searchParams.toString()}`;
  }
  return `/complete/quiz/${challenge.id}/`;
};

export const head: DocumentHead = ({ resolveValue }) => {
  const challengeSession = resolveValue(useQuizSession);
  const challengeName = challengeSession?.challenge.name ?? "Spelling practice";
  const index = (challengeSession?.index ?? 0) + 1;
  return {
    title: `Quiz for: "${challengeName}" - word ${index}`,
    meta: [
      {
        name: "description",
        content: `Quiz "${challengeName}", word ${index} of ${quizCutOff}`,
      },
    ],
  };
};

interface QuizSession {
  index: number;
  indices: readonly number[];
  word: string;
  audioFile: string | null;
  challenge: Challenge;
}

export const useQuizSession = routeLoader$<QuizSession | undefined>(
  async ({ params, query, platform, redirect }) => {
    const { WORDS, SPELLINGS } = platform.env as {
      WORDS: KVNamespace;
      SPELLINGS: KVNamespace;
    };
    const indexParam = params["index"];
    const indices = query
      .getAll("i")
      .map((index: string) => parseInt(index, 10));

    // The index is 1-based in the URI, but 0-based in the array
    const index = parseInt(indexParam, 10) - 1;
    const challenge = await resolveChallenge(params, SPELLINGS);
    const spellings = challenge?.spellings ?? [];
    const word = spellings[indices[index]];
    if (word) {
      const audioFile = await WORDS.get(word);
      return { index, word, audioFile, indices, challenge: challenge! };
    } else {
      redirect(302, "/");
    }
  },
);
