import { string } from "zod";
import { payload } from "../../shared/messages/message-payload.ts";
import { command } from "../../shared/models/command.ts";
import { CustomerPaymentMethod } from "./shared.ts";

export class EnsureCustomerCommand extends command(
  "Customer",
  "EnsureCustomer",
  payload({ aggregateId: string(), displayName: string(), email: string() }),
) {}

export class AttachPaymentMethodCommand extends command(
  "Customer",
  "AttachPaymentMethod",
  payload({ aggregateId: string(), paymentMethod: CustomerPaymentMethod }),
) {}

export class DetachPaymentMethodCommand extends command(
  "Customer",
  "DetachPaymentMethod",
  payload({ aggregateId: string(), paymentMethodId: string() }),
) {}
