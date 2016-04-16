#!/bin/bash

mkdir -p build
rm build/index.zip
zip -R build/index.zip ./* -x build/* -X

aws lambda update-function-code --function-name tvrobot --zip-file fileb://build/index.zip