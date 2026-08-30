# RabbitHollow — Deception Intelligence Platform

RabbitHollow je dashboard pro monitoring a řízení deception infrastruktury. Projekt kombinuje honeypoty, honeynet, threat hunting, IOC intelligence, attacker profiling, audit, security guardrails a AI-assisted workflows v jednom rozhraní.

## Přehled

Aplikace je postavená jako single-page frontend s tmavým security-oriented UI. Data a některé operace jsou v aktuální verzi simulované (mock), aby bylo možné celý workflow provozovat bez přístupu k produkční infrastruktuře.

Hlavní části aplikace:

- Dashboard — přehled aktivních honeypotů, zachycených intrusion, attacker IPs, IOCs, risk indexu, MITRE ATT&CK coverage a live event feedu
- Honeypot Builder — konfigurace a deployment deception nodes pro SSH, FTP, MySQL, HTTP, RDP, SMB, SMTP, Modbus a Kubernetes
- Honeynet Designer — network topology, VLAN/subnet konfigurace, segment roles a isolation controls
- Breadcrumb Trails — vytváření lure trails, canarytokenů a sledování jejich aktivace
- Threat Hunting — SPL, KQL, Sigma a SQL query workflow, detection rules a MITRE ATT&CK coverage
- IOC Intelligence — vyhledávání a filtrování IP adres, domén, hashů, URL a dalších indicators of compromise
- Attacker Profiles — behavioral fingerprints vytvořené z honeypot sessions
- AI Cyber Agent — mock LLM workflows pro incident triage, IOC correlation, ticket drafting, reporting a containment advice
- Auto Reports — generování threat reportů a opt-in výběr anonymizovaných dat pro AI training
- IP Activity Tracker — korelace aktivity podle IP adres a časová osa událostí
- Asset Management — evidence zařízení a jejich technických informací
- Security Ticketing — incident tickets, investigation notes a změna stavu ticketů
- Security & Guardrails — STRIDE-aligned threat model, isolation guarantees, honeytoken policy, deployment gates a RBAC
- Audit Log — append-only event stream, integrity status a compliance mapping
- Settings — alerting, threat intelligence feeds, API keys a license configuration

## Bezpečnostní model

Deception prostředí je v návrhu oddělené od produkční infrastruktury. Projekt počítá s network isolation, deny-by-default egress, namespace/cgroup isolation, syntetickými credentials a DNS sinkholingem.

High-risk deception nodes (RDP, SMB, Industrial a Kubernetes) vyžadují dual-control approval. AI workflow pracuje pouze se syntetickými daty a v mock režimu nemá shell, deployment ani firewall access.

Honeytokeny jsou navržené jako syntetické a sledovatelné. Produkční credentials a reálné PII nemají být součástí lure dat.

## UI a interakce

Rozhraní používá Space Grotesk pro UI a JetBrains Mono pro technická data. Hlavní vizuální systém používá tmavé vrstvy, fialový accent a barevné stavy pro danger, warning, success a informational data.

Součástí UI jsou například:

- live event feed
- animated threat ticker
- risk gauge
- MITRE ATT&CK matrix
- honeynet canvas topology
- global attacker-origin map
- terminal-style configuration previews
- animated stat cards
- command palette
- keyboard shortcuts
- toast notifications

Navigace podporuje command palette přes `Ctrl+K` / `⌘K`, číselné keyboard shortcuts a globální akce.

## Aktuální stav

Současná verze je frontendový prototype. Deployment, threat feeds, SIEM integrace, API calls, firewall actions a LLM operace jsou v UI reprezentované jako mock workflows nebo advisory actions.

Další vývoj bude směřovat k oddělení frontendu od backendu a postupnému napojení skutečných datových zdrojů při zachování současného UI a jeho chování.
