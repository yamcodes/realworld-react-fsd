/**
 * @see https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 */

type ErrorWithMessage = {
  message: string;
};

type ErrorsWithMessages = {
  // errors: {
  //   body: string[];
  // };
  errors: Record<string, Array<string>>;
};

function mapErrorsWithMessages(
  maybeError: ErrorsWithMessages,
): ErrorWithMessage {
  const message = Object.entries(maybeError.errors)
    .flatMap(([key, value]) => value.map((curError) => `${key} ${curError}`))
    .pop() as string;

  return { message };
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function isErrorsWithMessages(error: unknown): error is ErrorsWithMessages {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    typeof (error as Record<string, unknown>).errors === 'object' &&
    error.errors !== null &&
    Boolean(Object.keys((error as Record<string, Array<string>>).errors).length)
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  if (isErrorsWithMessages(maybeError))
    return mapErrorsWithMessages(maybeError);

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}
