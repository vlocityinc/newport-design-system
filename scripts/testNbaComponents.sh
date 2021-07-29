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

# setup symlink to git repository 
rm "${NBA_HOME}/ui-interaction-builder-components-git"
ln -s "$(pwd)" ${NBA_HOME}/ui-interaction-builder-components-git

# run the tests
jest ${NBA_HOME}/modules --config ${NBA_HOME}/jest.git.json
RESULT=$?

if [ $RESULT != 0 ]; then
    echo "NBA tests failed"
fi

exit $RESULT
