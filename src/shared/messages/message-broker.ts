import { Matchable, Message } from './message.ts';

type Callback<TMessage extends Message> = (message: TMessage) => any;

export interface MessageBrokerHook {
  before?: (message: Message) => void | Promise<void>;
  after?: (message: Message, output: any) => void | Promise<void>;
}

export class MessageBroker {
  private readonly subscribers = new Map<string, Callback<Message>[]>();

  constructor(private readonly hooks: MessageBrokerHook[] = []) {}

  pub(message: Message): void {
    const callbacks = this.subscribers.get(message.name) || [];

    callbacks.forEach((cb) => cb(message));
  }

  sub<TMessage extends Message>(
    constructor: Matchable<TMessage>,
    cb: Callback<TMessage>,
  ): void {
    const callbacks = this.subscribers.get(constructor.messageName) || [];
    callbacks.push(async (message) => {
      await Promise.all(this.hooks.map((hook) => hook.before?.(message)));
      const output = await cb(message as TMessage);
      await Promise.all(this.hooks.map((hook) => hook.after?.(message, output)));
    });
    this.subscribers.set(constructor.messageName, callbacks);
  }
}

