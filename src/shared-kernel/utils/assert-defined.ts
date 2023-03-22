export function assertDefined<T>(
  input: T | undefined | null,
): asserts input is T {
  if (input === null || input === undefined) {
    throw new Error("Failed assertion for input");
  }
}
