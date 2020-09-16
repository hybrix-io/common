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
  if (typeof symbol === 'undefined') return {error: 0};
  if (symbol === 'bitcoin') return {error: 0};

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
  const t_ = s.match(/until=(.*?)&/);
  const t = t_ === null ? s.match(/until=(.*)/) : t_;

  return t === null ? t : t.pop();
}

function getAmount (s) {
  const a_ = s.match(/amount=(.*?)&/);
  const a = a_ === null ? s.match(/amount=(.*)/) : a_;

  return a === null ? '' : a.pop();
}

function getMessage (s) {
  const msg = s.match(/message=(.*)/);
  return msg === null ? msg : msg.pop();
}

function getSymbol (s) {
  return s.match(/[^:]*/i)[0];
}

function getAddress (s) {
  const addr = s.indexOf('?')===-1?s.match(/:(.*)/):s.match(/:(.*)\?/);
  return addr === null ? addr : addr.pop();
}

exports.validations = {
  hasValidTimestamp,
  parseToObject,
  validate
};

if (typeof module !== 'undefined') {
  module.exports = exports.validations;
}
