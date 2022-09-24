export function sleep(s) {
  return new Promise((ok) => setTimeout(ok, 1000 * s));
}
