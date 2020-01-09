#!/bin/sh

source scripts/setupEnv.sh

CL=$1

if [ -z "$CL" ]; then
    echo "Usage: copyToNba.sh <changelist>"
    exit 1;
fi

UI_INTERACTION_BUILDER_COMPONENTS_COPY=$NBA_HOME/ui-interaction-builder-components-copy

find $UI_INTERACTION_BUILDER_COMPONENTS_COPY -type f | xargs p4 edit -c $CL
rm -rf $UI_INTERACTION_BUILDER_COMPONENTS_COPY/*
rsync -azh packages/@flow-builder/ui $UI_INTERACTION_BUILDER_COMPONENTS_COPY
find $UI_INTERACTION_BUILDER_COMPONENTS_COPY -type f | xargs p4 add -c $CL
find $UI_INTERACTION_BUILDER_COMPONENTS_COPY -type f | xargs p4 revert -a
