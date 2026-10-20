FROM python:3.13-slim
WORKDIR /app
# Your app's own dependencies come first, so the bootstrap step can detect them.
RUN pip install --no-cache-dir flask
COPY install.sh run.sh app.py ./
RUN sh install.sh
CMD ["sh", "run.sh"]
