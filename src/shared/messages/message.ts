import { nanoid } from "nanoid";
import { Constructor } from "../utils/constructor.ts";
import { Immutable } from "../utils/immutable.ts";

type Matchable<T extends Message> = Constructor<T> & {
  readonly messageName: T["name"];
};

export abstract class Message<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> {
  static match<T extends Message>(
    constructor: Matchable<T>,
    event: Message,
  ): event is T {
    return constructor.messageName === event.name;
  }

  readonly id = nanoid();
  readonly timestamp = Date.now();

  protected constructor(
    readonly name: TName,
    readonly payload: Immutable<TPayload>,
  ) {}
}

/**
 * name is not correctly inferred due to:
 * https://github.com/microsoft/TypeScript/issues/26242
 */
export function message<
  TPayload extends Record<string, any>,
  TName extends string = string,
>(name: TName) {
  class MessageMixin extends Message<TName, TPayload> {
    static readonly messageName: TName = name;

    constructor(payload: TPayload) {
      super(name, payload);
    }
  }

  return MessageMixin;
}
