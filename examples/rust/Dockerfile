FROM rust:1-bookworm AS build
WORKDIR /src
RUN cargo init --name checkout -q
COPY install.sh ./
RUN sh install.sh
COPY src ./src
RUN cargo build --release -q

FROM debian:bookworm-slim
RUN apt-get update -qq && apt-get install -y -qq ca-certificates >/dev/null && rm -rf /var/lib/apt/lists/*
COPY --from=build /src/target/release/checkout /checkout
CMD ["/checkout"]
