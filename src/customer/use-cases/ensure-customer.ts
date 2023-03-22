import { err, ok } from "../../shared-kernel/utils/result.ts";
import { CustomerAggregateGateway } from "../aggregate/gateway.ts";
import { CustomerAggregate } from "../aggregate/root.ts";
import { EnsureCustomerCommand } from "../api/commands.ts";

export class EnsureCustomerUseCase {
  constructor(private readonly gateway: CustomerAggregateGateway) {}

  async run(command: EnsureCustomerCommand) {
    const exists = await this.gateway.exists(command.payload.userId);
    if (exists) {
      return;
    }

    const [aggregate, error] = CustomerAggregate.create(
      command,
    );
    if (error) {
      return err(error);
    }
    await this.gateway.save(aggregate);
    return ok();
  }
}
