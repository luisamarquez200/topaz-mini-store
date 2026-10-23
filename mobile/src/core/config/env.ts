import { Platform } from 'react-native';

const IOS_SIMULATOR_URL = 'http://localhost:8080/api';
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:8080/api';
const DEFAULT_URL = 'http://localhost:8080/api';

const resolveBaseUrl = (): string => {
  return (
    Platform.select({
      ios: IOS_SIMULATOR_URL,
      android: ANDROID_EMULATOR_URL,
      default: DEFAULT_URL,
    }) ?? DEFAULT_URL
  );
};

export interface EnvConfig {
  readonly API_BASE_URL: string;
  readonly API_TIMEOUT_MS: number;
}

export const ENV: EnvConfig = Object.freeze({
  API_BASE_URL: resolveBaseUrl(),
  API_TIMEOUT_MS: 10000,
});
