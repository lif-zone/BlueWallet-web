import * as bitcoin from 'bitcoinjs-lib';
import { CoinSelectOutput, CoinSelectReturnInput, CoinSelectUtxo } from 'coinselect';

import { BitcoinUnit } from '../../models/bitcoinUnits';

export type Utxo = {
  height: number;
  address: string;
  txid: string;
  vout: number;
  value: number;
  txhex?: string;
  confirmations?: number;
  wif?: string | false;
};

export interface CreateTransactionUtxo extends CoinSelectUtxo {}

export type CreateTransactionTarget = {
  address?: string;
  value?: number;
  script?: {
    length?: number;
    hex?: string;
  };
};

export type CreateTransactionResult = {
  tx?: bitcoin.Transaction;
  inputs: CoinSelectReturnInput[];
  outputs: CoinSelectOutput[];
  fee: number;
  psbt: bitcoin.Psbt;
};

type TransactionInput = {
  txid: string;
  vout: number;
  scriptSig: { asm: string; hex: string };
  txinwitness: string[];
  sequence: number;
  addresses?: string[];
  address?: string;
  value?: number;
};

export type TransactionOutput = {
  value: number;
  n: number;
  scriptPubKey: {
    asm: string;
    hex: string;
    reqSigs: number;
    type: string;
    addresses: string[];
  };
};

export interface DecodedInvoice {
  destination: string;
  payment_hash: string;
  num_satoshis: number;
  num_millisatoshis: number;
  timestamp: number;
  expiry: number;
  description: string;
  description_hash: string;
  fallback_addr: string;
  cltv_expiry: string;
  route_hints: unknown[];
}

export type LightningTransaction = {
  memo?: string;
  type?: 'user_invoice' | 'payment_request' | 'bitcoind_tx' | 'paid_invoice';
  payment_hash?: string | { data: number[] };
  category?: 'receive';
  timestamp: number;
  expire_time?: number;
  ispaid?: boolean;
  failed?: boolean;
  walletID?: string;
  value?: number;
  amt?: number;
  fee?: number;
  payment_preimage?: string;
  payment_request?: string;
  description?: string;
};

export type Transaction = {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  blockhash?: string;
  confirmations?: number;
  time?: number;
  blocktime?: number;
  timestamp: number;
  value?: number;
  fee?: number;
  counterparty?: string;
};

export type ExtendedTransaction = Transaction & {
  walletID: string;
  walletPreferredBalanceUnit: BitcoinUnit;
};

export type TWallet = any;
export type THDWalletForWatchOnly = any;
