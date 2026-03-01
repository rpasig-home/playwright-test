FROM node:20-alpine

WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm ci --omit=dev || npm i --omit=dev

COPY src ./src
RUN npm i --save-dev typescript && npx tsc -p tsconfig.json && npm prune --omit=dev

ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.js"]