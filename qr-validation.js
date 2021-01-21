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

function symbolIsValid (symbol) {
  return symbol === null || typeof symbol === 'string'
    ? {error: 0}
    : {error: 1, data: `Expected string symbol'`};
}

function isString (x) {
  return typeof x === 'string';
}

function validate (symbol, amount, addr, timestamp) {
  const hasValidAmount = amountIsEmpty(amount) || amountIsValid(amount);
  if (!hasValidAmount) return {error: 1, data: 'Expected numerical or no amount'};

  const hasValidTimestamp = timestamp === null || isNumber(timestamp);
  if (!hasValidTimestamp) return {error: 1, data: 'Expected numerical or no timestamp'};
  if (timestamp && timestamp < Date.now()) return {error: 1, data: 'Time stamp has expired.'};

  const hasValidAddress = addressIsValid(addr);
  if (!hasValidAddress) return {error: 1, data: 'Expected valid address.'};

  return symbolIsValid(symbol);
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
  const t = s.match(/[?&]until=([^&]+)(&|$)/);
  return t === null ? t : t[1];
}

function getAmount (s) {
  const a = s.match(/[?&]amount=(.*?)(&|$)/);
  return a === null ? '' : a[1];
}

function getMessage (s) {
  const msg = s.match(/[?&]message=([^&]+)(&|$)/);
  return msg === null ? msg : msg[1];
}

function getSymbol (s) {
  const symbolMatch = s.match(/([^:]+):/);
  if (symbolMatch === null) return null;
  let symbol = symbolMatch[1];
  if (symbol === 'bitcoin') symbol = 'btc';
  else if (symbol === 'bitcoincash') symbol = 'bch';
  return symbol;
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
