import { Matchable, Message } from "./message.ts";

type Callback<TMessage extends Message, TState> = (
  state: TState,
  message: TMessage,
) => void | undefined | TState;

type OnDescriptor<TMessage extends Message, TState> = {
  [key: string]: Callback<TMessage, TState>;
};

export function on<TMessage extends Message, TState>(
  constructor: Matchable<TMessage>,
  handler: Callback<TMessage, TState>,
): OnDescriptor<TMessage, TState> {
  return {
    [constructor.messageName]: handler,
  };
}

export function reducer<TState>(
  handlers: OnDescriptor<any, TState>[],
): (state: TState, message: Message) => TState {
  const obj = handlers.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});
  return (state: TState, message: Message) => {
    const result = obj[message.name](state, message);
    return result === undefined ? state : result;
  };
}
