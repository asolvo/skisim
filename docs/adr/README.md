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

**Status der Umsetzung:** Umgesetzt & live — Cloudflare Worker deployed, 8 Lizenzen
aktiv, Client **v107** als `index.html` im Repo und via GitHub Pages online
(https://asolvo.github.io/skisim/). Produktivauslieferung auf
`alpinesicherheit.com` erfolgt später durch den Betreiber.
