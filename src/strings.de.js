// All German copy lives here, as pure data — imported by the browser
// runtime (src/i18n.js) and by the build-time prerenderer
// (scripts/prerender-de.mjs) that bakes dist/de/index.html. No browser
// APIs in this file. Written as native, conversion-focused German — not a
// literal translation of the English page.

export const TITLE_DE = 'Ocur — das KI-Betriebssystem für Unternehmen | Kostenlos starten';
export const OG_TITLE_DE = 'Ocur — das KI-Betriebssystem für Unternehmen';
export const DESC_DE =
  'Ocur erledigt die Arbeit direkt in deinen Tools — E-Mail, Kalender, Dateien, Chat, Web. Auf Zuruf oder voll automatisch. Du gibst frei, Ocur macht den Rest. Jetzt kostenlos starten.';

// Link-Vorschau (X, WhatsApp, iMessage, LinkedIn). Kürzer als DESC_DE, weil X
// die Beschreibung in der Karte hart abschneidet. Das Kartenbild dazu ist
// public/og-de.jpg (siehe scripts/gen-og.mjs).
export const TWITTER_DESC_DE =
  'Ocur erledigt die Arbeit direkt in deinen Tools — E-Mail, Kalender, Dateien, Chat, Web. Auf Zuruf oder voll automatisch. Jetzt kostenlos testen.';
export const OG_ALT_DE =
  'Ocur — „Deine KI redet nicht. Sie erledigt.“ Ein Ocur-Fenster auf Autopilot: überfällige Rechnungen anmahnen und die Tabelle aktualisieren — 14 Erinnerungen raus, Tabelle aktualisiert, 2 schon bezahlt.';

