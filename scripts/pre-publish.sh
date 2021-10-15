#!/bin/sh

cp package.json package.json.bak
cat package.json.bak | jq '. * .publishConfig' | jq 'del(.|.publishConfig)' > package.json
