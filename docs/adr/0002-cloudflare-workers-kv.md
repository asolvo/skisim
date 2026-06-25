# ADR-0002: Lizenz-Backend auf Cloudflare Workers + KV

- **Status:** Akzeptiert
- **Datum:** 2026-06-24
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Bezug:** Folgt aus [ADR-0001](0001-signierte-lizenz-tokens.md)

## Kontext

Für die signierten Tokens (ADR-0001) wird ein kleiner Server-Endpoint benötigt,
der Schlüssel prüft und Tokens signiert, sowie ein Speicher für die Lizenz-
Datensätze. Rahmen: anfangs **max. 10 Nutzer**, **manuelle Schlüsselverwaltung**,
Kostenbewusstsein, möglichst wenig Betriebsaufwand und keine zweite
Anbieterbeziehung.

Speicher-Optionen abgewogen:
- **KV** (Key-Value): einfacher „Schlüssel → Wert"-Speicher. Passt 1:1 auf
  „Lizenz per Schlüssel nachschlagen".
- **D1** (SQLite serverless): relationale Abfragen — erst bei Reporting/Listen nötig.
- **Postgres** (Neon/Supabase): vollwertig, aber separater Anbieter + mehr Wartung.

## Entscheidung

Das Lizenz-Backend läuft als **Cloudflare Worker** mit **Workers KV** als Speicher.

- KV-Key: `SHA-256(lizenzschlüssel)` — der rohe Schlüssel wird nicht gespeichert.
- KV-Value (JSON): `{ name, tier, features[], validUntil, status }`.
- Der Worker setzt eigene CORS-Header → der Fremd-Proxy entfällt ersatzlos.
- **Schlüsselverwaltung manuell** per `wrangler` (KV-Eintrag pro Lizenz);
  Widerruf = `status: "revoked"`, Verlängerung = `validUntil` ändern.

## Konsequenzen

**Positiv**
- Endpoint **und** Speicher aus einer Hand; kein zweiter Anbieter/Login.
- Im **Free-Tier ~0 €/Monat** (100.000 Requests/Tag, KV gratis) — bei 10 Usern
  um Größenordnungen ausreichend, auch bei Wachstum auf einige hundert.
- KV-Lookup ist global schnell und denkbar einfach.

**Negativ / Risiken**
- Bindung an Cloudflare (Lock-in), bei diesem Umfang vertretbar.
- Manuelles Anlegen skaliert nur begrenzt — bewusst für die Startphase gewählt;
  ein Self-Service/Admin-Verfahren bliebe ein späterer, separater ADR.
- Cloudflare-Account muss vom Betreiber manuell angelegt werden (E-Mail-
  Verifizierung, nicht automatisierbar); danach `wrangler login` einmalig.

## Alternativen

- **Netlify/Vercel Functions:** möglich, aber DB extern nötig; Vercel-Hobby ist
  nicht für kommerzielle Nutzung freigegeben. Verworfen.
- **D1 / Postgres:** für 10 Datensätze ohne relationalen Bedarf Overkill. Verworfen.
