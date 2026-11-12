import React from 'react';
import {createRoot} from 'react-dom/client';
import './node_env.js';
import {html_elm_frag_append} from 'lif-kernel/util';

html_elm_frag_append(document.head, `
  <meta name=viewport content='width=device-width, initial-scale=1' />
  <link rel=icon href='lif-kernel/favicon.ico' />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Helvetica Neue', Arial, sans-serif; }
    button { cursor: pointer; }
    input, textarea { font-family: inherit; }
  </style>
`);

function LoadingApp(){
  return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', flexDirection: 'column'}}>
    <div style={{fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>BlueWallet Web</div>
    <div style={{fontSize: 14, opacity: 0.6}}>Loading...</div>
  </div>;
}

let _root = document.body.appendChild(document.createElement('div'));
let root = createRoot(_root);
root.render(<LoadingApp />);

(async()=>{
  try {
    let {default: App} = await import('../App.tsx');
    root.render(<App />);
  } catch(e){
    console.error('App load error:', e);
    root.render(<div style={{padding: 32}}>
      <div style={{fontSize: 24, color: '#e74c3c'}}>Load Error</div>
      <pre style={{fontSize: 12, whiteSpace: 'pre-wrap'}}>{e.message+'\n'+e.stack}</pre>
    </div>);
  }
})();
