import { CustomerProjectionGateway } from "../../../gateways/customer-projection-gateway.ts";
import { GetCustomerQuery, GetCustomerResult } from "../../../api/queries.ts";

export class GetCustomerUseCase {
  constructor(private readonly gateway: CustomerProjectionGateway) {}

  async run(query: GetCustomerQuery): Promise<GetCustomerResult | undefined> {
    const customer = await this.gateway.get(query.id);
    if (!customer) {
      return;
    }
    return { customer };
  }
}
