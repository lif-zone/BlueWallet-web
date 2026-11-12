import bech32Default, {Bech32Version} from './bech32.js';
export {Bech32Version};
var convertBits = function(data, fromBits, toBits, pad) {
  var acc = 0;
  var bits = 0;
  var ret = [];
  var maxv = (1 << toBits) - 1;
  for (var p = 0; p < data.length; ++p) {
    var value = data[p];
    if (value < 0 || value >> fromBits !== 0)
      return null;
    acc = (acc << fromBits) | value;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0)
      ret.push((acc << (toBits - bits)) & maxv);
  } else if (bits >= fromBits || (acc << (toBits - bits)) & maxv) {
    return null;
  }
  return ret;
};
export var decodeSegwitAddress = function(hrp, addr) {
  var dec = bech32Default.decode(addr);
  if (dec === null || dec.hrp !== hrp || dec.data.length < 1 || dec.data[0] > 16)
    return null;
  var res = convertBits(Uint8Array.from(dec.data.slice(1)), 5, 8, false);
  if (res === null || res.length < 2 || res.length > 40)
    return null;
  if (dec.data[0] === 0 && res.length !== 20 && res.length !== 32)
    return null;
  return {version: dec.data[0], program: res};
};
export var encodeSegwitAddress = function(hrp, version, program) {
  var ret = bech32Default.encode(hrp, [version].concat(convertBits(program, 8, 5, true)), Bech32Version.Origin);
  if (decodeSegwitAddress(hrp, ret) === null)
    return null;
  return ret;
};
export var encodeBc32Data = function(hex) {
  var data = Buffer.from(hex, 'hex');
  return bech32Default.encode(null, convertBits(data, 8, 5, true), Bech32Version.bis);
};
export var decodeBc32Data = function(data) {
  var result = bech32Default.decode(data);
  if (result) {
    var res = convertBits(Buffer.from(result.data), 5, 8, false);
    return Buffer.from(res).toString('hex');
  } else {
    return null;
  }
};
