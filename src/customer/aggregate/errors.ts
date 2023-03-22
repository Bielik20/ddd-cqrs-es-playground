import { AggregateError } from "../../shared-kernel/aggregate/error.ts";

export class PaymentMethodAlreadyAttachedError
  extends AggregateError<"PaymentMethodAlreadyAttached"> {
  constructor(readonly paymentMethodId: string) {
    super("PaymentMethodAlreadyAttached");
  }
}

export class PaymentMethodNotAttachedError
  extends AggregateError<"PaymentMethodNotAttached"> {
  constructor(readonly paymentMethodId: string) {
    super("PaymentMethodNotAttached");
  }
}
