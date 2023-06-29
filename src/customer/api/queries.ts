import { object, string } from "zod";
import { message } from "../../shared/messages/message.ts";
import { CustomerProjection } from "./projections.ts";

export class GetCustomerQuery extends message("GetCustomer", object({ id: string() })) {}

export interface GetCustomerResult {
  customer: CustomerProjection;
}
