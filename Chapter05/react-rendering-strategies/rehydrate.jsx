import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './src/app';
import { SERVER_RENDER_APP_TYPE } from './src/server-render';

ReactDOM.hydrateRoot(
  document.querySelector('#app'),
  /**
   * We can't use a different "type" value here, else we get React hydration errors
   * We have to ensure the type in here and in ./src/server-render.jsx matches.
   */
  <App type={SERVER_RENDER_APP_TYPE} />,
);
