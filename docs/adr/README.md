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
| [0016](0016-vform-konstante-linienbreite.md) | V-Form mit skalier-invarianter Linienbreite | Akzeptiert | 2026-06-29 |
| [0017](0017-einfaerbbare-figuren-skimode-palette.md) | Einfärbbare Personen-Figuren mit separater Skimode-Palette | Akzeptiert | 2026-06-29 |
| [0018](0018-settings-connected-button-groups.md) | Settings-Auswahl als Connected Button Groups (Material Design 3) | Akzeptiert | 2026-06-29 |
| [0019](0019-dock-rueckkehr-urspruengliche-position.md) | Rückkehr gelöschter Objekte an die ursprüngliche Dock-Position | Akzeptiert | 2026-06-29 |
| [0020](0020-eisblau-standardfarbe-figuren.md) | Eisblau als einheitliche Standardfarbe aller Personen-Figuren (verfeinert 0017) | Akzeptiert | 2026-06-29 |
| [0021](0021-material-design-3-ui.md) | UI im Material Design 3 mit tonalem Token-Farbsystem | Akzeptiert | 2026-06-29 |
| [0022](0022-import-validierung.md) | Validierung importierter Projektdateien (Sicherheit, CWE-20/502) | Akzeptiert | 2026-06-29 |
| [0023](0023-schild-konfigurierbar.md) | Schild als konfigurierbares Objekt (Form + editierbare Beschriftung) | Akzeptiert | 2026-06-29 |
| [0024](0024-szenario-metadaten-legende.md) | Szenario-Metadaten (UTM/WGS84, Exposition, Neigung …) und Legende auf der Zeichenfläche | Akzeptiert | 2026-06-29 |
| [0025](0025-versionsschema-jahr-monat-nummer.md) | Versionsschema JJJJ.MM.NNNN mit monatlichem Reset (verfeinert 0008) | Akzeptiert | 2026-07-01 |
| [0026](0026-barrierefreiheit-wcag-aa.md) | Barrierefreiheit — Ziel WCAG 2.1 Level AA | Akzeptiert | 2026-07-01 |
| [0027](0027-datei-ausgabe-und-namensschema.md) | Datei-Ausgabe via File System Access API + Dateinamens-Schema | Akzeptiert | 2026-07-02 |

**Status der Umsetzung:** Umgesetzt & live — Cloudflare Worker deployed, 8 Lizenzen
aktiv, Client aktuell **2026.07.0019** als `index.html` im Repo und via GitHub Pages online
(https://asolvo.github.io/skisim/). Seit v107: Anzeige des Lizenz-Enddatums (v108),
Gast-Gating & -Limit (v109/v110), In-App-Editor (v111), Objekt „Bemaßung" (v112),
Responsive/Touch & Tastatur/A11y (v113–v115), Settings-Popup mit Theme & Sprache
(v116), Farbschema & kontextueller Farbwähler (v117), Objekt-Grafiken überarbeitet
(v118/v119), V-Form mit konstanter Linienbreite (v120), einfärbbare Personen-Figuren
mit separater Skimode-Palette (v121), Hilfetext-Korrektur (v122), Settings-Auswahl
als Connected Button Groups (v123), Bugfixes Snowboarder-Rotation & Drag-Vorschau
Text/Vektor (v124), Farbnamen-Tooltips (v125), Dock-Rückkehr an die ursprüngliche
Position (v126), Eisblau als einheitliche Standardfarbe aller Figuren (v126/v127),
UI-Überarbeitung im Material Design 3 (v128), MD3-Feinschliff & Warnschild-Gelb
(v129), Rodler-Grafik gedreht (v130), Box-Drag-Vorschau (v131), Security-Fix
Import-Validierung (v132), Typografie/Link-Stil an alpinesicherheit.com angeglichen
(v133/v134), Schild konfigurierbar mit Formen & editierbarer Beschriftung inkl. Raute
(v135–v137), Szenario-Metadaten & Canvas-Legende (v138/v139), Versionsschema auf
JJJJ.MM.NNNN umgestellt (2026.07.0011), diverse Legenden-/Layout-Feinschliffe
(2026.07.0012–0014), Barrierefreiheit WCAG 2.1 Level A und AA (2026.07.0015–0018),
Datei-Ausgabe mit Ordnerwahl & sprechenden Dateinamen (2026.07.0019).
Produktivauslieferung auf `alpinesicherheit.com` erfolgt später durch den Betreiber.
