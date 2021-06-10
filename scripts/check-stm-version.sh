#/bin/sh

# Usage: check-stm-version.sh stmfa|stmfb
# eg: check-stm-version.sh stmfa
#      check-stm-version.sh stmfb


STEAM_A_URL=https://na44.stmfa.stm.salesforce.com
STEAM_B_URL=https://na44.stmfb.stm.salesforce.com

JAR=ui-interaction-builder-components

STEAM=$1

if [ "$STEAM" = "stmfa" -o "$STEAM" = "" ]; then
    URL=$STEAM_A_URL
elif [ "$STEAM" = "stmfb" ]; then
    URL=$STEAM_B_URL
else
    echo "Usage: check-stm-version stmfa|stmfb"
    exit 1
fi

echo "Querying: ${URL}"
BRANCH=$(curl -s $URL/sfdc/releaseVersion.jsp | grep CoreBranch | grep -Eo '[0-9]+|main')
CL=$(curl -s $URL/sfdc/releaseVersion.jsp | grep "CoreChangeList" | cut -f 2 -d" ")

if [ "$BRANCH" != "main" ]; then
    BRANCH="$BRANCH/patch"
fi

TAG=$(p4 print //app/$BRANCH/core/pom.xml@$CL | grep "<$JAR.version>" | grep -Eo '[0-9]+.[0-9]+')

echo "Branch: $BRANCH"
echo "Latest Changelist: ${CL}"
echo "Latest ui-interaction-builder-compnents jar: ${TAG}"
echo ""

git --no-pager show -s sfci-$TAG

exit 0
