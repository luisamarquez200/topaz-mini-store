import { Platform } from 'react-native';

const IOS_SIMULATOR_URL = 'http://localhost:8080/api';
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:8080/api';
const DEFAULT_URL = 'http://localhost:8080/api';
const DEFAULT_TIMEOUT_MS = 10000;

const resolveDefaultBaseUrl = (): string => {
  return (
    Platform.select({
      ios: IOS_SIMULATOR_URL,
      android: ANDROID_EMULATOR_URL,
      default: DEFAULT_URL,
    }) ?? DEFAULT_URL
  );
};

const resolveBaseUrl = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  return fromEnv !== undefined && fromEnv.length > 0
    ? fromEnv.replace(/\/+$/, '')
    : resolveDefaultBaseUrl();
};

const resolveTimeoutMs = (): number => {
  const parsed = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
};

export interface EnvConfig {
  readonly API_BASE_URL: string;
  readonly API_TIMEOUT_MS: number;
}

export const ENV: EnvConfig = Object.freeze({
  API_BASE_URL: resolveBaseUrl(),
  API_TIMEOUT_MS: resolveTimeoutMs(),
});
