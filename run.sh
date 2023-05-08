#! /bin/bash

cd monorepo/docker/ && ./run.sh

cd ../../ && cd monorepo && npm i && npx nx run-many --target=serve