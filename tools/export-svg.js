// tools/export-svg.js
// Exportiert alle Skisim-Objekte als canvas-getreue SVGs nach ../objekte-svg/.
//
// Aufruf (aus dem Repo-Root oder tools/):  node tools/export-svg.js
//
// Sprites (Figuren): direkt aus den SVG_*-Konstanten in index.html (== Canvas-Darstellung).
// Vektorobjekte: via Aufnahme-Kontext, der die echten drawObject-Zeichenbefehle in SVG uebersetzt
//   (inkl. arcTo -> SVG-Arc fuer das gerundete Schild-Dreieck). Schatten werden bewusst weggelassen.
// Nach Aenderungen an Objekten/Farben in index.html erneut ausfuehren.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'index.html');
const OUT = path.join(ROOT, 'objekte-svg');
const html = fs.readFileSync(SRC, 'utf8');
fs.mkdirSync(OUT, { recursive: true });

// --- SVG_*-Konstanten einsammeln (fuer Sprites) ---
const re = /const\s+(SVG_[A-Z0-9_]+)\s*=\s*"data:image\/svg\+xml;charset=utf-8,"\s*\+\s*encodeURIComponent\(`([\s\S]*?)`\)/g;
const SVG = {}; let m;
while ((m = re.exec(html))) { SVG[m[1]] = m[2].trim(); }
const ensureXmlns = s => /xmlns=/.test(s) ? s : s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

