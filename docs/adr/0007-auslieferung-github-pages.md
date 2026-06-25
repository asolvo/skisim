# ADR-0007: Auslieferung via GitHub Pages (Entwicklung), später alpinesicherheit.com

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)

## Kontext

Die App ist eine einzelne statische HTML-Datei. Während der Entwicklung soll sie
ohne eigenen Server online und teilbar sein; im Produktivbetrieb läuft sie unter
`alpinesicherheit.com`. Der Quellcode wird im öffentlichen Repo
`github.com/asolvo/skisim` verwaltet.

## Entscheidung

- **Single Source:** Das Repo `github.com/asolvo/skisim` ist die Quelle; die App
  wird als **`index.html`** ausgeliefert.
- **Entwicklung:** Auslieferung über **GitHub Pages** vom Branch `main`
  (`https://asolvo.github.io/skisim/`).
- **Produktiv:** Zu gegebener Zeit wird `index.html` auf `alpinesicherheit.com`
  hochgeladen (separater Webspace).
- Die **Worker-URL** ist fix im Client eingebettet und gilt für beide Hosts; das
  CORS des Workers steht auf `*`, funktioniert also von `asolvo.github.io` wie von
  `alpinesicherheit.com`.

## Konsequenzen

**Positiv**
- Kostenlose, sofort verfügbare Test-URL ohne eigene Infrastruktur.
- `https://localhost`/Pages ist ein **sicherer Kontext** → `crypto.subtle`
  (Signaturprüfung) funktioniert (anders als oft bei `file://`).

**Negativ / Risiken**
- **Öffentliches Repo:** Es dürfen **keine Geheimnisse/PII** hinein — privater
  Signaturschlüssel, Lizenzschlüssel-Liste und die Nutzer-CSV bleiben lokal bzw.
  `.gitignore`. (Im Repo liegt nur die App; siehe auch [ADR-0008](0008-single-file-versionierung.md).)
- Zwei Auslieferungsorte temporär parallel — gewollt für die Übergangsphase.

## Alternativen

- **Nur alpinesicherheit.com:** verworfen für die Entwicklungsphase (langsamere
  Iteration, kein schneller Test-Link).
- **Eigener Static-Host/CDN:** unnötiger Aufwand für eine statische Datei.
