# ADR-0025: Versionsschema JJJJ.MM.NNNN mit monatlichem Reset

- **Status:** Akzeptiert
- **Datum:** 2026-07-01
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** 2026.07.0011 (löst die alte `v###`-Zählung ab)
- **Verfeinert:** [ADR-0008](0008-single-file-versionierung.md) (Single-File-Versionierung)

## Kontext

Die fortlaufende Zählung `v105 … v139` sagte nichts über den Zeitpunkt einer
Version aus und wuchs unbegrenzt. Gewünscht war ein Schema, das Jahr und Monat
sichtbar macht und pro Monat eine übersichtliche laufende Nummer führt.

## Entscheidung

Versionsformat: **`JJJJ.MM.NNNN`** — Jahr, Monat, 4-stellige fortlaufende Nummer.

- Die Nummer `NNNN` **wird pro Monat zurückgesetzt**: die erste Version eines
  neuen Monats beginnt bei `0001` (z. B. `2026.08.0001`); innerhalb des Monats
  wird hochgezählt.
- Die Umstellung selbst ist `2026.07.0011` (Juli 2026 lief zu dem Zeitpunkt bei
  ~10 Versionen des Tages).
- Pro Release werden weiterhin alle Marker aktualisiert (Header-Changelog +
  Datum, `<title>`, Popup-Versionsanzeige, `shareText` DE/EN) und eine
  versionierte Kopie `ski.mvp.<version>.html` abgelegt (Gewohnheit aus ADR-0008).

## Konsequenzen

**Positiv**
- Version zeigt auf einen Blick den Release-Monat; monatlicher Reset hält die
  Nummer klein und lesbar.

**Negativ / Risiken**
- Eine Version ist nicht mehr allein an der Nummer global eindeutig — erst
  zusammen mit `JJJJ.MM`. Für die Sortierung/Historie ist das unkritisch.

## Alternativen

- **`v###` fortlaufend beibehalten:** verworfen — kein Zeitbezug.
- **Durchlaufende Nummer ohne Monats-Reset:** verworfen — der Nutzer wünschte den
  monatlichen Reset; `JJJJ.MM` trägt den Zeitbezug bereits.
- **Semantische Versionierung (SemVer):** verworfen — für eine
  Single-File-Endnutzer-App ohne API kein Mehrwert.
