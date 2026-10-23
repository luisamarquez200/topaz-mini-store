import { createMMKV, MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

const STORAGE_ID = 'topaz-store-storage';

let mmkvInstance: MMKV | null = null;

try {
  mmkvInstance = createMMKV({ id: STORAGE_ID });
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
