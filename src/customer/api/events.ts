import { event } from "../../shared/models/event.ts";

export class CustomerCreatedEvent extends event<{
  displayName: string;
  email: string;
}>("Customer", "CustomerCreated") {}

export class CustomerPaymentMethodAttachedEvent extends event<{
  paymentMethod: {
    id: string;
    ownerName: string;
    last4Digits: string;
  };
}>("Customer", "CustomerPaymentMethodAttached") {}

export class CustomerPaymentMethodDetachedEvent extends event<{
  paymentMethodId: string;
}>("Customer", "CustomerPaymentMethodDetached") {}
