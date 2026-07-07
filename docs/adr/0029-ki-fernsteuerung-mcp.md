# ADR-0029: KI-Fernsteuerung über MCP-Server

- **Status:** Akzeptiert
- **Datum:** 2026-07-06
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** 2026.07.0031 (Stufe 1, lokal)
- **Bezug:** [ADR-0005](0005-granulares-feature-gating.md) (Feature-Gating),
  [ADR-0012](0012-gast-einschraenkungen.md) (Gast-Limit),
  [ADR-0022](0022-import-validierung.md) (Eingabe-Validierung)

## Kontext

Die Skizze soll optional von einem KI-Assistenten gesteuert werden können
(„Setze einen Snowboarder oberhalb des Baums und färbe ihn rot"). Der Standard
dafür ist **MCP** (Model Context Protocol): Der Assistent ist MCP-Client und ruft
Werkzeuge eines MCP-Servers auf. Die Skisim läuft aber **im Browser** (Szene im
Speicher), ein MCP-Server ist ein **eigener Prozess** — er kann nicht direkt in
den Browser greifen. Es braucht eine Brücke.

## Entscheidung

**Architektur (Stufe 1, lokal):**

```
Assistent (MCP-Client) ⇄ stdio ⇄ mcp-server/ ⇄ ws://127.0.0.1:4877 ⇄ Skisim im Browser
```

- Neuer Ordner `mcp-server/` (Node, `@modelcontextprotocol/sdk` + `ws`): bietet die
  Tools über stdio an und lauscht auf einem **loopback**-WebSocket.
- Die App verbindet sich **opt-in** (Einstellungen → KI-Assistent → Verbinden) per
  WebSocket mit dem Server und führt eingehende Befehle **selbst** aus.
- **Kopplung:** Die App erzeugt einen 6-stelligen Code und zeigt ihn an; der
  Assistent muss ihn einmalig über das Tool `pair` bestätigen. Erst danach sind
  die Steuer-Tools freigeschaltet.

**Werkzeugkatalog:** `list_objects`, `get_project`, `load_project`, `add_object`,
`move_object`, `rotate_object`, `scale_object`, `set_color`, `set_text`,
`delete_object`, `set_scene`, `get_screenshot` (+ `pair`). Positionen werden
gegenüber dem Assistenten als **Mittelpunkt** ausgedrückt.

**Getroffene Entscheidungen (Rückfragen):**
- **Stufe 1 zuerst** (lokal, Desktop-Client) statt sofort Remote.
- **Lizenzpflichtig:** KI-Verbindung nur bei **aktiver Lizenz** (`aiAllowed()`);
  lässt sich später über das granulare Gating (ADR-0005) auf ein `ai`-Feature-Flag
  verengen. Gast-Limit und Feature-Gating gelten für KI-Befehle unverändert.
- **`get_screenshot` inklusive**, damit der Assistent räumliche Anweisungen
  auflösen und sein Ergebnis prüfen kann.
- **`get_project`/`load_project`** liefern/laden das bestehende Projekt-JSON
  (format-identisch mit Speichern/Import), ergänzt um IDs & Canvas-Größe.

**Sicherheit:** WebSocket nur auf `127.0.0.1`; Kopplungscode nötig; **keine
Freiform-Ausführung** — nur der Befehlskatalog, jeder Befehl mit Import-Strenge
validiert (Whitelist/Clamping, [ADR-0022](0022-import-validierung.md)); kein
`eval`, kein Datei-/Netzzugriff aus der App. Objekte erhalten stabile IDs, damit
Befehle ein Objekt eindeutig adressieren.

## Konsequenzen

**Positiv**
- Steuerung per Assistent (Text/Diktat am Desktop) ohne Bruch des Sicherheits-
  und Freemium-Modells; nutzt vorhandene Routinen (createObject, checkBounds,
  sanitizeImportedObjects …).
- `mcp-server/` ist committbar (keine Geheimnisse); `node_modules` via `.gitignore`
  ausgeschlossen.

**Negativ / Risiken**
- Server und Browser müssen auf **demselben Rechner** laufen (Stufe 1).
- Sprache liefert der **Assistent**, nicht dieser Server — echte Voice-Steuerung
  vom Smartphone erfordert Stufe 2.
- Fester Port 4877; bei Kollision meldet der Server EADDRINUSE.

## Alternativen

- **Direkt Remote-Relay (Stufe 2) zuerst:** verworfen — Cloudflare Durable Objects
  + Pairing sind ein deutlich größerer Wurf; erst nach Erfahrungen mit Stufe 1.
- **Nur Projekt-Datei manipulieren statt Live-Steuerung:** verworfen — keine
  interaktive Rückmeldung/kein Screenshot, umständlicher Workflow.
- **Freiform-JS aus dem Assistenten ausführen:** verworfen — inakzeptables
  Sicherheitsrisiko; nur der validierte Befehlskatalog.

## Geplant (Stufe 2, Remote)

Cloudflare-Worker mit Durable Objects als Relay zwischen App und Assistent, gekoppelt
über den in der App angezeigten Code. Erst damit können claude.ai-Connectors bzw.
die Claude-Mobile-App (Sprachmodus) die am Desktop laufende Skizze steuern.
