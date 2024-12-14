export interface Challenge {
  id: string;
  name: string;
  spellings: readonly string[];
}

export const resolveChallenge = async (
  params: Record<string, string>,
  spellings: KVNamespace,
): Promise<Challenge | null> => {
  let challenge: Challenge | null;
  try {
    challenge = JSON.parse((await spellings.get(params["id"])) ?? "{}");
  } catch {
    return (challenge = null);
  }
  return { ...challenge!, id: params["id"] };
};
