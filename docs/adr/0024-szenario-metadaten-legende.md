# ADR-0024: Szenario-Metadaten und Legende auf der Zeichenfläche

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v138, v139
- **Bezug:** [ADR-0008](0008-single-file-versionierung.md) (Projekt-JSON),
  [ADR-0022](0022-import-validierung.md) (Import-Validierung)

## Kontext

Eine Unfallskizze braucht für ein Gutachten Kontext-Metadaten zum Ort:
Ortsbezeichnung, Koordinaten, Exposition (Hangrichtung), Neigung, Querneigung und
eine freie Beschreibung. Bisher gab es dafür kein Feld — die Angaben mussten
extern gepflegt werden.

## Entscheidung

Ein eigener **Szenario-Dialog** (Toolbar-Button mit Karten-Pin) erfasst die
Metadaten im Modell `sceneMeta`:

- **Ortsbezeichnung** (frei).
- **Koordinaten** wahlweise **UTM** (Zone/Rechtswert/Hochwert) oder **WGS84**
  (Breite/Länge in Dezimalgrad), per Umschalter; Dezimaltrenner „." und „,"
  werden toleriert.
- **Exposition** über einen **klickbaren Kompass-Kreis** (N oben, O rechts, S
  unten, W links) und/oder ein Gradfeld (wechselseitig verknüpft).
- **Neigung** und **Querneigung** in Grad, **Beschreibung** als Textfeld.

Dargestellt wird alles als **Legendenblock auf der Zeichenfläche** (unten links,
mit Icons je Zeile, Kompass-Vorschau für die Exposition und Dreieck-Vorschau für
die Neigung). Leere Felder werden weggelassen. Der Block ist **im PNG-Export
enthalten** (auf dem Canvas gezeichnet), **doppelklick-/tap-bar** (öffnet den
Dialog) und weicht auf schmalen Bildschirmen dem unteren Dock automatisch aus.
Die Metadaten werden in der **Projekt-JSON** (`state.scene`) gespeichert und beim
Import validiert (`sanitizeScene`).

## Konsequenzen

**Positiv**
- Vollständiger, gutachtentauglicher Kontext direkt in der Skizze und im Export;
  reproduzierbar über Speichern/Laden.

**Negativ / Risiken**
- Der Legenden-Block wird prozedural auf dem Canvas gezeichnet (Layout in Code) —
  Änderungen an Feldern/Icons erfordern Anpassung der Zeichenroutine.
- Der Kompass ist zeigergesteuert; als Tastatur-Äquivalent dient das Gradfeld.

## Alternativen

- **Metadaten nur als HTML-Overlay:** verworfen — wären nicht im PNG-Export.
- **Nur UTM oder nur WGS84:** verworfen — beide Systeme kommen in der Praxis vor.
