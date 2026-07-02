# ADR-0027: Datei-Ausgabe via File System Access API + Dateinamens-Schema

- **Status:** Akzeptiert
- **Datum:** 2026-07-02
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** 2026.07.0019

## Kontext

PNG-Export und JSON-Speichern landeten fix im Download-Ordner, mit wenig
aussagekräftigen Dateinamen (`ski-sim-<timestamp>.png`,
`skisim-projekt-<zufall>-<datum>.json`). Gewünscht: freie Ordnerwahl und sprechende,
im Explorer sinnvoll sortierbare Namen.

## Entscheidung

**Ordnerwahl:** Eine gemeinsame Routine `saveBlob()` nutzt die **File System
Access API** (`showSaveFilePicker`) für einen echten „Speichern unter"-Dialog mit
freier Ordner-/Namenswahl. Über eine gemeinsame `id` merkt sich der Browser den
zuletzt gewählten Ordner (für PNG und JSON gemeinsam). Wo die API fehlt
(Firefox/Safari/Mobil), **automatischer Fallback** auf den klassischen
Download-Anker. Abbruch im Dialog verbraucht keine Nummer.

**Dateinamen-Schema:** `<Ortsname> <JJJJ-MM-TT> <HHMM> <NNN>.<ext>`
- ISO-Datum (sortiert chronologisch), Uhrzeit ohne Doppelpunkt (Windows-tauglich).
- Ortsname aus den Szenario-Metadaten ([ADR-0024](0024-szenario-metadaten-legende.md)),
  von verbotenen Zeichen bereinigt, gekürzt; Fallback „Skizze"/„Sketch".
- **Fortlaufende Nummer (3-stellig) pro Ortsname**, in `localStorage` persistiert;
  wird nur bei tatsächlichem Speichern hochgezählt. Auch die Teilen-Funktion nutzt
  dieses Schema.

## Konsequenzen

**Positiv**
- Exporte landen im gewünschten (gemerkten) Ordner; Dateien eines Falls gruppieren
  und sortieren sich im Explorer von selbst.

**Negativ / Risiken**
- Ordnerwahl nur in Chromium-Browsern (Desktop); anderswo Download-Ordner wie
  bisher.
- Der Pro-Ort-Zähler lebt lokal im Browser (localStorage) — auf einem anderen
  Gerät/Browser beginnt er neu.

## Alternativen

- **Beim Download-Verhalten bleiben:** verworfen — keine Ordnerwahl, schwache
  Namen.
- **Zähler global oder pro Tag:** verworfen — der Nutzer wählte „pro Ortsname"
  (Nummer = Version dieses Falls).
