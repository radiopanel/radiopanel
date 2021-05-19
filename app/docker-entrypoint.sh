#!/usr/bin/env sh
set -eu

echo "UPSTREAM $UPSTREAM"

envsubst '${UPSTREAM}' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf
cat /etc/nginx/nginx.conf

exec "$@"
