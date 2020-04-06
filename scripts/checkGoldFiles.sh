#!/bin/bash

# This script will check that gold files are in sync with the gold files in core
# exit codes :
# 0 : gold files are in sync
# 1 : gold files are not in sync
# 3 : could not check because core is not up to date

GREEN='\033[0;32m'
YELLOW='\033[0;33m' 
RED='\033[0;31m'
NC='\033[0m'

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

GOLDFILES_CORE_DIR="${CORE_HOME}/ui-interaction-builder-impl/test/func/results/FlowBuilderControllerGoldFileTest"
GOLDFILES_GIT_DIR="$(pwd)/packages/@flow-builder/ui/jest-mock-data/results/FlowBuilderControllerGoldFileTest"

# check that perforce is properly configured ($P4PORT ...)
p4 info > /dev/null || exit 1

# check that gold files in core are up to date
p4 sync -n "${GOLDFILES_CORE_DIR}/..." | grep -q " updating" && { echo -e "${YELLOW}You don't have latest gold files in core. Cannot check if gold files in git repository are up to date${NC}" ; exit 3; }

diff -x '.*' -x '*.backup.json' -rq "${GOLDFILES_CORE_DIR}" "${GOLDFILES_GIT_DIR}" || { echo -e "${YELLOW}${GOLDFILES_GIT_DIR} is out of sync with core. Run yarn update:goldFiles to update${NC}" ; exit 1; }
echo -e "${GREEN}${GOLDFILES_GIT_DIR} is in sync with core.${NC}"