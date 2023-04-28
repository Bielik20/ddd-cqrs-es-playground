import { err, ok } from "../../../../shared/utils/result.ts";
import { DetachPaymentMethodCommand } from "../../../api/commands.ts";
import { CustomerAggregateGateway } from "../../../gateways/customer-aggregate-gateway.ts";

export class DetachPaymentMethodUseCase {
  constructor(private readonly gateway: CustomerAggregateGateway) {}

  async run(command: DetachPaymentMethodCommand) {
    const aggregate = await this.gateway.get(command.payload.aggregateId);

    const [, error] = aggregate.detachPaymentMethod(command);

    if (error) {
      return err(error);
    }
    await this.gateway.save(aggregate);
    return ok();
  }
}
