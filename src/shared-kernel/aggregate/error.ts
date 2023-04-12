import { NamedError } from "../error/named-error.ts";

export abstract class AggregateError<TName extends string = string>
  implements NamedError<TName> {
  aggregateName!: string;
  aggregateId!: string;
  aggregateVersion!: number;

  protected constructor(readonly name: TName, readonly message: string = "") {}
}
