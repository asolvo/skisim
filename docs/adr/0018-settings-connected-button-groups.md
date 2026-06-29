# ADR-0018: Settings-Auswahl als Connected Button Groups (Material Design 3)

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v123

## Kontext

Im Einstellungs-Popup wurden „Darstellung" (Hell / Dunkel / Auto) und „Sprache"
(Deutsch / English) über native `<select>`-Dropdowns gewählt. Dropdowns
verstecken die Optionen hinter einem Klick, wirken auf Touch-Geräten fummelig und
passen optisch nicht zum sonst flächigen, modernen UI. Gewünscht war eine direkte,
sichtbare Auswahl analog zu **Material Design 3 „Button groups"**
(https://m3.material.io/components/button-groups/overview).

## Entscheidung

Beide Dropdowns werden durch **Connected Button Groups** ersetzt — segmentierte,
direkt nebeneinander liegende Buttons, bei denen ein Wert aktiv ist:

- Markup: `.btn-group` (Flex, volle Breite, kleiner Spalt) mit `.seg`-Buttons,
  jeder mit `data-val` und einem ✓-Icon (`.seg-check`), das nur am aktiven Button
  eingeblendet wird.
- **Form:** Außenecken der Gruppe stark gerundet, Innenecken klein; der **aktive**
  Button ist gefüllt und voll gerundet (MD3-Auswahlmorphing).
- **Farbe:** aktiver Zustand in der **App-Akzentfarbe Teal** (`#007C89` hell /
  `#00a3b4` dunkel, weiße Schrift), inaktiv neutral-grau — nicht das MD3-Lila,
  sondern konsistent zur bestehenden Palette (vgl. Farbleiste,
  [ADR-0014](0014-farbschema-und-farbwaehler.md)). Hell- und Dunkel-Theme
  ([ADR-0009](0009-theme-system.md)) sind abgedeckt.
- **Verhalten:** Klick auf einen Button ruft direkt `applyTheme`/`applyLanguage`
  auf; `setGroupSel(groupId, val)` markiert den aktiven Button (`.is-selected`,
  `aria-pressed`). Auswahlzustand und Persistenz (localStorage) unverändert.
- **Beschriftung:** kürzere Labels passend zur kompakten Gruppe
  (Hell / Dunkel / Auto bzw. Light / Dark / Auto); via i18n
  ([ADR-0010](0010-mehrsprachigkeit-de-en.md)).

## Konsequenzen

**Positiv**
- Alle Optionen sind sofort sichtbar; Auswahl in einem Tap (gut für Touch).
- Konsistente, moderne Optik im App-Akzent; klare Active-Anzeige (Füllung + ✓).
- Tastatur-/Fokus-fähig (echte `<button>`-Elemente), theme- und sprachfähig.

**Negativ / Risiken**
- Button-Gruppen brauchen mehr horizontale Breite als ein Dropdown; bei sehr
  vielen Optionen oder sehr langen Labels skaliert das Muster schlecht (hier
  unkritisch: 2–3 kurze Optionen). Deshalb kurze Labels.
- Eigene Komponente statt nativem Control — Auswahl-/A11y-Verhalten muss selbst
  gepflegt werden.

## Alternativen

- **Native `<select>`-Dropdowns beibehalten:** verworfen — versteckte Optionen,
  schwächere Touch-Bedienung, Stilbruch.
- **Radio-Buttons:** verworfen — optisch weniger kompakt/modern als die
  verbundene Button-Gruppe.
- **MD3-Lila exakt übernehmen:** verworfen — die App hat eine eigene
  Teal-Akzentfarbe; nur das Muster (connected segments), nicht die Farbe wird
  übernommen.
