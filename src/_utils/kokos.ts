export const generateChunk = (size: number): Omit<MainGameKokoType, "key">[] => {
    return Array.from({ length: size }, (_) => ({ checked: false, score: 1 }));
  };
  