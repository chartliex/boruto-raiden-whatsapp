FROM oven/bun:1.4.2-slim

WORKDIR /app

COPY package.json ./
RUN bun install --production

COPY . .

CMD ["bun", "index.js"]