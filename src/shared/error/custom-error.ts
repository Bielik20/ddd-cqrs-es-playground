import { NamedError } from "./named-error.ts";

type CustomErrorConstructor<
  TName extends string = "Error",
  TPayload = Record<string, any>,
> = ConditionalName<TName> & {
  message?: string;
  cause?: Error;
} & TPayload;

type ConditionalName<TName extends string> = TName extends "Error" ? { name?: never }
  : { name: TName };

export class CustomError<
  TName extends string = "Error",
  TPayload = Record<string, any>,
> extends Error implements NamedError<TName> {
  override readonly name: TName;
  readonly payload: TPayload;

  constructor(
    { name, message, cause, ...payload }: CustomErrorConstructor<
      TName,
      TPayload
    >,
  ) {
    super(message, { cause });
    this.name = (name as TName) || ("Error" as TName);
    this.payload = payload as TPayload;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
