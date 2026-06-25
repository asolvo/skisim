# ADR-0001: Signierte Lizenz-Tokens statt clientseitiger Sheet-Prüfung

- **Status:** Akzeptiert
- **Datum:** 2026-06-24
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)

## Kontext

Die bisherige „Lizenzprüfung" in `ski.mvp.105.html` lädt eine öffentliche
Google-Sheet-CSV über fremde CORS-Proxys (`allorigins.win`, `corsproxy.io`),
vergleicht einen unsalted SHA-256-Hash des eingegebenen Keys gegen die Tabelle
und ändert bei Treffer nur ein UI-Label sowie das `creator`-Feld beim Speichern.

Probleme:
- Die **komplette Userliste** (Namen, Rollen, Hashes, Gültigkeit) wird in den
  Browser geladen und ist im Netzwerk-Tab einsehbar.
- Die Fremd-Proxys fallen regelmäßig aus → Symptom „keine Datenbankverbindung".
- Der Login **schaltet faktisch nichts frei**; `validUntil` wird angezeigt, aber
  nie geprüft.
- SHA-256 ohne Salt ist gegen Wörterbuchangriffe schwach.

Anforderung (mit dem Betreiber geklärt): **zeitlich begrenzte Lizenzen** +
**Freischaltung einzelner Funktionen**, öffentlicher/wachsender Nutzerkreis,
ein kleiner Serverless-Anteil ist erlaubt.

Grundsätzliche Einschränkung: Eine **rein clientseitige** Lizenzdurchsetzung ist
nicht vollständig absicherbar — wer den JS-Code editiert, kann jedes Gate
entfernen. Echte Durchsetzung wertvoller Aktionen wäre nur möglich, wenn diese
serverseitig ausgeführt würden (hier bewusst nicht verfolgt, da Overkill).

## Entscheidung

Ein Server stellt nach Schlüssel-Prüfung ein **kryptografisch signiertes Token**
aus. Der Client **verifiziert** das Token lokal mit einem eingebetteten
**Public Key** und schaltet daraufhin Funktionen frei. Der private Signatur-
schlüssel verbleibt ausschließlich serverseitig.

## Konsequenzen

**Positiv**
- Nur das *eigene* Token gelangt zum Client; keine Userliste mehr exponiert.
- Ablauf und Berechtigungen sind kryptografisch im Token verankert und werden
  geprüft.
- Fälschen ist ohne den privaten Schlüssel praktisch unmöglich.
- Funktioniert offline bis zum Ablauf (Token im localStorage gecacht).

**Negativ / Risiken**
- Schützt gegen Schlüssel-Weitergabe und abgelaufene Lizenzen (Casual-Missbrauch),
  ist aber **keine unknackbare DRM**: clientseitige Gates bleiben technisch
  umgehbar. Bewusst akzeptierter Kompromiss für ein Fach-Nischen-Tool.
- Führt einen Serverless-Endpoint als neue Komponente ein (siehe ADR-0002).

## Alternativen

- **Status quo (Sheet + Proxy):** verworfen — unsicher, unzuverlässig, ohne echte
  Durchsetzung.
- **Serverseitige Ausführung der geschützten Funktionen (echte DRM):** verworfen
  — unverhältnismäßiger Aufwand für den Anwendungsfall.
