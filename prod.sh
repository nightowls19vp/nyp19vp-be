#! /bin/bash

# Function to terminate the processes
function stop_processes() {
  pkill -f "node main.js"
}

# Start the servers
cd monorepo/docker/ && ./run.sh

cd ../../ && cd monorepo && npm i --legacy-peer-deps && npx nx run-many --target=build

# for each dir (services) ./dist/apps/*, copy .env* to
# ./dist/apps/<dir>/.env*
for d in ./dist/apps/* ; do cp .env* "$d" ; done

# for each dir (services) in ./dist/apps/* run "node main.js"
for d in ./dist/apps/* ; do (cd "$d" && node main.js &) ; done

# Trap SIGINT (Ctrl+C) to stop the processes
trap stop_processes SIGINT

# Wait for SIGINT
wait
