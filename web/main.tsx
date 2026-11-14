import React from 'react';
import {createRoot} from 'react-dom/client';
import './node_env.js';
import {html_elm_frag_append} from 'lif-kernel/util';
declare const $lif: any;

html_elm_frag_append(document.head, `
  <meta name=viewport content='width=device-width, initial-scale=1' />
  <link rel=icon href='lif-kernel/favicon.ico' />
  <style>
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Helvetica Neue', Arial, sans-serif; }
    #root { display: flex; flex-direction: column; height: 100%; }
    #root > div { display: flex; flex-direction: column; flex: 1; min-height: 0; }
    [class*="css-text-"] { overflow: hidden; }
    button { cursor: pointer; }
    input, textarea { font-family: inherit; }
  </style>
`);

function LoadingApp(){
  return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', flexDirection: 'column'}}>
    <div style={{fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>BlueWallet Web</div>
    <div id='bw-loading-text' style={{fontSize: 14, opacity: 0.6}}>Loading…</div>
  </div>;
}

class ErrorBoundary extends React.Component<{children: any}, {error: any}> {
  constructor(props: any){
    super(props);
    this.state = {error: null};
  }
  static getDerivedStateFromError(error: any){
    return {error};
  }
  componentDidCatch(error: any, info: any){
    console.error('ErrorBoundary caught:', error, info?.componentStack);
  }
  render(){
    if (this.state.error){
      return <div style={{padding: 32}}>
        <div style={{fontSize: 24, color: '#e74c3c'}}>Render Error</div>
        <pre style={{fontSize: 12, whiteSpace: 'pre-wrap'}}>{this.state.error.message+'\n'+this.state.error.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

let _root = document.body.appendChild(document.createElement('div'));
_root.id = 'root';
let root = createRoot(_root);
root.render(<LoadingApp />);

(async()=>{
  let last: number|null = null;
  let diff = 0;
  let iv = setInterval(async()=>{
    let stats = await $lif.boot.kernel_stats();
    let all = stats?.fetch?.all;
    if (all==null || all==last)
      return;
    if (last==null)
      diff = all;
    last = all;
    let txt = document.getElementById('bw-loading-text');
    if (txt)
      txt.textContent = 'Loading… '+(all-diff);
  }, 200);
  try {
    let {default: App} = await import('../App.tsx');
    clearInterval(iv);
    root.render(<ErrorBoundary><App /></ErrorBoundary>);
  } catch(e){
    clearInterval(iv);
    console.error('App load error:', e);
    root.render(<div style={{padding: 32}}>
      <div style={{fontSize: 24, color: '#e74c3c'}}>Load Error</div>
      <pre style={{fontSize: 12, whiteSpace: 'pre-wrap'}}>{e.message+'\n'+e.stack}</pre>
    </div>);
  }
})();
