import { AggregateError } from "../../shared-kernel/aggregate/error.ts";
import { AggregateRoot } from "../../shared-kernel/aggregate/root.ts";
import { assertDefined } from "../../shared-kernel/utils/assert-defined.ts";
import { ok, Result } from "../../shared-kernel/utils/result.ts";
import { unreachable } from "../../shared-kernel/utils/unreachable.ts";
import {
  AttachPaymentMethodCommand,
  DetachPaymentMethodCommand,
  EnsureCustomerCommand,
} from "../api/commands.ts";
import {
  CustomerCreatedEvent,
  CustomerEvent,
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

export class CustomerAggregate extends AggregateRoot<CustomerEvent> {
  static create(
    command: EnsureCustomerCommand,
  ): Result<CustomerAggregate> {
    const id = command.payload.userId;
    const aggregate = new CustomerAggregate(id);
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
  ): Result<void, AggregateError> {
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
  ): Result<void, AggregateError> {
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

  protected apply(event: CustomerEvent): void {
    switch (event.name) {
      case "CustomerCreated": {
        this.state = {
          displayName: event.payload.displayName,
          email: event.payload.email,
          paymentMethods: [],
        };
        break;
      }
      case "CustomerPaymentMethodAttached": {
        assertDefined(this.state);
        this.state.paymentMethods.push(event.payload.paymentMethod);
        break;
      }
      case "CustomerPaymentMethodDetached": {
        assertDefined(this.state);
        this.state.paymentMethods = this.state.paymentMethods.filter(
          (pm) => pm.id !== event.payload.paymentMethodId,
        );
        break;
      }
      default:
        unreachable(event);
    }
  }
}
