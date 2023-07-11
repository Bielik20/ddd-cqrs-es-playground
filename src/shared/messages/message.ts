import { literal, number, object, string, ZodType } from "zod";
import { nanoid } from "nanoid";
import { ParseError } from "../validation/error.ts";
import { jsonParse, makeSafeParse, SafeParse } from "../validation/parser.ts";
import { Constructor } from "../utils/constructor.ts";
import { Result } from "../utils/result.ts";

export type Matchable<T extends Message> = Constructor<T> & {
  readonly messageName: T["name"];
};

export type Parseable<T extends Message> = Matchable<T> & {
  readonly parse: SafeParse<T>;
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

  static safeParse<T extends Parseable<Message>[]>(
    input: unknown,
    constructors: T,
  ): Result<InstanceType<T[number]>, ParseError> {
    const [record, jsonError] = jsonParse(input);
    if (jsonError) {
      return Result.err(jsonError);
    }

    const constructor = constructors.find((c) => c.messageName === record.name);
    if (!constructor) {
      return Result.err(new ParseError("Message input must have a valid name"));
    }

    const [message, error] = constructor.parse(record);
    if (error) {
      return Result.err(error);
    }

    return Result.ok(message as InstanceType<T[number]>);
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
    static readonly parse = makeSafeParse(object({
      name: literal(name),
      payload: payloadSchema,
      id: string(),
      timestamp: number(),
    }));

    constructor(payload: TPayload, id?: string, timestamp?: number) {
      super(name, payload, id, timestamp);
    }
  }

  return MessageMixin;
}
