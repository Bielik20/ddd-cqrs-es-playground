import { Message } from "../messages/message.ts";

export class AggregateEvent<
  TAggregateName extends string = string,
  TEventName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> extends Message<TEventName, TPayload> {
  constructor(
    readonly aggregateName: TAggregateName,
    readonly aggregateId: string,
    readonly aggregateVersion: number,
    eventName: TEventName,
    payload: TPayload,
  ) {
    super(eventName, payload);
  }
}

export type AggregateEventCreator<
  TAggregateName extends string = string,
  TEventName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> =
  & ((
    payload: TPayload,
    aggregateId: string,
    aggregateVersion: number,
  ) => AggregateEvent<TAggregateName, TEventName, TPayload>)
  & {
    readonly aggregateName: TAggregateName;
    readonly eventName: TEventName;
    match(
      event: AggregateEvent,
    ): event is AggregateEvent<TAggregateName, TEventName, TPayload>;
  };

/**
 * aggregateName, eventName are not correctly inferred due to:
 * https://github.com/microsoft/TypeScript/issues/26242
 */
export function createAggregateEvent<
  TPayload extends Record<string, any>,
  TAggregateName extends string = string,
  TEventName extends string = string,
>(
  aggregateName: TAggregateName,
  eventName: TEventName,
): AggregateEventCreator<TAggregateName, TEventName, TPayload> {
  function factory(
    payload: TPayload,
    aggregateId: string,
    aggregateVersion: number,
  ): AggregateEvent<TAggregateName, TEventName, TPayload> {
    return new AggregateEvent<TAggregateName, TEventName, TPayload>(
      aggregateName,
      aggregateId,
      aggregateVersion,
      eventName,
      payload,
    );
  }

  const match = (
    event: AggregateEvent,
  ): event is AggregateEvent<TAggregateName, TEventName, TPayload> =>
    event.name === eventName;

  factory.aggregateName = aggregateName;
  factory.eventName = eventName;
  factory.match = match;

  return factory as unknown as AggregateEventCreator<
    TAggregateName,
    TEventName,
    TPayload
  >;
}

export type EventType<T> = T extends AggregateEventCreator<
  infer TAggregateName,
  infer TEventName,
  infer TPayload
> ? AggregateEvent<TAggregateName, TEventName, TPayload>
  : never;
