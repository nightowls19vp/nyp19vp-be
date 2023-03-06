# nyp19vp-be

## To start kafka, kafdrop and mongodb server

### Prerequisite

Docker and docker must be installed and run in your machine

### Commands

In the root directory

```sh
cd monorepo/docker/

# copy the config for dev env to docker folder
cp ../.env.dev .env

# run docker compose in detach mode
docker compose up  -d
```
