FROM nginx:alpine

COPY dist/** /usr/share/nginx/html/

ENV API_ROOT='http://localhost:5000'

EXPOSE 80

CMD [ "nginx -g 'daemon off'" ]