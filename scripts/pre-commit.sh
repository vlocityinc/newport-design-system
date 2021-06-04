#!/bin/sh

export IFS='
'


out=`yarn genTsConfig && git add **/tsconfig.json && lint-staged 2>&1`
res=$?

for line in $out; do
    echo $line | grep -v jsdoc
done

exit $res
