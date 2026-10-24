import { StateStorage } from 'zustand/middleware';

const STORAGE_ID = 'topaz-store-storage';

interface MMKVLike {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
}

let mmkvInstance: MMKVLike | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mmkvModule = require('react-native-mmkv');
  if (typeof mmkvModule?.createMMKV === 'function') {
    mmkvInstance = mmkvModule.createMMKV({ id: STORAGE_ID });
  }
} catch {
  // Graceful fallback for non-native test environments (e.g. Jest / Node)
  mmkvInstance = null;
}

const inMemoryMap = new Map<string, string>();

export const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (mmkvInstance !== null) {
      const stored = mmkvInstance.getString(name);
      return stored !== undefined ? stored : null;
    }
    const memVal = inMemoryMap.get(name);
    return memVal !== undefined ? memVal : null;
  },
  setItem: (name: string, value: string): void => {
    if (mmkvInstance !== null) {
      mmkvInstance.set(name, value);
    } else {
      inMemoryMap.set(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (mmkvInstance !== null) {
      mmkvInstance.remove(name);
    } else {
      inMemoryMap.delete(name);
    }
  },
};
