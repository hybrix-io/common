#!/bin/sh
WHEREAMI="`pwd`";
OLDPATH="$PATH"

# $HYBRIXD/interface/scripts/npm  => $HYBRIXD/interface
SCRIPTDIR="`dirname \"$0\"`"
HYBRIXD="`cd \"$SCRIPTDIR/../../..\" && pwd`"

COMMON="$HYBRIXD/common"

NODE="$HYBRIXD/node"
INTERFACE="$HYBRIXD/node"
WEB_WALLET="$HYBRIXD/web-wallet"
CLI_WALLET="$HYBRIXD/cli-wallet"
TUI_WALLET="$HYBRIXD/tui-wallet"
WEB_EXPLORER="$HYBRIXD/web-blockexplorer"

export PATH="$NODE/node_binaries/bin:$PATH"

cd "$COMMON"
echo "[.] Auditing common..."
npm i
npm update
npm audit fix --force

cd "$NODE"
npm run audit

cd "$INTERFACE"
npm run audit

cd "$DETERMINISTIC"
npm run audit

cd "$WEB_WALLET"
npm run audit

cd "$TUI_WALLET"
npm run audit

cd "$CLI_WALLET"
npm run audit

cd "$WEB_EXPLORER"
npm run audit


export PATH="$OLDPATH"
cd "$WHEREAMI"
