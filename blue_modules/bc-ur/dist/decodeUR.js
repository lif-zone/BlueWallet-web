import { sha256Hash } from './utils.js';
import { decodeSimpleCBOR } from './miniCbor.js';
import { decodeBc32Data } from '../../bc-bech32/dist/index.js';

var checkAndGetSequence = function(sequence) {
  var pieces = sequence.toUpperCase().split('OF');
  if (pieces.length !== 2)
    throw new Error("invalid sequence: " + sequence);
  var index = pieces[0], total = pieces[1];
  return [+index, +total];
};
var checkDigest = function(digest, payload) {
  if (decodeBc32Data(digest) !== sha256Hash(Buffer.from(decodeBc32Data(payload), 'hex')).toString('hex'))
    throw new Error("invalid digest: \n digest:" + digest + " \n payload:" + payload);
};
var checkURHeader = function(UR, type) {
  if (type === void 0) type = 'bytes';
  if (UR.toUpperCase() !== ("ur:" + type).toUpperCase())
    throw new Error("invalid UR header: " + UR);
};
var dealWithSingleWorkload = function(workload, type) {
  if (type === void 0) type = 'bytes';
  var pieces = workload.split('/');
  switch (pieces.length) {
    case 2:
      checkURHeader(pieces[0], type);
      return pieces[1];
    case 3:
      checkURHeader(pieces[0], type);
      var digest = pieces[1];
      var fragment = pieces[2];
      checkDigest(digest, fragment);
      return fragment;
    case 4:
      checkURHeader(pieces[0], type);
      checkAndGetSequence(pieces[1]);
      var digest2 = pieces[2];
      var fragment2 = pieces[3];
      checkDigest(digest2, fragment2);
      return fragment2;
    default:
      throw new Error("invalid workload pieces length: expect 2 / 3 / 4 but got " + pieces.length);
  }
};
var dealWithMultipleWorkloads = function(workloads, type) {
  if (type === void 0) type = 'bytes';
  var length = workloads.length;
  var fragments = new Array(length).fill('');
  var digest = '';
  workloads.forEach(function(workload) {
    var pieces = workload.split('/');
    checkURHeader(pieces[0], type);
    var _a = checkAndGetSequence(pieces[1]), index = _a[0], total = _a[1];
    if (total !== length)
      throw new Error("invalid workload: " + workload + ", total " + total + " not equal workloads length " + length);
    if (digest && digest !== pieces[2])
      throw new Error("invalid workload: " + workload + ", checksum changed " + digest + ", " + pieces[2]);
    digest = pieces[2];
    if (fragments[index - 1])
      throw new Error("invalid workload: " + workload + ", index " + index + " has already been set");
    fragments[index - 1] = pieces[3];
  });
  var payload = fragments.join('');
  checkDigest(digest, payload);
  return payload;
};
var getBC32Payload = function(workloads, type) {
  if (type === void 0) type = 'bytes';
  try {
    if (workloads.length === 1)
      return dealWithSingleWorkload(workloads[0], type);
    return dealWithMultipleWorkloads(workloads, type);
  } catch(e) {
    throw new Error("invalid workloads: " + workloads + "\n " + e);
  }
};

export const decodeUR = function(workloads, type) {
  if (type === void 0) type = 'bytes';
  var bc32Payload = getBC32Payload(workloads, type);
  var cborPayload = decodeBc32Data(bc32Payload);
  return decodeSimpleCBOR(cborPayload);
};

export const extractSingleWorkload = function(workload) {
  var pieces = workload.toUpperCase().split('/');
  switch (pieces.length) {
    case 2:
    case 3:
      return [1, 1];
    case 4:
      return checkAndGetSequence(pieces[1]);
    default:
      throw new Error("invalid workload pieces length: expect 2 / 3 / 4 but got " + pieces.length);
  }
};
