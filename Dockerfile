FROM node:lts-alpine

ENV NODE_ENV=stage

WORKDIR /usr/src/app

COPY ["*.sh", "./"]

WORKDIR /usr/src/app/monorepo

COPY ["./monorepo/package.json", "./monorepo/package-lock.json*", "./"]

RUN npm install

WORKDIR /usr/src/app

COPY . .