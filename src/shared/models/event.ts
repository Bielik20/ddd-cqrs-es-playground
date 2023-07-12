import { literal, number, object, string, ZodType } from "zod";
import { Message } from "../messages/message.ts";
import { makeSafeParse, SafeParse } from '../validation/safe-parse.ts';

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
    aggregateId?: string,
    aggregateVersion?: number,
    id?: string,
    timestamp?: number,
  ) {
    super(name, payload, id, timestamp);
    this.aggregateId = aggregateId!;
    this.aggregateVersion = aggregateVersion!;
  }
}

export function event<
  TPayload extends Record<string, any>,
  TName extends string = string,
>(aggregateName: string, name: TName, payloadSchema: ZodType<TPayload>) {
  class AggregateEventMixin extends AggregateEvent<TName, TPayload> {
    static readonly messageName: TName = name;
    static readonly safeParse = makeSafeParse(object({
      aggregateVersion: number(),
      aggregateId: string(),
      aggregateName: literal(aggregateName),
      name: literal(name),
      payload: payloadSchema,
      id: string(),
      timestamp: number(),
    })) as SafeParse<AggregateEventMixin>;

    constructor(
      payload: TPayload,
      aggregateId?: string,
      aggregateVersion?: number,
      id?: string,
      timestamp?: number,
    ) {
      super(aggregateName, name, payload, aggregateId, aggregateVersion, id, timestamp);
    }
  }

  return AggregateEventMixin;
}
