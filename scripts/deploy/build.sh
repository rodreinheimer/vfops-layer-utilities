#!/bin/bash
set -eo pipefail

#################################################
# Build layers, steps:
#       . zip content
#           zip will be used by publish-delta.sh
#################################################

# Prepare package
cd ../../
zip -vr layer_delta.zip nodejs/ -x "*.DS_Store"

