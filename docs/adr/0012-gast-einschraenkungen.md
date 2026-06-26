# ADR-0012: Gast-Einschränkungen (Freemium-Gating)

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Bezug:** Konkretisiert [ADR-0005](0005-granulares-feature-gating.md)
- **Umgesetzt in:** v109, v110

## Kontext

Das Lizenzmodell ([ADR-0001](0001-signierte-lizenz-tokens.md)) braucht eine klare,
sichtbare Grenze zwischen freier (Gast-)Nutzung und lizenzierten Funktionen — und
einen Anreiz zur Aktivierung.

## Entscheidung

Ohne Lizenz (Gast):
- **Frei:** Objekte platzieren, anordnen, ansehen.
- **Gesperrt:** Export (PNG), Speichern (JSON), Teilen — die Buttons werden
  **ausgegraut und sind nicht klickbar** (nicht nur eine Fehlermeldung).
- **Mengenlimit:** maximal **1 Personen-Figur** gleichzeitig (Skifahrer, Pflug,
  Snowboarder, Rodler, Verletzte zusammen). Ist das Limit erreicht, werden die
  betroffenen Dock-Objekte ausgegraut. Deko/Hilfsmittel bleiben unbegrenzt.

Das Gating erfolgt clientseitig anhand des `feat[]` im Token bzw. des Fehlens
eines Tokens.

## Konsequenzen

**Positiv**
- Klare, sofort sichtbare Grenze; motiviert zur Lizenzaktivierung; Demo-Nutzung
  bleibt möglich.

**Negativ / Risiken**
- Rein clientseitig und damit technisch umgehbar (bekannt, siehe
  [ADR-0001](0001-signierte-lizenz-tokens.md)). Akzeptierter Kompromiss.
- Bei neuen Funktionen muss die Gast-Grenze mitgedacht werden.

## Alternativen

- **Harte Server-Durchsetzung:** verworfen — die Funktionen laufen im Browser.
- **Keine Gast-Nutzung (Login-Pflicht):** verworfen — niederschwelliger Einstieg
  und Demo erwünscht.
