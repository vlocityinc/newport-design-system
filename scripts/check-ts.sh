#!/bin/bash

# Enforces that @ts-nocheck is not used for new, non-test typescript files

RED='\033[0;31m'

status=0

for file in "$@"; do
    res=$(grep -n "@ts-nocheck" $file)

    # checks that a non-test ts file is not disabling typescript
    if [[ "$res" =~ ^1 ]]; then
          # only enforce for added files
          if [[ "$(git status -s $file)" =~ ^A ]]; then
            echo -e "${RED}Found @ts-nocheck at the top of a new, non-test file: $file. Please remove."
            status=1
         fi
    fi
done

exit $status