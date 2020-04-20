#!/bin/bash

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

result=$(p4 sync -n "${GOLDFILES_CORE_DIR}/...") || exit 1

# check that gold files in core are up to date
grep -q " updating" <<<$result && { echo -e "${YELLOW}You don't have latest gold files in core. Sync or get latest revision on folder: \n${GOLDFILES_CORE_DIR}${NC}"; exit 3; }

# check if we need to sync
diff  -x '.*' -x '*.backup.json' -rq "${GOLDFILES_CORE_DIR}" "${GOLDFILES_GIT_DIR}" && { echo -e "${GREEN}The following folder is already in sync with core:\n${GOLDFILES_GIT_DIR}${NC}" ; exit 0; }

GOLD_FILES_MODIFIED=false
# warning if gold files modified in core
p4 opened "${GOLDFILES_CORE_DIR}/..." 2>&1 | grep -q "file(s) not opened on this client" || GOLD_FILES_MODIFIED=true
p4 reconcile -n "${GOLDFILES_CORE_DIR}/..." 2>&1 | grep -q "no file(s) to reconcile" || GOLD_FILES_MODIFIED=true

# sync gold files in git repo
rsync -rtv --exclude '*.backup.json' --delete "${GOLDFILES_CORE_DIR}/" "${GOLDFILES_GIT_DIR}/"

echo -e "${GREEN}The following folder has been synced with core:\n${GOLDFILES_GIT_DIR}${NC}\n"

if [ "${GOLD_FILES_MODIFIED}" = true ] ; then
    echo -e "${YELLOW}Some gold files have been modified in core. They have been copied to git repo. If it's not what you want, shelve and revert them and re-run yarn update:goldFiles${NC}"
fi
