import { string } from "zod";
import { payload } from "../../shared/messages/message-payload.ts";
import { parseMessage } from "../../shared/messages/message.ts";
import { event } from "../../shared/models/event.ts";
import { CustomerPaymentMethod } from "./shared.ts";

export class CustomerCreatedEvent extends event(
  "Customer",
  "CustomerCreated",
  payload({ displayName: string(), email: string().email() }),
) {}

export class CustomerPaymentMethodAttachedEvent extends event(
  "Customer",
  "CustomerPaymentMethodAttached",
  payload({ paymentMethod: CustomerPaymentMethod }),
) {}

export class CustomerPaymentMethodDetachedEvent extends event(
  "Customer",
  "CustomerPaymentMethodDetached",
  payload({ paymentMethodId: string() }),
) {}

const [a, error] = parseMessage({}, [
  CustomerCreatedEvent,
  CustomerPaymentMethodAttachedEvent,
  CustomerPaymentMethodDetachedEvent,
]);

if (a) {
  a satisfies (CustomerCreatedEvent | CustomerPaymentMethodAttachedEvent);
  a.payload;
}
