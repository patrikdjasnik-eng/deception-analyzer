# MVP Plan

Tento plán vychází přímo z aktuálního RabbitHollow frontend prototypu `rabbithollow-v3_4.html`. Cílem není vytvořit nový produkt, ale převést existující UI a jeho workflow na skutečně fungující aplikaci.

## Cíl MVP

MVP musí zachovat současný vzhled, navigaci a hlavní workflow aplikace. Mock data a mock actions budou postupně nahrazeny skutečným backendem, databází a API.

První verze musí umožnit:

- přihlášení a RBAC
- dashboard s reálnými security events
- správu honeypotů a honeynet konfigurace
- ukládání a vyhledávání IOC
- sledování IP activity
- threat hunting nad uloženými eventy
- attacker profiles
- security tickets a investigation notes
- audit logging
- security gates před deploymentem
- AI asistenci pouze jako controlled workflow s human review
- základní threat reporting

## Fáze 1 — Základ aplikace

- převést frontend do React + TypeScript + Vite
- zachovat současné UI 1:1
- rozdělit jednotlivé views na samostatné components
- zavést společný type systém
- odstranit inline mock logiku tam, kde bude nahrazena API vrstvou
- připravit routing a application state
- připravit error handling
- přidat základní test setup

Výsledek: frontend běží jako čistá aplikace bez změny vizuálního konceptu původního HTML.

## Fáze 2 — Backend a databáze

- vytvořit FastAPI backend
- přidat PostgreSQL přes Prisma
- připravit migrations a seed data
- vytvořit modely pro users, roles, assets, honeypots, honeynet nodes, events, IOCs, attacker profiles, tickets a audit events
- vytvořit REST API
- zavést validaci requestů a response schemas
- přidat základní logging a error handling

Výsledek: frontend už není závislý na lokálních mock datech.

## Fáze 3 — Authentication a RBAC

- login flow
- session/token management
- role-based permissions
- ochrana API endpointů
- permission checks také ve frontendu
- auditování citlivých akcí

Role a oprávnění musí odpovídat bezpečnostnímu modelu původního UI.

## Fáze 4 — Deception Management

### Honeypot Builder

Z původního builderu převést:

- node name
- IP a port
- service type
- banner
- konfiguraci node
- deployment workflow
- security validation

High-risk typy jako RDP, SMB, Industrial a Kubernetes musí před deploymentem vyžadovat dual-control approval.

### Honeynet Designer

- nodes
- network segments
- VLAN/subnet informace
- isolation status
- topology data
- základní validation pravidla

V MVP bude skutečný deployment oddělený od UI. Nejprve musí existovat bezpečná backendová reprezentace konfigurace a validační workflow.

## Fáze 5 — Detection a Intelligence

### Threat Hunting

- ukládání query
- SPL/KQL/Sigma/SQL workflow
- query validation
- execution nad dostupnými daty
- výsledky a historie huntů
- základní detection rules

### IOC Intelligence

- IP
- domain
- hash
- URL
- IOC type
- severity/risk
- source
- timestamps
- search a filtering

### IP Activity Tracker

- IP detail
- event timeline
- honeypot correlation
- filtrování podle času
- vazba na IOC a attacker profile

## Fáze 6 — Attacker Profiles

Z existujícího behavioral fingerprint workflow vytvořit persistentní profily:

- attacker identifier
- IP history
- observed services
- sessions
- techniques
- related IOCs
- risk score
- timeline

Profil nesmí být založen pouze na IP adrese. IP je pouze jeden z korelačních atributů.

## Fáze 7 — Ticketing a Investigation

- create ticket
- ticket detail
- severity
- status
- assigned analyst
- investigation notes
- related IP/IOC/asset
- audit trail
- status transitions

AI může ticket pouze připravit nebo doporučit další postup. Automatické containment akce nejsou součástí prvního MVP.

## Fáze 8 — Security & Guardrails

Převést bezpečnostní koncept z prototypu do skutečných backendových kontrol:

- RBAC
- deployment validation
- isolation checks
- deny-by-default policy
- synthetic credentials
- honeytoken policy
- dual control
- audit integrity

Bezpečnostní gate musí být proveden server-side. Frontend nesmí být jedinou bezpečnostní kontrolou.

## Fáze 9 — Audit Log

Každá důležitá změna musí vytvořit audit event.

Audit event bude obsahovat minimálně:

- timestamp
- actor
- action
- resource
- result
- metadata
- correlation ID

Audit log musí být append-only z pohledu běžného uživatele.

## Fáze 10 — AI Cyber Agent

AI vrstva naváže na workflow, které už existuje v prototypu:

- incident triage
- IOC correlation
- ticket drafting
- report assistance
- containment advice

AI nebude mít v MVP přímý shell, firewall ani production deployment access.

AI výstupy musí být označené jako doporučení a citlivé akce musí vyžadovat human approval.

## Fáze 11 — Reports

- 24h threat summary
- incident summary
- IOC summary
- attacker activity
- basic export

Reporting bude nejprve generovat data z interní databáze. Exportní formáty a externí integrace lze rozšířit později.

## Fáze 12 — Settings

Zprovoznit pouze nastavení potřebná pro MVP:

- alert configuration
- threat intelligence sources
- API configuration
- user/session settings

Secrets nebudou ukládány do frontendu ani Git repozitáře.

## Co není v prvním MVP

Do prvního MVP nepatří plnohodnotný production deployment deception infrastruktury, automatické firewall containment akce, přímý AI shell access, rozsáhlé SIEM integrace, multi-cloud orchestrace ani komplexní billing/licensing systém.

Tyto části mohou být připraveny architektonicky, ale jejich implementace přijde až po stabilizaci základního produktu.

## Definition of Done

MVP je hotové, když:

- aplikace běží jako React/TypeScript frontend a FastAPI backend
- data jsou persistentně uložená v PostgreSQL
- uživatelé mají funkční authentication a RBAC
- hlavní views z původního HTML jsou dostupné
- mock data nejsou potřeba pro základní workflow
- honeypot configuration lze vytvořit a validovat
- IOC a event data lze ukládat, vyhledávat a filtrovat
- IP activity je korelovaná s eventy
- tickets lze vytvořit a spravovat
- důležité akce jsou auditované
- security gates fungují server-side
- AI workflow vyžaduje human review
- původní vizuální koncept zůstává zachovaný
- aplikace funguje na mobilu i desktopu včetně 1920×1080
- existují unit a integrační testy pro kritickou logiku
