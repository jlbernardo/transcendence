FROM node:24-alpine

COPY . /core
WORKDIR /core

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]
