import { CustomerProjection } from "./projections.ts";

export interface GetCustomerQuery {
  id: string;
}

export interface GetCustomerResult {
  customer: CustomerProjection;
}
