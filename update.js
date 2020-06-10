const xmldoc = require('xmldoc');

function compareVersions (a, b) {
  const splitA = a.split('.');
  const splitB = b.split('.');
  const length = Math.max(splitA.length, splitB.length);
  for (let i = 0; i < length; ++i) {
    const nA = splitA.length > i ? Number(splitA[i]) : 0;
    const nB = splitB.length > i ? Number(splitB[i]) : 0;
    if (nA < nB) return 1;
    if (nA > nB) return -1;
  }
  return 0;
}

function getLatestVersion (xmlString, component) {
  try {
    const document = new xmldoc.XmlDocument(xmlString);
    const latestVersion = document.children
      .filter(node => node.name === 'Contents') // get content elements
      .map(node => node.children.filter(x => x.name === 'Key')[0].val) // get the key value  "tui-wallet/v0.5.0/hybrixd.tui-wallet.v0.5.0.zip"
      .filter(key => key.startsWith(component + '/')) // check if matches the requested component
      .map(key => key.split('/')[1].substr(1)) // get the version "0.5.0" ( drop "$component/v")
      .filter(version => version !== 'atest') // filter '(l)atest'
      .sort(compareVersions)[0];
    return latestVersion;
  } catch (e) {
    return 'error';
  }
}

exports.compareVersions = compareVersions;
exports.getLatestVersion = getLatestVersion;
