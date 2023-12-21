// @ts-check
import React, { useState } from 'react';
import { useClientRenderingOnly } from './rendering-utils';

export function ClientCounter() {
  const isClientRendering = useClientRenderingOnly();
  const [count, setCount] = useState(0);
  if (!isClientRendering) return null;
  return (
    <div>
      Dynamic Counter, count: {count}
      <br />
      <button onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
}
