# Skisim License Worker

Cloudflare Worker, der signierte ES256-Lizenz-Tokens für die Ski-Simulation-App
ausstellt. Umsetzung der Entscheidungen in [`../docs/adr/`](../docs/adr/README.md).

## Live

- **Endpoint:** `https://skisim-license.cklingler.workers.dev`
- **KV-Namespace `LICENSES`:** `6a82821eea0b419aaee67558fb1b1063`
- **Secret `SIGNING_KEY`:** privater ES256-Schlüssel (PKCS#8, base64) — in Cloudflare hinterlegt.
- **Public Key:** in [`public_key.jwk.json`](public_key.jwk.json); identisch im Worker (`PUBLIC_JWK` in `src/index.js`) und später in der HTML-Datei.

## Endpoints

| Methode | Pfad | Body | Antwort |
|---|---|---|---|
| GET | `/health` | – | `{ ok: true }` |
| POST | `/activate` | `{ "key": "<lizenzschlüssel>" }` | `{ token, name, tier, features[] }` oder Fehler |
| POST | `/refresh` | `{ "token": "<altes token>" }` | neues Token (prüft Signatur + KV erneut → fängt Widerruf) |

Fehler: `invalid_key` / `revoked` / `expired` → 403, `rate_limited` → 429, `bad_request` → 400.

Token-Laufzeit: 30 Tage, gedeckelt durch `validUntil` (ADR-0004).

## KV-Datenmodell

Der rohe Lizenzschlüssel wird **nie** gespeichert. Zwei Einträge pro Lizenz
(Zeiger + Datensatz), damit `/refresh` den Datensatz auch per `sub` findet:

```
key:<sha256(lizenzschlüssel)>  ->  "<id>"
lic:<id>                       ->  { id, name, tier, features[], validUntil, status }
rl:<ip>                        ->  Rate-Limit-Zähler (TTL 10 Min)
```

## Lizenz anlegen / ändern

Per Helfer-Skript (kümmert sich um Hashing und das JSON-Quoting):

```powershell
.\add-license.ps1 -Key "ASI-WERNER-7Q2F" -Id "werner.senn" -Name "Werner Senn" -ValidUntil "2027-06-30"
# nur bestimmte Features:
.\add-license.ps1 -Key "ASI-GAST-1234" -Id "gast.demo" -Name "Demo" -ValidUntil "2026-09-30" -Features export,save
```

- **Schlüssel** frei wählbar, sollte zufällig/eindeutig sein (z. B. `openssl rand -hex 8`).
- **Id** ist die interne, eindeutige Kennung (`sub` im Token), z. B. `vorname.nachname`.
- Den **Key** gibst du dem Nutzer; die **Id** bleibt intern.

### Widerrufen / verlängern

- **Widerrufen:** dieselbe Lizenz erneut anlegen mit `-Status revoked`
  (oder `wrangler kv key put ... "lic:<id>"` mit `status:"revoked"`).
  Greift beim nächsten `/refresh` (spätestens nach 30 Tagen).
- **Verlängern:** erneut anlegen mit neuem `-ValidUntil`.

## Deploy / Wartung

```powershell
$wr = "$env:USERPROFILE\tools\node-v24.18.0-win-x64\wrangler.cmd"
& $wr deploy                       # Worker neu deployen
& $wr secret put SIGNING_KEY       # privaten Schlüssel (neu) setzen
& $wr kv key list --namespace-id=6a82821eea0b419aaee67558fb1b1063 --remote   # Lizenzen auflisten
```

## Schlüssel neu erzeugen (Rotation)

`node gen-keys.cjs` erzeugt ein neues Paar (überschreibt die lokalen Dateien),
dann `wrangler secret put SIGNING_KEY` mit dem neuen privaten Schlüssel **und**
den neuen `PUBLIC_JWK` in `src/index.js` sowie in der HTML eintragen. Achtung:
alle bestehenden Tokens werden dadurch ungültig.

## Sicherheit / Dateien

- `signing_key.pkcs8.b64` — **privater Schlüssel, niemals committen/teilen** (in `.gitignore`).
- `public_key.jwk.json` — öffentlich, unkritisch.
- `record.test.json` — Beispiel-Datensatz.
- **Vor Go-Live:** Test-Lizenz `ASI-TEST-001` / `lic:test-user` entfernen.
