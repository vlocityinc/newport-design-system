#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[0;33m' 
RED='\033[0;31m'
NC='\033[0m'

. scripts/setupEnv.sh

GOLDFILES_CORE_DIR="${CORE_HOME}/ui-interaction-builder-impl/test/func/results/FlowBuilderControllerGoldFileTest"
GOLDFILES_GIT_DIR="$(pwd)/packages/@flow-builder/ui/jest-mock-data/results/FlowBuilderControllerGoldFileTest"

# check that perforce is properly configured ($P4PORT ...)
p4 info > /dev/null || exit 1

# check that gold files in core are up to date
p4 sync -n "${GOLDFILES_CORE_DIR}/..." | grep -q " updating" && { echo -e "${RED}You don't have latest gold files in core. Sync or get latest versions for ${GOLDFILES_CORE_DIR}${NC}" 1>&2 ; exit 1; }

# check if we need to sync
diff  -x '.*' -rq "${GOLDFILES_CORE_DIR}" "${GOLDFILES_GIT_DIR}" && { echo -e "${GREEN}${GOLDFILES_GIT_DIR} is already in sync with core.${NC}" ; exit 0; }

GOLD_FILES_MODIFIED=false
# warning if gold files modified in core
p4 opened "${GOLDFILES_CORE_DIR}/..." 2>&1 | grep -q "file(s) not opened on this client" || GOLD_FILES_MODIFIED=true 
p4 reconcile -n "${GOLDFILES_CORE_DIR}/..." 2>&1 | grep -q "no file(s) to reconcile" || GOLD_FILES_MODIFIED=true

# sync gold files in git repo
rsync -rtv --delete "${GOLDFILES_CORE_DIR}/" "${GOLDFILES_GIT_DIR}/"

echo -e "${GREEN}${GOLDFILES_GIT_DIR} have been synced with core.${NC}"

if [ "${GOLD_FILES_MODIFIED}" = true ] ; then
    echo -e "${YELLOW}Some gold files have been modified in core. They have been copied to git repo. If it's not what you want, shelve and revert them and re-run yarn update:goldFiles${NC}"
fi
