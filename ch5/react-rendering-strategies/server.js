// @ts-check
import express from 'express';
import {
  renderNav,
  serverRenderApp,
  serverRenderAppStream,
} from './src/server-render';

const app = express();
app.use(express.static('./dist'));

app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    ${renderNav()}
    <h1>Server-render only</h1>
    <div id="app">${serverRenderApp()}</div>
  `);
});

app.get('/streaming', (_req, res) => {
  serverRenderAppStream(res);
});

// import Helmet from 'react-helmet';
// app.get('/helmet', (_req, res) => {
//   const renderedApp = serverRenderApp();
//   const helmet = Helmet.renderStatic();
//   res.send(`
//     <!DOCTYPE html>
//     <head>
//       ${helmet.title.toString()}
//       ${helmet.meta.toString()}
//       ${helmet.link.toString()}
//     </head>
//     ${renderNav()}
//     <h1>Server-render with react-helmet to set head contents</h1>
//     <div id="app">${renderedApp}</div>
//   `);
// });

app.get('/rehydrate', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    ${renderNav()}
    <h1>Server-render with client-side rehydration</h1>
    <div id="app">${serverRenderApp()}</div>
    <script src="./rehydrate.js"></script>
  `);
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
