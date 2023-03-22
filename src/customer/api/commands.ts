import { AggregateCommand } from "../../shared-kernel/aggregate/command.ts";

interface EnsureCustomerPayload {
  userId: string;
  displayName: string;
  email: string;
}
export class EnsureCustomerCommand extends AggregateCommand<
  "EnsureCustomer",
  EnsureCustomerPayload
> {
  readonly aggregateName = "Customer";

  constructor(payload: EnsureCustomerPayload) {
    super("EnsureCustomer", payload);
  }
}

interface AttachPaymentMethodPayload {
  aggregateId: string;
  paymentMethod: {
    id: string;
    ownerName: string;
    last4Digits: string;
  };
}
export class AttachPaymentMethodCommand extends AggregateCommand<
  "AttachPaymentMethod",
  AttachPaymentMethodPayload
> {
  readonly aggregateName = "Customer";

  constructor(payload: AttachPaymentMethodPayload) {
    super("AttachPaymentMethod", payload);
  }
}

interface DetachPaymentMethodPayload {
  aggregateId: string;
  paymentMethodId: string;
}
export class DetachPaymentMethodCommand extends AggregateCommand<
  "DetachPaymentMethod",
  DetachPaymentMethodPayload
> {
  readonly aggregateName = "Customer";

  constructor(payload: DetachPaymentMethodPayload) {
    super("DetachPaymentMethod", payload);
  }
}
