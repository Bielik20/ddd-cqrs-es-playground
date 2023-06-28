import { payload } from "../../shared/messages/message-payload.ts";
import { message } from "../../shared/messages/message.ts";
import { CustomerProjection } from "./projections.ts";
import { string } from "zod";

export class GetCustomerQuery extends message("GetCustomer", payload({ id: string() })) {}

export interface GetCustomerResult {
  customer: CustomerProjection;
}
