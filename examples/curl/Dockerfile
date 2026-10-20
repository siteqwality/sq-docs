FROM curlimages/curl:8.22.0
WORKDIR /app
COPY logs.sh traces.sh metrics.sh ./
CMD ["sh", "-c", "while true; do sh logs.sh; sh traces.sh; sh metrics.sh; sleep 2; done"]
