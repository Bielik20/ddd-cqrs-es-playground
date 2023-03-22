export type Result<TValue, TError = Error> =
  | OkResult<TValue>
  | ErrorResult<TError>;
type OkResult<TValue = void> = [value: TValue, error: undefined];
type ErrorResult<TError = Error> = [value: undefined, error: TError];

export function ok(): OkResult;
export function ok<TValue>(value: TValue): OkResult<TValue>;
export function ok<TValue>(value?: TValue): OkResult<TValue> {
  return [value, undefined] as OkResult<TValue>;
}

export function err<TError>(error: TError): ErrorResult<TError> {
  return [undefined, error];
}
