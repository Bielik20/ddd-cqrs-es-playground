import { Message } from "../messages/message.ts";

export abstract class AggregateCommand<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> extends Message<TName, TPayload> {
  abstract readonly aggregateName: string;
}
