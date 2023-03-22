import { nanoid } from "nanoid";
import { Immutable } from "../utils/immutable.ts";

export abstract class Message<
  TName extends string = string,
  TPayload extends Record<string, any> = Record<string, any>,
> {
  readonly id: string;
  readonly timestamp: number;

  protected constructor(
    readonly name: TName,
    readonly payload: Immutable<TPayload>,
  ) {
    this.id = nanoid();
    this.timestamp = Date.now();
  }
}
