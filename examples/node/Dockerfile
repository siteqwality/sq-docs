FROM node:22-slim
WORKDIR /app
COPY install.sh run.sh app.js ./
RUN npm init -y >/dev/null && sh install.sh
CMD ["sh", "run.sh"]
