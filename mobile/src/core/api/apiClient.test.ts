import { AxiosError, AxiosHeaders } from 'axios';
import {
  ApiError,
  getMessageForStatus,
  normalizeError,
} from '@/core/api/apiClient';
import { STRINGS } from '@/core/theme/strings';

const buildAxiosError = (
  status: number | undefined,
  data: unknown = undefined,
  code?: string
): AxiosError => {
  const config = { headers: new AxiosHeaders() };
  const response =
    status === undefined
      ? undefined
      : { status, statusText: '', headers: {}, config, data };
  return new AxiosError('Request failed', code, config, null, response);
};

describe('normalizeError', () => {
  it('should map 502 to a localized message and keep server detail for diagnostics', () => {
    // Arrange
    const serverDetail = 'The product catalog is currently unavailable.';
    const error = buildAxiosError(502, { detail: serverDetail });

    // Act
    const result = normalizeError(error);

    // Assert
    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(502);
    expect(result.message).toBe(STRINGS.common.serviceUnavailableError);
    expect(result.detail).toBe(serverDetail);
  });

  it('should map 404 to the not found message', () => {
    // Arrange & Act
    const result = normalizeError(buildAxiosError(404));

    // Assert
    expect(result.status).toBe(404);
    expect(result.message).toBe(STRINGS.common.notFoundError);
  });

  it('should treat a client timeout as 504', () => {
    // Arrange & Act
    const result = normalizeError(
      buildAxiosError(undefined, undefined, 'ECONNABORTED')
    );

    // Assert
    expect(result.status).toBe(504);
    expect(result.message).toBe(STRINGS.common.timeoutError);
  });

  it('should treat a missing response as a network error', () => {
    // Arrange & Act
    const result = normalizeError(buildAxiosError(undefined));

    // Assert
    expect(result.status).toBe(0);
    expect(result.message).toBe(STRINGS.common.networkError);
  });

  it('should never expose raw non-axios error messages to the user', () => {
    // Arrange & Act
    const result = normalizeError(new Error('undefined is not a function'));

    // Assert
    expect(result.message).toBe(STRINGS.common.unknownError);
    expect(result.detail).toBe('undefined is not a function');
  });

  it('should return the same instance when given an ApiError', () => {
    // Arrange
    const apiError = new ApiError(400, 'custom');

    // Act & Assert
    expect(normalizeError(apiError)).toBe(apiError);
  });
});

describe('getMessageForStatus', () => {
  it.each([
    [400, STRINGS.common.badRequestError],
    [500, STRINGS.common.serverError],
    [503, STRINGS.common.serviceUnavailableError],
    [418, STRINGS.common.unknownError],
  ])('should map status %d to its localized message', (status, expected) => {
    expect(getMessageForStatus(status)).toBe(expected);
  });
});
