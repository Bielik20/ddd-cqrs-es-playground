import { Message } from "../messages/message.ts";

export abstract class AggregateEvent<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> extends Message<TName, TPayload> {
  aggregateId!: string;
  aggregateVersion!: number;

  protected constructor(
    readonly aggregateName: string,
    name: TName,
    payload: TPayload,
  ) {
    super(name, payload);
  }
}

/**
 * name is not correctly inferred due to:
 * https://github.com/microsoft/TypeScript/issues/26242
 */
export function event<
  TPayload extends Record<string, any>,
  TName extends string = string,
>(aggregateName: string, name: TName) {
  class AggregateEventMixin extends AggregateEvent<TName, TPayload> {
    static readonly messageName: TName = name;

    constructor(payload: TPayload) {
      super(aggregateName, name, payload);
    }
  }

  return AggregateEventMixin;
}
