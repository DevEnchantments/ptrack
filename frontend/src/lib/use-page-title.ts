import { useEffect } from 'react'

/** Sets the browser tab title ("<title> · P-Track"), restoring on unmount. */
export function usePageTitle(title: string | null | undefined) {
  useEffect(() => {
    document.title = title ? `${title} · P-Track` : 'P-Track'
    return () => {
      document.title = 'P-Track'
    }
  }, [title])
}
