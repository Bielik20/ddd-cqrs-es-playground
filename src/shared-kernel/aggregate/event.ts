import { Message } from "../messages/message.ts";

export abstract class AggregateEvent<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> extends Message<TName, TPayload> {
  aggregateName!: string;
  aggregateId!: string;
  aggregateVersion!: number;
}
