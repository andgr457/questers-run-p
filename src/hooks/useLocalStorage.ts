import { useCallback, useState, type Dispatch, type SetStateAction } from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  const setValue: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (value) => {
      setStoredValue(prev => {
        const nextValue =
          typeof value === "function"
            ? (value as (prev: T | undefined) => T | undefined)(prev)
            : value

        if (nextValue === undefined) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(nextValue))
        }

        return nextValue
      })
    },
    [key]
  )

  return [storedValue, setValue]
}

export function getLocalStorage<T>(key: string) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) as T : undefined
}