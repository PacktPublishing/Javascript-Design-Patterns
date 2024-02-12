// @ts-check
import React from 'react';

export function Nav() {
  // keep in sync with routes in server.js
  return (
    <ul>
      <li>
        <a href="/">Server-render only</a>
      </li>
      {/* <li>
        <a href="/helmet">
          Server-render with react-helmet to set head contents
        </a>
      </li> */}
      <li>
        <a href="/rehydrate">Server-render with client-side rehydration</a>
      </li>
      <li>
        <a href="/streaming">Server-render with streaming</a>
      </li>
    </ul>
  );
}
