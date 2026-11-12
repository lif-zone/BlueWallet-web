import React, {useState, useEffect, useRef} from 'react';
import * as bip39 from 'bip39';

let HDSegwitBech32Wallet;
let BlueElectrum;
let QRCode;

const SCREEN_WALLETS = 'wallets';
const SCREEN_ADD = 'add';
const SCREEN_DETAIL = 'detail';
const SCREEN_RECEIVE = 'receive';
const SCREEN_SEND = 'send';

const STORAGE_KEY = 'bluewallet_web_wallets';

function saveWallets(wallets){
  let data = wallets.map(w=>{
    let obj = {};
    for (let k of Object.keys(w)){
      let v = w[k];
      if (typeof v!='function' && typeof v!='object')
        obj[k] = v;
      else if (v && typeof v=='object' && !Array.isArray(v))
        obj[k] = v;
      else if (Array.isArray(v))
        obj[k] = v;
    }
    return {type: w.type, data: JSON.stringify(obj)};
  });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch(e){ console.warn('save failed', e); }
}

function loadWallets(){
  if (!HDSegwitBech32Wallet)
    return [];
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return [];
    let arr = JSON.parse(raw);
    return arr.map(({type, data})=>{
      if (type=='HDsegwitBech32'){
        let w = HDSegwitBech32Wallet.fromJson(data);
        return w;
      }
      return null;
    }).filter(Boolean);
  } catch(e){
    console.warn('load failed', e);
    return [];
  }
}

function satsToBtc(sats){
  return (sats/1e8).toFixed(8).replace(/\.?0+$/, '')||'0';
}

function formatBtc(sats){
  if (sats==0)
    return '0';
  if (Math.abs(sats)<100000)
    return sats+' sats';
  return satsToBtc(sats)+' BTC';
}

function QR({value, size=200}){
  let ref = useRef();
  useEffect(()=>{
    if (!ref.current || !value || !QRCode)
      return;
    QRCode.toCanvas(ref.current, value, {
      width: size, margin: 2,
      color: {dark: '#000', light: '#fff'},
    });
  }, [value, size]);
  return <canvas ref={ref} style={{borderRadius: 8}} />;
}

