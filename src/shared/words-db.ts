export const getWordAudioFile = async (
  WORDS: KVNamespace,
  word: string,
): Promise<string | null> => {
  const audioFile = await WORDS.get(word);
  return audioFile
    ? audioFile.startsWith("https://")
      ? audioFile
      : null
    : null;
};
