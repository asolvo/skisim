# ADR-0015: Objekt-Grafiken — Top-Down-Stil und Überarbeitung

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v118, v119

## Kontext

Die Objekt-Grafiken sind als **Inline-SVG-Daten-URIs** im HTML hinterlegt und
werden als Bilder (Dock-Vorschau) bzw. teils prozedural (Schild) gezeichnet.
Mehrere waren inkonsistent oder schwer lesbar: die verletzte Person war abstrakt,
der Rodler in Seitenansicht (statt Vogelperspektive), Snowboarder und Pflugfahrer
nutzten zwei kollidierende Lila-Töne, die Pflug-Ski waren grün, und das Schild
zeigte das Wort „Schild"/„Sign" (sprachabhängig, Textüberlauf).

## Entscheidung

**Einheitlicher Stil:** Alle Figuren in **Vogelperspektive** mit gemeinsamer
Formensprache — grauer Helm (`#808080`), hellblaue Brille (`#87ceeb`), dunkle Ski
und Details (`#333`). SVGs bleiben skalierbar und (wo vorgesehen) einfärbbar.

**Konkrete Überarbeitungen:**
- **Verletzte Person:** klare Top-Down-Figur (Kopf, Rumpf, Arme, Beine) in Rot mit
  weißem Notfall-Kreuz-Marker.
- **Rodler:** als Top-Down-Grafik (Schlitten mit Kufen + sitzende Person mit
  Helm/Brille), konsistent zu den Skifahrern.
- **Lila-Harmonisierung:** Snowboarder und Pflugfahrer nutzen denselben
  Violett-Ton (`#826dff`); unterschieden werden sie über die **Form** (Board vs.
  Plug-V), nicht über Farbe.
- **Pflugfahrer:** Ski dunkel (`#333`) statt grün; Stellung/Arme/Helm unverändert.
- **Schild:** sprachunabhängiges Warnsymbol **„!"** (rund, weißer Rand +
  Ausrufezeichen) statt des Wortes — sowohl in der SVG-Dock-Vorschau als auch in
  der Canvas-Zeichnung (`drawObject`). Fläche = gewählte Farbe, Symbol bleibt weiß.

## Konsequenzen

**Positiv**
- Konsistentes, gut erkennbares Erscheinungsbild; sprachunabhängige Symbole.

**Negativ / Risiken**
- Neue Sprites müssen dem Stil folgen (Vogelperspektive, gemeinsame Farben).
- Einfärbbare Symbol-Objekte (Schild) zeichnen Fläche = Farbe + weißes Symbol —
  bei sehr hellen Farben auf weißem Grund auf Lesbarkeit achten.

## Alternativen

- **Bitmap-Icons:** verworfen — SVG ist skalierbar und einfärbbar.
- **Wort-Label am Schild beibehalten:** verworfen — sprachabhängig und Überlauf.
- **Zwei verschiedene Lila-Töne:** verworfen — sie kollidierten optisch.

## Offen (aus dem Grafik-Review, noch nicht umgesetzt)

- Skifahrer „Schulter vor/zurück" deutlicher unterscheidbar machen.
- Fangzaun-Farben an die Objekt-Palette angleichen (statt CSS-Namen/Alt-Rot).
