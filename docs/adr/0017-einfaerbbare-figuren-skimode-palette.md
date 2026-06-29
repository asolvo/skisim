# ADR-0017: Einfärbbare Personen-Figuren mit separater Skimode-Palette

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v121

## Kontext

Bisher waren nur **Objekte** (Linie, Pfeil, V-Form, Box, Vektor, Schild, Bemaßung)
einfärbbar — über die 7-farbige `COLOR_PALETTE` und die kontextuelle Farbleiste
(siehe [ADR-0014](0014-farbschema-und-farbwaehler.md)). Die **Personen-Figuren**
hatten feste Farben; insbesondere gab es zwei getrennte Skifahrer-Vorlagen
(„Blau" und „Grün"), die sich nur in der Farbe unterschieden.

Für Unfallskizzen ist es nützlich, die einzelnen Beteiligten farblich zu
unterscheiden (z. B. mehrere Skifahrer). Gewünscht war daher, **alle**
Personen-Figuren (Skifahrer, Snowboarder, Pflugfahrer, Rodler) einfärbbar zu
machen — aber **nicht** mit der Objekt-Palette, sondern mit Farben, die die
**aktuellen Trendfarben der Skimode** abbilden (statt der Pisten-Blau/-Rot-Logik
der Objekte).

## Entscheidung

**1. Alle Personen-Figuren werden einfärbbar.** Betroffen: `skiBlue`,
`skiLeftShoulder`, `skiRightShoulder` (Skifahrer-Haltungsvarianten), `boarder`
(Snowboarder), `skiPlow` (Pflugfahrer), `sled` (Rodler).

**2. Laufzeit-Umfärbung statt zusätzlicher SVG-Varianten.** Die bestehenden
Figuren-SVGs (als Daten-URI hinterlegt) werden zur Laufzeit umgefärbt:
`getColoredSprite(assetKey, color)` dekodiert den Daten-URI, ersetzt die
**Jacken-/Körperfarbe** durch die gewählte Farbe und die zugehörige
**Konturfarbe** durch eine automatisch abgedunkelte Variante (`darken()`),
kodiert neu und cacht das Ergebnis pro `assetKey|color` in `_spriteCache`. Helm,
Brille, Ski und Board bleiben **neutral** (gemeinsame Formensprache aus
[ADR-0015](0015-objekt-grafiken.md) bleibt erhalten). Konfiguration je Figur in
`FIGURES{ assetKey:{ src, jacket, stroke } }`.

**3. Zwei getrennte Paletten, kontextuell umgeschaltet.**
- `COLOR_PALETTE` (7 Farben) — für **Objekte**, unverändert.
- `FIGURE_PALETTE` (11 Skimode-Farben) — für **Figuren**:
  `#1E1E1E` (Schwarz), `#ECE6D8` (Bone), `#54595E` (Graphit), `#EE8FBE` (Rosa),
  `#EF7A1A` (Orange), `#74803B` (Olivgrün), `#0E8E8E` (Petrol), `#6FB7E0`
  (Eisblau), `#1F3A6B` (Tiefblau), `#6E54C8` (Violett), `#D63C82` (Beere).
- Die kontextuelle Farbleiste zeigt **automatisch** die zur Auswahl passende
  Palette (`isFigure(p)` / `paletteFor(p)`); `buildColorSwatches()` /
  `updateColorBar()` bauen die Leiste anhand des Auswahltyps neu auf.

**4. Zusammenführung der Skifahrer.** Der bisher separate „grüne" Skifahrer
entfällt; es gibt **einen** einfärbbaren Skifahrer. Die **Haltungsvarianten**
(gerade, Schulter vor/zurück) bleiben als eigene Vorlagen erhalten. Standard­farben
der Figuren: Skifahrer Tiefblau `#1F3A6B`, Pflugfahrer Petrol `#0E8E8E`,
Snowboarder Violett `#6E54C8`, Rodler Orange `#EF7A1A`.

Die Palette wurde gegenüber einem ersten Vorschlag bewusst angepasst: **Rosa statt
Rot** und **Olivgrün statt Limette** — damit die Palette echte Ski-Mode-Trendtöne
abbildet und sich klar vom Pisten-Rot der Objekte abhebt.

## Konsequenzen

**Positiv**
- Beteiligte sind farblich unterscheidbar; die Skimode-Palette wirkt zeitgemäß und
  ist von der sachlichen Objekt-Palette getrennt.
- Keine Vervielfachung der SVG-Assets — eine SVG-Vorlage je Figur, beliebig
  umfärbbar; Caching hält die Performance stabil.
- Eine Vorlage weniger im Dock (grüner Skifahrer entfällt), übersichtlicher.

**Negativ / Risiken**
- Die Laufzeit-Umfärbung beruht auf **String-Ersetzung der Hex-Werte** im SVG: Die
  in `FIGURES` als `jacket`/`stroke` hinterlegten Farben müssen exakt mit den im
  SVG verwendeten Werten übereinstimmen, sonst greift die Umfärbung nicht.
- Neue Figuren müssen in `FIGURES` registriert werden (mit korrekten
  Jacken-/Konturwerten); neue einfärbbare Typen weiterhin in `isColorable()`.
- Zwei Paletten erhöhen die Pflege leicht; dafür bleibt die Semantik (Objekt vs.
  Person) sauber getrennt.

## Alternativen

- **Objekt-Palette auch für Figuren nutzen:** verworfen — Pisten-Blau/-Rot passt
  nicht zur gewünschten Skimode-Anmutung.
- **Zusätzliche, fertig eingefärbte SVG-Varianten je Farbe:** verworfen — Asset-
  Explosion und Wartungsaufwand; Laufzeit-Umfärbung ist sparsamer.
- **Freier Color-Picker für Figuren:** verworfen — feste, kuratierte Trend-Palette
  ist gewünscht (konsistent zur Objekt-Entscheidung in ADR-0014).
- **Grünen Skifahrer als separate Vorlage behalten:** verworfen — durch die
  Einfärbbarkeit redundant.
