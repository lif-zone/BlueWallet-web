import { encodeSimpleCBOR } from './miniCbor.js';
import { encodeBc32Data } from '../../bc-bech32/dist/index.js';
import { sha256Hash, compose3 } from './utils.js';

var composeUR = function(payload, type) {
  if (type === void 0) type = 'bytes';
  return "ur:" + type + "/" + payload;
};
var composeDigest = function(payload, digest) {
  return digest + "/" + payload;
};
var composeSequencing = function(payload, index, total) {
  return index + 1 + "of" + total + "/" + payload;
};
var composeHeadersToFragments = function(fragments, digest, type) {
  if (type === void 0) type = 'bytes';
  if (fragments.length === 1)
    return [composeUR(fragments[0])];
  return fragments.map(function(f, index) {
    return compose3(
      function(payload) { return composeUR(payload, type); },
      function(payload) { return composeSequencing(payload, index, fragments.length); },
      function(payload) { return composeDigest(payload, digest); }
    )(f);
  });
};

export const encodeUR = function(payload, fragmentCapacity) {
  if (fragmentCapacity === void 0) fragmentCapacity = 200;
  var cborPayload = encodeSimpleCBOR(payload);
  var bc32Payload = encodeBc32Data(cborPayload);
  var digest = sha256Hash(Buffer.from(cborPayload, 'hex')).toString('hex');
  var bc32Digest = encodeBc32Data(digest);
  var fragments = bc32Payload.match(new RegExp('.{1,' + fragmentCapacity + '}', 'g'));
  return composeHeadersToFragments(fragments, bc32Digest, 'bytes');
};
