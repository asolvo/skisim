# ADR-0005: Granulares Feature-Gating pro Lizenz

- **Status:** Akzeptiert
- **Datum:** 2026-06-24
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Bezug:** Folgt aus [ADR-0001](0001-signierte-lizenz-tokens.md)

## Kontext

Die Lizenz soll Funktionen freischalten. Zwei Modelle standen zur Wahl:
- **A) Alles-oder-nichts:** „Gast vs. lizenziert".
- **B) Granular:** einzelne Funktionen pro Lizenz schaltbar.

Der Betreiber will **später feiner abgestufte Funktionsrechte** vergeben können.

## Entscheidung

Das Gating wird von Anfang an **pro Funktion** umgesetzt:
`hasFeature('export' | 'save' | 'share')`, gespeist aus dem Feld `feat[]` des
Tokens bzw. `features[]` des KV-Datensatzes.

- **Frei (ohne Lizenz):** Objekte platzieren, anordnen, ansehen.
- **Lizenzpflichtig:** PNG-Export, JSON-Speichern, Teilen.
- Startphase: alle 10 Lizenzen erhalten alle drei Features; einzelne Rechte sind
  ab Tag 1 pro Lizenz zu-/abschaltbar — ohne Code-Änderung.

## Konsequenzen

**Positiv**
- Zukunftssicher: differenzierte Pakete/Tiers ohne Architekturänderung möglich.
- Klare Trennung zwischen frei nutzbarem Kern und lizenzierten Funktionen.

**Negativ / Risiken**
- Etwas mehr Implementierungsaufwand als alles-oder-nichts (mehrere Gate-Punkte
  statt eines globalen Schalters). Bewusst akzeptiert.

## Alternativen

- **Alles-oder-nichts:** einfacher, aber blockiert das gewünschte spätere
  Feinraster. Verworfen.
