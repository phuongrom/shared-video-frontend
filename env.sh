#!/bin/sh
set -e
# Inject BACKEND_URL into nginx config at container startup
sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
