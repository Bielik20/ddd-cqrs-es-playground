import { message } from "../../shared/messages/message.ts";
import { CustomerProjection } from "./projections.ts";

export class GetCustomerQuery extends message<{
  id: string;
}>("GetCustomer") {}

export interface GetCustomerResult {
  customer: CustomerProjection;
}
