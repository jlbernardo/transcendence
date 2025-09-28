FROM alpine:latest

RUN apk update && apk add sqlite

WORKDIR /db

COPY ./create_db.sh /db

RUN chmod +x /db/create_db.sh

ENTRYPOINT [ "sh", "-f", "/db/create_db.sh" ]
