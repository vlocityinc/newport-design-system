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

# copy built files over
cp -r src/main/modules/builder_platform_interaction $UI_INTERACTION_BUILDER_COMPONENTS_COPY/src
cp -r packages/@flow-builder/ui/build/ui/jest-modules $UI_INTERACTION_BUILDER_COMPONENTS_COPY
cp -r packages/@flow-builder/ui/build/ui/jest-mock-data $UI_INTERACTION_BUILDER_COMPONENTS_COPY

# copy shared utils jest-modules
cp -r packages/@flow-builder/shared-utils/build/esNext/jest-modules/builder_platform_interaction/* $UI_INTERACTION_BUILDER_COMPONENTS_COPY/jest-modules/builder_platform_interaction

p4 reconcile -c $CL -e -a -d $UI_INTERACTION_BUILDER_COMPONENTS_COPY/...