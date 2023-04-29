import { MessageBroker } from "./src/shared/messages/message-broker.ts";
import { EnsureCustomerUseCase } from "./src/customer/handlers/commands/ensure-customer/use-case.ts";
import { CustomerAggregateGateway } from "./src/customer/gateways/customer-aggregate-gateway.ts";
import {
  AttachPaymentMethodCommand,
  DetachPaymentMethodCommand,
  EnsureCustomerCommand,
} from "./src/customer/api/commands.ts";
import { DetachPaymentMethodUseCase } from "./src/customer/handlers/commands/detach-payment-method/use-case.ts";
import { AttachPaymentMethodUseCase } from "./src/customer/handlers/commands/attach-payment-method/use-case.ts";
import { CustomerProjectionGateway } from "./src/customer/gateways/customer-projection-gateway.ts";
import { CustomerProjector } from "./src/customer/handlers/projectors/customer/projector.ts";
import {
  CustomerCreatedEvent,
  CustomerPaymentMethodAttachedEvent,
  CustomerPaymentMethodDetachedEvent,
} from "./src/customer/api/events.ts";
import { MessagesCompletionHook } from './src/shared/messages/hooks/messages-completion-hook.ts';
import { MessagesConsoleHook } from './src/shared/messages/hooks/messages-console-hook.ts';

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}

const messagesCompletionHook = new MessagesCompletionHook();
const messageConsoleHook = new MessagesConsoleHook();
const messageBroker = new MessageBroker([messagesCompletionHook, messageConsoleHook]);
const customerAggregateGateway = new CustomerAggregateGateway(messageBroker);
const customerProjectionGateway = new CustomerProjectionGateway();
const ensureCustomerUseCase = new EnsureCustomerUseCase(customerAggregateGateway);
const attachPaymentMethodUseCase = new AttachPaymentMethodUseCase(customerAggregateGateway);
const detachPaymentMethodUseCase = new DetachPaymentMethodUseCase(customerAggregateGateway);
const customerProjector = new CustomerProjector(customerProjectionGateway);

messageBroker.sub(EnsureCustomerCommand, (message) => ensureCustomerUseCase.run(message));
messageBroker.sub(AttachPaymentMethodCommand, (message) => attachPaymentMethodUseCase.run(message));
messageBroker.sub(DetachPaymentMethodCommand, (message) => detachPaymentMethodUseCase.run(message));

messageBroker.sub(CustomerCreatedEvent, (message) => customerProjector.run(message));
messageBroker.sub(CustomerPaymentMethodAttachedEvent, (message) => customerProjector.run(message));
messageBroker.sub(CustomerPaymentMethodDetachedEvent, (message) => customerProjector.run(message));

messageBroker.pub(
  new EnsureCustomerCommand({
    aggregateId: "123",
    displayName: "Ned",
    email: "ned@winterfel.we",
  }),
);
await messagesCompletionHook
  .completed()
  .then(() => customerProjectionGateway.get("123"))
  .then(console.log);
