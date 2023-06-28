import { object, TypeOf, ZodObject, ZodRawShape } from "zod";
import { Result } from "../utils/result.ts";
import { ValidationError } from "../validation/error.ts";

export type MessagePayloadValidator<T> = (
  payload: Record<string, any>,
) => Result<T, ValidationError>;

export function payload<T extends ZodRawShape>(
  shape: T,
): MessagePayloadValidator<TypeOf<ZodObject<T>>> {
  const schema = object(shape);
  return (payload) => {
    const result = schema.safeParse(payload);
    if (!result.success) {
      // TODO: add message
      return Result.error(new ValidationError("Invalid payload!", result.error));
    }

    return Result.ok(result.data);
  };
}
