import { useCallback, useState } from "react";

const STORAGE_PREFIX = "clearspace:";

export function createStorageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

export function readLocalStorageValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined" || !window.localStorage) return fallback;

  try {
    const stored = window.localStorage.getItem(createStorageKey(key));
    return stored === null ? fallback : (JSON.parse(stored) as T);
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(
  key: string,
  fallback: T,
): [T, (value: T | ((current: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readLocalStorageValue(key, fallback),
  );

  const setValue = useCallback(
    (value: T | ((current: T) => T)) => {
      setStoredValue((current) => {
        const nextValue =
          value instanceof Function ? value(current) : value;

        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(
            createStorageKey(key),
            JSON.stringify(nextValue),
          );
        }

        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
