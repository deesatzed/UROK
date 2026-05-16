import { useCallback, useState } from "react";

const STORAGE_PREFIX = "clearspace:";

export type LocalStorageOptions<T> = {
  validate?: (value: unknown) => value is T;
  migrate?: (value: unknown) => T | undefined;
};

export function createStorageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

function writeLocalStorageValue<T>(key: string, value: T) {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    window.localStorage.setItem(createStorageKey(key), JSON.stringify(value));
  } catch {
    // Storage can fail in private browsing, quota pressure, or locked-down contexts.
  }
}

export function readLocalStorageValue<T>(
  key: string,
  fallback: T,
  options: LocalStorageOptions<T> = {},
): T {
  if (typeof window === "undefined" || !window.localStorage) return fallback;

  try {
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
        const nextValue =
          value instanceof Function ? value(current) : value;

        writeLocalStorageValue(key, nextValue);

        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
