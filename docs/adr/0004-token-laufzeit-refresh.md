# ADR-0004: 30-Tage-Token-Laufzeit mit /refresh für Widerruf

- **Status:** Akzeptiert
- **Datum:** 2026-06-24
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Bezug:** Folgt aus [ADR-0001](0001-signierte-lizenz-tokens.md)

## Kontext

Ein signiertes Token ist bis zu seinem `exp` gültig und wird offline akzeptiert.
Damit besteht ein Zielkonflikt:
- **Kurze Laufzeit** → schnellerer Widerruf, aber mehr Online-Zwang.
- **Lange Laufzeit** → besser für Feldeinsatz ohne Netz, aber Widerruf greift spät.

Die App wird teils ohne Netz genutzt (Skipisten). Lizenzen haben zusätzlich ein
festes Ablaufdatum (`validUntil`) in der KV.

## Entscheidung

- **Token-Laufzeit: 30 Tage.** `exp = min(validUntil, ausgestellt + 30 Tage)`;
  `validUntil` ist stets die harte Obergrenze.
- Token wird im `localStorage` gecacht → App funktioniert offline bis `exp`.
- Zusätzlich **`/refresh`-Endpoint:** erneuert bei bestehender Online-Verbindung
  das Token und prüft die KV erneut, sodass ein **Widerruf vor Ablauf** greift.
  Refresh wird still versucht, Fehler werden ignoriert (offline-tolerant).

## Konsequenzen

**Positiv**
- Guter Kompromiss aus Offline-Tauglichkeit und Kontrolle.
- Widerruf/Sperre wirkt beim nächsten Online-Kontakt, nicht erst nach 30 Tagen.

**Negativ / Risiken**
- Worst Case (Gerät dauerhaft offline): Widerruf greift erst nach bis zu 30 Tagen.
  Akzeptiert.
- `/refresh` ist eine zusätzliche Endpoint-Route (geringer Mehraufwand).

## Alternativen

- **Nur kurze Laufzeit ohne Refresh (z. B. 7 Tage):** zu viel Online-Zwang am Berg.
  Verworfen.
- **Sehr lange Laufzeit ohne Refresh:** Widerruf praktisch wirkungslos. Verworfen.
