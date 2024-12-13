const BASE62_CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE62 = 62;

export function generateBase62UUID(): string {
  return Array.from(
    { length: 11 },
    () => BASE62_CHARS[Math.floor(Math.random() * BASE62)],
  ).join("");
}
