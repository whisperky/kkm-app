export function formatBigNumber(number: number) {
  const format = (value: number, suffix: string) => {
    const formatted = value.toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + suffix
      : formatted + suffix;
  };

  if (number >= 1e9) {
    return format(number / 1e9, "B");
  } else if (number >= 1e6) {
    return format(number / 1e6, "M");
  } else if (number >= 1e3) {
    return format(number / 1e3, "K");
  } else {
    return number.toString();
  }
}

export function formatNumber(number: number | string) {
  return new Intl.NumberFormat().format(Number(number));
}

export function shuffleArray<T>(arr: T[]) {
  const array = [...arr];
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
