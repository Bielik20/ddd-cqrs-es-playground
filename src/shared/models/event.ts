import { literal, number, string, ZodType } from "https://deno.land/x/zod@v3.21.4/types.ts";
import { Message } from "../messages/message.ts";
import { parser } from "../validation/parser.ts";

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
>(aggregateName: string, name: TName, payloadSchema: ZodType<TPayload>) {
  class AggregateEventMixin extends AggregateEvent<TName, TPayload> {
    static readonly messageName: TName = name;
    static readonly parser = parser({
      aggregateVersion: number(),
      aggregateId: string(),
      aggregateName: literal(aggregateName),
      name: literal(name),
      payload: payloadSchema,
      id: string(),
      timestamp: number(),
    });

    constructor(payload: TPayload, id?: string, timestamp?: number) {
      super(aggregateName, name, payload, id, timestamp);
    }
  }

  return AggregateEventMixin;
}
