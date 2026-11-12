// electrum.js - Web ElectrumX client via lif-kernel WebSocket proxy
// Replaces BlueWallet's BlueElectrum.ts for web
import * as bitcoin from 'bitcoinjs-lib';
import {rpc_websocket} from 'lif-kernel/rpc.js';
import {lifnet} from 'lif-kernel/lifnet';

function ws_origin(){
  let protocol = location.protocol=='http:' ? 'ws:' : 'wss:';
  return protocol+'//'+location.host;
}

const sha256 = bitcoin.crypto.sha256;

function addr_sh(address){
  let script = bitcoin.address.toOutputScript(address);
  let hash = sha256(script);
  return Buffer.from(hash).reverse().toString('hex');
}

class ElectrumRPC {
  constructor(url){
    if (url.startsWith('lif:'))
      url = lifnet.resolve(url.slice(4));
    else if (url[0]=='/')
      url = ws_origin()+url;
    this.url = url;
    this.rpc = null;
    this.state = 'offline';
    this._listeners = {};
  }
  on(event, fn){ (this._listeners[event]||=[]).push(fn); }
  off(event, fn){
    let arr = this._listeners[event];
    if (arr){ let i = arr.indexOf(fn); if (i>=0) arr.splice(i, 1); }
  }
  _emit(event, ...args){
    for (let fn of (this._listeners[event]||[])) fn(...args);
  }
  async connect(){
    if (this.state=='online')
      return;
    this.state = 'connecting';
    this.rpc = rpc_websocket(this.url);
    this.rpc.on('error', e=>{
      console.error('electrum error', e);
      this.state = 'offline';
    });
    this.rpc.on('close', ()=>{
      this.state = 'offline';
      this._emit('close');
    });
    this.rpc.on('notification', ({method, params})=>{
      this._emit('notification', {method, params});
    });
    await this.rpc.open();
    this.state = 'online';
  }
  close(){
    try { this.rpc?.close(); } catch(e){}
    this.rpc = null;
    this.state = 'offline';
  }
  async call(method, params){
    if (this.state!='online')
      await this.connect();
    return await this.rpc.call(method, params);
  }
}

let _client = null;
const DEFAULT_URL = 'lif:net/bitcoin/electrum';

function client(){
  if (!_client)
    _client = new ElectrumRPC(DEFAULT_URL);
  return _client;
}

export function setServer(url){
  if (_client)
    _client.close();
  _client = new ElectrumRPC(url);
}

export async function connectMain(){
  await client().connect();
}

export function isConnected(){
  return _client?.state=='online';
}

export async function getBalanceByAddress(address){
  let sh = addr_sh(address);
  let res = await client().call('blockchain.scripthash.get_balance', [sh]);
  return {confirmed: res.confirmed, unconfirmed: res.unconfirmed};
}

export async function multiGetBalanceByAddress(addresses, batchsize=200){
  let result = {addresses: {}};
  for (let addr of addresses){
    try { result.addresses[addr] = await getBalanceByAddress(addr); }
    catch(e){ result.addresses[addr] = {confirmed: 0, unconfirmed: 0}; }
  }
  return result;
}

export async function getTransactionsByAddress(address){
  let sh = addr_sh(address);
  return await client().call('blockchain.scripthash.get_history', [sh])||[];
}

export async function multiGetHistoryByAddress(addresses, batchsize=200){
  let result = {};
  for (let addr of addresses){
    try { result[addr] = await getTransactionsByAddress(addr); }
    catch(e){ result[addr] = []; }
  }
  return result;
}

export async function multiGetUtxoByAddress(addresses, batchsize=100){
  let result = {};
  for (let addr of addresses){
    try {
      let sh = addr_sh(addr);
      let utxos = await client().call('blockchain.scripthash.listunspent', [sh]);
      result[addr] = (utxos||[]).map(u=>({
        txid: u.tx_hash, vout: u.tx_pos, value: u.value,
        height: u.height, address: addr,
      }));
    } catch(e){ result[addr] = []; }
  }
  return result;
}

export async function multiGetTransactionByTxid(txids, verbose=true, batchsize=40){
  let result = {};
  for (let txid of txids){
    try {
      result[txid] = await client().call('blockchain.transaction.get',
        [txid, verbose]);
    } catch(e){ console.warn('getTx failed', txid, e); }
  }
  return result;
}

export async function broadcastV2(hex){
  return await client().call('blockchain.transaction.broadcast', [hex]);
}

export async function estimateFees(){
  try {
    let rate = await client().call('blockchain.estimatefee', [6]);
    if (rate>0)
      return rate;
  } catch(e){}
  return 0.00001; // fallback 1 sat/byte
}

export function estimateCurrentBlockheight(){
  return 0; // not critical for basic operation
}

export function txhexToElectrumTransaction(txhex){
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
      let addr;
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

// Stubs for functions the wallet classes call but we don't need yet
export async function getTransactionsFullByAddress(address){
  let history = await getTransactionsByAddress(address);
  let txids = history.map(h=>h.tx_hash);
  if (!txids.length)
    return [];
  let txs = await multiGetTransactionByTxid(txids, true);
  return Object.values(txs);
}

export async function getMempoolTransactionsByAddress(address){
  return [];
}

export function getConnectionState(){
  return _client?.state=='online' ? 'CONNECTED' : 'DISCONNECTED';
}

export function subscribeConnectionState(listener){
  return ()=>{};
}

export async function ping(){
  try {
    await client().call('server.ping', []);
    return true;
  } catch(e){
    return false;
  }
}

export async function forgetCachedTransactions(txids){}

export async function ensureConnected(){
  await client().connect();
  return true;
}

export const getConfig = async()=>({
  connected: isConnected(),
  host: DEFAULT_URL,
  port: 0,
});

export const getSecondsSinceLastRequest = ()=>0;
export const ENSURE_CONNECTED_MAX_WALL_MS = 30000;
