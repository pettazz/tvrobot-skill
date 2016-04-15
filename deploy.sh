#!/bin/bash

mkdir -p build
rm build/index.zip
zip –Xr build/index.zip *

aws lambda update-function-code --function-name tvrobot --zip-file fileb://build/index.zip