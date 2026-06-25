# ADR-0006: KV-Datenmodell — Zeiger + Datensatz (für /refresh)

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Bezug:** Verfeinert [ADR-0002](0002-cloudflare-workers-kv.md), folgt aus [ADR-0004](0004-token-laufzeit-refresh.md)

## Kontext

ADR-0002 skizzierte das KV-Modell als `SHA-256(schlüssel)` → Datensatz. Bei der
Umsetzung von `/refresh` (ADR-0004) zeigte sich: Der Refresh-Endpoint kennt nur
das alte Token (mit `sub` = interne Id), **nicht** den rohen Lizenzschlüssel.
Mit einem rein hash-basierten Schlüssel ließe sich der Datensatz dort nicht
nachschlagen.

## Entscheidung

Pro Lizenz werden **zwei** KV-Einträge geführt:

```
key:<sha256(lizenzschlüssel)>  ->  "<id>"                            (Zeiger, Lookup bei /activate)
lic:<id>                       ->  { id, name, tier, features[], validUntil, status }
rl:<ip>                        ->  Rate-Limit-Zähler (TTL 10 Min)
```

- `/activate`: Schlüssel → `key:<hash>` → `id` → `lic:<id>` → Datensatz.
- `/refresh`: Token-`sub` (= `id`) → `lic:<id>` → Datensatz (Status/Ablauf erneut prüfen).
- Der **rohe Schlüssel wird nie gespeichert** (Prinzip aus ADR-0002 bleibt erhalten).

## Konsequenzen

**Positiv**
- `/refresh` kann den Datensatz per `sub` finden → Widerruf greift (ADR-0004).
- Der Datensatz liegt an genau einer Stelle (`lic:<id>`); Widerruf/Verlängerung
  ist eine einzige Änderung. Der Zeiger bleibt unverändert.

**Negativ / Risiken**
- Zwei KV-Puts pro Lizenz statt einem. Das Helfer-Skript `add-license.ps1`
  kapselt beide Schritte, sodass die manuelle Verwaltung (ADR-0002) ein Befehl bleibt.

## Alternativen

- **`keyHash` im Token mitführen** (statt Zweit-Index): verworfen — exponierte den
  eigenen Key-Hash im Token unnötig und vermischte Identität mit Geheimnis-Material.
