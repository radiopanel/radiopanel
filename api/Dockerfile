FROM node:fermium-alpine as builder

RUN apk add --no-cache build-base python2 python3 make g++ vips-dev
ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY . /home/node

RUN npm ci \
    && npm run build

# ---

FROM node:fermium-alpine

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
