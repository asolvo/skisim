// tools/release.js
// Stempelt eine neue Versionsnummer konsistent über alle Marker in index.html und legt
// die versionierte Kopie ski.mvp.<version>.html an. Verhindert den Fehler "Marker vergessen".
//
// Aufruf (aus Repo-Root oder tools/):
//   node tools/release.js              -> nächste Nummer automatisch (JJJJ.MM.NNNN, monatlicher Reset, ADR-0025)
//   node tools/release.js 2026.08.0001 -> explizite Version
//
// Aktualisierte Marker: Header-Kommentar <!-- Skisim X -->, Header-Datum, Popup-Version,
// shareText (DE + EN). Der <title> enthält seit 2026.07.0035 KEINE Version mehr und bleibt unberührt.
// Die Changelog-Prosa ("Neu in X …") schreibt der Mensch vorher von Hand.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'index.html');

function pad(n, w) { return String(n).padStart(w, '0'); }
function nextVersion(oldV) {
  const m = /^(\d{4})\.(\d{2})\.(\d{4})$/.exec(oldV);
  const d = new Date(), ty = d.getFullYear(), tm = pad(d.getMonth() + 1, 2);
  if (m && m[1] === String(ty) && m[2] === tm) return `${ty}.${tm}.${pad(parseInt(m[3], 10) + 1, 4)}`; // gleicher Monat -> hochzählen
  return `${ty}.${tm}.0001`; // neuer Monat -> Reset (ADR-0025)
}

let html = fs.readFileSync(FILE, 'utf8');
const cur = (html.match(/<!--\s*Skisim\s+(\d{4}\.\d{2}\.\d{4})\s*-->/) || [])[1];
if (!cur) { console.error('Aktuelle Version (<!-- Skisim JJJJ.MM.NNNN -->) nicht gefunden.'); process.exit(1); }
const next = process.argv[2] || nextVersion(cur);
if (!/^\d{4}\.\d{2}\.\d{4}$/.test(next)) { console.error('Ungültiges Versionsformat: ' + next); process.exit(1); }
if (next === cur) { console.error('Zielversion == aktuelle Version (' + cur + ').'); process.exit(1); }

const today = new Date().toISOString().slice(0, 10);
let changes = 0;
function replaceOnce(re, repl) { const before = html; html = html.replace(re, repl); if (html !== before) changes++; }

replaceOnce(/<!--\s*Skisim\s+\d{4}\.\d{2}\.\d{4}\s*-->/, '<!-- Skisim ' + next + ' -->');           // Header-Kommentar
replaceOnce(/(<!--[\s\S]{0,400}?Apache V2 License\s*\n)\d{4}-\d{2}-\d{2}/, '$1' + today);              // Header-Datum (nach Lizenzzeile)
replaceOnce(/(popup-version">)\d{4}\.\d{2}\.\d{4}(<)/, '$1' + next + '$2');                            // Popup-Version
replaceOnce(/(Erstellt mit Ski-Simulation )\d{4}\.\d{2}\.\d{4}/, '$1' + next);                          // shareText DE
replaceOnce(/(Created with Ski Simulation )\d{4}\.\d{2}\.\d{4}/, '$1' + next);                          // shareText EN

fs.writeFileSync(FILE, html, 'utf8');
fs.writeFileSync(path.join(ROOT, 'ski.mvp.' + next + '.html'), html, 'utf8'); // versionierte Kopie (ADR-0008)

// Service-Worker-Cache an die Version koppeln (ADR-0031) — sonst liefert der SW nach
// einem Deploy die alte, gecachte Version aus.
const SW = path.join(ROOT, 'sw.js');
if (fs.existsSync(SW)) {
  let sw = fs.readFileSync(SW, 'utf8');
  const swBefore = sw;
  sw = sw.replace(/(const CACHE = 'skisim-)\d{4}\.\d{2}\.\d{4}(';)/, '$1' + next + '$2');
  if (sw !== swBefore) { fs.writeFileSync(SW, sw, 'utf8'); changes++; console.log('sw.js: CACHE -> skisim-' + next); }
  else console.warn('WARNUNG: CACHE-Marker in sw.js nicht gefunden — bitte prüfen.');
}

// Kontrolle: taucht die alte Version noch irgendwo auf?
const leftover = (html.match(new RegExp(cur.replace(/\./g, '\\.'), 'g')) || []).length;
console.log(`Version ${cur} -> ${next}  (${changes} Marker aktualisiert, Datum ${today})`);
console.log('versionierte Kopie: ski.mvp.' + next + '.html');
if (changes < 5) console.warn('WARNUNG: weniger als 5 Marker geändert — bitte prüfen.');
if (leftover > 0) console.warn(`Hinweis: alte Version ${cur} steht noch ${leftover}× im Dokument (evtl. Changelog-Historie — ok).`);
