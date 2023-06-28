import { object, string } from "zod";
import { event } from "../../shared/models/event.ts";
import { CustomerPaymentMethod } from "./shared.ts";

export class CustomerCreatedEvent extends event(
  "Customer",
  "CustomerCreated",
  object({ displayName: string(), email: string().email() }),
) {}

export class CustomerPaymentMethodAttachedEvent extends event(
  "Customer",
  "CustomerPaymentMethodAttached",
  object({ paymentMethod: CustomerPaymentMethod }),
) {}

export class CustomerPaymentMethodDetachedEvent extends event(
  "Customer",
  "CustomerPaymentMethodDetached",
  object({ paymentMethodId: string() }),
) {}
