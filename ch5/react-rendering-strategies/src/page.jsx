// @ts-check
import React from 'react';
import { App } from './app';
import { Nav } from './nav';

/**
 * Page including html and head are necessary to do streaming SSR.
 */
export default function Page() {
  return (
    <html>
      <head>
        <title>Streaming</title>
      </head>
      <body>
        {/* keep in sync with one in server.js */}
        <Nav />
        <h1>Server-render with streaming</h1>
        <div id="app">
          <App type={`"streaming server render"`} />
        </div>
      </body>
    </html>
  );
}
