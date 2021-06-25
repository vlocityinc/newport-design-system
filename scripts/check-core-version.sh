#/bin/sh

# Usage: check-core-version.sh  BRANCH CL
# eg: check-stm-version.sh
#     check-stm-version.sh main 32818692


BRANCH=$1
CL=$2

if [ -z "$BRANCH" ]; then
    BRANCH=main
fi

if [ -z "$CL" ]; then
    CL=$(p4 changes -m 1 | cut -f2 -d" ")
fi


JAR=ui-interaction-builder-components

TAG=$(p4 print //app/$BRANCH/core/pom.xml@$CL | grep "<$JAR.version>" | grep -Eo '[0-9]+.[0-9]+')

echo "Branch: $BRANCH"
echo "Latest Changelist: ${CL}"
echo "Latest ui-interaction-builder-compnents jar: ${TAG}"
echo ""

git --no-pager show -s sfci-$TAG
