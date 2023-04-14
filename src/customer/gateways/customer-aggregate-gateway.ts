import { AggregateGateway } from "../../shared/models/gateway.ts";
import { MessageBroker } from "../../shared/messages/message-broker.ts";
import { CustomerAggregate } from "../models/aggregate.ts";

export class CustomerAggregateGateway
  extends AggregateGateway<CustomerAggregate> {
  constructor(messageBroker: MessageBroker) {
    super((id) => new CustomerAggregate(id), messageBroker);
  }
}
