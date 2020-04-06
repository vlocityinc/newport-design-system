#!/bin/bash

usage()
{
  echo "Usage: $0 -b BRANCH"
  echo "where BRANCH is 'main', '226/patch' ..."
  exit 2
}

while getopts 'b:?h' c
do
  case $c in
    b) BRANCH=$OPTARG ;;
    h|?) usage ;; esac
done
[ -z "$BRANCH" ] && usage

. scripts/setupEnv.sh "${BRANCH}"

# setup symlink to git @flow-builder packages
rm "${NBA_HOME}/ui-interaction-builder-components-git"
ln -s "$(pwd)/packages/@flow-builder" ${NBA_HOME}/ui-interaction-builder-components-git

# For some reason
# lwc-test modules -- -c jest.git.json
# doesn't work, so move over the config ..
chmod u+w ${NBA_HOME}/jest.json
cp ${NBA_HOME}/jest.json ${NBA_HOME}/jest.json.bak
cp ${NBA_HOME}/jest.git.json ${NBA_HOME}/jest.json

# run the tests
cd ${NBA_HOME}
lwc-test modules
RESULT=$?
cd -

mv ${NBA_HOME}/jest.json.bak ${NBA_HOME}/jest.json

if [ $RESULT != 0 ]; then
    echo "NBA tests failed"
fi

exit $RESULT
