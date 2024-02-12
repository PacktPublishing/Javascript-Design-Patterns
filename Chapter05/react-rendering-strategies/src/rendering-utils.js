// @ts-check
import { useState, useEffect } from 'react';

export function useClientRenderingOnly() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  });
  return hasMounted;
}

export const isServer = () => typeof window === 'undefined';
// export const isServer = () => false;
