import { TypeOf, ZodType } from "https://deno.land/x/zod@v3.21.4/types.ts";
import { ParseError } from "./error.ts";
import { Result } from "../utils/result.ts";

export type SafeParse<T> = (
  input: any,
) => Result<T, ParseError>;

export function makeSafeParse<T extends ZodType>(
  schema: T,
): SafeParse<TypeOf<T>> {
  return (input) => {
    const result = schema.safeParse(input);
    if (!result.success) {
      // TODO: add message
      return Result.err(new ParseError("Invalid record", result.error));
    }

    return Result.ok(result.data);
  };
}

export function jsonParse(input: unknown): Result<Record<string, any>, ParseError> {
  if (typeof input === "string") {
    try {
      return Result.ok(JSON.parse(input));
    } catch (e) {
      return Result.err(new ParseError("Message input must be a valid JSON string", e));
    }
  } else if (typeof input === "object") {
    return Result.ok(input as Record<string, any>);
  } else {
    return Result.err(new ParseError("Message input must be a JSON string or an object"));
  }
}
