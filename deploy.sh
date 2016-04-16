#!/bin/bash

rm -r build
mkdir -p build
zip -r ./build/index.zip ./* -x build/* -X

aws lambda update-function-code --function-name tvrobot --zip-file fileb://build/index.zip