import { AxiosInstance, create, isAxiosError } from 'axios';
import { ENV } from '@/core/config/env';
import { STRINGS } from '@/core/theme/strings';

export const HTTP_STATUS = Object.freeze({
  NETWORK_ERROR: 0,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
});

const TIMEOUT_ERROR_CODES: readonly string[] = ['ECONNABORTED', 'ETIMEDOUT'];

export class ApiError extends Error {
  readonly status: number;
  readonly detail: string | null;

  constructor(status: number, message: string, detail: string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const extractServerDetail = (data: unknown): string | null => {
  if (isRecord(data) && typeof data.detail === 'string') {
    return data.detail;
  }
  return null;
};

export const getMessageForStatus = (status: number): string => {
  switch (status) {
    case HTTP_STATUS.NETWORK_ERROR:
      return STRINGS.common.networkError;
    case HTTP_STATUS.BAD_REQUEST:
      return STRINGS.common.badRequestError;
    case HTTP_STATUS.NOT_FOUND:
      return STRINGS.common.notFoundError;
    case HTTP_STATUS.GATEWAY_TIMEOUT:
      return STRINGS.common.timeoutError;
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return STRINGS.common.serviceUnavailableError;
    default:
      return status >= HTTP_STATUS.INTERNAL_SERVER_ERROR
        ? STRINGS.common.serverError
        : STRINGS.common.unknownError;
  }
};

export const normalizeError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (isAxiosError(error)) {
    const isTimeout =
      error.code !== undefined && TIMEOUT_ERROR_CODES.includes(error.code);
    const status =
      error.response?.status ??
      (isTimeout ? HTTP_STATUS.GATEWAY_TIMEOUT : HTTP_STATUS.NETWORK_ERROR);

    return new ApiError(
      status,
      getMessageForStatus(status),
      extractServerDetail(error.response?.data) ?? error.message
    );
  }

  return new ApiError(
    HTTP_STATUS.NETWORK_ERROR,
    STRINGS.common.unknownError,
    error instanceof Error ? error.message : null
  );
};

export const apiClient: AxiosInstance = create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const normalized = normalizeError(error);
    return Promise.reject(normalized);
  }
);
