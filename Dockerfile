FROM nginx:alpine

COPY dist/ /usr/share/nginx/html/
COPY docker-entrypoint.sh /usr/local/bin

ENTRYPOINT docker-entrypoint.sh

EXPOSE 80

# CMD [ "nginx -g 'daemon off'" ]