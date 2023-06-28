import { MessagePayloadValidator } from "../messages/message-payload.ts";
import { Message } from "../messages/message.ts";

abstract class AggregateCommand<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> extends Message<TName, TPayload> {
  protected constructor(
    readonly aggregateName: string,
    name: TName,
    payload: TPayload,
    id?: string,
    timestamp?: number,
  ) {
    super(name, payload, id, timestamp);
  }
}

export function command<
  TPayload extends Record<string, any>,
  TName extends string = string,
>(aggregateName: string, name: TName, validator: MessagePayloadValidator<TPayload>) {
  class AggregateCommandMixin extends AggregateCommand<TName, TPayload> {
    static readonly messageName: TName = name;
    static readonly validator: MessagePayloadValidator<TPayload> = validator;

    constructor(payload: TPayload, id?: string, timestamp?: number) {
      super(aggregateName, name, payload, id, timestamp);
    }
  }

  return AggregateCommandMixin;
}
