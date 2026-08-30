# Development

### RabbitHollow

Krátký návod pro lokální vývoj. Konkrétní commands budou doplněné při vytvoření frontend a backend projektu.

## Prerequisites

- Git
- Node.js
- npm
- Python
- PostgreSQL

Doporučené prostředí je VS Code.

## Project layout

```text
frontend/
backend/
database/
tests/
README.md
MVP_PLAN.md
ARCHITECTURE.md
DATA_MODEL.md
API.md
SECURITY.md
DEVELOPMENT.md
TESTING.md
```

## Environment

Lokální secrets patří do `.env`.

Do repository se commitují pouze bezpečné placeholder hodnoty v `.env.example`.

## Database

Po inicializaci backendu bude workflow:

```text
install → configure env → migrate → seed → run
```

Migrations jsou source of truth pro změny databázového schema.

Seed obsahuje pouze synthetic development data.

## Frontend

Development frontend poběží samostatně od backendu.

```text
browser → Vite dev server → FastAPI API
```

Frontend nesmí obsahovat backend secrets.

## Backend

FastAPI bude spuštěná jako samostatná service.

Business logika patří do service vrstvy, nikoliv přímo do route handlerů.

## Tests

Před merge musí projít relevantní unit a integration tests.

Security-sensitive změny musí mít test pro povolený i zamítnutý scénář.

## Code quality

Používat:

- TypeScript strict mode
- ESLint
- formatter
- Python type checking
- linting
- test runner

Konkrétní tooling bude potvrzen při založení projektu.

## Git workflow

Vývoj bude probíhat v malých, kontrolovatelných změnách.

Commit má popisovat jednu logickou změnu. Secrets, build artefakty, lokální konfigurace a dependency caches nepatří do repository.
