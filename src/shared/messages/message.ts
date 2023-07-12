import { nanoid } from 'nanoid';
import { literal, number, object, string, ZodType } from 'zod';
import { Constructor } from '../utils/constructor.ts';
import { Result } from '../utils/result.ts';
import { ParseError } from '../validation/error.ts';
import { makeSafeParse, SafeParse, safeParseRecord } from '../validation/safe-parse.ts';

export type Matchable<T extends Message> = Constructor<T> & {
  readonly messageName: T["name"];
};

export type Parseable<T extends Message> = Matchable<T> & {
  readonly safeParse: SafeParse<T>;
};

export abstract class Message<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> {
  protected constructor(
    readonly name: TName,
    readonly payload: Readonly<TPayload>,
    readonly id = nanoid(),
    readonly timestamp = Date.now(),
  ) {}
}

export function matchMessage<T extends Message>(
  event: Message,
  constructor: Matchable<T>,
): event is T {
  return constructor.messageName === event.name;
}

export function safeParseMessage<T extends Parseable<Message>[]>(
  input: unknown,
  constructors: T,
): Result<InstanceType<T[number]>, ParseError> {
  const [record, jsonError] = safeParseRecord(input);
  if (jsonError) {
    return Result.err(jsonError);
  }

  const constructor = constructors.find((c) => c.messageName === record.name);
  if (!constructor) {
    return Result.err(new ParseError("Message input must have a valid name"));
  }

  const [message, error] = constructor.safeParse(record);
  if (error) {
    return Result.err(error);
  }

  return Result.ok(message as InstanceType<T[number]>);
}

export function message<
  TPayload extends Record<string, any>,
  TName extends string = string,
>(name: TName, payloadSchema: ZodType<TPayload>) {
  class MessageMixin extends Message<TName, TPayload> {
    static readonly messageName: TName = name;
    static readonly safeParse = makeSafeParse(object({
      name: literal(name),
      payload: payloadSchema,
      id: string(),
      timestamp: number(),
    })) as SafeParse<MessageMixin>;

    constructor(payload: TPayload, id?: string, timestamp?: number) {
      super(name, payload, id, timestamp);
    }
  }

  return MessageMixin;
}
