import { getErrorMessage } from '@/shared/utils/getErrorMessage';

describe('getErrorMessage', () => {
  const FALLBACK_MESSAGE = 'Default fallback error message';
  const ERROR_MESSAGE = 'Standard system error';
  const API_OBJECT_MESSAGE = 'Custom API problem detail message';
  const EMPTY_STRING = '';
  const WHITESPACE_STRING = '   ';
  const PRIMITIVE_STRING_ERROR = 'Direct string error';
  const PRIMITIVE_NUMBER_ERROR = 500;

  it('should return error message when error is an instance of Error', () => {
    // Arrange
    const error = new Error(ERROR_MESSAGE);

    // Act
    const result = getErrorMessage(error, FALLBACK_MESSAGE);

    // Assert
    expect(result).toBe(ERROR_MESSAGE);
  });

  it('should return message when error is a plain object containing a message property', () => {
    // Arrange
    const error = { message: API_OBJECT_MESSAGE };

    // Act
    const result = getErrorMessage(error, FALLBACK_MESSAGE);

    // Assert
    expect(result).toBe(API_OBJECT_MESSAGE);
  });

  it('should return fallback message when message property is empty or whitespace', () => {
    // Arrange
    const errorWithEmptyMessage = { message: EMPTY_STRING };
    const errorWithWhitespaceMessage = { message: WHITESPACE_STRING };
    const errorInstanceWithEmptyMessage = new Error(EMPTY_STRING);

    // Act
    const resultEmpty = getErrorMessage(
      errorWithEmptyMessage,
      FALLBACK_MESSAGE
    );
    const resultWhitespace = getErrorMessage(
      errorWithWhitespaceMessage,
      FALLBACK_MESSAGE
    );
    const resultErrorInstance = getErrorMessage(
      errorInstanceWithEmptyMessage,
      FALLBACK_MESSAGE
    );

    // Assert
    expect(resultEmpty).toBe(FALLBACK_MESSAGE);
    expect(resultWhitespace).toBe(FALLBACK_MESSAGE);
    expect(resultErrorInstance).toBe(FALLBACK_MESSAGE);
  });

  it('should return fallback message when error is a non-object value', () => {
    // Arrange
    const nullError: unknown = null;
    const undefinedError: unknown = undefined;
    const stringError: unknown = PRIMITIVE_STRING_ERROR;
    const numberError: unknown = PRIMITIVE_NUMBER_ERROR;

    // Act
    const resultNull = getErrorMessage(nullError, FALLBACK_MESSAGE);
    const resultUndefined = getErrorMessage(undefinedError, FALLBACK_MESSAGE);
    const resultString = getErrorMessage(stringError, FALLBACK_MESSAGE);
    const resultNumber = getErrorMessage(numberError, FALLBACK_MESSAGE);

    // Assert
    expect(resultNull).toBe(FALLBACK_MESSAGE);
    expect(resultUndefined).toBe(FALLBACK_MESSAGE);
    expect(resultString).toBe(FALLBACK_MESSAGE);
    expect(resultNumber).toBe(FALLBACK_MESSAGE);
  });
});
