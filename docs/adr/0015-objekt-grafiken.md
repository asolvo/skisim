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

## Nachtrag (2026.07.0024): zwei neue Objekte

Ergänzt um zwei prozedural gezeichnete Vektorobjekte (kein SVG-Sprite, nur eine
Dock-Vorschau-SVG je Objekt), beide unbegrenzt platzierbar und import-validiert
([ADR-0022](0022-import-validierung.md)):

- **Böschung** (`type: 'boeschung'`): Oberkante-Linie mit Schraffur-Strichen „/"
  nach unten, feste Strichstärke (nur länger/gedreht, nicht dicker — analog
  V-Form). **Einfärbbar** (Standard Schwarz), Gelände-Ebene (unter den Figuren).
  Standardlänge 100 px (2026.07.0025 von 200 halbiert).
- **Liftstütze** (`type: 'liftpole'`): Top-Down-Pylon als graue Scheibe mit
  hellgrauer Innenscheibe (`#E6E6E6`), dezenter Schatten. **Einfärbbar**, Standard
  Grau `#A6A6A6` wie das Box-/Hindernis-Objekt (2026.07.0025; zuvor feste dunkle
  Farbe). Struktur-Ebene (wie Fangzaun/Baum/Schild).

Zusätzlich (2026.07.0026):

- **Schneemobil** (`sprite`/`assetKey: 'snowmobile'`): Zweisitzer im Ski-Doo-Stil in
  Aufsicht (zwei Frontskier, Haube mit Scheinwerfer/Windschild, Lenker, Fahrer mit
  Helm/Brille, lange Raupe mit zweiter Sitzbank, Haltegriffen und angedeuteter
  Ladefläche). Umgesetzt als **einfärbbare Figur** über das Recolor-System
  ([ADR-0017](0017-einfaerbbare-figuren-skimode-palette.md)): `FIGURES`-Eintrag mit
  `jacket '#F2C200'` / `stroke '#B8940A'`, Standardfarbe **Ski-Doo-Gelb** `#F2C200`.
  Abweichend von den Personen-Figuren **unbegrenzt platzierbar** (`isInfiniteResource`,
  wie Baum/Zaun) und **ohne Gast-Personenlimit** (nicht in `PERSON_ASSETS`).
  Fahrzeug-Ebene wie die übrigen Fahrer.
- **Pistenraupe** (`sprite`/`assetKey: 'groomer'`, 2026.07.0027): Snow Groomer im
  PistenBully-Stil in Aufsicht — dunkles V-Frontschild, zwei breite Raupenketten,
  Kabine mit großer dunkel getönter Frontscheibe, graue Transportfläche und
  gerippte Heckfräse hinter dem Fahrzeug. Ebenfalls **einfärbbare Figur**
  (`FIGURES`: `jacket '#D9342B'` / `stroke '#A02A22'`, Standard **PistenBully-Rot**),
  **unbegrenzt** und **ohne Gast-Personenlimit** wie das Schneemobil. Einfärbbar sind
  nur Chassis und Kabine; Schild, Ketten, Scheiben, Transportfläche und Fräse fix.
