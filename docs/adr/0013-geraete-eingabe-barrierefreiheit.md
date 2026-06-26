# ADR-0013: Geräte- & Eingabe-Unterstützung (Responsive, Touch, Tastatur, A11y)

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v113, v114, v115

## Kontext

Die App soll auf Smartphone, Tablet, Laptop und Desktop sehr gut funktionieren und
**vollständig per Tastatur, Maus oder Touch** bedienbar sein.

## Entscheidung

- **Responsiv:** Media-Query ≤ 760px → kompaktes, eingeklapptes Info-Panel und
  Toolbar ohne Überlappung; Objekt-Dock als scrollbare Leiste. Querformat/kurze
  Höhe blendet das Panel nicht mehr aus (Inhalt scrollt).
- **Touch:** Dock per Touch scrollbar, Objekt per Tap hinzufügen; `touch-action:
  none` liegt **nur auf dem Canvas** (nicht auf `body`), damit Seite/UI weiterhin
  scroll- und zoombar bleiben.
- **Barrierefreiheit:** `user-scalable=no` entfernt → Pinch-Zoom der Seite erlaubt.
- **Tastatur (vollständig bedienbar):** Verschieben (Pfeile), Drehen
  layoutunabhängig (`,` / `.`, zusätzlich ö/ä), Zoom (`+` / `-`), Hinzufügen/
  Duplizieren (`Einfg`), Löschen (`Entf`), Bearbeiten (`Enter`), Farbe (`c`),
  Durchschalten (`Tab`), Dialoge schließen (`Esc`).

## Konsequenzen

**Positiv**
- Auf allen Zielgeräten und mit allen Eingabearten nutzbar.

**Negativ / Risiken**
- Neue UI-Elemente müssen Layout (mobil), Touch-Verhalten und Tastaturzugang
  berücksichtigen.

## Alternativen

- **Nur Desktop/Maus:** verworfen — Feldeinsatz vorrangig auf Tablets/Smartphones.
- **Separate mobile App:** verworfen — Aufwand; widerspricht dem
  Single-File-Prinzip ([ADR-0008](0008-single-file-versionierung.md)).
