#!/bin/sh

. ./.env

if [ -z "${CORE_HOME}" ]; then
    CORE_HOME=$HOME/blt/app/main/core
fi

NBA_HOME=$CORE_HOME/ui-nba-components



