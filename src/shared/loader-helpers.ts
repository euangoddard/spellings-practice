import { type Cookie } from "@builder.io/qwik-city";
import { saveCookieName } from "./constants";

export interface Challenge {
  id: string;
  name: string;
  spellings: readonly string[];
}

export const resolveChallenge = async (
  challengeId: string,
  spellings: KVNamespace,
): Promise<Challenge | null> => {
  let challenge: Challenge | null;
  try {
    challenge = JSON.parse((await spellings.get(challengeId)) ?? "{}");
  } catch {
    return null;
  }
  return { ...challenge!, id: challengeId };
};

export const getSavedChallenges = (cookie: Cookie): readonly string[] => {
  const saveCookie = cookie.get(saveCookieName);
  return saveCookie?.value.split(",") ?? [];
};
