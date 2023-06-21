FROM  golang:1.20.5-alpine3.18

ENV ROOT=/go/src/app
WORKDIR ${ROOT}

RUN apk update && apk add git

COPY ./moveWebsocket.go ${ROOT}

COPY go.mod ${ROOT}

RUN go mod tidy