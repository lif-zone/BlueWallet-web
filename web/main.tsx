import React from 'react';
import {createRoot} from 'react-dom/client';
import './node_env.js';
import App from './app.jsx';
import {html_elm_frag_append} from 'lif-kernel/util';
html_elm_frag_append(document.head, `
  <meta name=viewport content='width=device-width, initial-scale=1' />
  <link rel=icon href='lif-kernel/favicon.ico' />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0c2461; color: #fff; }
    button { cursor: pointer; }
    input, textarea { font-family: inherit; }
  </style>
`);
let _root = document.body.appendChild(document.createElement('div'));
let root = createRoot(_root);
root.render(<App />);
