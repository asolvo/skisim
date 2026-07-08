# ADR-0030: Datensicherheit — Undo/Redo, Autosave und Verlustschutz

- **Status:** Akzeptiert
- **Datum:** 2026-07-06
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** 2026.07.0032
- **Bezug:** [ADR-0020](0020-eisblau-standardfarbe-figuren.md) (Mehrfachauswahl-Löschen),
  [ADR-0028](0028-mehrfachauswahl-marquee.md) (Gruppen-Löschen),
  [ADR-0029](0029-ki-fernsteuerung-mcp.md) (KI-Befehle verändern die Skizze)

## Kontext

Die Skizze lebte ausschließlich flüchtig im Speicher. Es gab **kein Rückgängig**,
keinen **Verlustschutz** beim Schließen des Tabs und **kein Autosave**. Mit der
Mehrfachauswahl (ein Tastendruck kann viele Objekte löschen) und der
KI-Fernsteuerung (`load_project` ersetzt die ganze Skizze, Assistent arbeitet
autonom) war der versehentliche Totalverlust das größte reale Risiko eines
Gutachten-Werkzeugs.

## Entscheidung

**Undo/Redo (Snapshot-Verlauf).** Ein Snapshot ist das JSON aus `activeObjects` +
`sceneMeta`. Zwei Stapel (undo/redo, max. 40 Einträge). Zwei Muster:

- **Diskrete Aktionen** rufen `pushHistory()` **vor** der Änderung: Hinzufügen
  (Dock/Duplizieren), Löschen, Farbe/Text/Form, Szenario, Import, KI-Befehle.
- **Gesten** (Ziehen, Drehen, Skalieren per Maus/Touch, Pfeiltasten-Bewegung)
  „armen" beim Start (`armHistory()`) und „committen" am Ende (`commitHistory()`),
  wobei nur bei **tatsächlicher Änderung** ein Eintrag entsteht (kein Rauschen
  durch reine Klicks/Auswahl).

Bedienung: zwei Toolbar-Buttons (Rückgängig/Wiederholen, deaktiviert wenn leer)
und **Strg+Z / Strg+Y** (bzw. Strg+Umschalt+Z). KI-Befehle sind einzeln
rückgängig-machbar (arm/commit im WebSocket-Handler).

**Autosave.** Nach jeder Änderung wird die Skizze entprellt (~1,2 s) nach
`localStorage` geschrieben. Beim Start bietet ein Dialog an, eine dort gefundene,
nicht gespeicherte letzte Sitzung **wiederherzustellen** oder zu **verwerfen**.

**Verlustschutz.** Ein `beforeunload`-Handler warnt beim Schließen/Neuladen —
aber nur, solange **ungespeicherte Änderungen** bestehen (`_dirty`). Erfolgreiches
JSON-Speichern setzt das Flag zurück.

## Konsequenzen

**Positiv**
- Fehlbedienung (Löschen, Gruppen-Aktion, KI-Befehl) ist reversibel; kein stiller
  Totalverlust mehr.

**Negativ / Risiken**
- Snapshots sind Voll-Zustände (kein Delta) — bei sehr vielen Objekten wächst der
  Speicher; durch die Deckelung (40) und die geringe Objektgröße unkritisch.
- `beforeunload` zeigt einen generischen Browser-Dialog (Text nicht anpassbar).
- Autosave liegt pro Browser/Gerät lokal; kein geräteübergreifendes Backup.

## Alternativen

- **Command-/Delta-basiertes Undo:** verworfen — Snapshots sind bei dieser
  Objektzahl einfacher und robust gegen neue Objekttypen.
- **Nur Autosave ohne Undo:** verworfen — Undo ist die häufiger gebrauchte
  Sofort-Korrektur.
- **Server-Backup:** verworfen für Stufe 1 — die App ist bewusst client-seitig
  (Single-File, [ADR-0008](0008-single-file-versionierung.md)).
