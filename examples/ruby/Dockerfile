FROM ruby:3.4-slim
RUN apt-get update -qq && apt-get install -y -qq build-essential >/dev/null && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY install.sh run.sh app.rb ./
RUN bundle init >/dev/null && sh install.sh
CMD ["sh", "run.sh"]
