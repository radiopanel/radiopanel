#!/usr/bin/env sh
set -eu

echo "UPSTREAM $UPSTREAM"
echo "DOMAIN $DOMAIN"
echo "SSL $SSL"

if [ "$SSL" = true ]; then
	# Load SSL best practices
	curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "/etc/letsencrypt/options-ssl-nginx.conf"
	curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "/etc/letsencrypt/ssl-dhparams.pem"

	if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
		# Domain already exists, try to renew
		certbot renew
	else
		# Domain does not exist, try to create
		certbot certonly --rsa-key-size 4096 --standalone --register-unsafely-without-email --agree-tos --preferred-challenges http -d $DOMAIN
	fi

	CRONTAB_LENGTH=`wc -l < /etc/crontabs/root`
	# Write to crontab to renew & boot cron
	if [ "$CRONTAB_LENGTH" = 8 ]; then
		(crontab -l 2>/dev/null; echo "43 6 * * * certbot renew --renew-hook \"nginx -s reload -c /etc/nginx/nginx.conf\" > /dev/stdout") | crontab -
		crond -l 2 -f & 
	fi

	envsubst '$UPSTREAM:$DOMAIN' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf
else
	envsubst '$UPSTREAM:$DOMAIN' < /etc/nginx/nginx-no-ssl.template > /etc/nginx/nginx.conf
fi

cat /etc/nginx/nginx.conf

exec "$@"
