#!/bin/bash
set -eo pipefail

#################################################
# This script publishes layer, steps:  
#   . Zip code
#   . Put zip to S3 bucket
#   . Publish zip from S3 to predefined layer
#################################################
ENV_NAME=$1
DEPLOYMENT_BUCKET=$2

if [[ ! -z $1 ]] && [[ $1 != "prd" && $1 != "dev" ]]; then
   echo "ENV_NAME Parameter provided but not matching required values [${1}] Error will fail ..."
   exit 99
fi

###########################################################################
# Script running without environment variable (ENV_NAME) assumed to be 
# executed by developer in which case ENV_NAME defaults to 'test' and the  
# bucket should be created by the following script: create-stack-bucket.sh. 
# ENV_NAME value is defined in pipeline.yml and the bucket must be created 
# and is defined at template.yml.
###########################################################################
if [[ "dev,prd" =~ ${ENV_NAME} ]]; then 
    STACK_BUCKET=${DEPLOYMENT_BUCKET}-${ENV_NAME};
    STACK_NAME="vf-ops-lambda-layer-utilities-cicd-delta-deploy-"${ENV_NAME};
else 
    ENV_NAME="test";
    STACK_BUCKET=$(cat stack-bucket-name.txt);
    STACK_NAME="vf-ops-lambda-layer-utilities-cicd-delta-deploy-"${ENV_NAME};
fi

# Make sure package has unique name
NOW=$(date +"%Y-%m-%d-%H-%M")

# Put to S3
mv ../../layer_delta.zip ../../layer_delta_${NOW}.zip
aws s3 cp ../../layer_delta_${NOW}.zip s3://$STACK_BUCKET/ 


# Hold for 5 secs and publish layer's version
sleep 5
aws lambda publish-layer-version \
    --layer-name vf-ops-utilities-${ENV_NAME} \
    --description "Digital operation's utilities." \
    --content S3Bucket=${STACK_BUCKET},S3Key=layer_delta_${NOW}.zip \
    --compatible-runtimes nodejs12.x  