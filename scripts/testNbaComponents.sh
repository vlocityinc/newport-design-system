#!/bin/sh

. scripts/setupEnv.sh

if [ ! -h "${NBA_HOME}/ui-interaction-builder-components-git" ]; then
    ln -s "$(pwd)/packages/@flow-builder/ui" ${NBA_HOME}/ui-interaction-builder-components-git
fi

# For some reason
# lwc-test modules -- -c jest.git.json
# doesn't work, so move over the config ..
chmod u+w ${NBA_HOME}/jest.json
cp ${NBA_HOME}/jest.json ${NBA_HOME}/jest.json.bak
cp ${NBA_HOME}/jest.git.json ${NBA_HOME}/jest.json
(cd ${NBA_HOME} && lwc-test modules)
mv ${NBA_HOME}/jest.json.bak ${NBA_HOME}/jest.json
