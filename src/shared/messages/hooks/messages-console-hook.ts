import { MessageBrokerHook } from '../message-broker.ts';
import { Message } from '../message.ts';

export class MessagesConsoleHook implements MessageBrokerHook {
  before(message: Message) {
    console.log(`Start handling: ${message.name}, ${message.id}`);
  }

  after(message: Message, output: any) {
    console.log(`End handling: ${message.name}, ${message.id}`);
    console.log(`Output:`, output);
  }
}
