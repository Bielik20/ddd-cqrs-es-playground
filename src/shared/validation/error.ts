import { CustomError } from "../error/custom-error.ts";

export class ParseError extends CustomError<"ParseError"> {
  override readonly name = "ParseError";

  constructor(message: string, cause?: Error) {
    super({ name: "ParseError", message: message, cause });
  }
}
