#!/bin/bash
BRANCH=$1
[[ -f .env ]] && source .env
if [[ -z "$P4PORT" ]]; then
  export P4PORT=$CUSTOM_P4PORT
fi
if [[ -z "$P4CLIENT" ]]; then
  export P4CLIENT=$CUSTOM_P4CLIENT
fi

echo "Using P4CLIENT '$P4CLIENT' with P4PORT '$P4PORT' against '$BRANCH' branch."
CORE_HOME="$HOME/blt/app/$BRANCH/core"
NBA_HOME=$CORE_HOME/ui-nba-components
