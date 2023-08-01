#! /bin/bash

# start `api-gateway`
cp .env* "./dist/apps/api-gateway"
node ./dist/apps/api-gateway/main.js &

# start `auth`
cp .env* "./dist/apps/auth"
node ./dist/apps/auth/main.js &

# start `comm`
cp .env* "./dist/apps/comm"
node ./dist/apps/comm/main.js &

# start `pkg-mgmt`
cp .env* "./dist/apps/pkg-mgmt"
node ./dist/apps/pkg-mgmt/main.js &

# start `prod-mgmt`
cp .env* "./dist/apps/prod-mgmt"
node ./dist/apps/prod-mgmt/main.js &

# start `txn`
cp .env* "./dist/apps/txn"
node ./dist/apps/txn/main.js &

# start `users`
cp .env* "./dist/apps/users"
node ./dist/apps/users/main.js &