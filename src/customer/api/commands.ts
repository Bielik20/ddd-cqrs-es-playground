import { command } from "../../shared/models/command.ts";
import { CustomerPaymentMethod } from "./shared.ts";

export class EnsureCustomerCommand extends command<{
  aggregateId: string;
  displayName: string;
  email: string;
}>("Customer", "EnsureCustomer") {}

export class AttachPaymentMethodCommand extends command<{
  aggregateId: string;
  paymentMethod: CustomerPaymentMethod;
}>("Customer", "AttachPaymentMethod") {}

export class DetachPaymentMethodCommand extends command<{
  aggregateId: string;
  paymentMethodId: string;
}>("Customer", "DetachPaymentMethod") {}
