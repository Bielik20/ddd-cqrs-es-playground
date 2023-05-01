import { MessagesCompletionHook } from './src/shared/messages/hooks/messages-completion-hook.ts';
import { MessagesConsoleHook } from './src/shared/messages/hooks/messages-console-hook.ts';
import { MessageBroker } from './src/shared/messages/message-broker.ts';
import { orchestrate } from './main.ts';
import { EnsureCustomerCommand } from "./src/customer/api/commands.ts";
import { GetCustomerQuery } from "./src/customer/api/queries.ts";

Deno.test(async function addTest() {
  const messagesCompletionHook = new MessagesCompletionHook();
  const messageConsoleHook = new MessagesConsoleHook();
  const messageBroker = new MessageBroker([messagesCompletionHook, messageConsoleHook]);
  orchestrate(messageBroker);

  messageBroker.pub(
    new EnsureCustomerCommand({
      aggregateId: '123',
      displayName: 'Ned',
      email: 'ned@winterfel.we',
    }),
  );
  await messagesCompletionHook.completed();
  messageBroker.pub(new GetCustomerQuery({ id: '123' }));
});
