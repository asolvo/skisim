# ADR-0023: Schild als konfigurierbares Objekt (Form + editierbare Beschriftung)

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v135, v136, v137
- **Bezug:** [ADR-0014](0014-farbschema-und-farbwaehler.md) (kontextuelle Farbleiste),
  [ADR-0015](0015-objekt-grafiken.md) (Objekt-Grafiken)

## Kontext

Das bisherige „Warnschild" war ein fixes rundes Zeichen mit unveränderlichem
„!"-Symbol. In der Praxis kommen auf Pisten unterschiedliche Schilder vor (runde
Verbots-/Hinweisschilder, quadratische/rechteckige Tafeln, Warndreiecke,
Skirouten-Rauten) mit unterschiedlichem Text. Ein einziges festes Schild reichte
dafür nicht.

## Entscheidung

Das Objekt wird allgemein zu **„Schild" / „Sign"** und erhält zwei
konfigurierbare Eigenschaften:

- **Form** über ein **zweites kontextuelles Menü neben der Farbleiste** (gleiches
  Muster wie ADR-0014): Rund, Quadrat, Rechteck (Querformat), Dreieck (Warnung),
  **Raute** (Skirouten-Markierung). Die aktive Form ist markiert (`aria-pressed`).
  Alle Formen sind randlos, mit abgerundeten Ecken; der Pfosten sitzt ohne
  Abstand unter der Fläche.
- **Beschriftung** editierbar wie ein Textfeld (Doppelklick/`Enter`);
  `\n` erzeugt einen Zeilenumbruch. Die Schriftgröße passt sich automatisch an
  Schildgröße, Textlänge und Zeilenzahl an; die Textfarbe wird kontrastabhängig
  hell/dunkel gewählt.

Die Schild-Standardvorlage (und das Dock-Symbol) ist ein **gelbes Dreieck** mit
„!". Beim Import werden Form (Whitelist) und Text validiert (vgl.
[ADR-0022](0022-import-validierung.md)).

## Konsequenzen

**Positiv**
- Ein Objekt deckt viele reale Pisten-Schilder ab; freie Beschriftung.
- Das „Kontextmenü neben der Farbleiste"-Muster ist wiederverwendbar für weitere
  objektspezifische Einstellungen.

**Negativ / Risiken**
- Neue Formen müssen in die Zeichenlogik und die Import-Whitelist aufgenommen
  werden.
- Sehr langer Text im Dreieck/der Raute wird stark verkleinert — bewusst; der
  Nutzer kann `\n` setzen oder das Schild vergrößern.

## Alternativen

- **Mehrere feste Schild-Objekte je Form:** verworfen — Dock-Wildwuchs; ein
  konfigurierbares Objekt ist schlanker.
- **Nur feste Symbole ohne freien Text:** verworfen — Beschriftung wird für
  Gutachten gebraucht.