// --- Aufnahme-Kontext: uebersetzt Canvas-2D-Aufrufe in SVG ---
const f = n => (Math.round(n * 100) / 100);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function parseFont(font) {
  const mSize = /(\d+(?:\.\d+)?)px/.exec(font) || [0, 10];
  const weight = /bold/i.test(font) ? 'bold' : 'normal';
  const fam = /px\s+(.+)$/.exec(font); return { size: parseFloat(mSize[1]), weight, family: fam ? fam[1] : 'sans-serif' };
}
class SvgCtx {
  constructor() { this.reset(); }
  reset() {
    this.parts = []; this._d = ''; this._cur = null; this._circle = null;
    this.fillStyle = '#000'; this.strokeStyle = '#000'; this.lineWidth = 1; this.lineCap = 'butt'; this.lineJoin = 'miter';
    this.font = '10px sans-serif'; this.textAlign = 'start'; this.textBaseline = 'alphabetic';
    this.shadowColor = 'transparent'; this.shadowBlur = 0; this.shadowOffsetX = 0; this.shadowOffsetY = 0;
    this._t = { x: 0, y: 0 }; this._stack = [];
    this.minX = 1e9; this.minY = 1e9; this.maxX = -1e9; this.maxY = -1e9;
  }
  _bb(x, y) { if (x < this.minX) this.minX = x; if (y < this.minY) this.minY = y; if (x > this.maxX) this.maxX = x; if (y > this.maxY) this.maxY = y; }
  save() { this._stack.push({ f: this.fillStyle, s: this.strokeStyle, lw: this.lineWidth, cap: this.lineCap, jn: this.lineJoin, ft: this.font, ta: this.textAlign, tb: this.textBaseline, t: { x: this._t.x, y: this._t.y } }); }
  restore() { const s = this._stack.pop(); if (s) { this.fillStyle = s.f; this.strokeStyle = s.s; this.lineWidth = s.lw; this.lineCap = s.cap; this.lineJoin = s.jn; this.font = s.ft; this.textAlign = s.ta; this.textBaseline = s.tb; this._t = s.t; } }
  translate(x, y) { this._t = { x: this._t.x + x, y: this._t.y + y }; }
  rotate() { /* Export bei rotation 0 -> no-op */ }
  _p(x, y) { return [x + this._t.x, y + this._t.y]; }
  beginPath() { this._d = ''; this._cur = null; this._circle = null; }
  moveTo(x, y) { const p = this._p(x, y); this._cur = p; this._d += `M${f(p[0])},${f(p[1])} `; this._bb(p[0], p[1]); }
  lineTo(x, y) { const p = this._p(x, y); this._cur = p; this._d += `L${f(p[0])},${f(p[1])} `; this._bb(p[0], p[1]); }
  closePath() { this._d += 'Z '; }
  arc(cx, cy, r) { const p = this._p(cx, cy); this._circle = { cx: p[0], cy: p[1], r }; this._bb(p[0] - r, p[1] - r); this._bb(p[0] + r, p[1] + r); }
  arcTo(x1, y1, x2, y2, r) {
    const p0 = this._cur; const P1 = this._p(x1, y1); const P2 = this._p(x2, y2);
    if (!p0) { this.moveTo(x1, y1); return; }
    const v1x = p0[0] - P1[0], v1y = p0[1] - P1[1], v2x = P2[0] - P1[0], v2y = P2[1] - P1[1];
    const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
    if (l1 < 1e-6 || l2 < 1e-6) { this._d += `L${f(P1[0])},${f(P1[1])} `; this._cur = P1; return; }
    const u1x = v1x / l1, u1y = v1y / l1, u2x = v2x / l2, u2y = v2y / l2;
    let cosA = Math.max(-1, Math.min(1, u1x * u2x + u1y * u2y));
    const ang = Math.acos(cosA); const tan = Math.tan(ang / 2);
    let dist = tan < 1e-6 ? 0 : r / tan; dist = Math.min(dist, l1, l2);
    const t1 = [P1[0] + u1x * dist, P1[1] + u1y * dist], t2 = [P1[0] + u2x * dist, P1[1] + u2y * dist];
    const cross = u1x * u2y - u1y * u2x; const sweep = cross < 0 ? 1 : 0;
    this._d += `L${f(t1[0])},${f(t1[1])} A${f(r)},${f(r)} 0 0 ${sweep} ${f(t2[0])},${f(t2[1])} `;
    this._cur = t2; this._bb(t1[0], t1[1]); this._bb(t2[0], t2[1]);
  }
  fill() {
    if (this._circle) { const c = this._circle; this.parts.push(`<circle cx="${f(c.cx)}" cy="${f(c.cy)}" r="${f(c.r)}" fill="${this.fillStyle}"/>`); this._circle = null; return; }
    if (this._d.trim()) this.parts.push(`<path d="${this._d.trim()}" fill="${this.fillStyle}"/>`);
  }
  stroke() {
    if (this._circle) { const c = this._circle; this.parts.push(`<circle cx="${f(c.cx)}" cy="${f(c.cy)}" r="${f(c.r)}" fill="none" stroke="${this.strokeStyle}" stroke-width="${f(this.lineWidth)}"/>`); this._circle = null; return; }
    if (this._d.trim()) this.parts.push(`<path d="${this._d.trim()}" fill="none" stroke="${this.strokeStyle}" stroke-width="${f(this.lineWidth)}" stroke-linecap="${this.lineCap}" stroke-linejoin="${this.lineJoin}"/>`);
  }
  fillRect(x, y, w, h) { const p = this._p(x, y); this.parts.push(`<rect x="${f(p[0])}" y="${f(p[1])}" width="${f(w)}" height="${f(h)}" fill="${this.fillStyle}"/>`); this._bb(p[0], p[1]); this._bb(p[0] + w, p[1] + h); }
  measureText(s) { return { width: String(s).length * parseFont(this.font).size * 0.5 }; }
  fillText(text, x, y) {
    const p = this._p(x, y); const fo = parseFont(this.font);
    const anchor = this.textAlign === 'center' ? 'middle' : (this.textAlign === 'right' || this.textAlign === 'end' ? 'end' : 'start');
    const base = { middle: 'central', bottom: 'text-after-edge', top: 'text-before-edge', hanging: 'hanging', alphabetic: 'alphabetic' }[this.textBaseline] || 'alphabetic';
    this.parts.push(`<text x="${f(p[0])}" y="${f(p[1])}" font-family="${fo.family}" font-size="${f(fo.size)}" font-weight="${fo.weight}" text-anchor="${anchor}" dominant-baseline="${base}" fill="${this.fillStyle}">${esc(text)}</text>`);
    const w = this.measureText(text).width; const off = anchor === 'middle' ? w / 2 : (anchor === 'end' ? w : 0);
    this._bb(p[0] - off, p[1] - fo.size); this._bb(p[0] - off + w, p[1] + fo.size * 0.35);
  }
}
let ctx = new SvgCtx();

