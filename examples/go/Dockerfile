FROM golang:1 AS build
WORKDIR /src
COPY install.sh main.go otel.go ./
RUN go mod init checkout && sh install.sh && CGO_ENABLED=0 go build -o /out/checkout .

FROM gcr.io/distroless/static-debian12
COPY --from=build /out/checkout /checkout
CMD ["/checkout"]