// selector → replacement innerHTML. A string applies to every match; an
// array applies element-by-element in DOM order.
export const DE = [
  // nav
  ['header .g-btn-sm', 'Kostenlos starten'],
  ['.g-links a', ['In Aktion', 'Funktionen', 'Preise', 'FAQ']],

  // hero
  ['.g-kicker', '<span class="g-kdot" aria-hidden="true"></span>Das KI-Betriebssystem für Unternehmen'],
  ['.g-h1', 'Deine KI redet nicht.<br /><span class="g-grad">Sie erledigt.</span>'],
  [
    '.g-sub',
    'Sag, was zu tun ist — Ocur erledigt es direkt in deinen Tools. Auf Zuruf oder komplett auf Autopilot.',
  ],
  ['.g-ctas a', ['Kostenlos starten', 'Demo ansehen']],
  [
    '.g-micro',
    [
      'Kostenlos testen&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;Kein IT-Projekt',
      'Kostenlos testen&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;In Minuten live',
    ],
  ],
  ['.g-stat span', ['Gratis-Tokens / Monat', 'bis live', 'Konnektoren — beliebig erweiterbar']],

  // connector strip
  ['.g-logos-label', 'Arbeitet in den Tools, die dein Team längst nutzt'],
  [
    '.g-logos-sub',
    '…und allem, was eine API hat. Keine API? Dann steuert Ocur die App direkt auf deinem Rechner — wie ein Mensch.',
  ],

  // pinned demo
  ['#demo .g-h2', 'Gesagt. <span class="g-grad">Getan.</span>'],
  ['.g-win-pill', '<i class="g-kdot"></i> Autopilot an'],
  ['.g-bubble-you', 'Mahne die überfälligen Rechnungen an und aktualisiere die Tabelle.'],
  ['.g-working', 'Mach ich — der Ablauf läuft.'],
  [
    '.g-step',
    [
      '✓&nbsp; 14 Zahlungserinnerungen verschickt',
      '✓&nbsp; Tabelle aktualisiert — 12 Zeilen abgeglichen',
      '✓&nbsp; 2 Zahlungen schon da',
    ],
  ],
  [
    '.g-stamp',
    [
      'Du · 09:41',
      'Ocur · 09:43',
      'Jeder Schritt protokolliert · nichts Wichtiges ohne deine Freigabe',
    ],
  ],
  ['.g-approve p', 'Anders &amp; Co ist 90 Tage überfällig — <strong>letzte Mahnung senden?</strong>'],
  ['.g-approve-btns span', ['Freigeben', 'Halten']],
  [
    '.g-cap',
    [
      'Einmal sagen — in ganz normaler Sprache. Kein Prompt-Engineering.',
      'Ocur erledigt den ganzen Ablauf — über E-Mail, Tabellen und das Web.',
      'Alles Wichtige wartet auf deine Freigabe. Ein Klick, fertig.',
    ],
  ],

  // bento features
  ['#features .g-h2', 'Ein System. <span class="g-grad">Jeder Job.</span>'],
  [
    '.g-tile h3',
    [
      'Autopilot rund um die Uhr',
      'Für jede Abteilung',
      'Reden statt tippen',
      'Unternehmensgedächtnis',
      'Steuert deinen Rechner',
      'Volle Kontrolle',
    ],
  ],
  [
    '.g-tile p',
    [
      'Ocur wacht über den Tag immer wieder von selbst auf, prüft, was ansteht, erledigt es und protokolliert jeden Schritt. Du wachst auf — und findest einen Bericht, keinen Rückstand.',
      'Echte Arbeit — von Anfang bis Ende.',
      'Per Sprache, wie mit einem Kollegen — unterbrich es mitten im Satz.',
      '„Was haben wir im März vereinbart?“ — einmal gefragt, für immer beantwortet.',
      'Öffnet Apps, klickt, tippt, liest den Bildschirm — mit deinem Okay.',
      'Du legst fest, was allein laufen darf. Der Rest wartet auf Freigabe — jede Aktion protokolliert.',
    ],
  ],
  ['.g-times span', ['06:00 Posteingang', '06:15 Rechnungen', '07:12 baut ein Tool', '08:00 Bericht']],
  ['.g-chips span', ['Vertrieb', 'Support', 'Finanzen', 'Marketing', 'Betrieb', 'Wissen']],

  // pricing (euro for the German market)
  ['#pricing .g-h2', 'Kostenlos starten. Skalieren, <span class="g-grad">wenn’s überzeugt.</span>'],
  ['.g-eyebrow', ['Zum Ausprobieren', 'Für wachsende Teams', 'Für den vollen Betrieb']],
  ['.g-badge', 'Am beliebtesten'],
  ['.g-price', ['€0<span>/Monat</span>', '€1.500<span>/Monat</span>', '€5.000<span>/Monat</span>']],
  [
    '.g-card li',
    [
      // Free
      'Das volle Betriebssystem',
      'E-Mail, Kalender, Dateien, Chat &amp; das Web',
      'Gedächtnis, Sprache, Bilder &amp; Automatisierungen',
      'Ohne Kreditkarte',
      // Team
      'Alles aus Free',
      '300× so viel Arbeitsvolumen wie Free',
      'Gemeinsames Wissen fürs ganze Team',
      'Eigene Tools &amp; Automatisierungen',
      'Standard-Support',
      // Business
      'Alles aus Team',
      'Doppeltes Volumen von Team',
      'Mehr Automatisierungen &amp; parallele Worker',
      'Priority-Support',
    ],
  ],
  [
    '.g-meta',
    [
      '250K Tokens Ocur-Arbeit / Monat — genug für echte Aufgaben',
      '75M Tokens Ocur-Arbeit / Monat',
      '150M Tokens Ocur-Arbeit / Monat',
    ],
  ],
  ['.g-cards .g-btn', ['Kostenlos starten', 'Team starten', 'Business starten']],
  ['.g-note', 'Mehr nötig? Enterprise läuft unbegrenzt — Upgrade direkt in der App.'],

  // FAQ
  ['#faq .g-h2', 'Fragen, <span class="g-grad">beantwortet.</span>'],
  [
    '.g-faq summary',
    [
      'Ist der Start wirklich kostenlos?',
      'Muss ich etwas installieren?',
      'Macht Ocur etwas ohne mein Okay?',
      'Mit welchen Tools funktioniert es?',
      'Sind unsere Daten sicher?',
      'Kann das ganze Unternehmen mitmachen?',
      'Wie schnell sind wir startklar?',
    ],
  ],
  [
    '.g-faq p',
    [
      'Ja, wirklich. Der Free-Plan ist das volle Betriebssystem mit monatlichem Arbeitsvolumen — genug, um Ocur an echten Aufgaben zu testen. Keine Kreditkarte, keine Frist. Überzeugt es, ist das Upgrade einen Klick entfernt.',
      'Nein. Ocur läuft im Browser — und du erreichst es genauso aus WhatsApp, Telegram, Slack oder Discord. Soll es auch auf deinem Rechner arbeiten? Eine kleine Begleit-App verbindet ihn in unter einer Minute.',
      'Nur, wo du es erlaubst. Standardmäßig wartet alles Wichtige auf deine Freigabe. Erst auf Autopilot erledigt Ocur ganze Abläufe von selbst — jeder Schritt protokolliert. Was allein laufen darf, bestimmst du jederzeit, Ruhezeiten inklusive.',
      'Gmail, Google Kalender &amp; Drive, Notion, GitHub, WhatsApp, Telegram, Slack und Discord — dazu das Web und auf Wunsch deinen eigenen Rechner. Konten verbindest du einzeln und trennst sie jederzeit wieder.',
      'Dein Workspace ist strikt von jedem anderen Kunden getrennt. Ocur sieht nur die Konten, die du verbindest — und jede Verbindung kappst du mit einem Klick.',
      'Ja — genau dafür ist es gemacht. Alle delegieren an ein gemeinsames Ocur mit geteiltem Wissen. Admins regeln, wer was darf, und an einem Ort siehst du, was erledigt wurde.',
      'Minuten, nicht Monate. Ocur läuft im Browser, verbindet sich Login für Login mit deinen Tools und braucht kein IT-Projekt. Die meisten Teams geben ihm schon am ersten Tag echte Arbeit.',
    ],
  ],

  // final + dock
  ['.g-final-h', 'Führ dein Unternehmen —<br /><span class="g-grad">nicht deinen Posteingang.</span>'],
  ['.g-final .g-btn', 'Kostenlos starten'],
  ['.g-foot em', 'Sag es — oder nicht. Es passiert. Du behältst die Kontrolle.'],
  ['#g-dock strong', 'Kostenlos starten'],
  ['.g-dock-sub', 'ohne Kreditkarte'],
];

// selector → [attribute, value]
export const DE_ATTRS = [
  ['.g-links', 'aria-label', 'Hauptnavigation'],
  ['.g-social-x', 'aria-label', 'Ocur auf X'],
  ['.g-social-x', 'title', 'Ocur auf X'],
];
