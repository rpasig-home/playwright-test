# playwright-test
Mock API + Playwright (TypeScript) Automation Framework

Example of API-first test automation:
- Mock trading API (Node/Express)
- Playwright API tests (TypeScript)
- Contract/schema validation (AJV)
- Deterministic state reset endpoint for reliability
- Docker Compose for local execution
- GitHub Actions CI + HTML/JUnit reports

## Re-requisite
- Node (v25.6.1)
- Docker 

## Run (Docker)
```bash
cp .env.example .env
docker compose up --build --exit-code-from tests

## Run locally without Docker

Terminal 1:

    cd mock-api
    npm i
    API_KEY=local-dev-key npm run dev


Terminal 2:

    cd tests
    npm i
    BASE_URL=http://localhost:3000
    API_KEY=local-dev-key npm run test:api


 Note:
 API tests run with a single worker because the mock service is stateful/in-memory; parallel execution would require per-test state isolation.   