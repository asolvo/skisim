#!/usr/bin/env node
// Skisim MCP-Server (Stufe 1, lokal)
// ----------------------------------
// Verbindet einen MCP-Client (z. B. Claude Desktop/Code) mit der laufenden
// Ski-Simulation im Browser. Der Server bietet MCP-Tools über stdio an und
// leitet sie über einen lokalen WebSocket (127.0.0.1:4877) an die App weiter,
// die jeden Befehl selbst validiert ausführt.
//
// Ablauf: App öffnen → Einstellungen → KI-Assistent → Verbinden (zeigt einen
// 6-stelligen Code). Dann im Assistenten das Tool "pair" mit diesem Code
// aufrufen; danach stehen alle Steuer-Tools bereit.
//
// Aufruf (aus MCP-Client-Konfig): node <pfad>/mcp-server/index.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { WebSocketServer } from "ws";
import { z } from "zod";

const PORT = 4877;
const HOST = "127.0.0.1";
const REQUEST_TIMEOUT_MS = 10000;

// ---- Zustand der Brücke ----
let appSocket = null;   // WebSocket der verbundenen Skisim-App
let appCode = null;     // von der App angekündigter Kopplungscode
let paired = false;     // true, sobald der Assistent den Code per pair() bestätigt hat
const pending = new Map();
let seq = 1;

function callApp(tool, args) {
  return new Promise((resolve, reject) => {
    if (!appSocket || appSocket.readyState !== 1) {
      return reject(new Error("Keine Skisim-App verbunden. In der App: Einstellungen → KI-Assistent → Verbinden."));
    }
    if (!paired) {
      return reject(new Error("Nicht gekoppelt. Zuerst das Tool \"pair\" mit dem in der App angezeigten Code aufrufen."));
    }
    const id = seq++;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error("Zeitüberschreitung — keine Antwort der App."));
    }, REQUEST_TIMEOUT_MS);
    pending.set(id, { resolve, reject, timer });
    try {
      appSocket.send(JSON.stringify({ type: "cmd", id, tool, args: args || {} }));
    } catch (e) {
      clearTimeout(timer);
      pending.delete(id);
      reject(new Error("Senden an die App fehlgeschlagen: " + e.message));
    }
  });
}

// ---- WebSocket-Server (nur loopback) ----
const wss = new WebSocketServer({ host: HOST, port: PORT });
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    let m;
    try { m = JSON.parse(data.toString()); } catch (e) { return; }
    if (m.type === "hello" && m.role === "app") {
      // Neue App-Verbindung: bisherige ersetzen, Kopplung zurücksetzen.
      appSocket = ws;
      appCode = String(m.code || "");
      paired = false;
      return;
    }
    if (m.type === "result" && pending.has(m.id)) {
      const p = pending.get(m.id);
      clearTimeout(p.timer);
      pending.delete(m.id);
      p.resolve(m.result);
      return;
    }
  });
  ws.on("close", () => {
    if (ws === appSocket) { appSocket = null; paired = false; }
  });
  ws.on("error", () => {});
});
wss.on("error", (e) => { console.error("[skisim-mcp] WebSocket-Server-Fehler:", e.message); });

// ---- MCP-Server ----
const server = new McpServer({ name: "skisim", version: "1.0.0" });

const textResult = (x) => ({ content: [{ type: "text", text: typeof x === "string" ? x : JSON.stringify(x, null, 2) }] });
const errorResult = (msg) => ({ content: [{ type: "text", text: "Fehler: " + msg }], isError: true });

// Tool, das einen App-Befehl weiterreicht und das JSON-Ergebnis zurückgibt.
function forward(name, description, shape, opts) {
  const mapArgs = (opts && opts.mapArgs) || ((a) => a);
  const isImage = !!(opts && opts.image);
  server.tool(name, description, shape || {}, async (a) => {
    try {
      const res = await callApp(name, mapArgs(a || {}));
      if (isImage && res && res.ok && res.image && typeof res.image.dataUrl === "string") {
        const b64 = res.image.dataUrl.split(",")[1] || "";
        return { content: [{ type: "image", data: b64, mimeType: res.image.mime || "image/png" }] };
      }
      return textResult(res);
    } catch (e) {
      return errorResult(e.message);
    }
  });
}

