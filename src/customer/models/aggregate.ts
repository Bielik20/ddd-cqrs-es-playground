import { AggregateEvent } from "../../shared/models/event.ts";
import { Aggregate } from "../../shared/models/aggregate.ts";
import { Message } from "../../shared/messages/message.ts";
import { assertDefined } from "../../shared/utils/assert-defined.ts";
import { ok, Result } from "../../shared/utils/result.ts";
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
import {
  PaymentMethodAlreadyAttachedError,
  PaymentMethodNotAttachedError,
} from "./errors.ts";

interface CustomerAggregateState {
  displayName: string;
  email: string;
  paymentMethods: {
    id: string;
    ownerName: string;
    last4Digits: string;
  }[];
}

export class CustomerAggregate extends Aggregate {
  static create(command: EnsureCustomerCommand): Result<CustomerAggregate> {
    const aggregate = new CustomerAggregate(command.payload.aggregateId);
    aggregate.applyChange(
      new CustomerCreatedEvent({
        displayName: command.payload.displayName,
        email: command.payload.email,
      }),
    );
    return ok(aggregate);
  }

  protected state?: CustomerAggregateState;
  override readonly name = "Customer";

  attachPaymentMethod(
    command: AttachPaymentMethodCommand,
  ): Result<void, PaymentMethodAlreadyAttachedError> {
    assertDefined(this.state);
    if (
      this.state.paymentMethods.find((x) =>
        x.id === command.payload.paymentMethod.id
      )
    ) {
      return this.reject(
        new PaymentMethodAlreadyAttachedError(command.payload.paymentMethod.id),
      );
    }
    this.applyChange(
      new CustomerPaymentMethodAttachedEvent({
        paymentMethod: command.payload.paymentMethod,
      }),
    );
    return ok();
  }

  detachPaymentMethod(
    command: DetachPaymentMethodCommand,
  ): Result<void, PaymentMethodNotAttachedError> {
    assertDefined(this.state);
    const paymentMethods = this.state.paymentMethods.find((x) =>
      x.id !== command.payload.paymentMethodId
    );
    if (!paymentMethods) {
      return this.reject(
        new PaymentMethodNotAttachedError(command.payload.paymentMethodId),
      );
    }
    this.applyChange(
      new CustomerPaymentMethodDetachedEvent({
        paymentMethodId: command.payload.paymentMethodId,
      }),
    );
    return ok();
  }

  protected apply(event: AggregateEvent): void {
    if (Message.match(CustomerCreatedEvent, event)) {
      this.state = {
        displayName: event.payload.displayName,
        email: event.payload.email,
        paymentMethods: [],
      };
      return;
    }
    if (Message.match(CustomerPaymentMethodAttachedEvent, event)) {
      assertDefined(this.state);
      this.state.paymentMethods.push(event.payload.paymentMethod);
      return;
    }
    if (Message.match(CustomerPaymentMethodDetachedEvent, event)) {
      assertDefined(this.state);
      this.state.paymentMethods = this.state.paymentMethods.filter(
        (pm) => pm.id !== event.payload.paymentMethodId,
      );
      return;
    }
  }
}
