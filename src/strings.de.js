// All German copy lives here, as pure data — imported by the browser
// runtime (src/i18n.js) and by the build-time prerenderer
// (scripts/prerender-de.mjs) that bakes dist/de/index.html. No browser
// APIs in this file.

export const TITLE_DE = 'Ocur — Das KI-Betriebssystem für Unternehmen | Kostenlos starten';
export const OG_TITLE_DE = 'Ocur — Das KI-Betriebssystem für Unternehmen';
export const DESC_DE =
  'Ocur dockt an die Plattformen an, auf denen dein Unternehmen läuft — E-Mail, Kalender, Dateien, Chat, das Web — und erledigt die Arbeit darin. Auf Zuruf oder voll auf Autopilot. Du setzt die Grenzen. Teste kostenlos.';

// selector → replacement innerHTML. A string applies to every match; an
// array applies element-by-element in DOM order.
export const DE = [
  // nav
  ['header .g-btn-sm', 'Kostenlos starten'],
  ['.g-links a', ['In Aktion', 'Funktionen', 'Preise', 'FAQ']],

  // hero
  ['.g-kicker', '<span class="g-kdot" aria-hidden="true"></span>Das KI-Betriebssystem für Unternehmen'],
  ['.g-h1', 'Was, wenn dein Unternehmen<br /><span class="g-grad">sich selbst führt?</span>'],
  [
    '.g-sub',
    'Ocur dockt an die Plattformen an, auf denen du arbeitest, und erledigt die Arbeit darin. Auf Zuruf — oder voll auf Autopilot.',
  ],
  ['.g-ctas a', ['Kostenlos starten', 'Ansehen']],
  [
    '.g-micro',
    [
      'Kostenloser Pilot&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;Kein IT-Projekt',
      'Kostenloser Pilot&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;In Minuten live',
    ],
  ],
  ['.g-stat span', ['kostenlose Tokens / Monat', 'bis zum Rollout', 'native Konnektoren']],

  // connector strip
  ['.g-logos-label', 'Arbeitet in den Tools, die dein Unternehmen schon nutzt'],
  [
    '.g-logos-sub',
    '…und allem mit einer API. Keine API? Ocur bedient die App auf deinem Computer wie ein Mensch.',
  ],

  // pinned demo
  ['#demo .g-h2', 'Delegier es. <span class="g-grad">Sieh zu, wie es passiert.</span>'],
  ['.g-win-pill', '<i class="g-kdot"></i> Autopilot an'],
  ['.g-bubble-you', 'Mahne die überfälligen Rechnungen an und aktualisiere die Tabelle.'],
  ['.g-working', 'Mach ich — die Schleife läuft.'],
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
      'Einmal sagen, in normaler Sprache. Kein Prompt-Engineering.',
      'Ocur fährt die ganze Schleife — über E-Mail, Tabellen und das Web.',
      'Alles Wichtige wartet auf dich. Ein Tipp, fertig.',
    ],
  ],

  // bento features
  ['#features .g-h2', 'Ein System. <span class="g-grad">Jeder Job.</span>'],
  [
    '.g-tile h3',
    [
      'Autopilot, mit Herzschlag',
      'Jede Abteilung',
      'Sprich mit ihm',
      'Unternehmensgedächtnis',
      'Bedient deinen Computer',
      'Auf Kontrolle gebaut',
    ],
  ],
  [
    '.g-tile p',
    [
      'Ein Heartbeat weckt Ocur über den Tag. Es prüft, was ansteht, erledigt es und schreibt jeden Schritt mit. Du wachst zu einem Bericht auf, nicht zu einem Rückstand.',
      'Echte Arbeit, von Anfang bis Ende.',
      'Laut, wie ein Kollege — unterbrich es mitten im Satz.',
      '„Was haben wir im März vereinbart?“ — einmal gefragt, für immer beantwortet.',
      'Öffnet Apps, klickt, tippt, liest den Bildschirm — mit deinem Okay.',
      'Admins legen fest, was allein läuft. Der Rest wartet auf Freigabe — jede Aktion protokolliert.',
    ],
  ],
  ['.g-times span', ['06:00 Posteingang', '06:15 Rechnungen', '07:12 baut ein Tool', '08:00 Digest']],
  ['.g-chips span', ['Vertrieb', 'Support', 'Finanzen', 'Marketing', 'Betrieb', 'Wissen']],

  // pricing (euro for the German market)
  ['#pricing .g-h2', 'Pilotier es kostenlos. Skalier, wenn <span class="g-grad">es sich beweist.</span>'],
  ['.g-eyebrow', ['Für den Piloten', 'Ideal für wachsende Teams', 'Für den Betrieb gebaut']],
  ['.g-badge', 'Am beliebtesten'],
  ['.g-price', ['€0<span>/Monat</span>', '€149<span>/Monat</span>', '€299<span>/Monat</span>']],
  [
    '.g-card li',
    [
      // Free
      'Das volle Betriebssystem',
      'E-Mail, Kalender, Dateien, Chat &amp; das Web',
      'Gedächtnis, Sprache, Bilder und Automatisierungen',
      'Keine Kreditkarte zum Start',
      // Team
      'Alles aus Free',
      '300× das monatliche Kontingent',
      'Geteiltes Unternehmensgedächtnis und -wissen',
      'Eigene Tools und Automatisierungen',
      'Standard-Support',
      // Business
      'Alles aus Team',
      'Doppeltes monatliches Kontingent',
      'Höhere Automatisierungs- &amp; Worker-Limits',
      'Priorisierter Support',
    ],
  ],
  [
    '.g-meta',
    [
      '250K Tokens Ocur-Arbeit pro Monat',
      '75M Tokens Ocur-Arbeit pro Monat',
      '150M Tokens Ocur-Arbeit pro Monat',
    ],
  ],
  ['.g-cards .g-btn', ['Kostenlos starten', 'Team starten', 'Business holen']],
  ['.g-note', 'Enterprise wird unbegrenzt — kostenlos starten, in Ocur upgraden.'],

  // FAQ
  ['#faq .g-h2', 'Fragen, <span class="g-grad">beantwortet.</span>'],
  [
    '.g-faq summary',
    [
      'Ist der Start wirklich kostenlos?',
      'Muss ich etwas installieren?',
      'Macht es Dinge, ohne zu fragen?',
      'Womit arbeitet es?',
      'Sind unsere Daten privat?',
      'Kann das ganze Unternehmen es nutzen?',
      'Wie lange dauert der Rollout?',
    ],
  ],
  [
    '.g-faq p',
    [
      'Ja. Der kostenlose Plan ist das volle Betriebssystem mit einem monatlichen Arbeits-Kontingent — genug, um Ocur an echten Aufgaben zu testen. Keine Kreditkarte, keine Testuhr. Wenn es sich beweist, ist das Upgrade einen Klick entfernt.',
      'Nein — Ocur läuft im Browser, und du kannst ihm aus WhatsApp, Telegram, Slack oder Discord schreiben. Soll es auch auf deinem Computer arbeiten? Eine kleine Begleit-App verbindet deine Maschine in etwa einer Minute.',
      'Nur dort, wo du es erlaubt hast. Standardmäßig wartet alles Wichtige auf deine Freigabe. Stell einen Job auf Autopilot, und Ocur wacht auf einem Heartbeat und fährt die ganze Schleife selbst — jeder Schritt protokolliert. Du kannst jederzeit erweitern oder einschränken, was allein läuft, Ruhezeiten inklusive.',
      'Gmail, Google Kalender, Google Drive, Notion, GitHub, WhatsApp, Telegram, Slack und Discord — dazu das Web selbst und sogar deinen eigenen Computer, wenn du ihn verbindest. Du fügst Konten einzeln hinzu und kannst sie jederzeit trennen.',
      'Der Arbeitsbereich deines Unternehmens ist von jedem anderen Kunden abgeschottet. Ocur erreicht nur die Konten, die du verbunden hast, und du kannst jedes davon mit einem Klick entfernen.',
      'Ja — genau das ist der Punkt. Alle delegieren an ein gemeinsames Ocur mit geteiltem Gedächtnis und Wissen, Admins entscheiden, wer was darf, und es gibt einen Ort, an dem alles Erledigte sichtbar ist.',
      'Minuten, nicht Monate. Ocur läuft im Browser, verbindet sich Anmeldung für Anmeldung mit deinen Tools und braucht kein IT-Projekt. Die meisten Teams geben ihm am ersten Tag echte Arbeit.',
    ],
  ],

  // final + dock
  ['.g-final-h', 'Führ das Unternehmen.<br /><span class="g-grad">Nicht den Kleinkram.</span>'],
  ['.g-final .g-btn', 'Kostenlos starten'],
  ['.g-foot em', 'Sag es — oder nicht. Es passiert. Du behältst die Kontrolle.'],
  ['#g-dock strong', 'Kostenlos starten'],
  ['.g-dock-sub', 'keine Kreditkarte'],
];

// selector → [attribute, value]
export const DE_ATTRS = [['.g-links', 'aria-label', 'Hauptnavigation']];