function Header({title, onBack}){
  return <div style={styles.header}>
    {onBack && <button style={styles.backBtn} onClick={onBack}>&#8592;</button>}
    <span style={styles.headerTitle}>{title}</span>
  </div>;
}

function WalletListScreen({wallets, onSelect, onAdd, onRefresh, refreshing}){
  let total = wallets.reduce((s, w)=>s+w.getBalance()+w.getUnconfirmedBalance(), 0);
  return <div style={styles.screen}>
    <Header title="BlueWallet Web" />
    <div style={styles.totalBar}>
      <div style={{fontSize: 14, opacity: 0.7}}>Total Balance</div>
      <div style={{fontSize: 28, fontWeight: 'bold'}}>{formatBtc(total)}</div>
    </div>
    <div style={styles.actions}>
      <button style={styles.actionBtn} onClick={onAdd}>+ Add Wallet</button>
      <button style={styles.actionBtn} onClick={onRefresh} disabled={refreshing}>
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
    {wallets.length==0 && <div style={styles.empty}>
      No wallets yet. Add one to get started.
    </div>}
    {wallets.map((w, i)=><div key={i} style={styles.walletCard}
      onClick={()=>onSelect(i)}>
      <div style={{fontSize: 16, fontWeight: 'bold'}}>{w.getLabel()||'HD SegWit'}</div>
      <div style={{fontSize: 14, opacity: 0.8, marginTop: 4}}>
        {formatBtc(w.getBalance())}
        {w.getUnconfirmedBalance()!=0 &&
          <span style={{opacity: 0.6}}> ({formatBtc(w.getUnconfirmedBalance())} unconfirmed)</span>}
      </div>
      <div style={{fontSize: 12, opacity: 0.5, marginTop: 2}}>
        {w.typeReadable}
      </div>
    </div>)}
  </div>;
}

function AddWalletScreen({onBack, onCreated}){
  let [mode, setMode] = useState('create');
  let [mnemonic, setMnemonic] = useState('');
  let [label, setLabel] = useState('');
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState('');

  async function create(){
    setLoading(true);
    setError('');
    try {
      let w = new HDSegwitBech32Wallet();
      await w.generate();
      w.setLabel(label||'HD SegWit');
      onCreated(w);
    } catch(e){
      setError(e.message);
    }
    setLoading(false);
  }

  async function importWallet(){
    setLoading(true);
    setError('');
    try {
      let m = mnemonic.trim().toLowerCase();
      if (!bip39.validateMnemonic(m))
        throw new Error('Invalid mnemonic phrase');
      let w = new HDSegwitBech32Wallet();
      w.setSecret(m);
      w.setLabel(label||'Imported HD SegWit');
      onCreated(w);
    } catch(e){
      setError(e.message);
    }
    setLoading(false);
  }

  return <div style={styles.screen}>
    <Header title="Add Wallet" onBack={onBack} />
    <div style={styles.content}>
      <div style={styles.tabs}>
        <button style={{...styles.tab, ...(mode=='create' ? styles.tabActive : {})}}
          onClick={()=>setMode('create')}>Create New</button>
        <button style={{...styles.tab, ...(mode=='import' ? styles.tabActive : {})}}
          onClick={()=>setMode('import')}>Import</button>
      </div>
      <div style={{marginTop: 16}}>
        <input style={styles.input} placeholder="Wallet label (optional)"
          value={label} onChange={e=>setLabel(e.target.value)} />
      </div>
      {mode=='import' && <div style={{marginTop: 12}}>
        <textarea style={styles.textarea}
          placeholder="Enter 12 or 24 word mnemonic..."
          value={mnemonic} onChange={e=>setMnemonic(e.target.value)}
          rows={3} />
      </div>}
      {error && <div style={styles.error}>{error}</div>}
      <button style={styles.primaryBtn} disabled={loading}
        onClick={mode=='create' ? create : importWallet}>
        {loading ? 'Working...' : (mode=='create' ? 'Create Wallet' : 'Import Wallet')}
      </button>
    </div>
  </div>;
}

function WalletDetailScreen({wallet, walletIndex, onBack, onReceive, onSend, onRefresh}){
  let [txs, setTxs] = useState([]);
  let [loading, setLoading] = useState(false);

  useEffect(()=>{
    let t = wallet.getTransactions();
    setTxs(t.slice().sort((a, b)=>(b.time||0)-(a.time||0)));
  }, [wallet, wallet._lastTxFetch]);

  async function refresh(){
    setLoading(true);
    try {
      await BlueElectrum.ensureConnected();
      await wallet.fetchBalance();
      await wallet.fetchTransactions();
      onRefresh();
      setTxs(wallet.getTransactions().slice().sort((a, b)=>(b.time||0)-(a.time||0)));
    } catch(e){
      console.error('refresh failed', e);
    }
    setLoading(false);
  }

  return <div style={styles.screen}>
    <Header title={wallet.getLabel()||'Wallet'} onBack={onBack} />
    <div style={styles.balanceBox}>
      <div style={{fontSize: 14, opacity: 0.7}}>Balance</div>
      <div style={{fontSize: 32, fontWeight: 'bold'}}>{formatBtc(wallet.getBalance())}</div>
      {wallet.getUnconfirmedBalance()!=0 &&
        <div style={{fontSize: 14, opacity: 0.6}}>
          {formatBtc(wallet.getUnconfirmedBalance())} unconfirmed
        </div>}
    </div>
    <div style={styles.actions}>
      <button style={styles.actionBtn} onClick={onReceive}>Receive</button>
      <button style={styles.actionBtn} onClick={onSend}>Send</button>
      <button style={styles.actionBtn} onClick={refresh} disabled={loading}>
        {loading ? '...' : 'Refresh'}
      </button>
    </div>
    <div style={styles.txList}>
      <div style={{fontWeight: 'bold', marginBottom: 8}}>Transactions</div>
      {txs.length==0 && <div style={styles.empty}>No transactions yet</div>}
      {txs.map((tx, i)=><div key={tx.hash||i} style={styles.txRow}>
        <div style={{flex: 1}}>
          <div style={{fontSize: 14}}>
            {tx.value>0 ? 'Received' : 'Sent'} {formatBtc(Math.abs(tx.value))}
          </div>
          <div style={{fontSize: 11, opacity: 0.5, marginTop: 2}}>
            {tx.confirmations>0
              ? tx.confirmations+' confirmations'
              : 'unconfirmed'}
            {tx.time ? ' — '+new Date(tx.time*1000).toLocaleDateString() : ''}
          </div>
        </div>
        <div style={{color: tx.value>0 ? '#2ecc71' : '#e74c3c', fontWeight: 'bold'}}>
          {tx.value>0 ? '+' : ''}{formatBtc(tx.value)}
        </div>
      </div>)}
    </div>
  </div>;
}

function ReceiveScreen({wallet, onBack}){
  let [address, setAddress] = useState('');

  useEffect(()=>{
    try {
      let idx = wallet.next_free_address_index||0;
      let addr = wallet._getExternalAddressByIndex(idx);
      setAddress(addr);
    } catch(e){
      console.error('get address failed', e);
    }
  }, []);

  function copy(){
    navigator.clipboard?.writeText(address);
  }

  return <div style={styles.screen}>
    <Header title="Receive" onBack={onBack} />
    <div style={{...styles.content, alignItems: 'center', textAlign: 'center'}}>
      {address ? <>
        <QR value={address} size={250} />
        <div style={{marginTop: 16, fontSize: 14, wordBreak: 'break-all',
          fontFamily: 'monospace', padding: '0 16px'}}>
          {address}
        </div>
        <button style={{...styles.actionBtn, marginTop: 12}} onClick={copy}>
          Copy Address
        </button>
      </> : <div>Loading address...</div>}
    </div>
  </div>;
}

function SendScreen({wallet, onBack, onSent}){
  let [address, setAddress] = useState('');
  let [amount, setAmount] = useState('');
  let [fee, setFee] = useState('');
  let [sending, setSending] = useState(false);
  let [error, setError] = useState('');
  let [txid, setTxid] = useState('');

  useEffect(()=>{
    (async()=>{
      try {
        let fees = await BlueElectrum.estimateFees();
        setFee(String(Math.ceil(fees.medium*1e8/1000)));
      } catch(e){}
    })();
  }, []);

  async function send(){
    setSending(true);
    setError('');
    try {
      await BlueElectrum.ensureConnected();
      await wallet.fetchUtxo();
      let sats = Math.round(parseFloat(amount)*1e8);
      if (isNaN(sats) || sats<=0)
        throw new Error('Invalid amount');
      let feeRate = parseInt(fee)||2;
      let targets = [{address: address.trim(), value: sats}];
      let {tx, fee: txFee} = wallet.createTransaction(
        wallet.getUtxo(), targets, feeRate, wallet._getInternalAddressByIndex(
          wallet.next_free_change_address_index));
      if (!tx)
        throw new Error('Failed to create transaction');
      let result = await BlueElectrum.broadcast(tx.toHex());
      if (result && typeof result=='string' && result.length==64){
        setTxid(result);
        onSent();
      } else {
        throw new Error('Broadcast failed: '+JSON.stringify(result));
      }
    } catch(e){
      setError(e.message);
    }
    setSending(false);
  }

  if (txid)
    return <div style={styles.screen}>
      <Header title="Sent!" onBack={onBack} />
      <div style={{...styles.content, textAlign: 'center'}}>
        <div style={{fontSize: 48, marginBottom: 16}}>&#10003;</div>
        <div style={{fontSize: 16, marginBottom: 8}}>Transaction sent!</div>
        <div style={{fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all',
          opacity: 0.7}}>{txid}</div>
      </div>
    </div>;

  return <div style={styles.screen}>
    <Header title="Send" onBack={onBack} />
    <div style={styles.content}>
      <div style={{marginBottom: 12}}>
        <label style={styles.label}>Address</label>
        <input style={styles.input} placeholder="bc1q..."
          value={address} onChange={e=>setAddress(e.target.value)} />
      </div>
      <div style={{marginBottom: 12}}>
        <label style={styles.label}>Amount (BTC)</label>
        <input style={styles.input} placeholder="0.001"
          value={amount} onChange={e=>setAmount(e.target.value)} type="number" step="0.00000001" />
      </div>
      <div style={{marginBottom: 12}}>
        <label style={styles.label}>Fee (sat/vByte)</label>
        <input style={styles.input} placeholder="2"
          value={fee} onChange={e=>setFee(e.target.value)} type="number" />
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <button style={styles.primaryBtn} disabled={sending} onClick={send}>
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  </div>;
}

// Loading Screen
function LoadingScreen({progress}){
  return <div style={{...styles.screen, justifyContent: 'center', alignItems: 'center'}}>
    <div style={{textAlign: 'center', padding: 32}}>
      <div style={{fontSize: 28, fontWeight: 'bold', marginBottom: 16}}>BlueWallet Web</div>
      <div style={{fontSize: 14, opacity: 0.7, marginBottom: 24}}>
        Loading wallet libraries...
      </div>
      <div style={{width: 200, height: 4, background: 'rgba(255,255,255,0.1)',
        borderRadius: 2, overflow: 'hidden'}}>
        <div style={{width: progress+'%', height: '100%', background: '#3498db',
          borderRadius: 2, transition: 'width 0.3s'}} />
      </div>
      <div style={{fontSize: 12, opacity: 0.5, marginTop: 8}}>
        First load may take up to a minute
      </div>
    </div>
  </div>;
}

export default function App(){
  let [loaded, setLoaded] = useState(false);
  let [loadError, setLoadError] = useState(null);
  let [progress, setProgress] = useState(0);
  let [wallets, setWallets] = useState([]);
  let [screen, setScreen] = useState(SCREEN_WALLETS);
  let [selectedWallet, setSelectedWallet] = useState(0);
  let [refreshing, setRefreshing] = useState(false);

  useEffect(()=>{
    (async()=>{
      try {
        setProgress(10);
        let mod = await import('../class/wallets/hd-segwit-bech32-wallet');
        HDSegwitBech32Wallet = mod.HDSegwitBech32Wallet;
        setProgress(70);
        BlueElectrum = await import('../blue_modules/BlueElectrum');
        setProgress(85);
        QRCode = (await import('qrcode')).default;
        setProgress(100);
        let ws = loadWallets();
        setWallets(ws);
        setLoaded(true);
      } catch(e){
        console.error('Load error:', e);
        setLoadError(e);
      }
    })();
  }, []);

  function save(ws){
    setWallets([...ws]);
    saveWallets(ws);
  }

  async function refreshAll(){
    setRefreshing(true);
    try {
      await BlueElectrum.ensureConnected();
      for (let w of wallets){
        try {
          await w.fetchBalance();
          await w.fetchTransactions();
        } catch(e){
          console.warn('refresh wallet failed', e);
        }
      }
      save(wallets);
    } catch(e){
      console.error('refresh failed', e);
    }
    setRefreshing(false);
  }

  function onWalletCreated(w){
    wallets.push(w);
    save(wallets);
    setSelectedWallet(wallets.length-1);
    setScreen(SCREEN_DETAIL);
  }

  if (loadError)
    return <div style={{padding: 32}}>
      <div style={{fontSize: 24, color: '#e74c3c'}}>Load Error</div>
      <div style={{fontSize: 14, marginTop: 8, fontFamily: 'monospace',
        whiteSpace: 'pre-wrap'}}>{loadError.message||String(loadError)}</div>
    </div>;

  if (!loaded)
    return <LoadingScreen progress={progress} />;

  let wallet = wallets[selectedWallet];

  if (screen==SCREEN_ADD)
    return <AddWalletScreen onBack={()=>setScreen(SCREEN_WALLETS)}
      onCreated={onWalletCreated} />;

  if (screen==SCREEN_RECEIVE && wallet)
    return <ReceiveScreen wallet={wallet} onBack={()=>setScreen(SCREEN_DETAIL)} />;

  if (screen==SCREEN_SEND && wallet)
    return <SendScreen wallet={wallet} onBack={()=>setScreen(SCREEN_DETAIL)}
      onSent={()=>save(wallets)} />;

  if (screen==SCREEN_DETAIL && wallet)
    return <WalletDetailScreen wallet={wallet} walletIndex={selectedWallet}
      onBack={()=>setScreen(SCREEN_WALLETS)}
      onReceive={()=>setScreen(SCREEN_RECEIVE)}
      onSend={()=>setScreen(SCREEN_SEND)}
      onRefresh={()=>save(wallets)} />;

  return <WalletListScreen wallets={wallets}
    onSelect={i=>{setSelectedWallet(i); setScreen(SCREEN_DETAIL);}}
    onAdd={()=>setScreen(SCREEN_ADD)}
    onRefresh={refreshAll}
    refreshing={refreshing} />;
}

const styles = {
  screen: {
    maxWidth: 480, margin: '0 auto', minHeight: '100vh',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', alignItems: 'center', padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  backBtn: {
    background: 'none', border: 'none', color: '#fff',
    fontSize: 24, marginRight: 12, padding: 0, cursor: 'pointer',
  },
  headerTitle: {
    fontSize: 18, fontWeight: 'bold',
  },
  totalBar: {
    padding: '24px 16px', textAlign: 'center',
    background: 'linear-gradient(135deg, #1e3799, #0c2461)',
    borderRadius: 12, margin: '16px',
  },
  balanceBox: {
    padding: '24px 16px', textAlign: 'center',
  },
  actions: {
    display: 'flex', gap: 8, padding: '0 16px', justifyContent: 'center',
  },
  actionBtn: {
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff', padding: '10px 20px', borderRadius: 8,
    fontSize: 14, cursor: 'pointer',
  },
  content: {
    padding: 16, flex: 1, display: 'flex', flexDirection: 'column',
  },
  walletCard: {
    margin: '8px 16px', padding: 16,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, cursor: 'pointer',
  },
  txList: {
    padding: 16, flex: 1,
  },
  txRow: {
    display: 'flex', alignItems: 'center', padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  tabs: {
    display: 'flex', gap: 0,
  },
  tab: {
    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 14,
  },
  tabActive: {
    background: 'rgba(255,255,255,0.15)',
    borderBottom: '2px solid #3498db',
  },
  input: {
    width: '100%', padding: '12px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
    color: '#fff', fontSize: 14, outline: 'none',
  },
  textarea: {
    width: '100%', padding: '12px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
    color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical',
    fontFamily: 'monospace',
  },
  label: {
    display: 'block', fontSize: 12, opacity: 0.7, marginBottom: 4,
  },
  primaryBtn: {
    marginTop: 16, padding: '14px', background: '#3498db',
    border: 'none', borderRadius: 8, color: '#fff',
    fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
    width: '100%',
  },
  error: {
    color: '#e74c3c', fontSize: 14, marginTop: 8, padding: 8,
    background: 'rgba(231,76,60,0.1)', borderRadius: 8,
  },
  empty: {
    textAlign: 'center', opacity: 0.5, padding: '32px 16px',
  },
};
