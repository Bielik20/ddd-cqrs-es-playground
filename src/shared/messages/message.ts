import { literal, number, object, string, ZodType } from "https://deno.land/x/zod@v3.21.4/types.ts";
import { nanoid } from "nanoid";
import { Constructor } from "../utils/constructor.ts";
import { Result } from "../utils/result.ts";
import { ValidationError } from "../validation/error.ts";

export type Matchable<T extends Message> = Constructor<T> & {
  readonly messageName: T["name"];
};

export type Parseable<T extends Message> = Matchable<T> & {
  readonly schema: ZodType;
};

export abstract class Message<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> {
  static match<T extends Message>(
    event: Message,
    constructor: Matchable<T>,
  ): event is T {
    return constructor.messageName === event.name;
  }

  protected constructor(
    readonly name: TName,
    readonly payload: Readonly<TPayload>,
    readonly id = nanoid(),
    readonly timestamp = Date.now(),
  ) {}
}

export function message<
  TPayload extends Record<string, any>,
  TName extends string = string,
>(name: TName, payloadSchema: ZodType<TPayload>) {
  class MessageMixin extends Message<TName, TPayload> {
    static readonly messageName: TName = name;
    static readonly schema = object({
      name: literal(name),
      payload: payloadSchema,
      id: string(),
      timestamp: number(),
    });

    constructor(payload: TPayload, id?: string, timestamp?: number) {
      super(name, payload, id, timestamp);
    }
  }

  return MessageMixin;
}

export function parseMessage<T extends Parseable<Message>[]>(
  input: unknown,
  constructors: T,
): Result<InstanceType<T[number]>, ValidationError> {
  const [record, inputError] = parseInput(input);
  if (inputError) {
    return Result.error(inputError);
  }

  const constructor = constructors.find((c) => c.messageName === record.name);
  if (!constructor) {
    return Result.error(new ValidationError("Message input must have a valid name"));
  }

  const result = constructor.schema.safeParse(record);
  if (!result.success) {
    // TODO: add message
    return Result.error(new ValidationError("Invalid payload!", result.error));
  }

  return Result.ok(result.data);
}

// TODO: make return type = instance type without methods (keyof etc.)
// TODO: make Message, Event, Command constructors accept full input.
// TODO: try making zod part of message, event, command mixins and make them validate full input
function parseInput(input: unknown): Result<Record<string, any>, ValidationError> {
  if (typeof input === "string") {
    try {
      return Result.ok(JSON.parse(input));
    } catch (e) {
      return Result.error(new ValidationError("Message input must be a valid JSON string", e));
    }
  } else if (typeof input === "object") {
    return Result.ok(input as Record<string, any>);
  } else {
    return Result.error(new ValidationError("Message input must be a JSON string or an object"));
  }
}
