import { Message } from "../messages/message.ts";

class AggregateCommand<
  TAggregateName extends string = string,
  TCommandName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> extends Message<TCommandName, TPayload> {
  constructor(
    readonly aggregateName: TAggregateName,
    commandName: TCommandName,
    payload: TPayload,
  ) {
    super(commandName, payload);
  }
}

type AggregateCommandCreator<
  TAggregateName extends string = string,
  TCommandName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> =
  & ((
    payload: TPayload,
  ) => AggregateCommand<TAggregateName, TCommandName, TPayload>)
  & {
    readonly aggregateName: TAggregateName;
    readonly commandName: TCommandName;
    match(
      command: AggregateCommand,
    ): command is AggregateCommand<TAggregateName, TCommandName, TPayload>;
  };

/**
 * aggregateName, commandName are not correctly inferred due to:
 * https://github.com/microsoft/TypeScript/issues/26242
 */
export function createAggregateCommand<
  TPayload extends Record<string, any>,
  TAggregateName extends string = string,
  TCommandName extends string = string,
>(
  aggregateName: TAggregateName,
  commandName: TCommandName,
): AggregateCommandCreator<TAggregateName, TCommandName, TPayload> {
  function factory(
    payload: TPayload,
  ): AggregateCommand<TAggregateName, TCommandName, TPayload> {
    return new AggregateCommand<TAggregateName, TCommandName, TPayload>(
      aggregateName,
      commandName,
      payload,
    );
  }

  const match = (
    command: AggregateCommand,
  ): command is AggregateCommand<TAggregateName, TCommandName, TPayload> =>
    command.name === commandName;

  factory.aggregateName = aggregateName;
  factory.eventName = commandName;
  factory.match = match;

  return factory as unknown as AggregateCommandCreator<
    TAggregateName,
    TCommandName,
    TPayload
  >;
}

export type CommandType<T> = T extends AggregateCommandCreator<
  infer TAggregateName,
  infer TCommandName,
  infer TPayload
> ? AggregateCommand<TAggregateName, TCommandName, TPayload>
  : never;
