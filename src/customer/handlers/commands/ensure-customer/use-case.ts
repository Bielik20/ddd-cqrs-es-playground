import { Result } from "../../../../shared/utils/result.ts";
import { EnsureCustomerCommand } from "../../../api/commands.ts";
import { CustomerAggregateGateway } from "../../../gateways/customer-aggregate-gateway.ts";
import { CustomerAggregate } from "../../../models/aggregate.ts";

export class EnsureCustomerUseCase {
  constructor(private readonly gateway: CustomerAggregateGateway) {}

  async run(command: EnsureCustomerCommand) {
    const exists = await this.gateway.exists(command.payload.aggregateId);
    if (exists) {
      return;
    }

    const [aggregate, error] = CustomerAggregate.create(command);
    if (error) {
      return Result.error(error);
    }
    await this.gateway.save(aggregate);
    return Result.ok();
  }
}
