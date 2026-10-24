export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }

  return fallbackMessage;
};
