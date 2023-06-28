import { object, TypeOf, ZodObject, ZodRawShape } from "zod";
import { Result } from "../utils/result.ts";
import { ValidationError } from "../validation/error.ts";

export type MessagePayloadValidator<T> = (input: unknown) => Result<T, ValidationError>;

export function payload<T extends ZodRawShape>(
  shape: T,
): MessagePayloadValidator<TypeOf<ZodObject<T>>> {
  const schema = object(shape);
  return (input) => {
    const [payload, error] = safeParsePayload(input);
    if (error) {
      return Result.error(error);
    }

    const result = schema.safeParse(payload);
    if (!result.success) {
      // TODO: add message
      return Result.error(new ValidationError("Invalid payload!", result.error));
    }

    return Result.ok(result.data);
  };
}

function safeParsePayload(input: unknown): Result<Record<string, any>, ValidationError> {
  if (typeof input === "string") {
    try {
      return Result.ok(JSON.parse(input));
    } catch (e) {
      return Result.error(new ValidationError("Payload must be a valid JSON string", e));
    }
  } else if (typeof input === "object") {
    return Result.ok(input as Record<string, any>);
  } else {
    return Result.error(new ValidationError("Payload must be a JSON string or an object"));
  }
}
