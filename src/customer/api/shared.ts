import { object, string, TypeOf } from "zod";

export type CustomerPaymentMethod = TypeOf<typeof CustomerPaymentMethod>;

export const CustomerPaymentMethod = object({
  id: string(),
  ownerName: string(),
  last4Digits: string(),
});
