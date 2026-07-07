# Skisim MCP-Server (Stufe 1, lokal)

Steuert die **ASI-Tirol Ski-Simulation** über einen KI-Assistenten (MCP-Client wie
Claude Desktop oder Claude Code). Der Assistent ruft MCP-Tools auf; dieser Server
leitet sie über einen lokalen WebSocket an die im Browser laufende App weiter, die
jeden Befehl selbst **validiert** ausführt.

```
Assistent (MCP-Client) ⇄ stdio ⇄ dieser Server ⇄ ws://127.0.0.1:4877 ⇄ Skisim im Browser
```

Voraussetzung: In der Skisim ist eine **aktive Lizenz** nötig, um die KI-Verbindung
zu aktivieren.

## Installation

```bash
cd mcp-server
npm install
```

## Einrichtung im MCP-Client

Beispiel `claude_desktop_config.json` (Pfad absolut angeben):

```json
{
  "mcpServers": {
    "skisim": {
      "command": "node",
      "args": ["C:/Users/DEIN_PFAD/skisim 2026/mcp-server/index.js"]
    }
  }
}
```

Für Claude Code: `claude mcp add skisim -- node "C:/…/mcp-server/index.js"`.

## Nutzung

1. Ski-Simulation im Browser öffnen (Chrome/Edge, Desktop).
2. **Einstellungen → KI-Assistent → Verbinden** — es erscheint ein 6-stelliger
   Kopplungscode.
3. Im Assistenten das Tool **`pair`** mit diesem Code aufrufen
   (z. B. „Verbinde dich mit der Skisimulation, der Code ist 123456").
4. Danach steuern, z. B.: „Setze einen Snowboarder in die Mitte und färbe ihn rot",
   „Verschiebe Objekt 3 nach links", „Zeig mir einen Screenshot".

## Werkzeugkatalog

| Tool | Zweck |
|------|-------|
| `pair` | Kopplung per Code aus der App (einmalig) |
| `list_objects` | Objekte auflisten (IDs, Position=Mittelpunkt, Größe, Farbe, Text) |
| `get_project` | Komplette Skizze als Projekt-JSON (objects + scene) |
| `load_project` | Skizze aus Projekt-JSON laden (validiert) |
| `add_object` | Objekt hinzufügen |
| `move_object` / `rotate_object` / `scale_object` | Objekt verändern |
| `set_color` / `set_text` | Farbe / Beschriftung setzen |
| `delete_object` | Objekt entfernen |
| `set_scene` | Szenario-Metadaten setzen |
| `get_screenshot` | Aktuelle Skizze als PNG |

## Sicherheit

- WebSocket lauscht nur auf **127.0.0.1** (kein Zugriff aus dem Netz).
- **Kopplungscode**: Nur wer den in der App angezeigten Code kennt (via `pair`),
  kann steuern.
- **Keine Freiform-Ausführung**: ausschließlich der obige Befehlskatalog; die App
  validiert jeden Befehl (Whitelist/Clamping wie beim Datei-Import).
- Das Gast-Limit (ohne Lizenz max. 1 Personen-Figur) und das Feature-Gating der
  App gelten unverändert auch für KI-Befehle.

## Grenzen (Stufe 1)

Server und Browser müssen auf **demselben Rechner** laufen. Sprachsteuerung vom
Smartphone (App am Desktop) erfordert Stufe 2 (Cloudflare-Relay mit Pairing) —
siehe ADR-0029.