// --- Helfer 1:1 aus index.html ---
function roundRectPath(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function signTextColor(hex) { const m = /^#?([0-9a-fA-F]{6})$/.exec(String(hex)); if (!m) return '#ffffff'; const n = parseInt(m[1], 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return ((0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6) ? '#1A1B1F' : '#ffffff'; }
function roundedPolyPath(c, pts, r) { const n = pts.length; c.beginPath(); c.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2); for (let i = 1; i <= n; i++) { const cur = pts[i % n], nxt = pts[(i + 1) % n]; c.arcTo(cur[0], cur[1], nxt[0], nxt[1], r); } c.closePath(); }
function roundedTriPath(c, top, bot, tw, r) { const ax = 0, ay = top, blx = -tw / 2, bly = bot, brx = tw / 2, bry = bot; c.beginPath(); c.moveTo((ax + blx) / 2, (ay + bly) / 2); c.arcTo(blx, bly, brx, bry, r); c.arcTo(brx, bry, ax, ay, r); c.arcTo(ax, ay, blx, bly, r); c.closePath(); }
function drawSignLabel(rawText, cyText, maxW, maxH, color) {
  const raw = (rawText !== undefined && rawText !== null) ? String(rawText) : ''; if (raw === '') return;
  const lines = raw.split(/\\n|\n/); let fs2 = maxH * 0.5; fs2 = Math.min(fs2, (maxH * 0.92) / (lines.length * 1.15));
  ctx.font = 'bold ' + fs2 + 'px Arial'; let widest = 0;
  for (let i = 0; i < lines.length; i++) widest = Math.max(widest, ctx.measureText(lines[i]).width);
  if (widest > maxW && widest > 0) { fs2 = fs2 * maxW / widest; ctx.font = 'bold ' + fs2 + 'px Arial'; }
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lh = fs2 * 1.15; const startY = cyText - (lines.length - 1) * lh / 2;
  for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], 0, startY + i * lh);
}

