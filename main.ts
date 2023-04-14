import { CustomerAggregateGateway } from "./src/customer/gateways/customer-aggregate-gateway.ts";
import { EnsureCustomerCommand } from "./src/customer/api/commands.ts";
import { EnsureCustomerUseCase } from "./src/customer/handlers/ensure-customer/use-case.ts";
import { MessageBroker } from "./src/shared/messages/message-broker.ts";

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}

const messageBroker = new MessageBroker();
const customerAggregateGateway = new CustomerAggregateGateway(messageBroker);
const ensureCustomerUseCase = new EnsureCustomerUseCase(
  customerAggregateGateway,
);
const ensureCustomerCommand = new EnsureCustomerCommand({
  aggregateId: "123",
  displayName: "Ned",
  email: "ned@winterfel.westeros",
});

ensureCustomerUseCase.run(ensureCustomerCommand).then(console.log);