// pair: koppelt Assistent + App über den in der App angezeigten Code.
server.tool(
  "pair",
  "Koppelt den Assistenten mit der verbundenen Ski-Simulation. Übergib den 6-stelligen Code, den die App unter Einstellungen → KI-Assistent anzeigt. Muss vor allen Steuer-Tools einmal aufgerufen werden.",
  { code: z.string().describe("6-stelliger Kopplungscode aus der App") },
  async ({ code }) => {
    if (!appSocket || appSocket.readyState !== 1) return textResult("Keine App verbunden. In der App: Einstellungen → KI-Assistent → Verbinden.");
    if (String(code).trim() !== appCode) return textResult("Code stimmt nicht mit dem in der App angezeigten überein.");
    paired = true;
    try { appSocket.send(JSON.stringify({ type: "paired" })); } catch (e) {}
    return textResult("Gekoppelt. Die Skizze kann jetzt gesteuert werden.");
  }
);

forward("list_objects", "Listet alle Objekte der Skizze (id, typ, Position als Mittelpunkt x/y, Größe, Rotation, Farbe, Text, Label) samt Canvas-Größe.", {});
forward("get_project", "Gibt die komplette Skizze als Projekt-JSON zurück (objects + scene, format-identisch mit Speichern/Import), ergänzt um Objekt-IDs und Canvas-Größe.", {});
forward(
  "load_project",
  "Lädt eine komplette Skizze aus Projekt-JSON (objects + scene) und ersetzt die aktuelle. Wird wie ein Datei-Import validiert (unbekannte Objekte/Felder werden verworfen).",
  { project: z.object({ objects: z.array(z.any()), scene: z.record(z.any()).optional() }).describe("Projekt im Speichern-Format: { objects:[...], scene:{...} }") }
);
forward(
  "add_object",
  "Fügt ein Objekt hinzu. object = einer von: skier, skier_shoulder_front, skier_shoulder_back, snowplow, snowboarder, sled, snowmobile, groomer, injured, tree, fence, sign, text, velocity, dimension, line, arrow, vshape, rect, embankment, liftpole. x/y = Mittelpunkt (optional, Standard Canvas-Mitte). color optional (Name oder Hex), rotation in Grad, text für text/sign/velocity/dimension, shape für sign (round|square|rect|triangle|diamond).",
  {
    object: z.string(),
    x: z.number().optional(),
    y: z.number().optional(),
    color: z.string().optional(),
    rotation: z.number().optional(),
    text: z.string().optional(),
    shape: z.string().optional()
  }
);
forward("move_object", "Verschiebt ein Objekt. id = Objekt-ID; x/y = neuer Mittelpunkt (jeweils optional).", { id: z.number(), x: z.number().optional(), y: z.number().optional() });
forward("rotate_object", "Setzt die Rotation eines Objekts (absolute Grad).", { id: z.number(), rotation: z.number() });
forward("scale_object", "Skaliert ein Objekt um den Faktor (z. B. 1.2 = 20% größer, 0.8 = kleiner).", { id: z.number(), factor: z.number() });
forward("set_color", "Setzt die Farbe eines einfärbbaren Objekts (Farbname wie rot/blau/gelb oder Hex #RRGGBB).", { id: z.number(), color: z.string() });
forward("set_text", "Setzt den Text/die Beschriftung (nur text, sign, velocity, dimension).", { id: z.number(), text: z.string() });
forward("delete_object", "Entfernt ein Objekt aus der Skizze.", { id: z.number() });
forward(
  "set_scene",
  "Setzt Szenario-Metadaten (nur übergebene Felder werden geändert): name, coordSys (utm|wgs84), zone, east, north, lat, lon, aspectDeg, slope, crossSlope, desc, visible, showCopyright.",
  {
    name: z.string().optional(),
    coordSys: z.enum(["utm", "wgs84"]).optional(),
    zone: z.string().optional(),
    east: z.string().optional(),
    north: z.string().optional(),
    lat: z.string().optional(),
    lon: z.string().optional(),
    aspectDeg: z.number().optional(),
    slope: z.number().optional(),
    crossSlope: z.number().optional(),
    desc: z.string().optional(),
    visible: z.boolean().optional(),
    showCopyright: z.boolean().optional()
  },
  { mapArgs: (a) => ({ scene: a }) }
);
forward("get_screenshot", "Gibt die aktuelle Skizze als PNG-Bild zurück — damit der Assistent sehen kann, was er tut.", {}, { image: true });

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[skisim-mcp] bereit. WebSocket auf ws://" + HOST + ":" + PORT + " — App verbinden und mit pair() koppeln.");
