# User Stories — Ski-Simulation

**Stand:** 2026.07.0035 · App: [asolvo.github.io/skisim](https://asolvo.github.io/skisim/)

User Stories für die Web-App zum Skizzieren von Alpinunfällen. Hauptrolle:
**Sachverständige:r** (z. B. für Ski-/Rodelunfälle), die am Tablet, Laptop oder
Desktop schnell eine Unfallskizze in Vogelperspektive erstellt. Ergänzend die
Rollen **Betreiber** (Lizenzverwaltung) und **KI-Assistent** (optionale
Sprach-/Text-Fernsteuerung per MCP).

Format: *Als \<Rolle\> möchte ich \<Ziel\>, damit \<Nutzen\>.*

---

## 1. Skizze erstellen & Objekte

- **Objekt platzieren:** Als Sachverständige:r möchte ich Objekte aus dem Dock per
  Ziehen (Maus) oder Antippen (Touch) auf die Fläche setzen, damit ich eine Skizze
  schnell aufbauen kann.
- **Personen-Figuren:** Als Sachverständige:r möchte ich Skifahrer (Schulterstellung
  gerade / vor / zurück), Pflugfahrer, Snowboarder, Rodler und eine verletzte Person
  platzieren, damit ich alle Beteiligten darstellen kann.
- **Fahrzeuge:** Als Sachverständige:r möchte ich ein Schneemobil (Ski-Doo-Zweisitzer
  mit Ladefläche) und eine Pistenraupe (PistenBully-Stil, mit Frontschild, Kabine und
  Heckfräse) in Aufsicht platzieren, um Pistenfahrzeuge darzustellen.
- **Figuren/Fahrzeuge einfärben:** Als Sachverständige:r möchte ich jede
  Personen-Figur und jedes Fahrzeug einfärben, damit ich Beteiligte klar
  auseinanderhalten kann — Figuren aus einer eigenen Skimode-Palette (11 Farben),
  getrennt von der Objekt-Palette.
- **Verletzte Person:** Als Sachverständige:r möchte ich eine klar erkennbare,
  liegende Person mit Notfall-Markierung setzen, um die Endlage zu kennzeichnen.
- **Umgebung & Hinweise:** Als Sachverständige:r möchte ich Bäume, Fangzaun und ein
  einfärbbares Schild platzieren; das Schild kann ich in fünf Formen (rund, quadrat,
  rechteck, dreieck, raute) mit eigener, mehrzeiliger Beschriftung wählen.
- **Gelände:** Als Sachverständige:r möchte ich eine Böschung (Schraffur-Linie) und
  eine Liftstütze setzen, um Geländekanten und Anlagen darzustellen.
- **Hilfsobjekte:** Als Sachverständige:r möchte ich Linien, Pfeile, V-Formen,
  Boxen/Hindernisse, Textfelder und Geschwindigkeits-Vektoren nutzen, um Wege,
  Richtungen und Tempo zu annotieren. V-Form und Bemaßung werden beim Skalieren nur
  länger, nicht dicker (konstante Linienbreite).
- **Bemaßung:** Als Sachverständige:r möchte ich eine Maßlinie mit Beschriftung
  setzen, die sich beim Skalieren nur in der **Länge** ändert, um Abstände
  maßstabsgetreu einzutragen.
- **Geschwindigkeit:** Als Sachverständige:r möchte ich einen Geschwindigkeits-Pfeil
  mit km/h-Wert setzen (max. 9999 km/h), der m/s automatisch mit ausweist.
- **Mehrere Instanzen:** Als Sachverständige:r möchte ich **jedes** Objekt beliebig
  oft platzieren können (auch mehrere Skifahrer desselben Typs); die Objekte bleiben
  dabei im Dock. (Ausnahme: Gast ohne Lizenz — max. eine Personen-Figur.)

## 2. Auswahl & Mehrfachauswahl

- **Einzelauswahl:** Als Nutzer möchte ich ein Objekt anklicken/antippen, um es
  auszuwählen (Auswahlring).
- **Mehrfachauswahl:** Als Sachverständige:r möchte ich mit der Maus ein Rechteck
  aufziehen (Marquee) oder mit Umschalt+Klick mehrere Objekte auswählen und diese
  **gemeinsam verschieben oder löschen**, um Gruppen effizient zu bearbeiten.
- **Auswahl aufheben:** Als Nutzer möchte ich durch Klick auf eine leere Stelle die
  Auswahl aufheben.

## 3. Steuerung & Eingabe (Touch, Maus, Tastatur)

- **Touch:** Als Tablet-Nutzer möchte ich Objekte mit Zwei-Finger-Geste gleichzeitig
  zoomen und drehen, damit die Bedienung intuitiv ist.
- **Maus:** Als Desktop-Nutzer möchte ich mit Mausrad zoomen, mit der rechten
  Maustaste drehen und per Aufziehrechteck mehrere Objekte wählen.
- **Tastatur (vollständig bedienbar):** Als Nutzer möchte ich die App per Tastatur
  bedienen — Verschieben (Pfeile), Drehen (`,` / `.`), Zoom (`+` / `-`),
  Hinzufügen/Duplizieren (`Einfg`), Löschen (`Entf`), Bearbeiten (`Enter`), Farbe
  wechseln (`c`), Rückgängig/Wiederholen (`Strg+Z` / `Strg+Y`), Objekte durchschalten
  (`Tab`), Dialoge schließen (`Esc`).

## 4. Objekte bearbeiten

- **Beschriftung:** Als Sachverständige:r möchte ich Text-, Vektor-, Bemaßungs- und
  Schild-Beschriftungen per Doppelklick/-tipp oder `Enter` in einem Dialog ändern,
  der zuverlässig auf allen Geräten funktioniert.
- **Schild-Form:** Als Sachverständige:r möchte ich bei einem ausgewählten Schild die
  Form über eine kontextuelle Leiste wechseln (rund/quadrat/rechteck/dreieck/raute).
- **Farbe (kontextuelle Leiste):** Als Sachverständige:r möchte ich bei einer
  einfärbbaren Auswahl eine Farbleiste sehen und die Farbe per Klick wählen; sie zeigt
  automatisch die passende Palette (Objekt- bzw. Skimode-Palette).
- **Größe/Drehung/Position:** Als Sachverständige:r möchte ich Objekte frei
  verschieben, drehen (Einrasten in 15°-Schritten) und skalieren; Objekte bleiben
  dabei — auch gedreht — im sichtbaren Bereich.

## 5. Szenario-Metadaten & Legende

- **Metadaten erfassen:** Als Sachverständige:r möchte ich Ortsbezeichnung,
  Koordinaten (UTM **oder** WGS84, komma-/punkt-tolerant), Exposition (klickbarer
  Kompass + Gradfeld), Neigung, Querneigung und eine Beschreibung erfassen, damit die
  Skizze gutachtentauglichen Kontext trägt.
- **Legende:** Als Sachverständige:r möchte ich diese Angaben als Legende auf der
  Zeichenfläche sehen (mit Kompass- und Neigungs-Vorschau); leere Felder werden
  weggelassen, die Legende ist per Doppelklick editierbar und im PNG-Export enthalten.
- **Urheber:** Als Sachverständige:r möchte ich optional eine Copyright-Fußzeile
  („Skizze © <Lizenzname>") in der Legende einblenden.

## 6. Rückgängig & Datensicherheit

- **Rückgängig/Wiederholen:** Als Sachverständige:r möchte ich Aktionen rückgängig
  machen und wiederholen können (Buttons oder `Strg+Z` / `Strg+Y`), damit
  Fehlbedienungen (auch Gruppen-Löschen oder KI-Befehle) reversibel sind.
- **Autosave:** Als Sachverständige:r möchte ich, dass die laufende Skizze automatisch
  im Browser gesichert wird und mir beim Start angeboten wird, die letzte Sitzung
  wiederherzustellen.
- **Verlustschutz:** Als Sachverständige:r möchte ich beim Schließen gewarnt werden,
  solange es ungespeicherte Änderungen gibt.

## 7. Lizenzierung

- **Aktivieren:** Als Sachverständige:r möchte ich meine Lizenz mit einem Schlüssel
  aktivieren; das Popup erklärt kurz den Unterschied zwischen Gast und Voll-Lizenz und
  verlinkt die Lizenzanforderung.
- **Offline-Nutzung:** Als Sachverständige:r möchte ich nach der Aktivierung bis zu
  30 Tage offline arbeiten; die Lizenz erneuert sich bei Internet automatisch.
- **Gültigkeit sehen:** Als Sachverständige:r möchte ich sehen, auf wen die Lizenz
  läuft und bis wann sie gilt, sowie mich wieder abmelden können.
- **Gast-Nutzung:** Als Gast (ohne Lizenz) möchte ich die App ausprobieren — Objekte
  platzieren und ansehen; gesperrte Funktionen (Export/Speichern/Teilen) sind
  ausgegraut, und ich kann nur **eine** Personen-Figur setzen.
- **Lizenzverwaltung:** Als Betreiber möchte ich Lizenzen zentral anlegen, verlängern
  und widerrufen (signierte Tokens via Cloudflare Worker), ohne die App neu
  auszuliefern.

## 8. KI-Fernsteuerung (MCP)

- **Verbinden:** Als Sachverständige:r mit Lizenz möchte ich die Skizze optional von
  einem KI-Assistenten (MCP-Client wie Claude Desktop/Code) steuern lassen — ich
  aktiviere die Verbindung in den Einstellungen und koppele sie über einen
  angezeigten Code.
- **Steuern:** Als Nutzer möchte ich per Assistent Objekte hinzufügen, verschieben,
  drehen, skalieren, einfärben, beschriften und löschen, die Szene als JSON lesen/
  laden und einen Screenshot anfordern lassen — jeder Befehl wird von der App wie ein
  Datei-Import validiert.

## 9. Darstellung & Sprache

- **Design:** Als Nutzer möchte ich zwischen hellem, dunklem und automatischem Design
  wählen; die Zeichenfläche bleibt hell.
- **Schärfe:** Als Nutzer mit hochauflösendem Display möchte ich eine scharfe
  Darstellung und einen scharfen PNG-Export (HiDPI-Rendering).
- **Sprache:** Als Nutzer möchte ich zwischen Deutsch und English umschalten.
- **Persistenz:** Als Nutzer möchte ich, dass Design und Sprache gespeichert werden.

## 10. Speichern, Export & Teilen

- **Speichern/Laden:** Als Sachverständige:r möchte ich eine Skizze als JSON-Projekt
  speichern (`s`) und wieder laden (`o`), um später weiterzuarbeiten.
- **Ordnerwahl & Dateinamen:** Als Sachverständige:r möchte ich beim Speichern/Export
  den Zielordner wählen (wo unterstützt) und sprechende Dateinamen erhalten
  („<Ort> <Datum> <Uhrzeit> <Nr>"), die sich im Explorer sinnvoll sortieren.
- **Export:** Als Sachverständige:r möchte ich die Skizze als PNG exportieren (`e`),
  um sie in Gutachten einzubinden.
- **Teilen:** Als Sachverständige:r möchte ich die Skizze (auf unterstützten Geräten)
  direkt teilen können.

## 11. Plattform, Barrierefreiheit & Zuverlässigkeit

- **Geräteübergreifend:** Als Nutzer möchte ich die App auf Smartphone, Tablet, Laptop
  und Desktop gut nutzen können; das Bedienfeld passt sich an kleine Bildschirme an.
- **Barrierefreiheit (WCAG 2.1 AA):** Als Nutzer mit Hilfstechnologie möchte ich die
  App per Tastatur bedienen und Statusmeldungen (aria-live) hören; Kontraste und
  Fokus-Anzeige erfüllen Level AA. Die Seite bleibt zoombar.
- **Effizienz:** Als Nutzer möchte ich, dass die Zeichenfläche im Ruhezustand nicht
  dauernd neu gezeichnet wird (schont Akku/CPU).
- **Stabilität:** Als Nutzer möchte ich, dass die App sofort lädt und nicht bei
  „Lade Simulation…" hängen bleibt.

---

## Offen / Ideen (Backlog)

- Skifahrer „Schulter vor/zurück" optisch deutlicher unterscheidbar.
- Fangzaun-Farben an die Objekt-Palette angleichen.
- KI-Fernsteuerung Stufe 2: Remote-Relay mit Pairing für Sprachsteuerung vom
  Smartphone (App am Desktop) — siehe ADR-0029.
- Produktiv-Auslieferung auf `alpinesicherheit.com`.
