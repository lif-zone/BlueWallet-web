import {sha256} from '@noble/hashes/sha256';

class Hash {
  constructor(algo){
    if (algo!='sha256')
      throw Error('crypto stub: only sha256 supported, got '+algo);
    this._data = [];
  }
  update(data){
    if (typeof data=='string')
      data = new TextEncoder().encode(data);
    else if (data instanceof Uint8Array)
      ;
    else if (Buffer.isBuffer(data))
      data = new Uint8Array(data);
    this._data.push(data);
    return this;
  }
  digest(enc){
    let total = 0;
    for (let d of this._data)
      total += d.length;
    let buf = new Uint8Array(total);
    let off = 0;
    for (let d of this._data){
      buf.set(d, off);
      off += d.length;
    }
    let hash = sha256(buf);
    if (enc=='hex')
      return Array.from(hash).map(b=>b.toString(16).padStart(2, '0')).join('');
    return Buffer.from(hash);
  }
}

export function createHash(algo){
  return new Hash(algo);
}

export function randomBytes(size){
  let buf = new Uint8Array(size);
  crypto.getRandomValues(buf);
  return Buffer.from(buf);
}

export default {createHash, randomBytes};
