# ADR-0011: Eigene In-App-Dialoge statt nativer prompt()

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v111

## Kontext

Die Beschriftung von Text-, Geschwindigkeits- und Bemaßungs-Objekten wurde über
das native `prompt()` editiert. `prompt()` wird von modernen Browsern (v.a. auf
Tablets und in eingebetteten Ansichten) zunehmend blockiert oder kommentarlos
unterdrückt — die Bearbeitung funktionierte dort nicht mehr.

## Entscheidung

- Bearbeitung über einen **eigenen Modal-Dialog** (`#editModal`) mit Eingabefeld
  und OK/Abbrechen (`openTextEditor` / `applyEdit` / `closeEdit`).
- Auslöser unverändert: Doppelklick/Doppeltipp oder `Enter`.

## Konsequenzen

**Positiv**
- Zuverlässig auf allen Geräten/Browsern, touch-freundlich, theme- und
  sprachfähig (siehe [ADR-0009](0009-theme-system.md), [ADR-0010](0010-mehrsprachigkeit-de-en.md)).

**Negativ / Risiken**
- Etwas mehr Code als `prompt()`. (`alert()` für seltene Fehlermeldungen bleibt
  vorerst, da unkritisch.)

## Alternativen

- **`prompt()` beibehalten:** verworfen — unzuverlässig, der eigentliche Bug.
- **Inline-Bearbeitung direkt auf dem Canvas:** verworfen — deutlich aufwändiger.
