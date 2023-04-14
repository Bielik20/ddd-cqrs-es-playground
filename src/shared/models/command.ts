import { Message } from "../messages/message.ts";

abstract class AggregateCommand<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> extends Message<TName, TPayload> {
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
export function command<
  TPayload extends Record<string, any>,
  TName extends string = string,
>(aggregateName: string, name: TName) {
  class AggregateCommandMixin extends AggregateCommand<TName, TPayload> {
    static readonly messageName: TName = name;

    constructor(payload: TPayload) {
      super(aggregateName, name, payload);
    }
  }

  return AggregateCommandMixin;
}
