#!/usr/bin/env bash
set -e #fail batch if any command fails

set +x
echo "setting npm secret token"
echo "
@sb:registry=https://registry-node.starbreeze.com
//registry-node.starbreeze.com/:_authToken=${NPM_TOKEN}
" > .npmrc
set -x
echo "setting Dockerfile"
echo "
FROM node:${NODE_VERSION}
COPY .npmrc /root/.npmrc
RUN npm install -g npm@${NPM_VERSION}
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app/
" > Dockerfile

echo "Building docker image"
DOCKER_IMAGE=${JOB_BASE_NAME}:${BUILD_ID}
docker build -q -t "${DOCKER_IMAGE}" .
rm -f Dockerfile

echo "Running build and publish inside a docker container"
docker run --rm "${DOCKER_IMAGE}" bash -c "npm publish"

docker rmi "${DOCKER_IMAGE}"
