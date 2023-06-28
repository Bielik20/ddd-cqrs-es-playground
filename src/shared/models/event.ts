import { MessagePayloadValidator } from "../messages/message-payload.ts";
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
    payload: Readonly<TPayload>,
    id?: string,
    timestamp?: number,
  ) {
    super(name, payload, id, timestamp);
  }
}

export function event<
  TPayload extends Record<string, any>,
  TName extends string = string,
>(aggregateName: string, name: TName, validator: MessagePayloadValidator<TPayload>) {
  class AggregateEventMixin extends AggregateEvent<TName, TPayload> {
    static readonly messageName: TName = name;
    static readonly validator: MessagePayloadValidator<TPayload> = validator;

    constructor(payload: TPayload, id?: string, timestamp?: number) {
      super(aggregateName, name, payload, id, timestamp);
    }
  }

  return AggregateEventMixin;
}
