import { literal, number, object, string, ZodType } from "zod";
import { Message } from "../messages/message.ts";
import { makeSafeParse } from "../validation/safe-parse.ts";

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
>(aggregateName: string, name: TName, payloadSchema: ZodType<TPayload>) {
  class AggregateCommandMixin extends AggregateCommand<TName, TPayload> {
    static readonly messageName: TName = name;
    static readonly parse = makeSafeParse(object({
      aggregateName: literal(aggregateName),
      name: literal(name),
      payload: payloadSchema,
      id: string(),
      timestamp: number(),
    }));

    constructor(payload: TPayload, id?: string, timestamp?: number) {
      super(aggregateName, name, payload, id, timestamp);
    }
  }

  return AggregateCommandMixin;
}
