import { useState } from 'react'

/**
 * useState persisted to localStorage (string values only — parse at the call
 * site if needed). Reads once on mount; writes on every set. Storage errors
 * (private mode, quota) degrade to plain state.
 */
export function useLocalStorage<T extends string>(
  key: string,
  initial: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      return (localStorage.getItem(key) as T) ?? initial
    } catch {
      return initial
    }
  })

  function set(next: T) {
    setValue(next)
    try {
      localStorage.setItem(key, next)
    } catch {
      /* storage unavailable — state still works for this session */
    }
  }

  return [value, set]
}
