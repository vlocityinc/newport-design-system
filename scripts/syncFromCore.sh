#!/bin/sh

# Copies over jest-mock-data, jest-modules, builder_platform_interaction and results from core

source scripts/setupEnv.sh

SRC=$CORE_HOME/ui-interaction-builder-components
DEST=./packages/@flow-builder/ui

rm -rf $DEST/jest-mock-data $DEST/jest-modules $DEST/src/builder_platform_interaction
cp -r $SRC/jest-mock-data $DEST
cp -r $SRC/jest-modules $DEST
cp -r $SRC/modules/builder_platform_interaction $DEST/src
chmod -R u+wX $DEST

cp -r $CORE_HOME/ui-interaction-builder-impl/test/func/results $DEST/jest-mock-data
chmod -R u+wX $DEST
