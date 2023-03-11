FROM node:16-alpine AS builder
# app будет в корне в контерейнере докера
WORKDIR /build
# скопировать все файлы package с расширением json
COPY ./package*.json .

RUN npm i

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
FROM nginx:1.16.0-alpine AS frontend
# ' --from=builder' означает, что вторая стадия сборки (frontend) начнется только после того, как завершится стадия builder
COPY --from=builder /build/build /usr/build/share/nginx/html

# Скопировать конфиг nginx в контейнер докера
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# выделить порт для раздачи фронта
EXPOSE 81

# После утановки через RUN и конфигурации - в директиву CMD передается массив команд
# точка с запятой - чтобы команды выполнялись параллельно. Для последовательного выполнения ставится '&&'
CMD ["nginx", "-g", "daemon off;"]