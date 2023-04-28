import { unreachable } from '../../../../shared/utils/unreachable.ts';
import { CustomerProjectionGateway } from "../../../gateways/customer-projection-gateway.ts";
import { CustomerProjection } from "../../../api/projections.ts";
import {
  CustomerCreatedEvent,
  CustomerPaymentMethodAttachedEvent,
  CustomerPaymentMethodDetachedEvent,
} from "../../../api/events.ts";
import { Message } from "../../../../shared/messages/message.ts";

export class CustomerProjector {
  constructor(private readonly gateway: CustomerProjectionGateway) {}

  async run(
    event:
      | CustomerCreatedEvent
      | CustomerPaymentMethodAttachedEvent
      | CustomerPaymentMethodDetachedEvent,
  ): Promise<void> {
    if (Message.match(event, CustomerCreatedEvent)) {
      return this.handleCustomerCreated(event);
    }
    const value = await this.gateway.get(event.aggregateId);
    if (!value) {
      throw new Error("Customer projection not found");
    }
    if (Message.match(event, CustomerPaymentMethodAttachedEvent)) {
      return this.handleCustomerPaymentMethodAttached(event, value);
    }
    if (Message.match(event, CustomerPaymentMethodDetachedEvent)) {
      return this.handleCustomerPaymentMethodDetached(event, value);
    }
    unreachable(event);
  }

  handleCustomerCreated(event: CustomerCreatedEvent): Promise<void> {
    return this.gateway.save({
      id: event.aggregateId,
      paymentMethods: [],
      displayName: event.payload.displayName,
      email: event.payload.email,
    });
  }

  handleCustomerPaymentMethodAttached(
    event: CustomerPaymentMethodAttachedEvent,
    value: CustomerProjection,
  ): Promise<void> {
    return this.gateway.save({
      ...value,
      paymentMethods: [...value.paymentMethods, event.payload.paymentMethod],
    });
  }

  handleCustomerPaymentMethodDetached(
    event: CustomerPaymentMethodDetachedEvent,
    value: CustomerProjection,
  ): Promise<void> {
    return this.gateway.save({
      ...value,
      paymentMethods: value.paymentMethods.filter(
        (paymentMethod) => paymentMethod.id !== event.payload.paymentMethodId,
      ),
    });
  }
}
