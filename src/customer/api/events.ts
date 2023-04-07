import {
  createAggregateEvent,
  EventType,
} from "../../shared-kernel/aggregate/event.ts";

export const CustomerCreatedEvent = createAggregateEvent<{
  displayName: string;
  email: string;
}>("Customer", "CustomerCreated");
export type CustomerCreatedEvent = EventType<typeof CustomerCreatedEvent>;

export const CustomerPaymentMethodAttachedEvent = createAggregateEvent<{
  paymentMethod: {
    id: string;
    ownerName: string;
    last4Digits: string;
  };
}>("Customer", "CustomerPaymentMethodAttached");
export type CustomerPaymentMethodAttachedEvent = EventType<
  typeof CustomerPaymentMethodAttachedEvent
>;

export const CustomerPaymentMethodDetachedEvent = createAggregateEvent<{
  paymentMethodId: string;
}>("Customer", "CustomerPaymentMethodDetached");
export type CustomerPaymentMethodDetachedEvent = EventType<
  typeof CustomerPaymentMethodDetachedEvent
>;
