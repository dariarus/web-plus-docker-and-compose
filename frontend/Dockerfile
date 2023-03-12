FROM node:16-alpine AS builder
# app будет в корне в контерейнере докера
WORKDIR /build
# скопировать все файлы package с расширением json
COPY ./package*.json ./

RUN npm i

COPY .env* ./

# скопировать ВСЁ из папки src с компа в папку /app в докере
COPY ./src/ ./src
COPY ./public/ ./public

RUN npm run build

# nginx:

# установка
# RUN sudo apt install nginx
#...

# Но можно проще: multy-stage-сборка
# Вторая стадия сборки (frontend)
FROM nginx:1.23.1-alpine AS frontend
# ' --from=builder' означает, что вторая стадия сборки (frontend) начнется только после того, как завершится стадия builder
COPY --from=builder /build/build /usr/share/nginx/html

# Скопировать конфиг nginx в контейнер докера
COPY nginx/conf.d/ /etc/nginx/conf.d

# выделить порт для раздачи фронта
EXPOSE 80

# После утановки через RUN и конфигурации - в директиву CMD передается массив команд
# точка с запятой - чтобы команды выполнялись параллельно. Для последовательного выполнения ставится '&&'
CMD ["nginx", "-g", "daemon off;"]