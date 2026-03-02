FROM mcr.microsoft.com/playwright:v1.47.2-jammy

WORKDIR /work
COPY package.json package-lock.json tsconfig.json playwright.config.ts ./
RUN npm ci

COPY src ./src
CMD ["npm", "run", "test:api"]