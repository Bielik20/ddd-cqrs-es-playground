import { object, string } from "zod";
import { parseMessage } from "../../shared/messages/message.ts";
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

const ogBaby = new CustomerCreatedEvent({ displayName: "john", email: "john@westoros.org" });
ogBaby.aggregateId = "a";
ogBaby.aggregateVersion = 1;

const [newBaby, error] = parseMessage(
  JSON.stringify(ogBaby),
  [
    CustomerCreatedEvent,
    CustomerPaymentMethodAttachedEvent,
    CustomerPaymentMethodDetachedEvent,
  ],
);

console.log("bielik", newBaby, error);
if (newBaby) {
  newBaby satisfies (CustomerCreatedEvent | CustomerPaymentMethodAttachedEvent);
  newBaby.payload;
}
