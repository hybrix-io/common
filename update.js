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

function getLatestVersion (htmlString) {
  const versions = htmlString // html from download.hybrix.io/releases/$COMPONENT/
    .match(/v[\d.]+/g) // ['v0.1.2',...]
    .map(version => version.substr(1)) // ['0.1.2',...]
    .sort(compareVersions);
  return versions.length > 0 ? versions[0] : 'error';
}

exports.compareVersions = compareVersions;
exports.getLatestVersion = getLatestVersion;
