import { deferred, Deferred } from 'https://deno.land/std@0.185.0/async/deferred.ts';
import { MessageBrokerHook } from '../message-broker.ts';

export class MessagesCompletionHook implements MessageBrokerHook {
  private deferrer: Deferred<void>;
  private _pending = 0;
  get pending() {
    return this._pending;
  }

  set pending(value) {
    const previous = this._pending;
    this._pending = value;
    if (previous === 1 && value === 0) {
      this.deferrer.resolve();
    }
    if (previous === 0 && value === 1) {
      this.deferrer = deferred();
    }
  }

  constructor() {
    this.deferrer = deferred();
    this.deferrer.resolve();
  }

  async completed(): Promise<void> {
    return this.deferrer.then();
  }

  before() {
    this.pending++;
  }

  after() {
    this.pending--;
  }
}
