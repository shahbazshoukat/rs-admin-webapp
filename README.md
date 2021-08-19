# ResultSquare Web app

### Useful Docker Commands:

```sh
docker run -d \
--name rs-admin-webapp \
-p 80:80 \
-e "WEBAPP_FQDN=rcc.resultsquare.pk" \
-e "API_SERVER_FQDN=3.21.127.241:3000" \
resultsquare/rcc-webapp:latest

```