// --- drawObject-Vektorzweige 1:1 (nur die Vektortypen) ---
function drawVector(p) {
  ctx.save(); ctx.translate(p.x + p.width / 2, p.y + p.height / 2); // rotation 0
  if (p.type === 'text') { ctx.font = 'bold ' + p.height + 'px Arial'; ctx.fillStyle = p.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.text, 0, 0); }
  else if (p.type === 'rect') { ctx.fillStyle = p.color; ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height); }
  else if (p.type === 'line') { ctx.beginPath(); ctx.moveTo(-p.width / 2, 0); ctx.lineTo(p.width / 2, 0); ctx.strokeStyle = p.color; ctx.lineWidth = Math.max(4, p.height / 5); ctx.lineCap = 'round'; ctx.stroke(); }
  else if (p.type === 'vshape') { ctx.beginPath(); ctx.moveTo(-p.width / 2, -p.height / 2); ctx.lineTo(0, p.height / 2); ctx.lineTo(p.width / 2, -p.height / 2); ctx.strokeStyle = p.color; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (p.type === 'boeschung') { const half = p.width / 2; const tick = Math.max(8, p.height); ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-half, 0); ctx.lineTo(half, 0); ctx.stroke(); ctx.beginPath(); for (let x = -half + 6; x <= half - 2; x += 20) { ctx.moveTo(x, 0); ctx.lineTo(x - tick * 0.55, tick); } ctx.stroke(); }
  else if (p.type === 'liftpole') { const r = Math.min(p.width, p.height) / 2; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#E6E6E6'; ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2); ctx.fill(); }
  else if (p.type === 'arrow') { const headLen = p.width * 0.2; const bodyH = p.height * 0.2; ctx.fillStyle = p.color; ctx.strokeStyle = p.color; ctx.lineWidth = bodyH; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-p.width / 2, 0); ctx.lineTo(p.width / 2 - headLen, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.width / 2, 0); ctx.lineTo(p.width / 2 - headLen, -p.height / 2); ctx.lineTo(p.width / 2 - headLen, p.height / 2); ctx.fill(); }
  else if (p.type === 'velocity') { const headLen = p.width * 0.15; ctx.fillStyle = p.color; ctx.strokeStyle = p.color; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-p.width / 2, 0); ctx.lineTo(p.width / 2 - headLen, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.width / 2, 0); ctx.lineTo(p.width / 2 - headLen, -8); ctx.lineTo(p.width / 2 - headLen, 8); ctx.fill(); ctx.save(); ctx.translate(0, -15); ctx.font = 'bold 14px Arial'; ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(p.text, 0, 0); ctx.restore(); }
  else if (p.type === 'bemassung') { const w = p.width, h = p.height; const wit = h * 0.42; const arrow = Math.min(h * 0.4, w * 0.45); const ah = h * 0.18; ctx.strokeStyle = p.color; ctx.fillStyle = p.color; ctx.lineWidth = Math.max(2, h / 16); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-w / 2, -wit); ctx.lineTo(-w / 2, wit); ctx.moveTo(w / 2, -wit); ctx.lineTo(w / 2, wit); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2 + arrow, -ah); ctx.lineTo(-w / 2 + arrow, ah); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2 - arrow, -ah); ctx.lineTo(w / 2 - arrow, ah); ctx.closePath(); ctx.fill(); ctx.save(); ctx.translate(0, -wit - 3); ctx.font = 'bold ' + Math.round(h * 0.34) + 'px Arial'; ctx.fillStyle = '#1A1B1F'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(p.text, 0, 0); ctx.restore(); }
  else if (p.type === 'sign') {
    const w = p.width, h = p.height; const shape = p.shape || 'round'; const cy = -h * 0.08; let tbW, tbH, tbY;
    const postW = w * 0.06; ctx.fillStyle = '#666666'; ctx.fillRect(-postW / 2, cy, postW, h / 2 - cy);
    ctx.fillStyle = p.color; ctx.lineJoin = 'round';
    if (shape === 'square') { const s = Math.min(w, h) * 0.62; roundRectPath(ctx, -s / 2, cy - s / 2, s, s, s * 0.12); ctx.fill(); tbW = s * 0.82; tbH = s * 0.82; tbY = cy; }
    else if (shape === 'rect') { const rw = w * 0.84, rh = h * 0.50; roundRectPath(ctx, -rw / 2, cy - rh / 2, rw, rh, rh * 0.16); ctx.fill(); tbW = rw * 0.86; tbH = rh * 0.78; tbY = cy; }
    else if (shape === 'triangle') { const tw = w * 0.84, th = h * 0.72; const top = cy - th / 2, bot = cy + th / 2; roundedTriPath(ctx, top, bot, tw, Math.min(tw, th) * 0.09); ctx.fill(); tbW = tw * 0.44; tbH = th * 0.30; tbY = top + th * 0.68; }
    else if (shape === 'diamond') { const d = Math.min(w, h) * 0.70; roundedPolyPath(ctx, [[0, cy - d / 2], [d / 2, cy], [0, cy + d / 2], [-d / 2, cy]], d * 0.10); ctx.fill(); tbW = d * 0.52; tbH = d * 0.52; tbY = cy; }
    else { const r = Math.min(w, h) * 0.34; ctx.beginPath(); ctx.arc(0, cy, r, 0, Math.PI * 2); ctx.fill(); tbW = r * 1.4; tbH = r * 1.4; tbY = cy; }
    drawSignLabel(p.text, tbY, tbW, tbH, signTextColor(p.color));
  }
  ctx.restore();
}

