# Stage 0: Build Angular
FROM node:fermium-alpine AS build
ARG buildenv
ARG NPM_TOKEN

WORKDIR /usr/build
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build -- --prod

# Stage 1: Serve Angular
FROM nginx:1.21.0-alpine

RUN apk add certbot

COPY --from=build /usr/build/dist/* /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.template
COPY nginx-no-ssl.conf /etc/nginx/nginx-no-ssl.template
COPY docker-entrypoint.sh /
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
