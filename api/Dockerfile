FROM node:fermium-alpine as builder

RUN apk add --update --no-cache python3 gcc make automake autoconf g++ vips vips-dev
ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY . /home/node

RUN npm ci \
    && npm run build

# ---

FROM node:fermium-alpine

RUN apk add --update --no-cache python3 gcc make automake autoconf g++ vips vips-dev
ENV NODE_ENV production

EXPOSE 80
USER root
RUN apk add libcap && setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/node

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/

RUN npm ci

CMD ["node", "dist/src/main.js"]
