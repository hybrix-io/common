#!/bin/sh
OLDPATH="$PATH"
WHEREAMI="`pwd`"

# $HYBRIXD/node/scripts/npm  => $HYBRIXD
SCRIPTDIR="`dirname \"$0\"`"
HYBRIXD="`cd \"$SCRIPTDIR/../../..\" && pwd`"

export PATH="$HYBRIXD/node/node_binaries/bin:$PATH"

# Move to provided directory
if [ -z "$2" ]; then
    cd "$HYBRIXD/$1"
elif [ -z "$1" ]; then
    cd "$WHEREAMI"
else
    cd "$1"
fi



IFS=$'\n'
LINTLIST="/tmp/hybrixlint.list"
git diff --stat --cached --name-only master | grep ".jsx\{0,1\}$" | grep -v "node_" | grep -v "hybrix-lib.nodejs.js" | grep -v "hybrix-lib.web.js" | grep -v "test.js" | grep -v "test.web.js"| grep -v "test.host.js"  > $LINTLIST
ESLINT="$HYBRIXD/common/node_modules/.bin/eslint"
STAGED_FILES=$(cat "$LINTLIST");

echo "\nPre Push:\n"

if [ -z "$STAGED_FILES" ]; then
    echo "\033[42mNO CHANGES\033[0m\n"
    cd "$WHEREAMI"
    export PATH="$OLDPATH"
    exit 0
fi

PASS=true

echo "\nValidating Javascript:\n"

# Check for eslint
if [ ! -f "$ESLINT" ]; then
    echo "\033[41mPlease install ESlint and dependencies\033[0m (npm i eslint-plugin-promise eslint-plugin-standard eslint-plugin-react)"
    echo "\033[41mPlease install ESlint Standard config\033[0m (npm i eslint-config-standard)"
    echo "\033[41mPlease install ESlint Semi-standard config\033[0m (npm i eslint-config-semistandard)"
    exit 1
fi

while read -r FILE; do
    if [ -f "$FILE" ]; then
        "$ESLINT" "$FILE"  --fix --quiet -c "$HYBRIXD/common/.eslintrc.js"

        if [ "$?" -eq 0 ]; then
            echo "\033[32mESLint Passed: $FILE\033[0m"
        else
            echo "\033[31mESLint Failed: $FILE\033[0m"
            PASS=false
        fi
    else
        echo "ESLint Skipped (File removed): $FILE"
    fi
done < "$LINTLIST"

echo "\nJavascript validation completed!\n"

if ! $PASS; then
    echo "\033[41mCOMMIT FAILED:\033[0m Your commit contains files that should pass ESLint but do not. Please fix the ESLint errors and try again.\n"
    cd "$WHEREAMI"
    export PATH="$OLDPATH"
    exit 1
else
    echo "\033[42mCOMMIT SUCCEEDED\033[0m\n"
fi


cd "$WHEREAMI"
export PATH="$OLDPATH"

exit $?
