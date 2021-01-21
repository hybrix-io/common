const basex = require('./base-x.js');
const {Buffer} = require('buffer');

// replace multiple strings
// example: replacebulk("testme",['es','me'],['1','2']); => "t1t2"
function replaceBulk (str, findArray, replaceArray) {
  let i; let regex = []; let map = {};
  for (i = 0; i < findArray.length; i++) {
    regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'));
    map[findArray[i]] = replaceArray[i];
  }
  regex = regex.join('|');
  str = str.replace(new RegExp(regex, 'g'), function (matched) {
    return map[matched];
  });
  return str;
}

function generateAsciiTable () {
  let x = '';
  for (let i = 0; i < 256; i++) { x = x + String.fromCharCode(i); }
  return x;
}

const asciiTable = generateAsciiTable();

function getEncoding (code) {
  switch (code) {
    case 'base64':
      return 'base64';
    case 'base58':
      return '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    case 'hex':
      return '0123456789abcdef';
    case 'number':
    case 'dec':
      return '0123456789';
    case 'oct':
      return '01234567';
    case 'bool':
    case 'bin':
      return '01';
    case 'bech32':
    case 'RFC4648':
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    case 'ascii':
    case 'base256':
      // DEPRECATED: return asciiTable; -> base-x contains a bug which makes it unable to handle 256 character alphabet
    case 'string':
    case 'utf-8':
    default:
      return 'string';
  }
}

function cleanInput (code, input) {
  switch (code) {
    case 'base58':
      return input.replace(/[^1-9A-HJ-NP-Za-km-z]/g, '');
    case 'hex':
      if (input.substring(0, 2) === '0x') { input = input.substring(2); }
      return input.toLowerCase().replace(/[^0-9a-f]/g, '');
    case 'number':
    case 'dec':
      return (typeof input === 'number') ? String(input) : input.replace(/[^0-9]/g, '');
    case 'oct':
      return input.replace(/[^0-7]/g, '');
    case 'bool':
      return input ? '1' : '0';
    case 'bin':
      return input.replace(/[^0-1]/g, '');
    case 'bech32':
    case 'RFC4648':
      return replaceBulk(input.toUpperCase(), ['0', '1', '8', '9'], ['O', 'I', 'B', 'G']).replace(/[^A-Z2-7]/g, '');
    default:
      return input;
  }
}

function recode (source, target, input) {
  if (typeof target === 'undefined') { target = source; source = getEncoding('ascii'); }

  const sourceEncoding = getEncoding(source);

  input = cleanInput(source, input);

  const buffer = Buffer.from(sourceEncoding === 'string' ? input : basex(sourceEncoding).decode(input));

  const targetEncoding = getEncoding(target);

  if (targetEncoding === 'string') {
    return buffer.toString();
  } else if (target === 'bool') {
    return buffer.toString() !== '0';
  } else if (target === 'number') {
    return Number(Buffer.from(basex(targetEncoding).encode(buffer)));
  } else if (target === 'base64') {
    return buffer.toString('base64');
  } else {
    return Buffer.from(basex(targetEncoding).encode(buffer)).toString();
  }
}

exports.recode = recode;
