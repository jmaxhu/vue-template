#!/bin/sh
set -e

if [ ! -z "$API_ROOT" ]; then
  echo "use api root: $API_ROOT"
  sed -i "s@http:\/\/localhost:5000@$API_ROOT@g" /usr/share/nginx/html/js/app.*.js
fi

nginx -g 'daemon off;'

# exec "$@"
