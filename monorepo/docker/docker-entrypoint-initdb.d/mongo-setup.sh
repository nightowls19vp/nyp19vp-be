#!/bin/bash

MONGODB=mongodb

echo "**********************************************" ${MONGODB}
echo "Waiting for startup.."
sleep 10
echo "done"

echo SETUP.sh time now: `date +"%T" `
mongosh --host ${MONGODB} -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} <<EOF
var cfg = {
    "_id": "rs0",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "${MONGODB}:27017",
            "priority": 1
        }
    ]
};
rs.initiate(cfg, { force: true });
rs.status();
EOF