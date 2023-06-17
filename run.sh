#! /bin/bash

cd monorepo/docker/ && ./run.sh

cd ../../ && cd monorepo && npm i --legacy-peer-deps && npx nx run-many --target=serve --all --maxParallel=100