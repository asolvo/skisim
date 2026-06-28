# Architecture Decision Records (ADR) — Ski-Simulation

Dieser Ordner dokumentiert die wesentlichen Architekturentscheidungen für die
Lizenzierung der Ski-Simulation-App (`ski.mvp.105.html`).

Format: angelehnt an Michael Nygard / MADR. Eine Entscheidung pro Datei,
fortlaufend nummeriert. Status einmal getroffener ADRs wird nicht editiert —
geänderte Entscheidungen erhalten einen neuen ADR, der den alten *ersetzt*.

| Nr. | Titel | Status | Datum |
|-----|-------|--------|-------|
| [0001](0001-signierte-lizenz-tokens.md) | Signierte Lizenz-Tokens statt clientseitiger Sheet-Prüfung | Akzeptiert | 2026-06-24 |
| [0002](0002-cloudflare-workers-kv.md) | Lizenz-Backend auf Cloudflare Workers + KV | Akzeptiert | 2026-06-24 |
| [0003](0003-es256-signatur.md) | ES256 (ECDSA P-256) als Signaturverfahren | Akzeptiert | 2026-06-24 |
| [0004](0004-token-laufzeit-refresh.md) | 30-Tage-Token-Laufzeit mit /refresh für Widerruf | Akzeptiert | 2026-06-24 |
| [0005](0005-granulares-feature-gating.md) | Granulares Feature-Gating pro Lizenz | Akzeptiert | 2026-06-24 |
| [0006](0006-kv-datenmodell.md) | KV-Datenmodell: Zeiger + Datensatz (für /refresh) | Akzeptiert | 2026-06-25 |
| [0007](0007-auslieferung-github-pages.md) | Auslieferung via GitHub Pages (Entwicklung), später alpinesicherheit.com | Akzeptiert | 2026-06-25 |
| [0008](0008-single-file-versionierung.md) | Single-File-Versionierung mit Changelog-Kommentar | Akzeptiert | 2026-06-25 |
| [0009](0009-theme-system.md) | Theme-System (Hell / Dunkel / Auto), nur UI dunkel | Akzeptiert | 2026-06-25 |
| [0010](0010-mehrsprachigkeit-de-en.md) | Mehrsprachigkeit (Deutsch / English) per Laufzeit-i18n | Akzeptiert | 2026-06-25 |
| [0011](0011-in-app-dialoge-statt-prompt.md) | Eigene In-App-Dialoge statt nativer prompt() | Akzeptiert | 2026-06-25 |
| [0012](0012-gast-einschraenkungen.md) | Gast-Einschränkungen (Freemium-Gating) | Akzeptiert | 2026-06-25 |
| [0013](0013-geraete-eingabe-barrierefreiheit.md) | Geräte- & Eingabe-Unterstützung (Responsive, Touch, Tastatur, A11y) | Akzeptiert | 2026-06-25 |
| [0014](0014-farbschema-und-farbwaehler.md) | Farbschema (7 Farben, Pisten-Blau/-Rot) und kontextueller Farbwähler | Akzeptiert | 2026-06-25 |
| [0015](0015-objekt-grafiken.md) | Objekt-Grafiken: Top-Down-Stil und Überarbeitung | Akzeptiert | 2026-06-25 |

**Status der Umsetzung:** Umgesetzt & live — Cloudflare Worker deployed, 8 Lizenzen
aktiv, Client aktuell **v119** als `index.html` im Repo und via GitHub Pages online
(https://asolvo.github.io/skisim/). Seit v107: Anzeige des Lizenz-Enddatums (v108),
Gast-Gating & -Limit (v109/v110), In-App-Editor (v111), Objekt „Bemaßung" (v112),
Responsive/Touch & Tastatur/A11y (v113–v115), Settings-Popup mit Theme & Sprache
(v116), Farbschema & kontextueller Farbwähler (v117), Objekt-Grafiken überarbeitet
(v118/v119). Produktivauslieferung auf `alpinesicherheit.com` erfolgt später durch den Betreiber.
