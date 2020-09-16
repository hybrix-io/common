function amountIsValid (s) {
  return isNumber(s);
}

function amountIsEmpty (s) {
  return s === '';
}

function addressIsValid (addr) {
  return isString(addr) && addr !== '';
}

function validateMessage (msg) {
  const isEmptyMessage = msg === '';

  return isString(msg) && !isEmptyMessage
    ? msg
    : null;
}

function hasValidTimestamp (s) {
  return isNumber(s);
}

function isNumber (s) {
  return !isNaN(Number(s));
}

function symbolIsValid (assetNames, symbol) {
  // prefix exceptions for bitcoin(-like) currencies
  if (symbol === 'bitcoincash') return {error: 0};
  if (symbol === 'bitcoin') return {error: 0};

  if (typeof symbol === 'undefined') return {error: 0};

  const symbols = Object.keys(assetNames);
  return symbols.includes(symbol)
    ? {error: 0}
    : {error: 1, data: `Unknown symbol '${symbol}'`};
}

function isString (x) {
  return typeof x === 'string';
}

function validate (symbol, amount, addr, timestamp, assetNames) {
  const hasValidAmount = amountIsEmpty(amount) || amountIsValid(amount);
  if (!hasValidAmount) return {error: 1, data: 'Expected numerical or no amount'};

  const hasValidTimestamp = typeof timestamp === 'undefined' || (timestamp !== null && isNumber(timestamp));
  if (!hasValidTimestamp) return {error: 1, data: 'Expected numerical or no timestamp'};

  const hasValidAddress = addressIsValid(addr);
  if (!hasValidAddress) return {error: 1, data: 'Expected valid address.'};

  return symbolIsValid(assetNames, symbol);
}

function parseToObject (s) {
  const symbol = getSymbol(s);
  const address = getAddress(s);
  const params = getParameters(s);
  const message = validateMessage(getMessage(s));

  return Object.assign({symbol, address, message}, params);
}

function getParameters (s) {
  const amount = getAmount(s);
  const timestamp = getTimestamp(s);

  return {
    amount,
    timestamp
  };
}

function getTimestamp (s) {
  const t = s.match(/[?&]until=(.*?)(&|$)/);
  return t === null ? t : t[1];
}

function getAmount (s) {
  const a = s.match(/[?&]amount=(.*?)(&|$)/);
  return a === null ? '' : a[1];
}

function getMessage (s) {
  const msg = s.match(/[?&]message=[^&]+(&|$)/);
  return msg === null ? msg : msg[1];
}

function getSymbol (s) {
  return s.match(/[^:]+:/)[0];
}

function getAddress (s) {
  const addr = s.match(/^([^:]+:)?([^?]*)(\?|$)/);
  return addr === null ? addr : addr[2];
}

exports.validations = {
  hasValidTimestamp,
  parseToObject,
  validate
};

if (typeof module !== 'undefined') {
  module.exports = exports.validations;
}
