# ADR-0022: Validierung importierter Projektdateien (Sicherheit)

- **Status:** Akzeptiert
- **Datum:** 2026-06-29
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v132
- **Bezug:** [ADR-0012](0012-gast-einschraenkungen.md) (Gast-Einschränkungen)

## Kontext

Der Projekt-Import (`handleFileSelect`) übernahm den Inhalt einer beliebigen
`.json`-Datei **ungeprüft** als Live-Zustand (`activeObjects = data.objects`);
geprüft wurde nur, dass `objects` ein Array ist. Das ist eine unsichere
Deserialisierung / fehlende Eingabevalidierung (CWE-20 / CWE-502). Nachgewiesene
Folgen: die Gast-Regel „max. 1 Personen-Figur" ([ADR-0012](0012-gast-einschraenkungen.md))
ließ sich per präpariertem Import umgehen, und Objekte mit unbekanntem `type`,
nicht existierendem `assetKey` oder nicht-numerischer/negativer Geometrie wurden
in die Render-Schleife übernommen.

## Entscheidung

Importierte Objekte werden vor der Übernahme **validiert und normalisiert**:

- **Whitelist:** nur bekannte `type` (`sprite, text, velocity, bemassung, line,
  arrow, vshape, rect, sign`); bei `sprite` nur bekannte `assetKey`
  (Figuren + `tree`, `fence`). Alles andere wird verworfen.
- **Feld-Validierung:** `x/y/width/height/rotation` werden auf endliche Zahlen
  geprüft und in sinnvolle Grenzen geklammert (Defaults bei Fehlwerten); `color`
  nur bei gültigem Hex-Muster übernommen; `text` auf 500 Zeichen begrenzt.
- **Gast-Limit auch beim Import:** ohne Lizenz werden überzählige Personen-Figuren
  verworfen (höchstens eine bleibt) — konsistent zu ADR-0012.

Umsetzung: `sanitizeImportedObjects()` + `enforceGuestPersonLimit()` in
`handleFileSelect`. Regressions-Testfall:
`tests/security-import-validation.test.html` (treibt den echten Import-Pfad über
ein `File`+`change`-Event; grün = abgesichert).

## Konsequenzen

**Positiv**
- Fremd-Eingaben können den Zustand nicht mehr beliebig setzen; Gast-Gating auch
  über den Import durchgesetzt; robustere Render-Schleife.

**Negativ / Risiken**
- Neue Objekttypen/Asset-Keys müssen in die Import-Whitelist aufgenommen werden,
  sonst werden sie beim Laden verworfen (bewusster Trade-off: sicher als Default).

## Alternativen

- **Import ohne Validierung (Status quo):** verworfen — unsichere Deserialisierung.
- **Import ohne Lizenz komplett ablehnen:** verworfen — Laden/Ansehen soll für
  Gäste möglich bleiben; nur die Figuren-Menge wird begrenzt (überzählige verworfen).
- **JSON-Schema-Bibliothek:** verworfen — Single-File/CSP, kein Build; die
  kompakte manuelle Prüfung genügt für das kleine, bekannte Objektmodell.
