// @ts-check
/**
 * initially we had all the following code in server.js (it was server.jsx)
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from './app';
import { Nav } from './nav';
import Page from './page';

export const SERVER_RENDER_APP_TYPE = `"server render"`;

export function renderNav() {
  return ReactDOMServer.renderToStaticMarkup(<Nav />);
}
export function serverRenderApp() {
  return ReactDOMServer.renderToString(<App type={SERVER_RENDER_APP_TYPE} />);
}

/**
 * @param {import('express').Response} res
 */
export function serverRenderAppStream(res) {
  const { pipe } = ReactDOMServer.renderToPipeableStream(<Page />, {
    bootstrapScripts: ['./streaming-rehydrate.js'],
  });
  pipe(res);
}
