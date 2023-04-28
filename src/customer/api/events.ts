import { event } from "../../shared/models/event.ts";
import { CustomerPaymentMethod } from "./shared.ts";

export class CustomerCreatedEvent extends event<{
  displayName: string;
  email: string;
}>("Customer", "CustomerCreated") {}

export class CustomerPaymentMethodAttachedEvent extends event<{
  paymentMethod: CustomerPaymentMethod;
}>("Customer", "CustomerPaymentMethodAttached") {}

export class CustomerPaymentMethodDetachedEvent extends event<{
  paymentMethodId: string;
}>("Customer", "CustomerPaymentMethodDetached") {}
