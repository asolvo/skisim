# ADR-0031: Installierbare PWA + echtes Offline (Font-Inlining, versions-gekoppelter Service Worker)

- **Status:** Akzeptiert
- **Datum:** 2026-07-28
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** 2026.07.0037 (Release folgt)
- **Bezug:** [ADR-0004](0004-token-laufzeit-refresh.md) (30 Tage offline),
  [ADR-0007](0007-auslieferung-github-pages.md) (GitHub Pages),
  [ADR-0008](0008-single-file-versionierung.md) (Single-File)

## Kontext

Die App verspricht 30 Tage Offline-Nutzung (ADR-0004), lud die Schriften bisher
aber von Google Fonts über das Netz — ohne Verbindung fehlten die Schriften. Das
Offline-Versprechen war also nur teilweise eingelöst. Zusätzlich der Wunsch, die
App **installierbar** anzubieten (eigenes Icon, eigenständiges Fenster,
Start-Menü/Dock), ohne die bewährte Auslieferung als eine Datei über GitHub Pages
und die Doppelklick-Fähigkeit der versionierten Schnappschüsse (ADR-0008)
aufzugeben.

Native Wrapper (Tauri/Electron) wurden erwogen, aber verworfen: Code-Signing und
plattformspezifische Buildpipelines passen nicht zur Admin-freien Umgebung, und
der Wrapper würde dieselbe Webview rendern — geringer Zusatznutzen bei hohen
laufenden Kosten. Eine PWA liefert die zwei realen Gewinne (installierbar + echtes
Offline) additiv und signierungsfrei.

## Entscheidung

- **Schriften inline (base64):** Nur die tatsächlich genutzten Schnitte
  (Roboto 400/500/700, Roboto Serif 600), jeweils **latin-Subset** (deckt Deutsch
  inkl. Umlaute/ß und Englisch ab), als `@font-face` mit `data:`-URLs direkt in
  `index.html`. Damit ist die App in **einer** Datei komplett offline — auch als
  `file://`. Die Google-Fonts-`<link>`s entfallen. Roboto Mono (nie geladen) und
  Canvas-Fettschrift (Arial) nutzen weiterhin Systemschriften.
- **Web-App-Manifest** (`manifest.json`) mit **relativen** `start_url`/`scope`
  (`./`), damit es im GitHub-Pages-Unterpfad `/skisim/` greift; `display:
  standalone`, `theme_color` in Marken-Teal.
- **Icon:** Das asi-Bildzeichen (Berge + Sonne, ohne Schriftzug) als Vektor
  rekonstruiert (`icon.svg`) und zu `icon-192/512.png` (`purpose: any maskable`),
  `apple-touch-icon.png` und `favicon-32.png` gerastert.
- **Service Worker** (`sw.js`) mit versions-gekoppeltem `CACHE`
  (`skisim-<version>`): App-Shell cachen; **HTML network-first mit Cache-Fallback**
  (frische Version online, offline aus dem Cache), übrige eigene Assets
  cache-first. Es werden **nur same-origin-GET**-Anfragen behandelt — die
  Lizenz-API (cross-origin, Cloudflare Worker) und der MCP-WebSocket bleiben
  unberührt. Registrierung nur bei Unterstützung **und nicht** unter `file://`.
- **`tools/release.js`** zieht den `CACHE`-Marker in `sw.js` bei jedem Release mit
  (sonst liefert der SW nach einem Deploy die alte, gecachte Version aus).
- **ADR-0008 bleibt gewahrt:** `index.html` läuft weiter allein; Manifest/SW/Icons
  sind hosting-only und laufen beim `file://`-Öffnen harmlos ins Leere. Die
  versionierten `ski.mvp.*.html`-Schnappschüsse bleiben Einzeldatei-tauglich.

## Konsequenzen

**Positiv**
- Echtes Offline (Schriften inline) — löst das Versprechen aus ADR-0004 ein.
- Installierbar mit eigenem Icon und eigenständigem Fenster; Auto-Update beim
  nächsten Online-Start, ohne Store/Signierung.
- Distribution bleibt „ein Link / eine Datei"; keine neue Laufzeit-Abhängigkeit.

**Negativ / Risiken**
- `index.html` wächst um ~205 KB (base64-Schriften): ~226 KB → ~437 KB. Über
  GitHub Pages gzip-komprimiert; für ein Fachwerkzeug vertretbar.
- Der Service Worker bringt eine **Cache-Korrektheits-Pflicht** mit; sie ist über
  die Versionskopplung in `release.js` abgesichert (bei Handhabung außerhalb des
  Skripts droht Stale-Cache).
- Das Icon ist aus den vorliegenden Rastervorlagen **neu als Vektor
  nachgebaut**, kein Original-Vektor der Marke — bei Bedarf durch offizielles
  Logo ersetzbar.

## Alternativen

- **Separate `woff2`-Dateien statt Inline:** schlankere `index.html`, aber
  zusätzliche Dateien und kein `file://`-Offline ohne Server — verworfen zugunsten
  der Single-File-Treue (ADR-0008).
- **Google Fonts nur per SW cachen:** am wenigsten Aufwand, aber nicht
  `file://`-offline und fragiler (abhängig vom ersten Online-Laden) — verworfen.
- **Native Wrapper (Tauri/Electron):** höhere OS-Integration (Dateiverknüpfung,
  native Dialoge), aber Code-Signing/Buildpipeline/Admin-Rechte nötig — für später
  zurückgestellt, nur bei konkretem Bedarf (z. B. `.skisim`-Doppelklick).
