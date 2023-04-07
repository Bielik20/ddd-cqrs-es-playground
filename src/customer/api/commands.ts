import {
  CommandType,
  createAggregateCommand,
} from "../../shared-kernel/aggregate/command.ts";

export const EnsureCustomerCommand = createAggregateCommand<{
  aggregateId: string;
  displayName: string;
  email: string;
}>("Customer", "EnsureCustomer");
export type EnsureCustomerCommand = CommandType<typeof EnsureCustomerCommand>;

export const AttachPaymentMethodCommand = createAggregateCommand<{
  aggregateId: string;
  paymentMethod: {
    id: string;
    ownerName: string;
    last4Digits: string;
  };
}>("Customer", "AttachPaymentMethod");
export type AttachPaymentMethodCommand = CommandType<
  typeof AttachPaymentMethodCommand
>;

export const DetachPaymentMethodCommand = createAggregateCommand<{
  aggregateId: string;
  paymentMethodId: string;
}>("Customer", "DetachPaymentMethod");
export type DetachPaymentMethodCommand = CommandType<
  typeof DetachPaymentMethodCommand
>;
