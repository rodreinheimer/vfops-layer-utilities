#!/bin/bash
set -eo pipefail

#################################################
# Deploy report foundation pipeline stack
#################################################

# Move to working directory
cd ../../

# Deploy code pipeline stack
aws cloudformation deploy \
--stack-name vf-ops-lambda-utilities-layer-pipeline-delta-deploy \
--template-file pipeline.yml \
--capabilities CAPABILITY_IAM 