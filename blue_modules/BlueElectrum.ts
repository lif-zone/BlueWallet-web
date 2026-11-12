// BlueElectrum - Web replacement
// Uses lif-kernel WebSocket RPC instead of net/tls
import * as bitcoin from 'bitcoinjs-lib';

// Re-export types
export type ElectrumTransaction = {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  fee?: number;
  vin: {
    txid: string;
    vout: number;
    scriptSig: { asm: string; hex: string };
    txinwitness: string[];
    sequence: number;
    addresses?: string[];
    value?: number;
  }[];
  vout: {
    value: number;
    n: number;
    scriptPubKey: {
      asm: string;
      hex: string;
      reqSigs: number;
      type: string;
      addresses: string[];
    };
  }[];
  blockhash?: string;
  confirmations?: number;
  time?: number;
  blocktime?: number;
};

export type ElectrumTransactionWithHex = ElectrumTransaction & {
  hex: string;
};

export type ConnectionState = 'disabled'|'disconnected'|'connecting'|'connected';
export type EnsureConnectedOptions = {
  maxWallMs?: number;
  throwOnDisabled?: boolean;
};
export type ElectrumHistory = {
  tx_hash: string;
  height: number;
  address: string;
};
export type ConfirmedBlockInfo = { height: number; tip: number };

type MempoolTransaction = {
  height: 0;
  tx_hash: string;
  fee: number;
};

type ConnectionListener = (state: ConnectionState)=>void;

export const ELECTRUM_HOST = 'electrum_host';
export const ELECTRUM_TCP_PORT = 'electrum_tcp_port';
export const ELECTRUM_SSL_PORT = 'electrum_ssl_port';
export const ELECTRUM_SERVER_HISTORY = 'electrum_server_history';

export const hardcodedPeers = [
  {host: 'electrum1.bluewallet.io', ssl: 443},
  {host: 'electrum2.bluewallet.io', ssl: 443},
  {host: 'electrum3.bluewallet.io', ssl: 443},
];
export const suggestedServers = hardcodedPeers;
export const ENSURE_CONNECTED_MAX_WALL_MS = 30000;

// State
let _state: ConnectionState = 'disconnected';
let _listeners: ConnectionListener[] = [];
let _rpc: any = null;
let _lastRequest = Date.now();

function ws_origin(){
  let protocol = location.protocol=='http:' ? 'ws:' : 'wss:';
  return protocol+'//'+location.host;
}

const sha256Hash = bitcoin.crypto.sha256;

function addr_sh(address: string): string {
  let script = bitcoin.address.toOutputScript(address);
  let hash = sha256Hash(script);
  return Buffer.from(hash).reverse().toString('hex');
}

async function _connect(){
  if (_state=='connected')
    return;
  _state = 'connecting';
  _notify();
  try {
    let {rpc_websocket} = await import('lif-kernel/rpc.js');
    let {lifnet} = await import('lif-kernel/lifnet');
    let url = 'lif:net/bitcoin/electrum';
    let v;
    if (url.startsWith('lif:net/')){
      let {rg, sock, error} = await lifnet.connect(
        url.slice(8), null, {jsonrpc: '2.0'});
      if (error)
        throw Error('lifnet connect: '+error);
      _rpc = sock;
    } else {
      _rpc = new rpc_websocket({jsonrpc: '2.0'});
      if (url[0]=='/')
        url = ws_origin()+url;
      await _rpc.connect({url});
    }
    _rpc.on('close', ()=>{
      _state = 'disconnected';
      _rpc = null;
      _notify();
    });
    await _rpc.T_call('server.version', ['bluewallet-web', '1.4']);
    _state = 'connected';
    _notify();
  } catch(e){
    _state = 'disconnected';
    _rpc = null;
    _notify();
    throw e;
  }
}

function _notify(){
  for (let fn of _listeners)
    fn(_state);
}

async function _call(method: string, params: any[]): Promise<any> {
  if (_state!='connected')
    await _connect();
  _lastRequest = Date.now();
  return await _rpc.T_call(method, params);
}

export function getConnectionState(): ConnectionState {
  return _state;
}

export function subscribeConnectionState(listener: ConnectionListener): ()=>void {
  _listeners.push(listener);
  return ()=>{
    let i = _listeners.indexOf(listener);
    if (i>=0)
      _listeners.splice(i, 1);
  };
}

export function isConnected(): boolean {
  return _state=='connected';
}

export async function ensureConnected(opts: EnsureConnectedOptions={}): Promise<boolean> {
  await _connect();
  return true;
}

export const connectMain = ensureConnected;

export async function isDisabled(): Promise<boolean> {
  return false;
}

export async function setDisabled(disabled=true){}

export const getBalanceByAddress = async function(address: string): Promise<{confirmed: number; unconfirmed: number}> {
  let sh = addr_sh(address);
  let res = await _call('blockchain.scripthash.get_balance', [sh]);
  return {confirmed: res.confirmed, unconfirmed: res.unconfirmed};
};

export const getTransactionsByAddress = async function(address: string): Promise<ElectrumHistory[]> {
  let sh = addr_sh(address);
  let history = await _call('blockchain.scripthash.get_history', [sh]);
  return (history||[]).map((h: any)=>({tx_hash: h.tx_hash, height: h.height, address}));
};

export const getMempoolTransactionsByAddress = async function(address: string): Promise<MempoolTransaction[]> {
  return [];
};

export const ping = async function(): Promise<boolean> {
  try {
    await _call('server.ping', []);
    return true;
  } catch(e){
    return false;
  }
};

