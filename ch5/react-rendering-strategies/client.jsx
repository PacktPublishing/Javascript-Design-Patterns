import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './src/app';

ReactDOM.createRoot(document.querySelector('#app')).render(
  <App type={`"client render"`} />,
);
