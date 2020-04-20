#!/bin/sh
BRANCH=$1
. .env
if [[ -z "$P4CLIENT" ]]; then
  export P4CLIENT=$CUSTOM_P4CLIENT
fi
echo "Using P4CLIENT '$P4CLIENT' against '$BRANCH' branch."
CORE_HOME="$HOME/blt/app/$BRANCH/core"
NBA_HOME=$CORE_HOME/ui-nba-components
