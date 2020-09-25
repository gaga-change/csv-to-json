#!/bin/bash

project_path=$(cd `dirname $0`; pwd)
project_name="${project_path##*/}"
git branch
git pull
docker run -it --rm --name ${project_name}-install  -v ${project_path}:/root/app -w /root/app node:10-alpine npm i
docker stop ${project_name}
docker run -it --rm -d --name ${project_name} -p 8720:8720 -v ${project_path}:/root/app -w /root/app node:10-alpine npm run start