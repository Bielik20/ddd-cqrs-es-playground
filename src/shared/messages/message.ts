import { nanoid } from "nanoid";
import { Constructor } from "../utils/constructor.ts";
import { MessagePayloadValidator } from "./message-payload.ts";

export type Matchable<T extends Message> = Constructor<T> & {
  readonly messageName: T["name"];
};

export type Praseable<T extends Message> = Constructor<T> & {
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

    constructor(payload: TPayload) {
      super(name, payload);
    }
  }

  return MessageMixin;
}
