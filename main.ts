import { CustomerAggregateGateway } from "./src/customer/aggregate/gateway.ts";
import { EnsureCustomerCommand } from "./src/customer/api/commands.ts";
import { EnsureCustomerUseCase } from "./src/customer/use-cases/ensure-customer.ts";
import { MessageBroker } from "./src/shared-kernel/messages/message-broker.ts";

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
const ensureCustomerCommand = EnsureCustomerCommand({
  aggregateId: "123",
  displayName: "Ned",
  email: "ned@winterfel.westeros",
});

ensureCustomerUseCase.run(ensureCustomerCommand).then(console.log);
