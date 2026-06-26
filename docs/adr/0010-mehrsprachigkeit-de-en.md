# ADR-0010: Mehrsprachigkeit (Deutsch / English)

- **Status:** Akzeptiert
- **Datum:** 2026-06-25
- **Entscheider:** Christian Klingler (asolvo / ASI-Tirol)
- **Umgesetzt in:** v116

## Kontext

Neben der deutschen wird eine englische Version benötigt. Die App ist eine
einzelne HTML-Datei ohne Build-Schritt.

## Entscheidung

- **Laufzeit-i18n** in der Single-File-App: zentrale String-Tabelle
  `I18N = { de, en }`, Zugriff über `t(key)`.
- `applyLanguage()` setzt statische Texte per Element-ID, die Instruktionsliste per
  `innerHTML` und Tooltips per `title`; dynamische JS-Strings nutzen `t()`.
- Umfang: **gesamte sichtbare UI** inkl. Tooltips, Dialoge, Meldungen, Objektnamen
  und der auf der Zeichenfläche gezeichneten Beschriftung („Schild"/„Sign").
- Sprache wählbar in den Einstellungen; Persistenz in `localStorage`
  (`skisim_lang`); Standard **Deutsch**.

## Konsequenzen

**Positiv**
- Vollständig lokalisiert; weitere Sprache = ein weiterer Block in `I18N`.
- Kein zweites Dokument, keine Build-Kette.

**Negativ / Risiken**
- Neue UI-Strings müssen zentral in beiden Sprachen gepflegt werden.
- Nutzer-eingegebene Inhalte (eigener Text, Maßzahlen) werden bewusst **nicht**
  übersetzt.

## Alternativen

- **Separate HTML-Dateien je Sprache:** verworfen — Duplikate, hohe Wartungslast.
- **i18n-Framework/Build-Tool:** verworfen — widerspricht dem Single-File-Prinzip
  ([ADR-0008](0008-single-file-versionierung.md)).
