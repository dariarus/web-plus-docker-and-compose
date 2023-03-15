### backend Dockerfile:
FROM node:16-alpine AS builder
WORKDIR /build
COPY package*.json ./
# COPY ./tsconfig*.json ./
RUN npm install

COPY ./src/ ./src
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./

RUN npm run build

FROM node:16-alpine AS backend
WORKDIR /app
COPY package*.json ./

# автоматический перезапуск контейнера в случае ошибок и падения - утилита pm2, родной
# (использовался для сборки Mesto)
# зависимости устан-ся без dev-dependencies. + установить pm2
RUN npm i --omit=dev && npm i pm2 -g
COPY --from=builder /build/dist ./dist
COPY ./ecosystem.config.js /
CMD ["pm2-runtime", "start", "/ecosystem.config.js"]

# CMD ["node", "dist/main.js"] - простой запуск контейнера, без pm2

# запуск: docker compose up

