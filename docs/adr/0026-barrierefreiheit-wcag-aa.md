# ADR-0026: Barrierefreiheit — Ziel WCAG 2.1 Level AA

- **Status:** Akzeptiert
- **Datum:** 2026-07-01
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** 2026.07.0015 (Level A), 2026.07.0016–0018 (Level AA)
- **Bezug:** [ADR-0013](0013-geraete-eingabe-barrierefreiheit.md) (Geräte/Eingabe),
  [ADR-0021](0021-material-design-3-ui.md) (Farbtokens)

## Kontext

Die App ist canvas-lastig — Canvas-Inhalte sind für Hilfstechnologie von Haus aus
unsichtbar, und ein globaler Tab-Handler kaperte die Fokus-Reihenfolge. Ein
Code-Audit ergab, dass **Level A nicht erreicht** war und mehrere AA-Kriterien
(Kontrast, Fokus) verletzt wurden. Zielkonformität: **WCAG 2.1 Level AA** (AAA
ist für ein Freihand-Zeichenwerkzeug nicht sinnvoll erreichbar).

## Entscheidung

**Level A:**
- Tab durchläuft Canvas-Objekte **nur, wenn die Zeichenfläche fokussiert ist**;
  sonst native Fokus-Reihenfolge (Toolbar/Dialoge). `Shift+Tab` und das
  Zyklus-Ende verlassen die Fläche garantiert (2.1.2/2.4.3).
- Dock-Objekte per Tastatur bedienbar (`role=button`, `tabindex`, Enter/Leertaste;
  gesperrte als `aria-disabled`) — vorher nur Maus/Touch (2.1.1).
- Canvas mit `role`/`aria-label`; `aria-live`-Statusmeldungen (hinzugefügt/
  entfernt/ausgewählt/Projekt geladen) (1.1.1/4.1.3).
- Dialog-Schließen als echte `<button>`; alle Dialoge per `Esc` schließbar.

**Level AA:**
- Alle Text/Hintergrund-Paare ≥ 4.5:1 (Legenden-Label, Versionsnummer,
  Vektor-Vorschau, Text-Links auf grauen Flächen via eigenem `--md-link`,
  Platzhalter, lizenziert-Grün via `--md-success`) (1.4.3).
- Eingabefeld-Rahmen und aktive Zustände ≥ 3:1 (`--md-outline` abgedunkelt)
  (1.4.11).
- Durchgängig sichtbarer `:focus-visible`-Ring auf allen Bedienelementen; native
  Controls behalten zusätzlich den UA-Fokusring (2.4.7).

Kontrastwerte werden mit einem Rechenskript geprüft, nicht nur visuell geschätzt.

## Konsequenzen

**Positiv**
- Tastatur- und Screenreader-Bedienung möglich; verlässliche Kontraste in Hell
  und Dunkel.

**Negativ / Risiken**
- Kein zertifizierter Fremd-Audit — „AA nach bestem Wissen per Code-Review".
- Neue interaktive Elemente/Farben müssen die Muster (Fokus, ≥4.5:1/≥3:1,
  aria-Zustände) einhalten, sonst droht Regression.

## Alternativen

- **Nur Level A:** verworfen — AA ist für ein professionelles Werkzeug angemessen.
- **Volles AAA:** verworfen — eine vollständige Textalternative für beliebige
  Freihand-Skizzen ist nicht sinnvoll leistbar.
