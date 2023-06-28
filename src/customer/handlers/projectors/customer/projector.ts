import { CustomerProjectionGateway } from "../../../gateways/customer-projection-gateway.ts";
import { CustomerProjection } from "../../../api/projections.ts";
import {
  CustomerCreatedEvent,
  CustomerPaymentMethodAttachedEvent,
  CustomerPaymentMethodDetachedEvent,
} from "../../../api/events.ts";
import { assertDefined } from "../../../../shared/utils/assert-defined.ts";
import {
  makeReducer,
  on,
  ReducerMessage,
  state,
} from "../../../../shared/messages/message-reducer.ts";

const reducer = makeReducer(state<CustomerProjection | null>(null), [
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

export class CustomerProjector {
  constructor(private readonly gateway: CustomerProjectionGateway) {}

  async run(event: ReducerMessage<typeof reducer>): Promise<void> {
    const initialState = (await this.gateway.get(event.aggregateId)) || reducer.initial();
    const value = reducer(initialState, event);
    assertDefined(value);
    await this.gateway.save(value);
  }
}