function svgFromVector(p) {
  ctx.reset(); drawVector(p);
  const pad = 4; const x = ctx.minX - pad, y = ctx.minY - pad, w = (ctx.maxX - ctx.minX) + 2 * pad, hh = (ctx.maxY - ctx.minY) + 2 * pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${f(w)}" height="${f(hh)}" viewBox="${f(x)} ${f(y)} ${f(w)} ${f(hh)}">${ctx.parts.join('')}</svg>`;
}

// --- Objektliste: Dateiname -> Quelle (Sprite-Konstante ODER Vektor-Template) ---
const SPRITES = [
  ['01-skifahrer-gerade', 'SVG_SKI_BLUE'], ['02-skifahrer-schulter-vor', 'SVG_SKI_LEFT_SHOULDER'],
  ['03-skifahrer-schulter-zurueck', 'SVG_SKI_RIGHT_SHOULDER'], ['04-pflugfahrer', 'SVG_SKI_PLOW'],
  ['05-snowboarder', 'SVG_BOARDER'], ['06-rodler', 'SVG_SLED'], ['07-verletzte-person', 'SVG_INJURED_CUSTOM'],
  ['08-baum', 'SVG_TREE'], ['10-fangzaun', 'SVG_FENCE']
];
const VECTORS = [
  ['09-schild', { type: 'sign', color: '#F2C200', width: 80, height: 80, rotation: 0, shape: 'triangle', text: '!', x: 0, y: 0 }],
  ['11-text', { type: 'text', text: 'Text', color: '#000000', width: 80, height: 30, rotation: 0, x: 0, y: 0 }],
  ['12-geschwindigkeit', { type: 'velocity', text: '40 km/h (11 m/s)', color: '#D9343B', width: 150, height: 40, rotation: 0, x: 0, y: 0 }],
  ['13-bemassung', { type: 'bemassung', text: '5,0 m', color: '#2B2B2B', width: 200, height: 50, rotation: 0, x: 0, y: 0 }],
  ['14-linie', { type: 'line', color: '#A6A6A6', width: 200, height: 20, rotation: 0, x: 0, y: 0 }],
  ['15-pfeil', { type: 'arrow', color: '#2C7FB8', width: 100, height: 40, rotation: 0, x: 0, y: 0 }],
  ['16-v-form', { type: 'vshape', color: '#A6A6A6', width: 100, height: 60, rotation: 0, x: 0, y: 0 }],
  ['17-box-hindernis', { type: 'rect', color: '#A6A6A6', width: 80, height: 120, rotation: 0, x: 0, y: 0 }],
  ['18-boeschung', { type: 'boeschung', color: '#2B2B2B', width: 100, height: 16, rotation: 0, x: 0, y: 0 }],
  ['19-liftstuetze', { type: 'liftpole', color: '#A6A6A6', width: 40, height: 40, rotation: 0, x: 0, y: 0 }]
];

let n = 0; const missing = [];
SPRITES.forEach(([name, key]) => { if (!SVG[key]) { missing.push(name + ' (' + key + ')'); return; } fs.writeFileSync(path.join(OUT, name + '.svg'), ensureXmlns(SVG[key]) + '\n', 'utf8'); n++; });
VECTORS.forEach(([name, p]) => { fs.writeFileSync(path.join(OUT, name + '.svg'), svgFromVector(p) + '\n', 'utf8'); n++; });

console.log('geschrieben:', n, 'Dateien nach', OUT);
if (missing.length) console.log('FEHLT (keine Konstante):', missing.join(', '));
