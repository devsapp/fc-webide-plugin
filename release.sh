#! /bin/bash

cd dist
zip -ry ide-plugin-layer ./ -x "*.DS_Store"
regions=(
    'cn-beijing'
    'cn-shanghai'
    'cn-hangzhou'
    'cn-shenzhen'
    'cn-zhangjiakou'
    'cn-huhehaote'
    'cn-hongkong'
    'ap-northeast-1'
    'ap-southeast-1'
    'eu-central-1'
    'us-east-1'
)
for r in ${regions[@]}
do
    export REGION=$r
    echo $REGION
    s cli fc layer publish --layer-name webide-custom-plugin --code ide-plugin-layer.zip --compatible-runtime nodejs16,python3.10,custom.debian10,custom,nodejs14,nodejs12,nodejs10,nodejs8,nodejs6,python3,python3.9,python2.7,php7.2,java8,java11,dotnetcore2.1,go1 --region $REGION -a fc-console
    s cli fc layer acl --layer-name webide-custom-plugin --public --region $REGION -a fc-console
    s cli fc layer detail --layer-name webide-custom-plugin --version-id latest  --region $REGION  -a fc-console
done