import { CustomerProjection } from "../api/projections.ts";

export class CustomerProjectionGateway {
  private readonly projections: Map<string, CustomerProjection> = new Map();

  async save(projection: CustomerProjection): Promise<void> {
    this.projections.set(projection.id, projection);
  }

  async get(aggregateId: string): Promise<CustomerProjection | undefined> {
    return this.projections.get(aggregateId);
  }
}
