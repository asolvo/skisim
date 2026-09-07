# ADR-0032: Freemium-Test — Werkzeug frei, sauberer Export kostenpflichtig

- **Status:** Akzeptiert, **befristetes Experiment** (Entscheidung bis Ende März 2027)
- **Datum:** 2026-09-07
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** 2026.09.0001 (Phase 1)
- **Bezug:** [ADR-0005](0005-granulares-feature-gating.md) (Feature-Gating),
  [ADR-0012](0012-gast-einschraenkungen.md) (bisherige Gast-Regeln — ersetzt),
  [ADR-0022](0022-import-validierung.md) (Import), [ADR-0031](0031-pwa-installierbar-offline.md) (PWA)

## Kontext

Bis 2026.07.0037 galt: Gast = **eine** Personen-Figur, kein Speichern, kein Export,
kein Teilen. Vollzugriff nur mit Lizenz, die per Formular auf alpinesicherheit.com
**angefragt** und von Hand ausgestellt wird.

Drei Beobachtungen sprechen gegen dieses Modell:

1. **Die Gratisstufe kann den Kernnutzen nicht zeigen.** Der kanonische Fall ist eine
   *Kollision* — mindestens zwei Personen. Mit einer Figur ist die Hauptsache nicht
   darstellbar, und Speichern/Export waren genau der Moment, in dem der Nutzen entsteht.
2. **Der technische Schutz ist schwach.** Der Code liegt Apache 2.0 in einem öffentlichen
   Repo, die App ist eine ausgelieferte HTML-Datei, die Prüfung läuft im Client. Wer will,
   entfernt sie. Bezahlbarer Wert kann also nicht im Zurückhalten von Bits liegen.
3. **Das Problem ist die Kaufhürde, nicht der Preis.** Ein Gutachten wird mit €800–3.000
   abgerechnet; €190/Jahr sind dagegen eine Rundungsdifferenz. Aber die Zielgruppe ist
   klein (geschätzt einige hundert Personen im DACH-Raum) und muss heute erst *anfragen*.

Offen ist damit **eine** Frage: Scheitert es an der **Nutzung** oder an der
**Zahlungsbereitschaft**? Diese ADR beschreibt den Umbau, mit dem sich das messen lässt.

## Entscheidung

**Das Werkzeug wird frei, bezahlt wird der saubere Output.**

- **Objekte unbegrenzt — für alle.** Das Gast-Limit entfällt ersatzlos, auch beim
  **Import** (bisher wurden geladene Projekte still auf eine Figur beschnitten) und über
  die **KI-Brücke**. `PERSON_ASSETS`, `isPersonTpl`, `personCount`,
  `guestPersonLimitReached` und `enforceGuestPersonLimit` sind damit entfallen.
- **Speichern/Laden (JSON) ist frei** — kein Feature-Gate mehr.
- **Export und Teilen sind offen, aber ohne Lizenz gezeichnet:** Die Ausgabe erhält ein
  diagonales „ENTWURF" plus die Fußzeile „Entwurf – nicht zur Vorlage bei Gericht".
- **Bezahlt bleibt:** sauberer Export ohne Wasserzeichen, Teilen ohne Wasserzeichen,
  Copyright-Zeile in der Legende, KI-Fernsteuerung.
- **Verkaufsmoment:** Direkt nach einem Entwurfs-Export erscheint ein Dialog mit den zwei
  Preispunkten (**10 Exporte 39 €**, **Jahreslizenz 190 €**) — der Punkt, an dem der
  Nutzer die Reibung gerade gespürt hat.

**Technisch entscheidend:** Das Wasserzeichen wird auf einer **Offscreen-Kopie** des
Canvas gezeichnet (`buildExportCanvas(clean)`), nie auf dem Live-Canvas. Mit Berechtigung
gibt die Funktion das Original unverändert zurück — die HiDPI-Schärfe (eingeführt in
2026.07.0033) bleibt damit unangetastet. Die Skalierung des Wasserzeichens leitet sich
aus `canvas.width / CW` (dem devicePixelRatio) ab.

**Messung — minimaler eigener Zähler.** Vier anonyme Ereignisnamen (`app_start`,
`engaged` = Skizze mit ≥2 Objekten, `export_watermarked`, `upgrade_click`) gehen an einen
neuen Endpunkt `POST /ev` des **eigenen** Lizenz-Workers. Bewusste Nicht-Ziele: keine
Kennungen, keine Cookies, keine IP-Speicherung, keine Skizzeninhalte, kein Drittanbieter
(insbesondere **keine** externen Analytics — die mit ADR-0031 erreichte Freiheit von
Fremd-Requests bleibt erhalten). Pro Sitzung wird jedes Ereignis höchstens einmal
gesendet, per `sendBeacon` mit `text/plain` (im `no-cors`-Modus zulässig, kein Preflight),
fire-and-forget — Offline oder Fehler bleiben ohne Wirkung. Serverseitig bevorzugt
Workers Analytics Engine, mit Tageszähler in KV als Rückfall. **Abschaltbar** über einen
Schalter in den Einstellungen; der Hinweistext nennt genau, was gezählt wird.

