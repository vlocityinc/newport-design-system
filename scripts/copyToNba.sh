#!/bin/bash
# Sample Usage: scripts/copyToNba.sh -b main -c 25821889

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

UI_INTERACTION_BUILDER_COMPONENTS_COPY=$NBA_HOME/ui-interaction-builder-components-copy
UI_INTERACTION_BUILDER_COMPONENTS_COPY_SRC=$UI_INTERACTION_BUILDER_COMPONENTS_COPY/src

# build the ts code, we will copy over the built js
yarn build

find $UI_INTERACTION_BUILDER_COMPONENTS_COPY -type f | xargs p4 revert
p4 sync -f $UI_INTERACTION_BUILDER_COMPONENTS_COPY/...


rm -rf $UI_INTERACTION_BUILDER_COMPONENTS_COPY
mkdir -p $UI_INTERACTION_BUILDER_COMPONENTS_COPY/src

# make node_modules directory
mkdir -p $UI_INTERACTION_BUILDER_COMPONENTS_COPY/node_modules
mkdir -p $UI_INTERACTION_BUILDER_COMPONENTS_COPY/jest-modules/builder_framework

# copy built files over
cp -r src/main/modules/builder_platform_interaction $UI_INTERACTION_BUILDER_COMPONENTS_COPY/src
cp -r packages/@flow-builder/ui/build/ui/jest-modules $UI_INTERACTION_BUILDER_COMPONENTS_COPY
cp -r packages/@flow-builder/ui/build/ui/jest-mock-data $UI_INTERACTION_BUILDER_COMPONENTS_COPY

# copy shared utils jest-modules
cp -r packages/@flow-builder/shared-utils/jest-modules/builder_framework/command $UI_INTERACTION_BUILDER_COMPONENTS_COPY/jest-modules/builder_framework

# copy lightning-component-stubs node_modules
cp -r node_modules/lightning-components-stubs $UI_INTERACTION_BUILDER_COMPONENTS_COPY/node_modules

p4 reconcile -c $CL -e -a -d $UI_INTERACTION_BUILDER_COMPONENTS_COPY/...