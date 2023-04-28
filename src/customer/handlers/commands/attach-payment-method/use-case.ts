import { err, ok } from "../../../../shared/utils/result.ts";
import { AttachPaymentMethodCommand } from "../../../api/commands.ts";
import { CustomerAggregateGateway } from "../../../gateways/customer-aggregate-gateway.ts";

export class AttachPaymentMethodUseCase {
  constructor(private readonly gateway: CustomerAggregateGateway) {}

  async run(command: AttachPaymentMethodCommand) {
    const aggregate = await this.gateway.get(command.payload.aggregateId);

    const [, error] = aggregate.attachPaymentMethod(command);

    if (error) {
      return err(error);
    }
    await this.gateway.save(aggregate);
    return ok();
  }
}
