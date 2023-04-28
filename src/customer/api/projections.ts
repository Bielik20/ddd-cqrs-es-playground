import { CustomerPaymentMethod } from "./shared.ts";

export interface CustomerProjection {
  id: string;
  displayName: string;
  email: string;
  paymentMethods: CustomerPaymentMethod[];
}
