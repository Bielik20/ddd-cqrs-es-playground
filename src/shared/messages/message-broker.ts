import { Message } from "./message.ts";

type Callback<TName extends string, TPayload extends Record<string, any>> = (
  message: Message<TName, TPayload>,
) => void;

export class MessageBroker {
  private readonly subscribers = new Map<string, Callback<string, any>[]>();

  pub(message: Message): void {
    const callbacks = this.subscribers.get(message.name) || [];

    callbacks.forEach((cb) => cb(message));
  }

  sub<TName extends string, TPayload extends Record<string, any>>(
    name: TName,
    cb: (message: Message<TName, TPayload>) => void,
  ): void {
    const callbacks = this.subscribers.get(name) || [];
    callbacks.push(cb as Callback<string, any>);
    this.subscribers.set(name, callbacks);
  }
}
