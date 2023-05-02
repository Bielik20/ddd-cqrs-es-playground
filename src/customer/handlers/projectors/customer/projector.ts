import { CustomerProjectionGateway } from "../../../gateways/customer-projection-gateway.ts";
import { CustomerProjection } from "../../../api/projections.ts";
import {
  CustomerCreatedEvent,
  CustomerPaymentMethodAttachedEvent,
  CustomerPaymentMethodDetachedEvent,
} from "../../../api/events.ts";
import { assertDefined } from "../../../../shared/utils/assert-defined.ts";
import { on, reducer, ReducerMessage, state } from "../../../../shared/messages/message-reducer.ts";

export class CustomerProjector {
  private readonly reducer = reducer(state<CustomerProjection | null>(), [
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
  ]);

  constructor(private readonly gateway: CustomerProjectionGateway) {}

  async run(event: ReducerMessage<typeof this.reducer>): Promise<void> {
    const initialState = (await this.gateway.get(event.aggregateId)) || null;
    const value = this.reducer(initialState, event);
    assertDefined(value);
    await this.gateway.save(value);
  }
}
