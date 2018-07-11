// zchan
// zchan compresses an API query before sending it to the router
// usercryptography is handled by ychan, and keys are passed
zchan = function (usercrypto, step, txtdata) {
  var encdata = ychan_encode(usercrypto, step, zchan_encode(usercrypto, step, txtdata));
  return 'z/' + encdata;
};
zchan_obj = function (usercrypto, step, encdata) {
  try {
    return JSON.parse(zchan_decode(usercrypto, step, encdata));
  } catch (err) {
    return false;
  }
};
zchan_encode = function (usercrypto, step, txtdata) {
  return LZString.compressToEncodedURIComponent(txtdata);
};
zchan_decode = function (usercrypto, step, encdata) {
  return LZString.decompressFromEncodedURIComponent(ychan_decode(usercrypto, step, encdata));
};
