#!/bin/bash
set -eo pipefail
#################################################
# This script is to be used by developer when 
# creating stack locally from his/her local env.
# Steps: 
#   Generate random sufix.
#   Commit bucket name to flat file
#       The flat file to be used by push-delta.sh
#       when executed locally
#   Create S3 bucket
#################################################
BUCKET_ID=$(dd if=/dev/random bs=8 count=1 2>/dev/null | od -An -tx1 | tr -d ' \t\n')
BUCKET_NAME=vf-ops-report-utilities-layer-$BUCKET_ID
echo $BUCKET_NAME > stack-bucket-name.txt
aws s3 mb s3://$BUCKET_NAME