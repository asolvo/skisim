# ADR-0003: ES256 (ECDSA P-256) als Signaturverfahren

- **Status:** Akzeptiert
- **Datum:** 2026-06-24
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Bezug:** Folgt aus [ADR-0001](0001-signierte-lizenz-tokens.md)

## Kontext

Die Tokens (ADR-0001) müssen serverseitig signiert und im Browser via Web Crypto
API verifiziert werden. Der Nutzerkreis ist öffentlich/gemischt, inkl. potenziell
älterer Geräte/Browser (Feldeinsatz am Berg). Damit ist **breite Browser-
Kompatibilität der Verifikation** das ausschlaggebende Kriterium.

Kandidaten:
- **ES256 (ECDSA P-256, SHA-256):** seit Jahren in allen Web-Crypto-fähigen
  Browsern unterstützt.
- **Ed25519 (EdDSA):** schlanker und schneller, client-seitige Web-Crypto-Unter-
  stützung jedoch erst auf neueren Browsern verlässlich verfügbar.

## Entscheidung

Tokens werden mit **ES256 (ECDSA P-256)** signiert. Token-Format kompakt,
JWS-ähnlich: `base64url(payload).base64url(signatur)`.

Der private Schlüssel liegt als Cloudflare-Worker-Secret; der Public Key wird in
die HTML eingebettet (öffentlich, unkritisch).

## Konsequenzen

**Positiv**
- Maximale Kompatibilität der client-seitigen Verifikation über alle relevanten
  Geräte/Browser.
- Etabliertes, standardkonformes Verfahren (ES256 wie in JWT/JOSE).

**Negativ / Risiken**
- Etwas größere Signaturen/Schlüssel und minimal langsamer als Ed25519 —
  bei der geringen Frequenz (Token-Holen alle 30 Tage) irrelevant.

## Alternativen

- **Ed25519:** verworfen wegen unsicherer Browser-Unterstützung im Zielgerätepark.
- **RS256:** funktioniert universell, aber deutlich größere Schlüssel/Signaturen
  ohne Vorteil. Verworfen.
