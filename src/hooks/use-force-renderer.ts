import { useCallback, useState } from "react";

export function useForceRenderer() {
  const [key, setKey] = useState(0)

  const forceRenderer = useCallback(() => {
    setKey(p => p + 1)
  }, [])

  return { key, forceRenderer }
}
