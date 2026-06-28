# User Stories — Ski-Simulation

**Stand:** v119 · App: [asolvo.github.io/skisim](https://asolvo.github.io/skisim/)

User Stories für die Web-App zum Skizzieren von Alpinunfällen. Hauptrolle:
**Sachverständige:r** (z. B. für Ski-/Rodelunfälle), die am Tablet, Laptop oder
Desktop schnell eine Unfallskizze in Vogelperspektive erstellt. Ergänzend die
Rolle **Betreiber** (Lizenzverwaltung).

Format: *Als \<Rolle\> möchte ich \<Ziel\>, damit \<Nutzen\>.*

---

## 1. Skizze erstellen & Objekte

- **Objekt platzieren:** Als Sachverständige:r möchte ich Objekte aus dem Dock per
  Ziehen (Maus) oder Antippen (Touch) auf die Fläche setzen, damit ich eine Skizze
  schnell aufbauen kann.
- **Figuren:** Als Sachverständige:r möchte ich Skifahrer (blau/grün, mit
  Schulterstellung vor/zurück), Pflugfahrer, Snowboarder, Rodler und eine verletzte
  Person platzieren, damit ich alle Beteiligten darstellen kann.
- **Verletzte Person:** Als Sachverständige:r möchte ich eine klar erkennbare,
  liegende Person mit Notfall-Markierung setzen, um die Endlage zu kennzeichnen.
- **Umgebung & Hinweise:** Als Sachverständige:r möchte ich Bäume, Fangzaun und ein
  einfärbbares Warnschild („!") platzieren, um die Pistensituation darzustellen.
- **Hilfsobjekte:** Als Sachverständige:r möchte ich Linien, Pfeile, V-Formen,
  Boxen/Hindernisse, Textfelder und Geschwindigkeits-Vektoren nutzen, um Wege,
  Richtungen und Tempo zu annotieren.
- **Bemaßung:** Als Sachverständige:r möchte ich eine Maßlinie (Bemaßung) mit
  Beschriftung setzen, die sich beim Skalieren nur in der **Länge** ändert (nicht
  dicker wird), damit ich Abstände maßstabsgetreu eintragen kann.
- **Mehrfach vs. einzeln:** Als Sachverständige:r möchte ich Hilfs-/Deko-Objekte
  (Linie, Pfeil, Baum, Zaun, Schild, Text …) beliebig oft setzen können, während
  Personen-Figuren beim Platzieren aus dem Dock wandern, damit ich keine Duplikate
  derselben Person erzeuge.

## 2. Steuerung & Eingabe (Touch, Maus, Tastatur)

- **Touch:** Als Tablet-Nutzer möchte ich Objekte mit Zwei-Finger-Geste gleichzeitig
  zoomen und drehen, damit die Bedienung intuitiv ist.
- **Maus:** Als Desktop-Nutzer möchte ich mit Mausrad zoomen und mit der rechten
  Maustaste drehen.
- **Tastatur (vollständig bedienbar):** Als Nutzer möchte ich die App auch per
  Tastatur bedienen können — Verschieben (Pfeile), Drehen (`,` / `.`), Zoom
  (`+` / `-`), Hinzufügen/Duplizieren (`Einfg`), Löschen (`Entf`), Bearbeiten
  (`Enter`), Farbe wechseln (`c`), Objekte durchschalten (`Tab`), Dialoge schließen
  (`Esc`).
- **Löschen:** Als Nutzer möchte ich ein markiertes Objekt mit `Entf` oder durch
  Zurückziehen ins Dock entfernen.
- **Auswahl aufheben:** Als Nutzer möchte ich durch Klick auf eine leere Stelle die
  Auswahl aufheben.

## 3. Objekte bearbeiten

- **Beschriftung:** Als Sachverständige:r möchte ich Text-, Vektor- und
  Bemaßungs-Beschriftungen per Doppelklick/-tipp oder `Enter` in einem Dialog
  ändern, der zuverlässig auf allen Geräten funktioniert.
- **Farbe (kontextuelle Leiste):** Als Sachverständige:r möchte ich bei einem
  ausgewählten einfärbbaren Objekt eine Farbleiste sehen und die Farbe per Klick
  direkt wählen — aus einer harmonischen Palette (Pisten-Blau/-Rot, Schwarz, Grün,
  Braun, Grau, Fast-Weiß).
- **Größe/Drehung/Position:** Als Sachverständige:r möchte ich Objekte frei
  verschieben, drehen (mit Einrasten in 15°-Schritten) und skalieren.

## 4. Lizenzierung

- **Aktivieren:** Als Sachverständige:r möchte ich meine Lizenz mit einem Schlüssel
  aktivieren (Panel-Zahnrad → Popup oder „Lizenz aktivieren"), damit die
  kostenpflichtigen Funktionen freigeschaltet werden.
- **Offline-Nutzung:** Als Sachverständige:r möchte ich nach der Aktivierung bis zu
  30 Tage offline arbeiten können; die Lizenz erneuert sich bei Internet automatisch.
- **Gültigkeit sehen:** Als Sachverständige:r möchte ich im Popup sehen, auf wen die
  Lizenz läuft und bis wann sie gültig ist, sowie mich wieder abmelden können.
- **Gast-Nutzung:** Als Gast (ohne Lizenz) möchte ich die App ausprobieren können —
  Objekte platzieren und ansehen; gesperrte Funktionen (Export/Speichern/Teilen)
  sind ausgegraut, und ich kann nur **eine** Personen-Figur setzen.
- **Lizenzverwaltung:** Als Betreiber möchte ich Lizenzen zentral anlegen,
  verlängern und widerrufen können (signierte Tokens via Cloudflare Worker), damit
  ich den Zugang steuern kann, ohne die App neu auszuliefern.

## 5. Darstellung & Sprache

- **Design:** Als Nutzer möchte ich zwischen hellem, dunklem und automatischem
  (System-)Design wählen, damit die Oberfläche zu Umgebung und Vorliebe passt; die
  Zeichenfläche bleibt hell.
- **Sprache:** Als Nutzer möchte ich die Sprache zwischen Deutsch und English
  umschalten, damit die App in meiner Sprache läuft.
- **Persistenz:** Als Nutzer möchte ich, dass Design und Sprache gespeichert werden
  und beim nächsten Öffnen wieder gelten.

## 6. Speichern, Export & Teilen

- **Speichern/Laden:** Als Sachverständige:r möchte ich eine Skizze als JSON-Projekt
  speichern (`s`) und wieder laden (`o`), damit ich später daran weiterarbeiten kann.
- **Export:** Als Sachverständige:r möchte ich die Skizze als PNG exportieren (`e`),
  um sie in Gutachten einzubinden.
- **Teilen:** Als Sachverständige:r möchte ich die Skizze (auf unterstützten
  Geräten) direkt teilen können.

## 7. Plattform & Zuverlässigkeit

- **Geräteübergreifend:** Als Nutzer möchte ich die App auf Smartphone, Tablet,
  Laptop und Desktop gut nutzen können; das Bedienfeld passt sich an kleine
  Bildschirme an.
- **Barrierefreiheit:** Als Nutzer möchte ich die Seite zoomen können (kein
  gesperrtes Pinch-Zoom), während die Zeichengesten auf der Fläche erhalten bleiben.
- **Stabilität:** Als Nutzer möchte ich, dass die App sofort lädt und nicht bei
  „Lade Simulation…" hängen bleibt.

---

## Offen / Ideen (Backlog)

- Skifahrer „Schulter vor/zurück" optisch deutlicher unterscheidbar.
- Fangzaun-Farben an die Objekt-Palette angleichen.
- Produktiv-Auslieferung auf `alpinesicherheit.com`.
