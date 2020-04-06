#!/bin/bash

usage()
{
  echo "Usage: $0 -b BRANCH -c CHANGELIST"
  echo "where BRANCH is 'main', '226/patch' ..."
  exit 2
}

while getopts 'c:b:?h' c
do
  case $c in
    c) CL=$OPTARG ;;
    b) BRANCH=$OPTARG ;;
    h|?) usage ;; esac
done
[ -z "$BRANCH" ] && usage
[ -z "$CL" ] && usage

. scripts/setupEnv.sh "${BRANCH}"

# need to build @flow-builder/flow-utils
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
