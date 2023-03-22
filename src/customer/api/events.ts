import { AggregateEvent } from "../../shared-kernel/aggregate/event.ts";

interface CustomerCreatedPayload {
  displayName: string;
  email: string;
}
export class CustomerCreatedEvent extends AggregateEvent<
  "CustomerCreated",
  CustomerCreatedPayload
> {
  constructor(payload: CustomerCreatedPayload) {
    super("CustomerCreated", payload);
  }
}

interface CustomerPaymentMethodAttachedPayload {
  paymentMethod: {
    id: string;
    ownerName: string;
    last4Digits: string;
  };
}
export class CustomerPaymentMethodAttachedEvent extends AggregateEvent<
  "CustomerPaymentMethodAttached",
  CustomerPaymentMethodAttachedPayload
> {
  constructor(payload: CustomerPaymentMethodAttachedPayload) {
    super("CustomerPaymentMethodAttached", payload);
  }
}

interface CustomerPaymentMethodDetachedPayload {
  paymentMethodId: string;
}
export class CustomerPaymentMethodDetachedEvent extends AggregateEvent<
  "CustomerPaymentMethodDetached",
  CustomerPaymentMethodDetachedPayload
> {
  constructor(payload: CustomerPaymentMethodDetachedPayload) {
    super("CustomerPaymentMethodDetached", payload);
  }
}

export type CustomerEvent =
  | CustomerCreatedEvent
  | CustomerPaymentMethodAttachedEvent
  | CustomerPaymentMethodDetachedEvent;
