#!/bin/sh

DEFAULT_CORE_HOME=$HOME/blt/app/main/core

if [  ! -f .env ]; then
    echo "CORE_HOME=$DEFAULT_CORE_HOME" > .env
fi

. ./.env

if [ -z "${CORE_HOME}" ]; then
    CORE_HOME=$DEFAULT_CORE_HOME
fi

NBA_HOME=$CORE_HOME/ui-nba-components



