FROM php:8.3-cli
RUN apt-get update -qq && apt-get install -y -qq unzip >/dev/null && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY install.sh run.sh index.php ./
RUN sh install.sh
CMD ["sh", "run.sh"]
