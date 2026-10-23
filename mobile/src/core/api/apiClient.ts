import axios, { AxiosInstance } from 'axios';
import { ENV } from '../config/env';

export interface ApiError {
  readonly status: number;
  readonly message: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isApiError = (error: unknown): error is ApiError => {
  if (!isRecord(error)) {
    return false;
  }
  return typeof error.status === 'number' && typeof error.message === 'string';
};

const extractErrorMessage = (data: unknown, fallbackMessage: string): string => {
  if (isRecord(data)) {
    if (typeof data.detail === 'string' && data.detail.length > 0) {
      return data.detail;
    }
    if (typeof data.message === 'string' && data.message.length > 0) {
      return data.message;
    }
    if (typeof data.title === 'string' && data.title.length > 0) {
      return data.title;
    }
  }
  return fallbackMessage;
};

export const normalizeError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? (error.code === 'ECONNABORTED' ? 504 : 0);
    const fallback = error.message || 'An error occurred while connecting to the server';
    const message = extractErrorMessage(error.response?.data, fallback);

    return {
      status,
      message,
    };
  }

  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message,
    };
  }

  return {
    status: 0,
    message: 'Unknown error occurred',
  };
};

export const apiClient: AxiosInstance = axios.create({
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
