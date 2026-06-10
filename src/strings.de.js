// All German copy lives here, as pure data — imported by the browser
// runtime (src/i18n.js) and by the build-time prerenderer
// (scripts/prerender-de.mjs) that bakes dist/de/index.html. No browser
// APIs in this file.

export const TITLE_DE = 'Ocur — Das KI-Betriebssystem für Unternehmen | Kostenlos starten';
export const OG_TITLE_DE = 'Ocur — Das KI-Betriebssystem für Unternehmen';
export const DESC_DE =
  'Ocur dockt an die Plattformen an, auf denen dein Unternehmen läuft — E-Mail, Kalender, Dateien, Chat, das Web — und erledigt die Arbeit darin. Auf Zuruf oder voll auf Autopilot. Du setzt die Grenzen. Teste kostenlos.';

// Strings rendered dynamically by main.js.
export const STRINGS = {
  en: {
    notes: [
      { e: '✉️', t: '23 customer emails overnight', s: 'answered — 3 escalated to a human' },
      { e: '📅', t: 'Quarterly review to schedule', s: '11 calendars aligned, invites out' },
      { e: '🧾', t: 'Four invoices overdue', s: 'reminders sent — one already paid' },
      { e: '📝', t: 'Investor update due Friday', s: 'first draft waiting for your edits' },
      { e: '📣', t: 'Launch post not written', s: 'drafted and queued across channels' },
    ],
    final: { e: '✨', t: 'All handled.', s: 'Two things waited for your sign-off. The rest just ran.' },
    teamHours: 'team-hours',
    tasksHandled: (pct, done, total) => `${pct}% — ${done} of ${total} tasks handled`,
  },
  de: {
    notes: [
      { e: '✉️', t: '23 Kundenmails über Nacht', s: 'beantwortet — 3 an Menschen eskaliert' },
      { e: '📅', t: 'Quartals-Review zu planen', s: '11 Kalender abgeglichen, Einladungen raus' },
      { e: '🧾', t: 'Vier Rechnungen überfällig', s: 'Erinnerungen raus — eine schon bezahlt' },
      { e: '📝', t: 'Investoren-Update bis Freitag', s: 'erster Entwurf wartet auf dich' },
      { e: '📣', t: 'Launch-Post nicht geschrieben', s: 'entworfen und für alle Kanäle eingeplant' },
    ],
    final: { e: '✨', t: 'Alles erledigt.', s: 'Zwei Dinge warteten auf deine Freigabe. Der Rest lief einfach.' },
    teamHours: 'Team-Stunden',
    tasksHandled: (pct, done, total) => `${pct} % — ${done} von ${total} Aufgaben erledigt`,
  },
};

