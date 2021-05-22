#!/bin/bash

if [[ -z "${WEBAPP_FQDN}" ]] || [[ -z "${API_SERVER_FQDN}" ]] ;then
  echo "Environment variables not set, build aborted."
  exit 1
else
  sed -i "s/WEBAPP_FQDN/${WEBAPP_FQDN}/g" /etc/nginx/conf.d/default
  sed -i "s/WEBAPP_FQDN/${WEBAPP_FQDN}/g" /etc/nginx/sites-available/default
  sed -i "s/API_SERVER_FQDN/${API_SERVER_FQDN}/g" /etc/nginx/conf.d/default
  sed -i "s/API_SERVER_FQDN/${API_SERVER_FQDN}/g" /etc/nginx/sites-available/default
  nginx -g "daemon off;"
fi
