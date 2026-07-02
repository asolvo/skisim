# ADR-0028: Mehrfachauswahl per Aufziehrechteck + gemeinsames Verschieben

- **Status:** Akzeptiert
- **Datum:** 2026-07-02
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** 2026.07.0020
- **Bezug:** [ADR-0013](0013-geraete-eingabe-barrierefreiheit.md) (Eingabe/Touch),
  [ADR-0026](0026-barrierefreiheit-wcag-aa.md) (Barrierefreiheit)

## Kontext

Bis dahin gab es genau **eine** Auswahl (`activePlayerIndex`). Mehrere Objekte
zugleich zu verschieben (z. B. eine Gruppe Personen samt Spuren) war nur einzeln
möglich. Gewünscht: mit der Maus ein Rechteck aufziehen, mehrere Objekte
markieren und gemeinsam verschieben.

## Entscheidung

**Auswahlmodell:** Neben dem bestehenden Primär-Index `activePlayerIndex` führt
die App eine Liste `selectedIndices`. **Einzelauswahl = Liste der Länge 1** — der
gesamte vorhandene Einzelobjekt-Code (Farbleiste, Formleiste, Bearbeiten, Drehen,
Zoom) bleibt unverändert; nur der Gruppenpfad kommt hinzu.

**Aufziehrechteck (Marquee):** Maustaste im leeren Bereich → ab einer kleinen
Bewegungsschwelle (~4 px) wird ein gestricheltes Rechteck aufgezogen. Beim
Loslassen werden alle Objekte ausgewählt, deren Rechteck das Marquee **überlappt
(Berühren genügt)**. Ein reiner Klick ins Leere hebt die Auswahl auf (wie bisher).

**Umschalt+Klick** ergänzt/entfernt einzelne Objekte aus der Auswahl.

**Gemeinsames Verschieben:** Ziehen auf einem bereits ausgewählten Objekt bewegt
die ganze Gruppe. Der gemeinsame Versatz wird an den Canvas-Rändern so begrenzt,
dass die **relativen Abstände erhalten** bleiben (Gruppen-Clamping, kein
Einzel-Clamping). **Entf** löscht die ganze Auswahl (Figuren kehren ins Dock
zurück), die **Pfeiltasten** bewegen sie gemeinsam.

**Bewusst einzelobjekt-bezogen:** Drehen (Rechts-Drag) und Zoom (Mausrad/Pinch)
wirken weiterhin nur auf das Primärobjekt — eine Gruppen-Rotation/-Skalierung um
einen Schwerpunkt wäre deutlich aufwändiger und ist separat zu entscheiden.

**Eingabe:** Das Marquee ist vorerst **Maus-only**. Die bestehende Touch-Gestik
(1 Finger ziehen = Objekt bewegen, 2 Finger = Zoom/Drehen) bleibt unverändert, um
Regressionen zu vermeiden.

## Konsequenzen

**Positiv**
- Mehrere Objekte lassen sich in einem Zug markieren und verschieben; der
  Einzelobjekt-Workflow bleibt vollständig kompatibel.
- Auswahl-Ring wird pro ausgewähltem Objekt gezeichnet; aria-live meldet die
  Anzahl der ausgewählten Objekte (Barrierefreiheit, [ADR-0026](0026-barrierefreiheit-wcag-aa.md)).

**Negativ / Risiken**
- `selectedIndices` ist index-basiert und wird bei strukturellen Änderungen
  (Objekt hinzufügen, Import, Dock-Rückkehr) auf die Einzelauswahl zurückgesetzt.
- Kein Touch-Marquee und keine Gruppen-Rotation/-Skalierung in dieser Version.

## Alternativen

- **Referenzen statt Indizes** in der Auswahl: verworfen — der Bestand ist
  durchgängig index-basiert; Rücksetzen bei Strukturänderungen ist einfacher und
  robust.
- **Marquee auch per Touch (1 Finger):** verworfen für diese Version — kollidiert
  mit dem bestehenden Ein-Finger-Ziehen; später separat.
- **Vollständiges Umschließen statt Berühren:** verworfen — der Nutzer wählte
  „Berühren genügt" (schneller, verzeiht ungenaues Aufziehen).
