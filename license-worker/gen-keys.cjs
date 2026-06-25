// Erzeugt ein ES256 (ECDSA P-256) Schluesselpaar.
// - signing_key.pkcs8.b64 : privater Schluessel (PKCS#8, base64) -> als Worker-Secret SIGNING_KEY
// - public_key.jwk.json    : oeffentlicher Schluessel (JWK) -> wird in den Worker UND in die HTML eingebettet
// Der private Schluessel wird NICHT auf die Konsole ausgegeben.
const { webcrypto } = require('node:crypto');
const fs = require('node:fs');
const subtle = webcrypto.subtle;

(async () => {
  const kp = await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const pkcs8 = await subtle.exportKey('pkcs8', kp.privateKey);
  const pubJwk = await subtle.exportKey('jwk', kp.publicKey);
  fs.writeFileSync('signing_key.pkcs8.b64', Buffer.from(pkcs8).toString('base64'));
  fs.writeFileSync('public_key.jwk.json', JSON.stringify(pubJwk));
  console.log('PRIVATE_WRITTEN signing_key.pkcs8.b64');
  console.log('PUBLIC_JWK=' + JSON.stringify(pubJwk));
})();
