import { object, TypeOf, ZodObject, ZodRawShape } from "https://deno.land/x/zod@v3.21.4/types.ts";
import { Result } from "../utils/result.ts";
import { ParseError } from "./error.ts";

export type SafeParser<T> = (
  input: Record<string, any>,
) => Result<T, ParseError>;

export function makeParser<T extends ZodRawShape>(
  shape: T,
): SafeParser<TypeOf<ZodObject<T>>> {
  const schema = object(shape);
  return (payload) => {
    const result = schema.safeParse(payload);
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
