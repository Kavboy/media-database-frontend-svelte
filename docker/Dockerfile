FROM node:alpine as build

WORKDIR /app

COPY . /app

COPY package.json /app/package.json

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/public /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]