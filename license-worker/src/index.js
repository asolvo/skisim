// Skisim License Worker
// Stellt signierte ES256-Lizenz-Tokens aus und erneuert sie.
// Siehe ../docs/adr/  (0001 signierte Tokens, 0002 Cloudflare+KV, 0003 ES256,
// 0004 30-Tage-Token + /refresh, 0005 granulares Feature-Gating).
//
// KV-Datenmodell (Namespace-Binding: LICENSES):
//   key:<sha256(lizenzschluessel)> -> "<id>"                (Zeiger, Lookup beim Aktivieren)
//   lic:<id>                       -> { id, name, tier, features[], validUntil, status }
//   rl:<ip>                        -> Zaehler (Rate-Limit, TTL)
// Der rohe Lizenzschluessel wird nie gespeichert.

const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 Tage (ADR-0004)

// Oeffentlicher Verifikations-Schluessel (passend zum Worker-Secret SIGNING_KEY).
// Identisch mit dem in die HTML eingebetteten Public Key.
const PUBLIC_JWK = {
  kty: "EC",
  crv: "P-256",
  x: "nsu4Z_DGOkiKxFTWb8KB_1FGR5vQbP8fMHvh_Kzke2I",
  y: "am4U3mkL6zzD_inls9DpoCkA7ritxp6Y36iX8HNM3qo",
  key_ops: ["verify"],
  ext: true,
};

// ---------- base64url ----------
function b64urlFromBytes(bytes) {
  let bin = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ---------- crypto ----------
async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

let _signKey = null;
async function getSigningKey(env) {
  if (_signKey) return _signKey;
  if (!env.SIGNING_KEY) throw new Error("SIGNING_KEY secret not set");
  // Whitespace/Zeilenumbrueche tolerieren (koennen beim Setzen des Secrets entstehen)
  _signKey = await crypto.subtle.importKey(
    "pkcs8", b64ToBytes(env.SIGNING_KEY.replace(/\s+/g, "")),
    { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]
  );
  return _signKey;
}

let _verifyKey = null;
async function getVerifyKey() {
  if (_verifyKey) return _verifyKey;
  _verifyKey = await crypto.subtle.importKey(
    "jwk", PUBLIC_JWK, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]
  );
  return _verifyKey;
}

async function signToken(payload, env) {
  const key = await getSigningKey(env);
  const payloadB64 = b64urlFromBytes(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(payloadB64)
  );
  return payloadB64 + "." + b64urlFromBytes(sig);
}

// Verifiziert ein selbst ausgestelltes Token und liefert die Payload (oder null).
async function verifyToken(token) {
  const parts = String(token).split(".");
  if (parts.length !== 2) return null;
  try {
    const ok = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" }, await getVerifyKey(),
      b64urlToBytes(parts[1]), new TextEncoder().encode(parts[0])
    );
    if (!ok) return null;
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0])));
  } catch {
    return null;
  }
}

// ---------- helpers ----------
const epochNow = () => Math.floor(Date.now() / 1000);

// validUntil "YYYY-MM-DD" inklusiv -> Tagesende UTC
function validUntilEpoch(validUntil) {
  const d = new Date(String(validUntil) + "T23:59:59Z");
  return Math.floor(d.getTime() / 1000);
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

async function buildTokenForRecord(rec, env) {
  const now = epochNow();
  const vu = validUntilEpoch(rec.validUntil);
  const exp = Math.min(vu, now + TOKEN_TTL_SECONDS); // ADR-0004: validUntil ist harte Obergrenze
  const payload = {
    sub: rec.id,
    name: rec.name,
    tier: rec.tier || "standard",
    feat: Array.isArray(rec.features) ? rec.features : [],
    iat: now,
    exp,
  };
  return await signToken(payload, env);
}

async function rateLimited(env, ip) {
  const k = "rl:" + ip;
  const cur = parseInt((await env.LICENSES.get(k)) || "0", 10);
  if (cur >= 20) return true; // max 20 Versuche / 10 Min / IP
  await env.LICENSES.put(k, String(cur + 1), { expirationTtl: 600 });
  return false;
}

function tokenResponse(token, rec) {
  return json({
    token,
    name: rec.name,
    tier: rec.tier || "standard",
    features: Array.isArray(rec.features) ? rec.features : [],
  });
}

// ---------- endpoints ----------
async function handleActivate(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "bad_request" }, 400); }
  const key = (body && body.key ? String(body.key) : "").trim();
  if (!key) return json({ error: "missing_key" }, 400);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (await rateLimited(env, ip)) return json({ error: "rate_limited" }, 429);

  const id = await env.LICENSES.get("key:" + (await sha256Hex(key)));
  if (!id) return json({ error: "invalid_key" }, 403);

  const rec = await env.LICENSES.get("lic:" + id, { type: "json" });
  if (!rec) return json({ error: "invalid_key" }, 403);
  if (rec.status !== "active") return json({ error: "revoked" }, 403);
  if (validUntilEpoch(rec.validUntil) < epochNow()) return json({ error: "expired" }, 403);

  return tokenResponse(await buildTokenForRecord(rec, env), rec);
}

async function handleRefresh(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "bad_request" }, 400); }
  const token = (body && body.token ? String(body.token) : "").trim();

  // Nur ein von uns signiertes Token darf erneuert werden (verhindert Faelschung beliebiger sub).
  const payload = await verifyToken(token);
  if (!payload || !payload.sub) return json({ error: "bad_token" }, 403);

  const rec = await env.LICENSES.get("lic:" + payload.sub, { type: "json" });
  if (!rec) return json({ error: "invalid_key" }, 403);
  if (rec.status !== "active") return json({ error: "revoked" }, 403);
  if (validUntilEpoch(rec.validUntil) < epochNow()) return json({ error: "expired" }, 403);

  return tokenResponse(await buildTokenForRecord(rec, env), rec);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    const path = new URL(request.url).pathname;
    if (request.method === "POST" && path === "/activate") return handleActivate(request, env);
    if (request.method === "POST" && path === "/refresh") return handleRefresh(request, env);
    if (path === "/" || path === "/health") return json({ ok: true, service: "skisim-license" });

    return json({ error: "not_found" }, 404);
  },
};