// selector → replacement innerHTML. A string applies to every match,
// an array applies element-by-element in DOM order.
export const DE = [
  // nav
  ['.mg-nav-links a', ['Der Unterschied', 'Autopilot', 'Abteilungen', 'Preise', 'Fragen']],
  ['.mg-nav .mg-btn-small', 'Kostenlos starten'],

  // hero
  ['.mg-kicker', 'Das KI-Betriebssystem für Unternehmen'],
  ['.mg-hero h1', 'Was wäre, wenn dein Unternehmen<br /><em>von selbst liefe?</em>'],
  [
    '.mg-hero .mg-sub',
    'Ocur dockt an die Plattformen an, auf denen dein Unternehmen längst läuft — E-Mail, Kalender, Dateien, Chat, das Web — und erledigt die Arbeit direkt darin. Bitte im Chat oder per Stimme um etwas. Oder stell einen Job auf Autopilot — dann ist er erledigt, bevor jemand fragt.',
  ],
  ['.mg-hero .mg-ctas .mg-btn', 'Kostenlos starten'],
  ['.mg-hero .mg-hint', 'Sieh den Unterschied ↓'],
  ['.mg-hero .mg-micro', 'Kostenloser Pilot&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;Kein IT-Projekt'],

  // Monday compare
  ['#monday h2', 'Der Montag deines Unternehmens. <em>Zieh zum Vergleichen.</em>'],
  ['#mg-side-before', 'Ohne Ocur'],
  ['#mg-side-after', 'Mit Ocur'],
  [
    '#mg-rows .b',
    [
      '23 Vertriebs-Follow-ups liegen in Entwürfen',
      'Support-Queue: 41 unbeantwortete Tickets',
      'Board-Unterlagen bis Donnerstag — nicht angefangen',
      'Ein Dutzend überfällige Rechnungen anzumahnen',
    ],
  ],
  [
    '#mg-rows .a',
    [
      'Follow-ups vor der Mittagspause raus — 4 Antworten schon da',
      'Queue sortiert — 6 knifflige an Menschen übergeben',
      'Entwurf steht — wartet auf dein OK',
      'Zahlungserinnerungen raus — 2 schon bezahlt',
    ],
  ],
  ['.mg-end .b', '17:45 — alle stecken noch fest.'],
  ['.mg-end .a', '16:00 — alles abgearbeitet.'],
  ['.mg-compare-note', 'Ein „OK“ von deinem Team. Den Rest hat Ocur erledigt.'],

  // statements story
  ['.mg-statement:nth-of-type(1) h2', 'Dein Team sagt es.'],
  ['.mg-statement:nth-of-type(1) .mg-said', '„Mahne die überfälligen Rechnungen an und aktualisiere die Tabelle.“'],
  ['.mg-statement:nth-of-type(2) h2', 'Es <em>passiert.</em>'],
  ['.mg-outcomes li', ['✓ 14 Erinnerungen verschickt', '✓ Tabelle aktualisiert', '✓ 2 Zahlungen schon da']],
  ['.mg-statement:nth-of-type(3) h2', 'Oder sag <em>gar nichts.</em>'],
  ['.mg-statement:nth-of-type(3) .mg-said', '💓 Heartbeat — Ocur hat’s bemerkt, erledigt, protokolliert.'],
  ['.mg-statement:nth-of-type(3) .mg-statement-note', 'Auf Autopilot passiert die Arbeit, bevor jemand fragt.'],
  ['.mg-statement:nth-of-type(4) h2', 'Du behältst die Kontrolle.'],
  ['.mg-approve p', 'Ocur fragt: <strong>„Anders &amp; Co ist 90 Tage überfällig — letzte Mahnung senden?“</strong>'],
  ['.mg-approve-btns .yes', 'Ja, senden'],
  ['.mg-approve-btns span:not(.yes)', 'Noch nicht'],
  ['.mg-statement:nth-of-type(4) .mg-statement-note', 'Alles Wichtige wartet auf deine Freigabe. Jede Aktion ist protokolliert.'],

  // autopilot
  ['#autopilot h2', 'Autopilot, mit <em>Herzschlag.</em>'],
  [
    '#autopilot .mg-head p',
    'Stell einen Job auf Autopilot und Ocur fährt die ganze Schleife selbst. Ein Heartbeat weckt es über den Tag — es prüft, was ansteht, erledigt es und schreibt jeden Schritt mit.',
  ],
  [
    '.mg-pulse-text',
    [
      '<strong>Heartbeat.</strong> Ocur wacht auf — scannt Posteingang, Kalender und Queues.',
      'Neun Routine-Kundenmails beantwortet. Zwei Entwürfe warten auf deine Freigabe.',
      'Überfällige Rechnung entdeckt → Erinnerung verschickt → Tabelle aktualisiert.',
      '<strong>Ruhiger Beat.</strong> Nichts Dringendes — also baut sich Ocur ein schnelleres Tool für den Rechnungs-Check.',
      'Dein Morgen-Digest landet: alles, was lief — und die zwei Dinge, die auf dich warten.',
    ],
  ],
  [
    '.mg-pulse-note',
    'Du wachst mit einem Bericht auf, nicht mit einem Rückstau. Autopilot ist opt-in pro Job — mit Ruhezeiten, Freigaberegeln und vollem Protokoll.',
  ],

  // departments
  ['#everyday h2', 'Ein System. <em>Jede Abteilung.</em>'],
  ['#everyday .mg-head p', 'Keine neuen Tools zu lernen — Ocur arbeitet in denen, die dein Unternehmen schon hat.'],
  ['#everyday .mg-card h3', ['Vertrieb', 'Support', 'Finanzen', 'Marketing', 'Operations', 'Firmengedächtnis']],
  [
    '#everyday .mg-card p',
    [
      'Follow-ups pünktlich raus, Leads recherchiert, Angebote entworfen — noch vor dem Stand-up.',
      'Routinefragen beantwortet — in deinem Ton, von allein. Die kniffligen landen bei einem Menschen.',
      'Rechnungen angemahnt, Erinnerungen im Takt, die Zahlen sauber in einer Tabelle.',
      'Posts und Kampagnentexte entworfen, eingeplant und veröffentlicht — bereit für deine Freigabe.',
      'Berichte erstellt, Ordner aufgeräumt — und die Wochenroutinen laufen von selbst.',
      'Jede Entscheidung, jedes Dokument — gemerkt. Frag „Was haben wir im März beschlossen?“ und bekomm die Antwort.',
    ],
  ],

  // plugged into everything
  ['#anywhere h2', 'Mit <em>allem</em> verbunden.'],
  [
    '#anywhere .mg-head p',
    'Ocur liegt unter den Tools, auf denen dein Unternehmen läuft — und dein Team erreicht es von überall.',
  ],
  [
    '.mg-system-note',
    '…und das ist nur die Kurzliste. <strong>Bau eigene Connectoren direkt in Ocur</strong> — hat ein Tool eine API, ist es in Minuten angebunden. Hat es keine, bedient Ocur es an deinem Computer wie ein Mensch. Dein ganzer Stack — ohne Warten auf eine Integrations-Roadmap.',
  ],
  ['#anywhere .mg-card h3', ['Sprich es durch', 'Worker, parallel', 'Der Firmen-Takt, automatisiert', 'Es bedient einen Computer', 'Es erstellt Bilder', 'Gebaut für Kontrolle']],
  [
    '#anywhere .mg-card p',
    [
      'Sprich mit Ocur wie mit einem Kollegen. Es antwortet laut — und du kannst ihm ins Wort fallen.',
      'Gib einen großen Job ab und Ocur teilt ihn auf Worker auf, die nebeneinander laufen.',
      'Morgen-Digests, Freitagsberichte, Monatsend-Erinnerungen — einmal einstellen, läuft.',
      'Apps öffnen, klicken, tippen, den Bildschirm lesen — Ocur bedient einen Rechner wie ein Mensch. Mit deinem Einverständnis.',
      'Produktbilder, Diagramme, Social-Grafiken — in Worten beschrieben, in Minuten geliefert.',
      'Admins entscheiden, was Ocur allein tun darf. Der Rest wartet auf Freigabe — jede Aktion im Protokoll.',
    ],
  ],

  // pricing
  ['#pricing h2', 'Teste kostenlos. Skaliere, wenn <em>es sich beweist.</em>'],
  [
    '#pricing .mg-head p',
    'Das volle Betriebssystem in jedem Plan — größere Pläne lassen Ocur einfach mehr vom Unternehmen tragen. Monatlich kündbar.',
  ],
  ['.mg-price-eyebrow', ['Für den Pilot', 'Ideal für wachsende Teams', 'Gebaut für Operations']],
  ['.mg-price-badge', 'Am beliebtesten'],
  ['.mg-price-amount', ['0&nbsp;€<span>/Monat</span>', '149&nbsp;€<span>/Monat</span>', '299&nbsp;€<span>/Monat</span>']],
  [
    '.mg-price:nth-of-type(1) ul li',
    ['Das volle Betriebssystem', 'E-Mail, Kalender, Dateien, Chat &amp; Web', 'Gedächtnis, Stimme, Bilder und Automationen', 'Keine Kreditkarte zum Start'],
  ],
  [
    '.mg-price:nth-of-type(2) ul li',
    ['Alles aus Free', '300× das monatliche Kontingent', 'Geteiltes Firmengedächtnis und Wissen', 'Eigene Tools und Automationen', 'Standard-Support'],
  ],
  [
    '.mg-price:nth-of-type(3) ul li',
    ['Alles aus Team', 'Doppeltes Monats-Kontingent', 'Höhere Automations- &amp; Worker-Limits', 'Mehr verbundene Konten', 'Priority-Support'],
  ],
  [
    '.mg-price-meta',
    ['250K Tokens Ocur-Arbeit pro Monat', '75M Tokens Ocur-Arbeit pro Monat', '150M Tokens Ocur-Arbeit pro Monat'],
  ],
  ['.mg-price .mg-btn', ['Kostenlos starten', 'Team starten', 'Business holen']],
  [
    '.mg-price-note',
    'Preise in Euro — US-Kunden zahlen dieselben Zahlen in Dollar ($149 / $299). Unbegrenzt nötig? Es gibt einen Enterprise-Plan — starte kostenlos und upgrade direkt in Ocur.',
  ],

  // FAQ
  ['#faq h2', 'Fragen, <em>beantwortet.</em>'],
  [
    '.mg-faq summary',
    [
      'Ist der Start wirklich kostenlos?',
      'Muss ich etwas installieren?',
      'Macht es Dinge, ohne zu fragen?',
      'Womit funktioniert es?',
      'Sind unsere Daten privat?',
      'Kann das ganze Unternehmen es nutzen?',
      'Wie lange dauert der Rollout?',
    ],
  ],
  [
    '.mg-faq details p',
    [
      'Ja. Der Free-Plan ist das volle Betriebssystem mit einem monatlichen Arbeits-Kontingent — genug, um Ocur an echten Aufgaben zu testen. Keine Kreditkarte, keine Testphasen-Uhr. Wenn es sich beweist, ist das Upgrade ein Klick.',
      'Nein — Ocur läuft im Browser, und du kannst es auch über WhatsApp, Telegram, Slack oder Discord erreichen. Soll es zusätzlich an deinem eigenen Rechner arbeiten? Eine kleine Begleit-App verbindet deine Maschine in etwa einer Minute.',
      'Nur dort, wo du es erlaubt hast. Ab Werk wartet alles Wichtige auf deine Freigabe. Stellst du einen Job auf Autopilot, wacht Ocur per Heartbeat auf und fährt die ganze Schleife allein — jeder Schritt im Protokoll. Was allein laufen darf, kannst du jederzeit enger oder weiter stellen, Ruhezeiten inklusive.',
      'Gmail, Google Calendar, Google Drive, Notion, GitHub, WhatsApp, Telegram, Slack und Discord — plus das Web selbst und sogar dein eigener Computer, wenn du ihn verbindest. Konten verbindest du einzeln und kannst jedes jederzeit wieder trennen.',
      'Der Workspace deines Unternehmens ist von allen anderen Kunden abgeschottet. Ocur erreicht nur die Konten, die du verbunden hast — und du kannst jedes mit einem Klick wieder entfernen.',
      'Ja — genau dafür ist es da. Alle delegieren an ein gemeinsames Ocur mit geteiltem Gedächtnis und Wissen, Admins entscheiden, wer was darf, und an einem Ort siehst du alles, was erledigt wurde.',
      'Minuten, nicht Monate. Ocur läuft im Browser und verbindet sich mit deinen Tools per Sign-in — ganz ohne IT-Projekt. Die meisten Teams geben ihm am ersten Tag echte Arbeit.',
    ],
  ],

  // final CTA + footer
  ['.mg-final h2', 'Führ das Unternehmen.<br /><em>Nicht den Kleinkram.</em>'],
  [
    '.mg-final p:not(.mg-micro)',
    'Ocur arbeitet in E-Mail, Kalender, Dateien und Chats, auf denen dein Unternehmen läuft.<br />Vor allem Wichtigen fragt es nach.',
  ],
  ['.mg-final .mg-btn-big', 'Kostenlos starten'],
  ['.mg-final .mg-micro', 'Kostenloser Pilot&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;Live in Minuten'],
  ['.mg-foot em', 'Sag es — oder lass es. Es passiert. Du behältst die Kontrolle.'],
];

