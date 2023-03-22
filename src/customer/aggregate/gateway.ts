import { AggregateGateway } from "../../shared-kernel/aggregate/gateway.ts";
import { MessageBroker } from "../../shared-kernel/messages/message-broker.ts";
import { CustomerAggregate } from "./root.ts";

export class CustomerAggregateGateway
  extends AggregateGateway<CustomerAggregate> {
  constructor(messageBroker: MessageBroker) {
    super((id) => new CustomerAggregate(id), messageBroker);
  }
}
