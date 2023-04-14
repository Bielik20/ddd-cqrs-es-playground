export function unreachable(x: never): never {
  const print = typeof x === "object" ? JSON.stringify(x) : x;

  throw new Error(`Didn't expect to get here with: ${print}`);
}
