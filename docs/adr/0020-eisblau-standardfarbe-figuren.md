# ADR-0020: Eisblau als einheitliche Standardfarbe aller Personen-Figuren

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v126, v127
- **Verfeinert:** [ADR-0017](0017-einfaerbbare-figuren-skimode-palette.md) (nur die
  Standardfarben; Palette und Umfärb-Mechanismus bleiben unverändert)

## Kontext

[ADR-0017](0017-einfaerbbare-figuren-skimode-palette.md) machte alle
Personen-Figuren einfärbbar und gab ihnen unterschiedliche Standardfarben aus der
Skimode-Palette (Skifahrer Tiefblau `#1F3A6B`, Pflugfahrer Petrol `#0E8E8E`,
Snowboarder Violett `#6E54C8`, Rodler Orange `#EF7A1A`). In der Praxis wirkte das
bunte, uneinheitliche Erscheinungsbild — auch im Dock — unruhig. Gewünscht war
**eine** ruhige, einheitliche Standardfarbe für alle Figuren, die der Anwender bei
Bedarf weiterhin pro Objekt ändern kann.

## Entscheidung

**Eisblau `#6FB7E0`** (aus der bestehenden Skimode-Figuren-Palette) ist die
einheitliche Standardfarbe **aller** Personen-Figuren: Skifahrer (gerade,
Schulter vor, Schulter zurück), Pflugfahrer, Snowboarder und Rodler. Konkret:

- `TEMPLATES`-Farbe aller sechs Figuren-Vorlagen auf `#6FB7E0` gesetzt — damit
  sind auch die **Dock-Symbole** eisblau (zuvor tiefblau/petrol/violett/orange).
- Fallback-Default in `getColoredSprite` ebenfalls auf `#6FB7E0`.
- Die **Verletzte Person** bleibt rot (keine einfärbbare Figur).
- Das **Einfärben pro Objekt** über die kontextuelle Farbleiste (gesamte
  11-Farben-Skimode-Palette) bleibt unverändert möglich.

Palette, Laufzeit-Umfärbung (`getColoredSprite`) und die Zwei-Paletten-Logik aus
ADR-0017 bleiben bestehen; geändert wird ausschließlich die Default-Farbwahl.

## Konsequenzen

**Positiv**
- Ruhiges, einheitliches Erscheinungsbild von Figuren und Dock; klarer
  Ausgangszustand.
- Anwender setzt Farben bewusst dort, wo Beteiligte unterschieden werden sollen.

**Negativ / Risiken**
- Beteiligte sind im Default nicht mehr automatisch farblich unterscheidbar —
  bewusst in Kauf genommen; Unterscheidung erfolgt über manuelles Einfärben.
- Eine künftige neue Figur sollte denselben Default (`#6FB7E0`) verwenden, sonst
  bricht die Einheitlichkeit.

## Alternativen

- **Unterschiedliche Defaults je Figur beibehalten (ADR-0017):** verworfen —
  uneinheitlich/unruhig.
- **Andere Standardfarbe (z. B. Tiefblau):** verworfen — Eisblau gewünscht.
- **Default abhängig vom Figurentyp automatisch vergeben:** verworfen — der
  Anwender soll die Unterscheidung bewusst steuern.
