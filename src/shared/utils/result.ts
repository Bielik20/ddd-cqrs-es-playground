export type Result<TValue, TError = Error> =
  | OkResult<TValue>
  | ErrorResult<TError>;
type OkResult<TValue = void> = [value: TValue, error: undefined];
type ErrorResult<TError = Error> = [value: undefined, error: TError];

function ok(): OkResult;
function ok<TValue>(value: TValue): OkResult<TValue>;
function ok<TValue>(value?: TValue): OkResult<TValue> {
  return [value, undefined] as OkResult<TValue>;
}

function err<TError>(error: TError): ErrorResult<TError> {
  return [undefined, error];
}

export const Result = { ok, err };
