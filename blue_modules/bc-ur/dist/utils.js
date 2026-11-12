import { sha256 as _sha256 } from '@noble/hashes/sha256';

function bitcoinjs_crypto_sha256(buffer) {
  return Buffer.from(_sha256(Uint8Array.from(buffer)));
}

export const sha256Hash = function(data) {
  return bitcoinjs_crypto_sha256(data);
};

export const compose3 = function(f, g, h) {
  return function(x) {
    return f(g(h(x)));
  };
};
