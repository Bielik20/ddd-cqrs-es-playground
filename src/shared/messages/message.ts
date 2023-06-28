import { nanoid } from "nanoid";
import { Constructor } from "../utils/constructor.ts";
import { Result } from "../utils/result.ts";
import { ValidationError } from "../validation/error.ts";
import { MessagePayloadValidator } from "./message-payload.ts";

export type Matchable<T extends Message> = Constructor<T> & {
  readonly messageName: T["name"];
};

export type Parseable<T extends Message> = Constructor<T> & Matchable<T> & {
  readonly validator: MessagePayloadValidator<T["payload"]>;
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
>(name: TName, validator: MessagePayloadValidator<TPayload>) {
  class MessageMixin extends Message<TName, TPayload> {
    static readonly messageName: TName = name;
    static readonly validator: MessagePayloadValidator<TPayload> = validator;

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

  const [payload, validationError] = constructor.validator(record);
  if (validationError) {
    return Result.error(validationError);
  }

  return Result.ok(new constructor(payload));
}

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
