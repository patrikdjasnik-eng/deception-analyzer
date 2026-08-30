# RabbitHollow MVP — stav projektu

Aktualizováno: 30. 8. 2026

Tento soubor je checkpoint pro pokračování vývoje. Referenční UI zůstává v `reference/rabbithollow-v3_4.html` a slouží jako zdroj pravdy pro požadavek 1:1.

## Aktuální checkpoint

Poslední implementační bod: rozšíření pracovních obrazovek dashboardu.

Poslední commit:
`66e3b7c47f97dff7c8464b0bd56adb807ba26bfe`

Předchozí významný UI checkpoint:
`a6f10daabab989dc649a3e2117bd9955fe0e6284`

## Hotové části

- [x] Referenční HTML uloženo v `reference/rabbithollow-v3_4.html`
- [x] Základ RabbitHollow design systému
- [x] Dark UI, purple accent, glow efekty a základní design tokeny
- [x] Typography založená na Space Grotesk a JetBrains Mono
- [x] React frontend základ
- [x] FastAPI backend základ
- [x] LLM service pro lokální OpenAI-compatible llama-server
- [x] LLM health check
- [x] Chat request flow
- [x] Streaming chat flow
- [x] Základní error handling LLM služby
- [x] LLM policy pro omezení počtu a délky zpráv
- [x] Testy LLM policy
- [x] RabbitHollow shell
- [x] 64px rail
- [x] 220px sidebar
- [x] 52px topbar
- [x] Security Overview dashboard základ
- [x] Dashboard metriky a live activity základ
- [x] Responsive základ pro menší obrazovky
- [x] Navigační pracovní obrazovky
- [x] Threats workspace základ
- [x] Deception workspace základ
- [x] Network workspace základ
- [x] Telemetry workspace základ
- [x] Reports workspace základ
- [x] Settings workspace základ
- [x] AI Analyst workspace základ
- [x] Přímý vstup z AI Analyst workspace do chatu

## Co je potřeba dokončit pro MVP

### UI 1:1

- [ ] Detailně porovnat React UI s referenčním HTML
- [ ] Dokončit všechny panely, karty, tabulky, grafy a stavové prvky z reference
- [ ] Přenést existující animace a mikrointerakce
- [ ] Dokončit responsive chování pro mobil a desktop včetně 1920×1080
- [ ] Odstranit všechny dočasné vizuální/mock části
- [ ] Ověřit všechny navigační stavy

### Dashboard funkce

- [ ] Napojit Threats na skutečná data backendu
- [ ] Napojit Deception na skutečná data
- [ ] Napojit Network na skutečná data
- [ ] Napojit Telemetry na skutečná data
- [ ] Napojit Reports na skutečná data
- [ ] Dokončit Settings
- [ ] Dokončit Overview podle skutečné reference

### AI / LLM

- [ ] Kompletně napojit chat UI na FastAPI streaming endpoint
- [ ] Ověřit Qwen 2.5 Coder 7B jako výchozí lokální model
- [ ] Připravit bezpečné přepnutí na lokálně ověřený 14B model
- [ ] Dokončit kontext a historii konverzace
- [ ] Doplnit rate limiting a další ochrany API
- [ ] Připravit auditní vrstvu pro budoucího agenta

### Testy a spuštění

- [ ] Spustit frontend test/build kontrolu
- [ ] Spustit backend testy
- [ ] Otestovat streaming end-to-end
- [ ] Otestovat chat flow proti lokálnímu llama-serveru
- [ ] Ověřit health endpointy
- [ ] Připravit jednoduché lokální spuštění MVP na Windows PC
- [ ] Ověřit produkční frontend build
- [ ] Ověřit čistý GitHub Actions stav na aktuálním HEAD

## Budoucí fáze po MVP

- [ ] Agent orchestration layer
- [ ] Sandbox pro agent tools
- [ ] Docker kontejnery pro obranné cybersecurity nástroje
- [ ] Řízený terminal přístup pouze přes bezpečnostní vrstvu
- [ ] Allowlist nástrojů a příkazů
- [ ] Timeouty a resource limity
- [ ] Audit log všech akcí agenta
- [ ] Autonomní vyhodnocování bezpečnostní situace
- [ ] Řízená automatická reakce na detekovaná rizika
- [ ] Pravidelné bezpečnostní reporty
- [ ] Notifikace uživatelům
- [ ] Pokročilé využití 14B modelu vedle 7B

## Pravidla pokračování

1. Referenční HTML je zdroj pravdy pro UI.
2. Nezjednodušovat UI jen kvůli rychlejšímu MVP. ( pro AI ) 
3. Do produkční logiky nedávat smyšlené IP adresy, tokeny, credentials ani jiné konkrétní hodnoty. Pokud jsou potřeba, vyžádat si je od uživatele s vysvětlením, jak je získat a proč jsou potřeba.
4. Kód držet čistý a technickou dokumentaci nepřehánět.
5. Komentáře v kódu psát česky; běžné technické termíny, které se standardně používají anglicky, ponechat anglicky. ( vzkaz pro AI xD ) 
6. Commit messages psát česky a podle kontextu používat vhodné emoji. ( vzkaz pro AI )
7. Každou významnou změnu commitovat samostatně a uživateli předat odkaz na konkrétní commit. ( vzkaz pro AI )
8. Před další větší změnou preferovat test nebo ověření aktuálního stavu, pokud je dostupné.

## Stav při pauze

Projekt je ve fázi aktivního převodu referenčního HTML do React aplikace. Shell a základní pracovní obrazovky už existují, ale jejich obsah je zatím částečně demonstrační. LLM backend má základní komunikaci a policy vrstvu, ale finální end-to-end integrace s kompletním UI ještě není uzavřená.

Nejbližší správný krok po návratu k projektu: pokračovat v detailním 1:1 převodu dashboardů z `reference/rabbithollow-v3_4.html`, současně napojovat existující backendová data a následně provést end-to-end test lokálního LLM chatu.
