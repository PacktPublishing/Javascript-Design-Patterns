// @ts-check
import React from 'react';
import { ClientCounter } from './client-counter';
import { /* isServer ,*/ useClientRenderingOnly } from './rendering-utils';

export function App({ type = '' }) {
  const isClientRendering = useClientRenderingOnly();
  /*
    Shouldn't do the following, means the lazy-load happens on every render
    so it suspends on every render, we want this behaviour so that it's deterministic
    for demos, but we should ensure to note that the correct place to have this code is
    in the module scope.
  */
  // const Loaded = lazy(async () => {
  //   // to demo this, disable JavaScript to show the document without JS
  //   return import('./loaded.jsx');
  // });

  return (
    <>
      <div>
        <p>Hello from the {type + ' '}app</p>
        <p>
          Rendering: {isClientRendering ? 'from client' : 'not from client'}
        </p>
        <ClientCounter />
        {/* <Suspense fallback={<div>Loading</div>}>
          <Loaded />
        </Suspense> */}
      </div>
    </>
  );
}