export function txhexToElectrumTransaction(txhex: string): ElectrumTransactionWithHex {
  let tx = bitcoin.Transaction.fromHex(txhex);
  return {
    txid: tx.getId(),
    hash: tx.getId(),
    version: tx.version,
    size: txhex.length/2,
    vsize: tx.virtualSize(),
    weight: tx.weight(),
    locktime: tx.locktime,
    hex: txhex,
    vin: tx.ins.map(i=>({
      txid: Buffer.from(i.hash).reverse().toString('hex'),
      vout: i.index,
      scriptSig: {asm: '', hex: i.script.toString('hex')},
      txinwitness: i.witness.map(w=>w.toString('hex')),
      sequence: i.sequence,
    })),
    vout: tx.outs.map((o, n)=>{
      let addr: string|undefined;
      try { addr = bitcoin.address.fromOutputScript(o.script); } catch(e){}
      return {
        value: Number(o.value)/1e8,
        n,
        scriptPubKey: {
          asm: '', hex: o.script.toString('hex'),
          reqSigs: 1, type: '',
          addresses: addr ? [addr] : [],
        },
      };
    }),
  };
}

export const getTransactionsFullByAddress = async(address: string): Promise<ElectrumTransaction[]>=>{
  let history = await getTransactionsByAddress(address);
  let txids = history.map(h=>h.tx_hash);
  if (!txids.length)
    return [];
  let txs = await multiGetTransactionByTxid(txids, true);
  return Object.values(txs);
};

type MultiGetBalanceResponse = {
  balance: number;
  unconfirmed_balance: number;
  addresses: Record<string, {confirmed: number; unconfirmed: number}>;
};

export const multiGetBalanceByAddress = async(
  addresses: string[], batchsize: number=200
): Promise<MultiGetBalanceResponse>=>{
  let result: MultiGetBalanceResponse = {
    balance: 0, unconfirmed_balance: 0, addresses: {},
  };
  for (let addr of addresses){
    try {
      let bal = await getBalanceByAddress(addr);
      result.addresses[addr] = bal;
      result.balance += bal.confirmed;
      result.unconfirmed_balance += bal.unconfirmed;
    } catch(e){
      result.addresses[addr] = {confirmed: 0, unconfirmed: 0};
    }
  }
  return result;
};

export const multiGetUtxoByAddress = async function(
  addresses: string[], batchsize: number=100
): Promise<Record<string, any[]>> {
  let result: Record<string, any[]> = {};
  for (let addr of addresses){
    try {
      let sh = addr_sh(addr);
      let utxos = await _call('blockchain.scripthash.listunspent', [sh]);
      result[addr] = (utxos||[]).map((u: any)=>({
        txid: u.tx_hash, vout: u.tx_pos, value: u.value,
        height: u.height, address: addr, wif: false,
      }));
    } catch(e){
      result[addr] = [];
    }
  }
  return result;
};

export const multiGetHistoryByAddress = async function(
  addresses: string[], batchsize: number=100
): Promise<Record<string, ElectrumHistory[]>> {
  let result: Record<string, ElectrumHistory[]> = {};
  for (let addr of addresses){
    try {
      result[addr] = await getTransactionsByAddress(addr);
    } catch(e){
      result[addr] = [];
    }
  }
  return result;
};

export async function multiGetTransactionByTxid(
  txids: string[], verbose?: boolean, batchsize?: number
): Promise<Record<string, any>>;
export async function multiGetTransactionByTxid(
  txids: string[], verbose: boolean=true, batchsize: number=40
): Promise<Record<string, any>> {
  let result: Record<string, any> = {};
  for (let txid of txids){
    try {
      result[txid] = await _call('blockchain.transaction.get',
        [txid, verbose]);
    } catch(e){
      console.warn('getTx failed', txid, e);
    }
  }
  return result;
}

export const broadcast = async function(hex: string) {
  return await _call('blockchain.transaction.broadcast', [hex]);
};

export const broadcastV2 = broadcast;

export const estimateFees = async function(): Promise<{fast: number; medium: number; slow: number}> {
  try {
    let fast = await _call('blockchain.estimatefee', [1]);
    let medium = await _call('blockchain.estimatefee', [6]);
    let slow = await _call('blockchain.estimatefee', [36]);
    if (fast<=0) fast = 0.00002;
    if (medium<=0) medium = 0.00001;
    if (slow<=0) slow = 0.000005;
    return {fast, medium, slow};
  } catch(e){
    return {fast: 0.00002, medium: 0.00001, slow: 0.000005};
  }
};

export const estimateFee = async function(numberOfBlocks: number): Promise<number> {
  try {
    let fee = await _call('blockchain.estimatefee', [numberOfBlocks]);
    if (fee>0)
      return fee;
  } catch(e){}
  return 0.00001;
};

export const calcEstimateFeeFromFeeHistorgam = function(numberOfBlocks: number, feeHistorgram: number[][]): number {
  return 1;
};

export const serverFeatures = async function() {
  return await _call('server.features', []);
};

export const getConfig = async function() {
  return {
    connected: isConnected(),
    host: location.host,
    port: 0,
  };
};

export const getSecondsSinceLastRequest = function() {
  return Math.floor((Date.now()-_lastRequest)/1000);
};

export function estimateCurrentBlockheight(): number {
  return 0;
}

export async function forgetCachedTransactions(txids: string[]){}

export async function presentResetToDefaultsAlert(): Promise<boolean> {
  return false;
}

export async function presentElectrumDisconnectedHelpAlert(): Promise<void> {}

export const getPreferredServer = async()=>undefined;
export const removePreferredServer = async()=>{};

export type ElectrumServerItem = {
  host: string;
  port?: number;
  ssl?: boolean;
};
