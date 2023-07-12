import { makeReducer, on, state } from "../../shared/messages/message-reducer.ts";
import { aggregate } from "../../shared/models/aggregate.ts";
import { assertDefined } from "../../shared/utils/assert-defined.ts";
import { Result } from "../../shared/utils/result.ts";
import {
  AttachPaymentMethodCommand,
  DetachPaymentMethodCommand,
  EnsureCustomerCommand,
} from "../api/commands.ts";
import {
  CustomerCreatedEvent,
  CustomerPaymentMethodAttachedEvent,
  CustomerPaymentMethodDetachedEvent,
} from "../api/events.ts";
import { PaymentMethodAlreadyAttachedError, PaymentMethodNotAttachedError } from "./errors.ts";

interface CustomerAggregateState {
  id: string;
  displayName: string;
  email: string;
  paymentMethods: {
    id: string;
    ownerName: string;
    last4Digits: string;
  }[];
}

export class CustomerAggregate extends aggregate(
  "Customer",
  makeReducer(state<CustomerAggregateState | null>(null), [
    on(CustomerCreatedEvent, (_, event) => ({
      id: event.aggregateId,
      paymentMethods: [],
      displayName: event.payload.displayName,
      email: event.payload.email,
    })),
    on(CustomerPaymentMethodAttachedEvent, (value, event) => {
      assertDefined(value);
      value.paymentMethods.push(event.payload.paymentMethod);
    }),
    on(CustomerPaymentMethodDetachedEvent, (value, event) => {
      assertDefined(value);
      value.paymentMethods = value.paymentMethods.filter(
        (pm) => pm.id !== event.payload.paymentMethodId,
      );
    }),
  ]),
) {
  static create(command: EnsureCustomerCommand): Result<CustomerAggregate> {
    const aggregate = new CustomerAggregate(command.payload.aggregateId);
    aggregate.apply(
      new CustomerCreatedEvent({
        displayName: command.payload.displayName,
        email: command.payload.email,
      }),
    );
    return Result.ok(aggregate);
  }

  attachPaymentMethod(
    command: AttachPaymentMethodCommand,
  ): Result<void, PaymentMethodAlreadyAttachedError> {
    assertDefined(this.state);
    if (this.state.paymentMethods.find((x) => x.id === command.payload.paymentMethod.id)) {
      return this.reject(new PaymentMethodAlreadyAttachedError(command.payload.paymentMethod.id));
    }
    this.apply(
      new CustomerPaymentMethodAttachedEvent({
        paymentMethod: command.payload.paymentMethod,
      }),
    );
    return Result.ok();
  }

  detachPaymentMethod(
    command: DetachPaymentMethodCommand,
  ): Result<void, PaymentMethodNotAttachedError> {
    assertDefined(this.state);
    const paymentMethods = this.state.paymentMethods.find(
      (x) => x.id !== command.payload.paymentMethodId,
    );
    if (!paymentMethods) {
      return this.reject(new PaymentMethodNotAttachedError(command.payload.paymentMethodId));
    }
    this.apply(
      new CustomerPaymentMethodDetachedEvent({
        paymentMethodId: command.payload.paymentMethodId,
      }),
    );
    return Result.ok();
  }
}
