import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    let item = localStorage.getItem(key);
    if(item === 'undefined'){
      return undefined
    }
    return item ? JSON.parse(item as string) : initialValue ?? undefined;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
}

export function getLocalStorage<T>(key: string) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) as T : undefined
}
