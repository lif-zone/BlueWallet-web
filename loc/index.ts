import enJson from './en_data.js';
import {BitcoinUnit} from '../models/bitcoinUnits';

const loc: any = {...enJson};

loc.formatBalanceWithoutSuffix = (balance: number, toUnit: string): string=>{
  if (toUnit==BitcoinUnit.SATS)
    return String(balance);
  if (toUnit==BitcoinUnit.BTC)
    return (balance/1e8).toFixed(8);
  return String(balance);
};

loc.formatBalance = (balance: number, toUnit: string, withFormatting?: boolean): string=>{
  if (toUnit==BitcoinUnit.SATS)
    return balance+' sats';
  if (toUnit==BitcoinUnit.BTC)
    return (balance/1e8).toFixed(8)+' BTC';
  return String(balance);
};

loc.formatStringWithArgs = (str: string, ...args: any[]): string=>{
  if (!str)
    return '';
  let result = str;
  for (let i=0; i<args.length; i++){
    if (typeof args[i]=='object' && args[i]!==null){
      for (let k of Object.keys(args[i]))
        result = result.replace('{'+k+'}', args[i][k]);
    } else {
      result = result.replace('{'+i+'}', String(args[i]));
    }
  }
  return result;
};

loc.transactionTimeToReadable = (time: number): string=>{
  return new Date(time*1000).toLocaleString();
};

export const STORAGE_KEY = 'lang';
export const saveLanguage = async(_lang: string)=>{};
export const languageReady = ()=>Promise.resolve();
export const isRtlLayoutStale = ()=>false;
export const formatBalance = loc.formatBalance;
export const formatBalanceWithoutSuffix = loc.formatBalanceWithoutSuffix;
export const formatBalancePlain = (balance: number, toUnit: string): string=>{
  if (toUnit==BitcoinUnit.SATS)
    return String(balance);
  if (toUnit==BitcoinUnit.BTC)
    return (balance/1e8).toFixed(8);
  return String(balance);
};
export const transactionTimeToReadable = loc.transactionTimeToReadable;
export const removeTrailingZeros = (s: string): string=>s.replace(/\.?0+$/, '');
export const formatStringAddTwoWhiteSpaces = (s: string): string=>'  '+s;
export const formatTransactionListDate = (ts: number): string=>new Date(ts*1000).toLocaleDateString();
export type TLanguage = string;
export const AvailableLanguages: {label: string; value: string}[] = [{label: 'English', value: 'en'}];
export default loc;
