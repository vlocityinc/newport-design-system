#!/bin/bash

# Enforces that @ts-nocheck is not used for new, non-test typescript files

RED='\033[0;31m'

status=0

for file in "$@"; do
    res=$(grep -n "@ts-nocheck" $file)

    # checks that a non-test ts file is not disabling typescript
    if [[ "$res" =~ ^1 ]]; then
         echo -e "${RED}Found @ts-nocheck at the top of non-test file: $file. Please remove."
         status=1
    fi
done

exit $status