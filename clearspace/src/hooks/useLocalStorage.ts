import { useCallback, useState, useSyncExternalStore } from "react";

const STORAGE_PREFIX = "clearspace:";
const unsavedValues = new Map<string, unknown>();
const storageListeners = new Set<() => void>();

function notifyStorageListeners() {
  // A React state updater may call the writer during render. Notify after it completes.
  queueMicrotask(() => storageListeners.forEach((listener) => listener()));
}

export function useStorageAvailable() {
  return useSyncExternalStore(
    (listener) => {
      storageListeners.add(listener);
      return () => {
        storageListeners.delete(listener);
      };
    },
    () => unsavedValues.size === 0,
    () => true,
  );
}

export function retryUnsavedValues() {
  for (const [key, value] of [...unsavedValues])
    writeLocalStorageValue(key, value);
}

export type LocalStorageOptions<T> = {
  validate?: (value: unknown) => value is T;
  migrate?: (value: unknown) => T | undefined;
};

export function createStorageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

function writeLocalStorageValue<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(createStorageKey(key), JSON.stringify(value));
    if (unsavedValues.delete(key)) notifyStorageListeners();
  } catch {
    const alreadyUnsaved = unsavedValues.has(key);
    unsavedValues.set(key, value);
    if (!alreadyUnsaved) notifyStorageListeners();
  }
}

export function readLocalStorageValue<T>(
  key: string,
  fallback: T,
  options: LocalStorageOptions<T> = {},
): T {
  if (typeof window === "undefined") return fallback;

  try {
    if (unsavedValues.has(key)) {
      const pending = unsavedValues.get(key);
      return !options.validate || options.validate(pending)
        ? (pending as T)
        : fallback;
    }
    const stored = window.localStorage.getItem(createStorageKey(key));
    if (stored === null) return fallback;

    const parsed = JSON.parse(stored) as unknown;
    const migrated = options.migrate?.(parsed);

    if (migrated !== undefined) {
      if (!options.validate || options.validate(migrated)) {
        writeLocalStorageValue(key, migrated);
        return migrated;
      }

      return fallback;
    }

    if (options.validate && !options.validate(parsed)) {
      return fallback;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(
  key: string,
  fallback: T,
  options: LocalStorageOptions<T> = {},
): [T, (value: T | ((current: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readLocalStorageValue(key, fallback, options),
  );

  const setValue = useCallback(
    (value: T | ((current: T) => T)) => {
      setStoredValue((current) => {
        const nextValue = value instanceof Function ? value(current) : value;

        writeLocalStorageValue(key, nextValue);

        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
