import { object, string } from "zod";
import { command } from "../../shared/models/command.ts";
import { CustomerPaymentMethod } from "./shared.ts";

export class EnsureCustomerCommand extends command(
  "Customer",
  "EnsureCustomer",
  object({ aggregateId: string(), displayName: string(), email: string() }),
) {}

export class AttachPaymentMethodCommand extends command(
  "Customer",
  "AttachPaymentMethod",
  object({ aggregateId: string(), paymentMethod: CustomerPaymentMethod }),
) {}

export class DetachPaymentMethodCommand extends command(
  "Customer",
  "DetachPaymentMethod",
  object({ aggregateId: string(), paymentMethodId: string() }),
) {}
