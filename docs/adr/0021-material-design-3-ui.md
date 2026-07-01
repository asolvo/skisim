# ADR-0021: UI im Material Design 3 mit tonalem Token-Farbsystem

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v128
- **Baut auf:** [ADR-0009](0009-theme-system.md) (Theme), [ADR-0014](0014-farbschema-und-farbwaehler.md) (Objekt-Farben), [ADR-0018](0018-settings-connected-button-groups.md) (Button Groups)

## Kontext

Die Oberfläche war über viele Versionen organisch gewachsen: ad-hoc-Farben,
harte Schlagschatten, gemischte Schriften (Open Sans/Roboto), Emoji-Icons in der
Toolbar und eine umfangreiche, fehleranfällige `body.theme-dark .X { … }`-Kaskade
(eine Override-Regel je Element). Gewünscht war eine konsistente Überarbeitung im
**Google Material Design 3** („Material You").

Randbedingungen: Single-File-HTML, strenge CSP, kein Build — also **kein**
Material-Web-Framework. MD3 wird mit eigenen CSS-Tokens nachgebildet.

## Entscheidung

**Tonales Token-Farbsystem** als Grundlage. CSS-Custom-Properties auf `:root`
(Light) und `body.theme-dark` (Dark): `--md-primary` (+ `-hover`, `-container`,
`-on-…`), `--md-surface`, abgestufte `--md-surface-container[-low|-high|-highest]`,
`--md-on-surface[-variant]`, `--md-outline[-variant]`, `--md-error` und Elevation
(`--md-elev-1..3`). **Primärfarbe bleibt das bestehende Teal** (`#007C89` hell /
`#4FD8E0` dunkel) — bewusst nicht MD3-Lila, und mit Abstand zu den Objektfarben
Blau/Rot.

**Dark Mode nur noch über Token-Overrides:** Alle Komponenten lesen Tokens; die
früheren per-Element-Dark-Regeln entfallen vollständig. Die **Zeichenfläche
bleibt in beiden Modi weiß** (gemäß ADR-0009).

**Komponenten:**
- **Toolbar:** runde *filled-tonal* Icon-Buttons (Teal-Container). Icons als
  Inline-SVG statt Emoji; **Speichern = Download-Icon** (keine Diskette),
  Export = Bild, Import = Ordner, Teilen = Share.
- **Hilfe-Panel & Dialoge:** MD3-Karten/-Dialoge (Flächen `surface-container*`,
  Radien 20 px Karte / 28 px Dialog, tonale statt harter Schatten). Die
  **Tastaturkürzel bleiben** vollständig in der Hilfe-Karte (mit Badge-Stil).
- **Dock:** Navigation-Rail-Anmutung; Kacheln mit Radius 16 px, Hover-/Aktiv-
  Zustand (aktiv = Primary-Container).
- **Farbleiste:** Pill-Card mit runden Chip-Swatches; aktiver Swatch mit Teal-Ring.
- **Buttons:** Filled (Primäraktion) und Text-Button (Abbrechen); Connected Button
  Groups (ADR-0018) bleiben.
- **Typografie:** Sentence case. *(Nachtrag v133: an das Website-Theme „Chaplin"
  angeglichen — Überschriften/Titel in Roboto Serif, Fließtext/UI in Open Sans;
  zuvor durchgehend Roboto. Links im Akzent mit Unterstreichung. Die MD3-Primär-
  farbe #007C89 ist identisch mit der `--accent`-Farbe der Website.)*

**Kein FAB:** Bewusst weggelassen — Hinzufügen erfolgt weiter über Dock
(Ziehen/Tippen) und `Einfg`; ein globaler „+"-FAB wäre mehrdeutig.

## Konsequenzen

**Positiv**
- Konsistentes, modernes Erscheinungsbild; ein zentrales Farbsystem.
- Dark Mode wartungsarm: neue Komponenten erben Tokens, keine Doppelpflege.
- Klare, sprachunabhängige Icons.

**Negativ / Risiken**
- MD3 wird selbst nachgebaut (kein Framework) — Komponenten-Verhalten/Tokens
  müssen manuell konsistent gehalten werden.
- Neue UI-Elemente müssen die Tokens verwenden, sonst brechen sie im Dark Mode.

## Alternativen

- **Material-Web-Komponenten (`@material/web`):** verworfen — Single-File + CSP,
  kein Build; externe Skripte/Fonts blockiert.
- **MD3-Lila als Primärfarbe:** verworfen — Teal ist etabliert und hält Abstand zu
  den Objektfarben.
- **Bestehendes Design beibehalten:** verworfen — inkonsistent, schwer zu pflegen.
