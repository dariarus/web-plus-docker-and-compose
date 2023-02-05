FROM node:16-alpine

WORKDIR /app/build

COPY ./package.json /app/build/

RUN npm i

COPY ./src/ /app/build/src
COPY ./tsconfig.json /app/build/
COPY ./tsconfig.build.json /app/build/

RUN npm run build