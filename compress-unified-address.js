const zlib = require('zlib');
const baseCode = require('./common/basecode');

// keep only uniques
const uniq = function (ydata) {
  const amount = 1;
  let str;
  if (typeof ydata === 'string') {
    str = true;
    ydata = ydata.split('');
  }
  let sorted = ydata.sort();
  for (let i = 0; i < ydata.length; i++) {
    let entries = 0;
    for (let j = 0; j < ydata.length; j++) {
      if (ydata[i] === sorted[j]) {
        if (entries >= amount) {
          ydata.splice(i, 1);
        }
        entries++;
      }
    }
  }
  if (str) {
    ydata = ydata.join('');
  }
  return ydata;
};

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

// example encoding string
// const datastring = 'eth.hy:0xfd9eb537df909144f14084d75fa88142bc80eb57,tomo.hy:0xfd9eb537df909144f14084d75fa88142bc80eb57,xyz.hy:0xfd9eb4892b1n3a83ns82bs7281b73142bc80eb57';

function encode(datastring) {
  try {
    // first gather all unique addresses
    const addresses = uniq(datastring.split(',').map( val => { return val.split(':')[1]; }));
    const reference = addresses.map( (val,idx) => { return String(idx); });
    // now replace all addresses in string by reference to addresses in array
    const pruned = replaceBulk(datastring,addresses,reference);
    const reformatted = addresses.join(',')+'|'+pruned;
    // encode
    return baseCode.recode('hex','base58',zlib.deflateSync(reformatted,{level:zlib.constants.Z_BEST_COMPRESSION}).toString('hex'));
  } catch(e) {
    return null;
  }
}

function decode(datastring) {
  try {
    // decompress
    const decompressed = zlib.inflateSync(new Buffer.from( baseCode.recode('base58','hex',datastring) ,'hex')).toString();
    // now reverse the operation... (we prefix reference numbers and addresses with semicolon to avoid replacing numbers in token names)
    const parts = decompressed.split('|');
    const prefixedAddresses = parts[0].split(',').map( (val) => { return String(':'+val); });
    const reference = prefixedAddresses.map( (val,idx) => { return String(':'+idx); });
    const pruned = parts[1];
    // restore all addresses in string by reference to addresses in array  
    return replaceBulk(pruned,reference,prefixedAddresses);
  } catch(e) {
    return null;
  }
}

exports.encode = encode;
exports.decode = decode;
