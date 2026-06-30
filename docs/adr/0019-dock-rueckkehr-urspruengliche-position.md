# ADR-0019: Rückkehr gelöschter Objekte an die ursprüngliche Dock-Position

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v126

## Kontext

Endliche Objekte (Personen-Figuren) wandern beim Platzieren aus dem Dock und
kehren beim Löschen bzw. Zurückziehen ins Dock zurück (siehe
[ADR-0012](0012-gast-einschraenkungen.md) für das Mengen-Konzept). Bisher wurden
zurückkehrende Objekte mit `dockedObjects.push(...)` **ans Ende** der Objektleiste
gehängt. Dadurch änderte sich die Reihenfolge im Dock bei jedem Platzieren/Löschen
— die gewohnte Position einer Figur war nicht mehr stabil, was die Bedienung
verwirrend machte.

## Entscheidung

Jede Vorlage erhält eine **stabile `dockOrder`** (= ihr Index in `TEMPLATES`,
einmalig per `TEMPLATES.forEach((t,i)=>t.dockOrder=i)` gesetzt). `createObject`
überträgt `dockOrder` auf das erzeugte Objekt, und auch die Duplizier-Funktion
reicht sie weiter. Beim Zurücklegen ins Dock (`returnToDock`) wird das Objekt
**nach `dockOrder` einsortiert** statt angehängt:

```
const ord = (ni.dockOrder === undefined) ? MAX : ni.dockOrder;
const pos = dockedObjects.findIndex(d => (d.dockOrder ?? MAX) > ord);
pos === -1 ? dockedObjects.push(ni) : dockedObjects.splice(pos, 0, ni);
```

So bleibt die Dock-Reihenfolge stets konsistent mit der ursprünglichen
`TEMPLATES`-Reihenfolge, unabhängig davon, in welcher Reihenfolge Objekte
platziert und gelöscht werden.

## Konsequenzen

**Positiv**
- Figuren erscheinen immer an ihrem gewohnten Platz im Dock — vorhersehbare,
  ruhige Bedienung.
- Robust gegenüber beliebiger Platzier-/Lösch-Reihenfolge.

**Negativ / Risiken**
- Objekte ohne `dockOrder` (z. B. aus einem importierten Projekt rekonstruierte
  Figuren) landen als Fallback am Ende — akzeptiert, da die ursprüngliche
  Slot-Information dort nicht vorliegt.
- Neue endliche Objekttypen müssen über `TEMPLATES` (mit `dockOrder`) definiert
  werden, damit die Einsortierung greift.

## Alternativen

- **Weiterhin ans Ende anhängen:** verworfen — instabile, verwirrende Reihenfolge.
- **Dock bei jeder Änderung komplett aus `TEMPLATES` neu aufbauen:** verworfen —
  würde die Mengen-/Gast-Logik (welche Figur ist bereits platziert) verkomplizieren;
  die `dockOrder`-Einsortierung ist lokaler und einfacher.
