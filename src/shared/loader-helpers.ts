import { type Cookie } from "@builder.io/qwik-city";
import { saveCookieName } from "./constants";

export interface Spelling {
  word: string;
  hint?: string;
}

export interface Challenge {
  id: string;
  name: string;
  spellings: readonly Spelling[];
}

const normalizeSpellings = (raw: unknown): Spelling[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) =>
    typeof s === "string"
      ? { word: s }
      : { word: s.word ?? "", ...(s.hint ? { hint: s.hint } : {}) },
  );
};

export const resolveChallenge = async (
  challengeId: string,
  spellings: KVNamespace,
): Promise<Challenge | null> => {
  let raw: { name?: string; spellings?: unknown } | null;
  try {
    raw = JSON.parse((await spellings.get(challengeId)) ?? "{}");
  } catch {
    return null;
  }
  if (!raw?.name) return null;
  return {
    id: challengeId,
    name: raw.name,
    spellings: normalizeSpellings(raw.spellings),
  };
};

export const getSavedChallenges = (cookie: Cookie): readonly string[] => {
  const saveCookie = cookie.get(saveCookieName);
  return saveCookie?.value.split(",") ?? [];
};
