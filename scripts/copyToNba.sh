#!/bin/sh

. scripts/setupEnv.sh

CL=$1

if [ -z "$CL" ]; then
    echo "Usage: copyToNba.sh <changelist>"
    exit 1;
fi

# need to built @flow-builder/flow-utils
yarn build

UI_INTERACTION_BUILDER_COMPONENTS_COPY=$NBA_HOME/ui-interaction-builder-components-copy
UI_INTERACTION_BUILDER_COMPONENTS_COPY_FLOW_UTILS=$UI_INTERACTION_BUILDER_COMPONENTS_COPY/src/builder_platform_interaction/flowUtils

find $UI_INTERACTION_BUILDER_COMPONENTS_COPY -type f | xargs p4 edit -c $CL
rm -rf $UI_INTERACTION_BUILDER_COMPONENTS_COPY/*
rsync -azh packages/@flow-builder/ui/* $UI_INTERACTION_BUILDER_COMPONENTS_COPY

# copy over the built @flow-builder/flow-utils
mkdir -p $UI_INTERACTION_BUILDER_COMPONENTS_COPY_FLOW_UTILS
cp 'packages/@flow-builder/flow-utils/dist/index.dev.js' $UI_INTERACTION_BUILDER_COMPONENTS_COPY_FLOW_UTILS/flowUtils.js

find $UI_INTERACTION_BUILDER_COMPONENTS_COPY -type f | xargs p4 add -c $CL
find $UI_INTERACTION_BUILDER_COMPONENTS_COPY -type f | xargs p4 revert -a
