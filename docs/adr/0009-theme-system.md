# ADR-0009: Theme-System (Hell / Dunkel / Auto)

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v116

## Kontext

Nutzer wünschen ein dunkles Design; der Feldeinsatz findet bei sehr
unterschiedlichen Lichtverhältnissen statt. Die App ist eine einzelne HTML-Datei
mit vielen fest verdrahteten Farben.

## Entscheidung

- Drei Modi, wählbar in den Einstellungen: **Hell**, **Dunkel**, **Auto**.
  `Auto` folgt dem Betriebssystem über `prefers-color-scheme` (inkl. Live-Reaktion).
- Das dunkle Design betrifft **nur die UI-Chrome** (Panel, Popup, Dock, Buttons,
  Dialoge) über einen `body.theme-dark`-Override-Block. Die **Zeichenfläche bleibt
  hell** — die Objekte (schwarzer Text, Schild, Farben) sind für hellen Hintergrund
  gezeichnet.
- Auswahl wird in `localStorage` (`skisim_theme`) gespeichert und früh angewendet
  (kein Umfärben-Flackern).

## Konsequenzen

**Positiv**
- Flexibel; „Auto" respektiert Systemeinstellung.
- Geringes Risiko: ein additiver Override-Block statt Umbau aller CSS-Regeln.

**Negativ / Risiken**
- Objektfarben sind nicht für dunklen Hintergrund optimiert → Canvas bewusst hell.
- Der Dark-Override-Block muss bei neuen UI-Elementen mitgepflegt werden.

## Alternativen

- **Alles dunkel inkl. Zeichenfläche:** verworfen — schwarze Objekte/Texte würden
  unlesbar, erforderte zusätzliche Anpassung aller Objektfarben.
- **Vollständiges CSS-Variablen-Refactoring:** verworfen zugunsten des gezielten
  Override-Blocks (weniger Risiko bei einer gewachsenen Single-File-App).
