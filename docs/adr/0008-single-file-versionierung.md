# ADR-0008: Single-File-Versionierung mit Changelog-Kommentar

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)

## Kontext

Die App ist eine einzelne, in sich geschlossene HTML-Datei (HTML + CSS + JS +
SVG-Assets inline). Größere Umbauten (z. B. Entfernung des alten Logins, dann
Neubau der Lizenzierung) sollen nachvollziehbar und einzeln rückrollbar sein.

## Entscheidung

- **Versionierte Arbeitsstände:** Jede Iteration wird als `ski.mvp.NNN.html`
  gespeichert (lokal als Historie). Schritte werden bewusst getrennt
  (Beispiel: v106 = Entfernung des Alt-Codes, v107 = neue Lizenzierung).
- **Auslieferung:** Die jeweils aktuelle Version wird als **`index.html`**
  ausgeliefert (siehe [ADR-0007](0007-auslieferung-github-pages.md)).
- **Changelog-Kommentar:** Am Anfang jeder HTML-Datei steht ein Kommentarblock,
  der Version, Datum und die wichtigsten Änderungen gegenüber der Vorversion
  beschreibt (Was + Warum).
- **Im Repo** liegt nur `index.html`; die `ski.mvp.NNN.html` sind lokale Historie.

## Konsequenzen

**Positiv**
- Klare, menschenlesbare Änderungshistorie direkt in der Datei — auch ohne Diff-Tool.
- Schneller Rollback durch Zurückgreifen auf eine ältere `ski.mvp.NNN.html`.
- Saubere Trennung von „Entfernen" und „Neubauen" reduziert Fehlerquellen.

**Negativ / Risiken**
- Erfordert Disziplin, den Changelog-Kommentar bei jeder Version zu pflegen.
- Lokale Versionsdateien und Git-Historie überschneiden sich teilweise (bewusst:
  die Datei-Kommentare sind die für Nicht-Entwickler lesbare Ebene).
