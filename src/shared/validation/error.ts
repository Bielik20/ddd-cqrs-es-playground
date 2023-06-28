import { CustomError } from "../error/custom-error.ts";

export class ValidationError extends CustomError<"ValidationError"> {
  override readonly name = "ValidationError";

  constructor(message: string, cause?: Error) {
    super({ name: "ValidationError", message: message, cause });
  }
}
