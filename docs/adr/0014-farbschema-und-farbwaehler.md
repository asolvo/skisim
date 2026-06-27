# ADR-0014: Farbschema und kontextueller Farbwähler

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v117

## Kontext

Die einfärbbaren Objekte (Box, Linie, Pfeil, V-Form, Geschwindigkeits-Vektor,
Schild, Bemaßung) wechselten ihre Farbe über einen einzelnen, kontextlosen
🎨-Button unten mittig, der durch neun teils unharmonische Farben schaltete. Der
Button war auch sichtbar, wenn er nichts bewirkte (z. B. bei Skifahrern). Gewünscht
war ein harmonisches Schema mit festen Pflichtfarben und ein besser platzierter,
verständlicherer Farbwähler.

## Entscheidung

**Palette (7 Farben, `COLOR_PALETTE`)** — Reihenfolge und Werte:
Blau `#2C7FB8`, Rot `#D9343B`, Schwarz `#2B2B2B`, Grün `#5BA86B`, Braun `#9C6B43`,
Grau `#A6A6A6`, Fast-Weiß `#ECECE6`.
- Blau und Rot sind an **Pistenfarben** angelehnt.
- Fast-Weiß ist bewusst leicht abgedunkelt, damit es auf der weißen Zeichenfläche
  noch erkennbar bleibt.
- Standardfarben der Objekte und die Dock-Vorschau-Icons wurden an die Palette
  angeglichen.

**Farbwähler — kontextuelle Swatch-Leiste:**
- Eine Leiste mit allen 7 Farb-Swatches erscheint **nur**, wenn ein einfärbbares
  Objekt ausgewählt ist (sonst ausgeblendet).
- Klick/Tap auf ein Swatch setzt die Farbe **direkt** (statt mehrfaches
  Durchschalten); der aktive Swatch ist markiert.
- Taste `c` bleibt als Durchschalten erhalten.

## Konsequenzen

**Positiv**
- Harmonisches, abgestimmtes Erscheinungsbild; Pisten-Blau/-Rot wiedererkennbar.
- Schnellere, direkte Farbwahl; der Wähler erscheint nur, wenn er etwas bewirkt
  (nicht mehr „einsam"/kontextlos). Touch-, Theme- und sprachfähig.

**Negativ / Risiken**
- Fast-Weiß bleibt auf weißem Grund dezent (bewusst, für Druck/farbigen Grund).
- Neue einfärbbare Objekttypen müssen in `isColorable()` und bei den Standardfarben
  berücksichtigt werden.

## Alternativen

- **Durchschalt-Button beibehalten:** verworfen — langsam und kontextlos.
- **Farbwähler in die obere Toolbar:** verworfen — immer sichtbar, ohne Bezug zur
  Auswahl.
- **Schwebender Wähler direkt am Objekt:** verworfen — technisch fummelig bei
  Drehung/Zoom/Rändern.
- **Freier Color-Picker (beliebige Farben):** verworfen — feste, harmonische und
  einheitliche Palette ist für Unfallskizzen gewünscht.
