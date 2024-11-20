export function createInviteKey(sessionId?: string) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  function toBase62(num: number) {
    let result = "";
    do {
      result = chars[num % 62] + result;
      num = Math.floor(num / 62);
    } while (num > 0);
    return result;
  }

  const numberedSessionId = Number(sessionId);
  const data = !isNaN(numberedSessionId) ? toBase62(numberedSessionId) : "";
  const timestamp = toBase62(Date.now());
  const randomPart = Array(5)
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * 62)])
    .join("");

  return `${randomPart}-${timestamp}${data ? `-${data}` : ""}`;
}

export function decodeInviteKey(key: string) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  function fromBase62(str: string) {
    return str
      .split("")
      .reduce((prev, curr) => prev * 62 + chars.indexOf(curr), 0);
  }

  const [, timestampPart, data] = key.split("-");
  const timestamp = fromBase62(timestampPart);
  const date = new Date(timestamp);

  const sessionId = data ? fromBase62(data) : "";

  return {
    createdAt: date,
    originalKey: key,
    sessionId,
  };
}
