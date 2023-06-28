import { Matchable, Message } from "./message.ts";

type ReducerMessageHandler<TState, TMessage extends Message> = (
  state: TState,
  message: TMessage,
) => void | TState;

type OnDescriptor<TState, TMessage extends Message> = {
  [key: string]: ReducerMessageHandler<TState, TMessage>;
};

type OnDescriptorsMessages<TOnDescriptors> = TOnDescriptors extends
  OnDescriptor<infer TState, infer TMessage>[] ? Parameters<TOnDescriptors[number][string]>[1]
  : never;

export type ReducerStateManager<TState> = {
  produce: (
    state: TState,
    message: Message,
    handler: ReducerMessageHandler<TState, Message>,
  ) => TState;
  initial: () => TState;
};

/**
 * This function serves two purposes:
 * 1. It provides a type-safe way to define a reducer state.
 * 2. It provides a way to extend functionality with libs like immer.
 * @important Do not use `undefined` as a state value.
 * @see https://github.com/microsoft/TypeScript/issues/26242
 * @see https://immerjs.github.io/immer/docs/introduction
 */
export function state<TState>(initial: TState): ReducerStateManager<TState> {
  return {
    produce: (state, message, handler) => {
      const result = handler(state, message);
      return result === undefined ? state : result;
    },
    initial: () => structuredClone(initial),
  };
}

export function on<TState, TMessage extends Message>(
  constructor: Matchable<TMessage>,
  handler: ReducerMessageHandler<TState, TMessage>,
): OnDescriptor<TState, TMessage> {
  return {
    [constructor.messageName]: handler,
  };
}

export type Reducer<TState, TMessage extends Message> =
  & ((
    state: TState,
    message: TMessage,
  ) => TState)
  & { initial: () => TState };
export type ReducerMessage<T> = T extends Reducer<any, infer TMessage> ? TMessage : never;
export type ReducerState<T> = T extends Reducer<infer TState, any> ? TState : never;

export function makeReducer<TState, THandlers extends OnDescriptor<TState, any>[]>(
  manager: ReducerStateManager<TState>,
  handlers: THandlers,
): Reducer<TState, OnDescriptorsMessages<THandlers>> {
  const obj = handlers.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});
  const result: Reducer<TState, OnDescriptorsMessages<THandlers>> = (state, message) => {
    const handler = obj[message.name];
    return manager.produce(state, message, handler);
  };
  result["initial"] = manager.initial;

  return result;
}