// attribute swaps: [selector, attribute, value]
export const DE_ATTRS = [
  ['#mg-compare', 'aria-label', 'Der Montag deines Unternehmens — zieh den Regler und sieh zu, wie Ocur die Arbeit übernimmt'],
  ['#mg-handle', 'aria-label', 'Wie viel vom Montag Ocur übernommen hat'],
  ['#mg-stack', 'aria-label', 'Ein Stapel Benachrichtigungen wird eine nach der anderen erledigt, bis alles geschafft ist'],
  ['.mg-statements', 'aria-label', 'So funktioniert Ocur'],
  [
    '.mg-system',
    'aria-label',
    'Ocur im Zentrum eines Sonnensystems, umkreist von Gmail, Google Calendar, Google Drive, Notion, GitHub, Telegram, WhatsApp, Discord, E-Mail, deinem Computer, dem Web — und einem freien Platz für Connectoren, die du selbst baust',
  ],
  [
    '.mg-pulse',
    'aria-label',
    'Ein Morgen auf Autopilot: Heartbeats wecken Ocur, es erledigt die Arbeit von Anfang bis Ende und berichtet zurück',
  ],
  ['.mg-p-add', 'title', 'Deine Apps — bau deinen eigenen Connector'],
  ['.mg-planet[title="Your computer"]', 'title', 'Dein Computer'],
  ['.mg-planet[title="The web"]', 'title', 'Das Web'],
  ['.mg-planet[title="Email — any provider"]', 'title', 'E-Mail — jeder Anbieter'],
];
