# API Reference

### RabbitHollow

Tento dokument definuje plánovaný backend contract pro MVP. Detailní request/response schema bude generováno přes FastAPI OpenAPI.

## Conventions

Base path:

```text
/api/v1
```

API používá JSON pro requesty a response. Chyby mají konzistentní strukturu:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

Authentication bude vyžadována u všech endpointů kromě auth flow.

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Přihlášení |
| POST | `/auth/logout` | Odhlášení |
| GET | `/auth/me` | Aktuální uživatel |
| POST | `/auth/refresh` | Obnovení session/tokenu |

## Dashboard

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/dashboard/summary` | Statistický přehled |
| GET | `/dashboard/events` | Live event feed |
| GET | `/dashboard/risk` | Risk data |

## Honeypots

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/honeypots` | Seznam honeypotů |
| POST | `/honeypots` | Vytvoření konfigurace |
| GET | `/honeypots/{id}` | Detail |
| PATCH | `/honeypots/{id}` | Úprava konfigurace |
| POST | `/honeypots/{id}/validate` | Security validation |
| POST | `/honeypots/{id}/approve` | Approval workflow |
| POST | `/honeypots/{id}/deploy` | Deployment request |

Deployment endpoint musí provést server-side security gate a nesmí spoléhat na frontendové permission checks.

## Honeynet

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/honeynet` | Topology |
| POST | `/honeynet/nodes` | Přidání node |
| PATCH | `/honeynet/nodes/{id}` | Úprava node |
| POST | `/honeynet/validate` | Topology validation |

## Events

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/events` | Vyhledávání eventů |
| GET | `/events/{id}` | Detail eventu |

Filtry budou podporovat minimálně čas, source IP, event type, severity a honeypot.

## IOC

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/iocs` | Search/filter |
| POST | `/iocs` | Vytvoření IOC |
| GET | `/iocs/{id}` | Detail IOC |
| PATCH | `/iocs/{id}` | Aktualizace |

## IP Activity

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/ips/{ip}/activity` | Timeline IP aktivity |
| GET | `/ips/{ip}/iocs` | Související IOCs |
| GET | `/ips/{ip}/attackers` | Související profily |

IP endpointy musí používat validaci IP adres a bezpečné query parametrizování.

## Attacker Profiles

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/attackers` | Seznam profilů |
| GET | `/attackers/{id}` | Detail profilu |
| GET | `/attackers/{id}/timeline` | Timeline |

## Threat Hunting

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/hunts/validate` | Validace query |
| POST | `/hunts/execute` | Spuštění hunt query |
| GET | `/hunts/history` | Historie huntů |
| GET | `/detections` | Detection rules |
| POST | `/detections` | Vytvoření rule |

Query execution musí být omezené na povolené datasource a query capabilities. Libovolný SQL execution proti produkční databázi není povolený.

## Tickets

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/tickets` | Seznam ticketů |
| POST | `/tickets` | Vytvoření ticketu |
| GET | `/tickets/{id}` | Detail |
| PATCH | `/tickets/{id}` | Aktualizace |
| POST | `/tickets/{id}/notes` | Investigation note |
| POST | `/tickets/{id}/transition` | Status transition |

## Audit

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/audit` | Audit search |
| GET | `/audit/{id}` | Audit detail |

Write endpoint pro běžného uživatele nebude existovat. Audit eventy vznikají interně během operací.

## AI

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/ai/triage` | Incident triage |
| POST | `/ai/correlate` | IOC/event correlation |
| POST | `/ai/draft-ticket` | Návrh ticketu |
| POST | `/ai/draft-report` | Návrh reportu |
| POST | `/ai/recommend` | Security recommendation |

AI endpointy vrací návrhy. Security-sensitive action musí projít human review.

## Reports

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/reports` | Seznam reportů |
| POST | `/reports` | Vytvoření reportu |
| GET | `/reports/{id}` | Detail reportu |
| GET | `/reports/{id}/export` | Export |

## Settings

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/settings` | Načtení settings |
| PATCH | `/settings` | Aktualizace settings |

Secrets a API keys se nesmí vracet do frontend response.

## Security requirements

Každý protected endpoint musí provést:

```text
authentication → authorization → validation → business rule → audit
```

Citlivé operace navíc:

```text
authentication → authorization → validation → security gate → approval → action → audit
```

API contract se bude při implementaci průběžně zpřesňovat podle skutečných domain modelů a frontend workflow.
