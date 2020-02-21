#!/bin/sh

. scripts/setupEnv.sh

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
