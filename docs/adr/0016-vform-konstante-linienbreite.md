# ADR-0016: V-Form mit skalier-invarianter Linienbreite

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v120

## Kontext

Die **V-Form** (`vshape`) markiert in Skizzen einen Spur-/Pflug-Winkel. Sie wurde
prozedural mit einer von der Objektgröße abhängigen Strichstärke gezeichnet
(`lineWidth = Math.max(4, p.height/15)`). Beim Skalieren wurden die beiden
Schenkel dadurch **gleichzeitig länger und dicker**. Gewünscht war, dass die
V-Form sich verhält wie die **Bemaßung**: Skalieren ändert nur die **Länge** der
Geraden, nicht ihre Dicke.

## Entscheidung

Die Strichstärke der V-Form wird auf einen **festen Wert (`lineWidth = 5`)**
gesetzt, unabhängig von der Skalierung. Skalieren verlängert nur noch die beiden
Schenkel.

Damit folgt die V-Form demselben Prinzip wie die Bemaßung (siehe deren
längen-only-Skalierung): Bei linienartigen Annotations-Objekten bleibt die
Linienstärke konstant; die Skalierung wirkt auf die geometrische Ausdehnung, nicht
auf die Strichbreite.

## Konsequenzen

**Positiv**
- Konsistentes Verhalten von V-Form und Bemaßung; saubere, gleichmäßig dünne
  Linien auch bei großen Formen.

**Negativ / Risiken**
- Bei sehr kleinen V-Formen wirkt die feste Strichstärke verhältnismäßig kräftig
  (bewusst in Kauf genommen — Lesbarkeit vor Proportion).
- Neue linienartige Objekttypen sollten diese Konvention (feste Strichstärke)
  ebenfalls berücksichtigen.

## Alternativen

- **Größenabhängige Strichstärke beibehalten:** verworfen — Schenkel wurden beim
  Skalieren unerwünscht dicker.
- **Strichstärke separat einstellbar machen:** verworfen — unnötige Komplexität
  für ein einfaches Annotations-Objekt.