Unter `file://` wird **nicht** gezählt (und ohnehin kein SW registriert) — die
versionierten Einzeldatei-Schnappschüsse bleiben vollständig offline und ohne
Netzverkehr ([ADR-0008](0008-single-file-versionierung.md)).

## Konsequenzen

**Positiv**
- Die Gratisstufe ist erstmals ernsthaft nutzbar; der bisherige Funnel-Bruch entfällt.
- **Niemand verliert etwas:** Lizenznehmer bekommen unverändert den sauberen Export,
  Gäste deutlich mehr als vorher. Der Umbau ist rückrollbar.
- Der Import beschneidet Projekte nicht mehr still — ein Verhalten, das ohne Lizenz
  Daten aus einer fremden Datei verwarf.
- Zahlungsbereitschaft wird am realen Kauf gemessen, nicht per Umfrage.

**Negativ / Risiken**
- **Das Wasserzeichen ist im Fork entfernbar.** Akzeptiert: Der Test misst die
  Zahlungsbereitschaft von Berufsnutzern, nicht die Umgehbarkeit. Screenshots umgehen es
  ohnehin — deshalb ist die *Provenienz* (siehe „Nicht Teil dieser Entscheidung") das
  eigentliche Produkt, nicht das Vorenthalten von Pixeln.
- **Erstmals Telemetrie** in einer bislang telemetriefreien, lokal arbeitenden App. Bei
  einer Zielgruppe mit Verschwiegenheitspflicht ist das eine Vertrauensfrage; daher
  Allowlist, Aggregat, Offenlegung und Opt-out.
- Kleine Stückzahlen machen jede Quote statistisch wackelig — die Zahlen sind
  **Richtungsaussagen** und müssen mit qualitativen Gesprächen kombiniert werden.
- **Saisonalität:** Skiunfälle passieren Dezember–März, Gutachten folgen versetzt. Ein
  Ergebnis aus dem Herbst ist bedeutungslos; deshalb Bauen im Herbst, Messen im Winter.

## Entscheidungsregel (vorab festgelegt)

| Beobachtung | Diagnose | Konsequenz |
|---|---|---|
| Viele Exporte, kaum Upgrade-Klicks | Nutzen überzeugt, Argument nicht | Wert umpacken: Provenienz-/Nachweisdienst |
| Klicks, aber keine Käufe | Preis, Kaufprozess oder Vertrauen | Preis, Rechnung, Zahlarten, ggf. Merchant of Record |
| Kaum Nutzung überhaupt | Reichweite, nicht Geschäftsmodell | Vertrieb über Verbände/Institutionen |
| Käufe fließen | Modell trägt | Serverseitigen Export + Provenienz bauen, Fulfillment automatisieren |

## Nicht Teil dieser Entscheidung

Bewusst zurückgestellt, bis der Test ein Ergebnis hat: serverseitige Erzeugung des
sauberen Exports, Provenienz-Block mit QR/Verifikationsseite, Credit-Verwaltung im Token,
Nutzer-/Seat-Verwaltung, automatisches Fulfillment nach Zahlung. Das Fulfillment bleibt
im Test **von Hand** (`add-license.ps1`) — bei erwarteten kleinen Stückzahlen ist
Automatisierung Vorleistung auf eine unbestätigte Annahme.

## Alternativen

- **Gast-Limit nur anheben (z. B. 5 Objekte):** verworfen — eine willkürliche Grenze
  erzeugt dieselbe Frustration nur später und verwässert die Messung.
- **Export weiter komplett sperren, dafür Objekte frei:** verworfen — der Nutzen entsteht
  erst mit der ausgegebenen Datei; ohne Export bleibt der „Aha"-Moment aus.
- **Externe Analytics (z. B. Cloudflare Web Analytics):** verworfen — würde einen
  Fremd-Request und einen Dritten in eine Anwendung holen, deren lokale Arbeitsweise für
  diese Zielgruppe ein Verkaufsargument ist.
- **Alles verschenken (Open Core), Monetarisierung über Schulung/Beratung:** bleibt eine
  ernsthafte Option, falls der Test negativ ausfällt — greift aber die heutigen
  Lizenzeinnahmen an und ist deshalb nicht der erste Versuch.
