// All German copy lives here, as pure data — imported by the browser
// runtime (src/i18n.js) and by the build-time prerenderer
// (scripts/prerender-de.mjs) that bakes dist/de/index.html. No browser
// APIs in this file. Written as native, conversion-focused German — not a
// literal translation of the English page.

export const TITLE_DE = 'Ocur — das KI-Betriebssystem für Unternehmen | Kostenlos starten';
export const OG_TITLE_DE = 'Ocur — das KI-Betriebssystem für Unternehmen';
export const DESC_DE =
  'Das KI-Betriebssystem für Unternehmen: Ocur beantwortet E-Mails und Anrufe, erledigt die Arbeit direkt in deinen Tools und führt Versprechen, Geld und Pipeline als lebende Register. Jetzt kostenlos starten.';

// Link-Vorschau (X, WhatsApp, iMessage, LinkedIn). Kürzer als DESC_DE, weil X
// die Beschreibung in der Karte hart abschneidet. Das Kartenbild dazu ist
// public/og-de.jpg (siehe scripts/gen-og.mjs).
export const TWITTER_DESC_DE =
  'Ocur beantwortet E-Mails und Anrufe, erledigt die Arbeit direkt in deinen Tools und führt Versprechen, Geld und Pipeline als lebende Register. Jetzt kostenlos testen.';
export const OG_ALT_DE =
  'Ocur — „Deine KI redet nicht. Sie erledigt.“ Ein Ocur-Fenster im Live-Anruf: In der Lieferung fehlen 40 Stück, klär das — Vertrag geprüft, Lieferant angerufen, €312 zurückgeholt.';

// The founder's booking page — the same href every data-book link in
// index.html carries. Only the FAQ answer needs it here (its link is inline
// in the sentence); the other German labels swap text inside existing links.
const BOOK_URL = 'https://api.ocur.ai/api/book/gJM0Hx8-5SY';

// selector → replacement innerHTML. A string applies to every match; an
// array applies element-by-element in DOM order.
export const DE = [
  // nav ("Book a demo", then "Start free") + the phone menu
  ['header .g-btn-sm', ['Demo buchen', 'Kostenlos starten']],
  ['.g-login', 'Anmelden'],
  ['.g-links a', ['In Aktion', 'Das System', 'Funktionen', 'Preise', 'FAQ']],
  ['.g-menu-links a', ['In Aktion', 'Das System', 'Funktionen', 'Deine ersten zehn Minuten', 'Preise', 'FAQ']],
  ['.g-menu-ctas a', ['Anmelden', 'Kostenlos starten', 'Demo buchen']],

  // hero
  ['.g-kicker', '<span class="g-kdot" aria-hidden="true"></span>Das KI-Betriebssystem für Unternehmen'],
  ['.g-h1', 'Deine KI redet nicht.<br /><span class="g-grad">Sie erledigt.</span>'],
  [
    '.g-sub',
    'Ocur beantwortet deine E-Mails und geht ans Telefon, mahnt offene Rechnungen an, vergisst kein Versprechen — und erledigt die Arbeit direkt in deinen Tools. Auf Zuruf oder komplett auf Autopilot.',
  ],
  ['.g-ctas a', ['Kostenlos starten', 'Demo ansehen']],
  [
    '.g-micro',
    [
      'Kostenlos testen&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;Kein IT-Projekt',
      'Kostenlos testen&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;In Minuten live',
    ],
  ],
  ['.g-stat strong', ['1,5M', '60s', '∞']],
  ['.g-stat span', ['Gratis-Tokens / Monat', 'bis live', 'Konnektoren — beliebig erweiterbar']],

  // connector strip
  ['.g-logos-label', 'Arbeitet in den Tools, die dein Team längst nutzt'],
  [
    '.g-logos-sub',
    '…und allem, was eine API hat. Keine API? Dann steuert Ocur die App direkt auf deinem Rechner — wie ein Mensch.',
  ],

  // pinned demo (four scenes: ask → facts + the call → the deal → payoff)
  ['#demo .g-h2', 'Gesagt. <span class="g-grad">Getan.</span>'],
  ['.g-win-pill', '<i class="g-kdot"></i> Autopilot an'],
  ['.g-type', 'In der Freitagslieferung fehlen 40 Stück — klär das mit dem Lieferanten.'],
  ['.g-fan', '<i class="g-kdot" aria-hidden="true"></i>Mach ich — erst die Fakten, dann der Anruf.'],
  ['.g-act-tag', ['Lager', 'Drive', 'Telefon', 'Anruf']],
  [
    '.g-act-txt',
    [
      'Bestellt 500 · Lieferschein 460 — 40 fehlen, bestätigt',
      'Liefervertrag, §7 — 4&nbsp;% Gutschrift bei Fehlmenge',
      'Ruft Meier Logistik an — Einkauf',
      '„Wir schreiben die 4&nbsp;% gut und liefern Donnerstag früh nach.“',
    ],
  ],
  ['.g-act-ok', ['✓ geprüft', '✓ gefunden', '● live', '02:41']],
  [
    '.g-stamp',
    [
      'Du · 09:41',
      'Ocur · 09:47 · ja, Ocur telefoniert wirklich',
      'Nichts Wichtiges ohne deine Freigabe',
      'Ocur · 10:02 · das ganze Gespräch im Protokoll',
    ],
  ],
  ['.g-approve p', 'Meier bietet €312 Gutschrift + Nachlieferung am Donnerstag — <strong>Deal annehmen?</strong>'],
  ['.g-approve-btns span', ['Annehmen', 'Nachverhandeln']],
  ['.g-sent', '✓ Am Telefon zugesagt — schriftliche Bestätigung ist raus'],
  ['.g-report-kicker', 'Während du im Meeting warst'],
  ['.g-report-big', '<strong class="g-grad" data-cc="312" data-cc-prefix="€">€312</strong><span> zurückgeholt</span>'],
  [
    '.g-report-lines li',
    [
      'Gutschrift verbucht — die Bücher stimmen schon',
      'Nachlieferung Do 08:00 — steht in deinem Kalender',
      'Gesprächsprotokoll + Bestätigung, abgelegt',
    ],
  ],
  [
    '.g-cap',
    [
      'Einmal sagen — in ganz normaler Sprache. Kein Prompt-Engineering.',
      'Erst die Fakten — dann greift Ocur zum Hörer.',
      'Ocur verhandelt. Die letzte Entscheidung bleibt deine.',
      'Geld zurück, Termin fix, jedes Wort im Protokoll.',
    ],
  ],

  // the ledgers ("the system")
  ['#system .g-h2', 'Andere KI antwortet. <span class="g-grad">Ocur führt die Bücher.</span>'],
  [
    '.g-os-sub',
    '„Betriebssystem“ ist wörtlich gemeint: Ocur führt lebende Register über alles, was dein Unternehmen verspricht, besitzt, schuldet und verkauft — abgeleitet aus dem, was wirklich passiert ist, nie aus Formularfeldern.',
  ],
  ['.g-os-tag', ['Versprechen', 'Geld', 'Pipeline', 'Lager', 'Deine Datenbank', 'Kommandozentrale']],
  [
    '.g-os-card h3',
    [
      'Jedes Versprechen im Blick',
      'Zahlen mit Substanz',
      'Ein CRM, das sich selbst pflegt',
      'Nie wieder leere Regale verkaufen',
      'Ocur baut deine Datenbank',
      'Die ganze Firma auf einen Blick',
    ],
  ],
  [
    '.g-os-card p:not(.g-os-tag)',
    [
      'Ocur liest Zusagen direkt aus E-Mails und Chats — was ihr schuldet, was man euch schuldet, das „Mach ich!“ tief im Thread — und verfolgt jede einzelne bis zur Erledigung. Nichts geht mehr unter.',
      'Kasse, Forderungen, Verbindlichkeiten, Runway — live aus dem echten Geschehen. Ocur nennt nie eine Zahl, die die Daten nicht hergeben, und lässt dich kein Geld versprechen, das nicht da ist.',
      'Deals und Beziehungen, deren Zustand sich aus dem echten Verlauf ergibt. Ocur geht in jedes Gespräch und weiß schon, welcher Deal hakt und wer still geworden ist.',
      'Bestand als Bewegungsjournal statt als irgendwann überschriebene Zahl. Ocur prüft, was wirklich da ist, bevor es den Auftrag bestätigt.',
      'Bewerber, Aufträge, Patienten — worauf dein Geschäft auch läuft: Ocur entwirft die Tabellen, entwickelt sie mit dir weiter und arbeitet selbst darin. Das nächste SaaS-Abo kannst du dir womöglich sparen.',
      'Ein Live-Dashboard, das Ocur für dich zusammenstellt — was Aufmerksamkeit braucht, welche Zahlen sich bewegt haben und welche Entscheidungen auf dich warten.',
    ],
  ],
  [
    '.g-os-note',
    'Ein Graph verbindet alles: Der gewonnene Deal bucht seine Forderung, das Versprechen an den Interessenten steht schon im Register — und hinter beidem steht derselbe Kontakt. Nichts wird zweimal gefragt.',
  ],

  // bento features
  ['#features .g-h2', 'Ein System. <span class="g-grad">Jeder Job.</span>'],
  [
    '.g-tile h3',
    [
      'Autopilot rund um die Uhr',
      'Beantwortet E-Mails selbst',
      'Sprich mit Ocur',
      'Geht ans Telefon',
      'Zehn Jobs auf einmal',
      'Einmal zeigen genügt',
      'Unternehmensgedächtnis',
      'Steuert deinen Rechner',
      'Volle Kontrolle',
      'Baut eigene Tools',
      'Für jede Abteilung',
    ],
  ],
  [
    '.g-tile p',
    [
      'Ocur wacht über den Tag immer wieder von selbst auf, prüft, was ansteht, erledigt es und protokolliert jeden Schritt. Du wachst auf — und findest einen Bericht, keinen Rückstand.',
      'Ocur bekommt ein eigenes Postfach, kennt zu jedem Absender die ganze Vorgeschichte und antwortet in deinem Ton — oder legt dir Entwürfe zur Freigabe vor.',
      'Wie mit einem Kollegen — ein echtes Gespräch, kein Diktat. Unterbrich Ocur mitten im Satz; es kommt mit.',
      'Ocur bekommt eine eigene Nummer, nimmt die Anrufe an, auf die du keine Lust hast, sagt nur, was du erlaubst — und legt dir das Protokoll hin.',
      'Übergib den ganzen Rückstand in einer Nachricht. Parallele Worker arbeiten nebeneinander und melden sich, sobald ein Job fertig ist.',
      'Nimm die Routineaufgabe als Bildschirmvideo auf und erklär dabei, was du tust. Ocur macht daraus eine Fähigkeit, die es für immer wiederholt — genau auf deine Art.',
      '„Was haben wir im März vereinbart?“ — einmal gefragt, für immer beantwortet. Gib Ocur eure Dokumente; nichts wird zweimal gefragt.',
      'Ocur öffnet Apps, klickt, tippt, liest den Bildschirm — mit deinem Okay.',
      'Du legst fest, was allein laufen darf. Der Rest wartet auf Freigabe — jede Aktion protokolliert.',
      'Fehlt ein Tracker, ein Portal, ein Rechner? Ocur schreibt die App selbst, hält sie neben dem Chat am Laufen — und teilt sie mit dem Team.',
      'Echte Arbeit — von Anfang bis Ende. Ein Ocur, an das die ganze Firma delegiert.',
    ],
  ],
  ['.g-times span', ['06:00 Posteingang', '06:15 Rechnungen', '07:12 baut ein Tool', '08:00 Bericht']],
  ['.g-chips span', ['Vertrieb', 'Support', 'Finanzen', 'Marketing', 'Betrieb', 'Wissen']],

  // the first ten minutes
  ['#start .g-h2', 'Deine ersten <span class="g-grad">zehn Minuten.</span>'],
  [
    '.g-start-sub',
    'Ocur ist kein Chatfenster. Es ist ein Schreibtisch — Apps, ein Dock und Ocur in der Mitte. So laufen die ersten zehn Minuten.',
  ],
  [
    '.g-step h3',
    ['Anmelden. Du sitzt am Schreibtisch.', 'Den ersten Job sagen.', 'Ein Tool verbinden.', 'Auf Autopilot stellen.'],
  ],
  [
    '.g-step p',
    [
      'Chat, Konnektoren, Einstellungen und der App Store sind schon da. Jede weitere App erscheint, sobald Ocur etwas hineinzulegen hat.',
      '„Such die drei Rechnungen, die noch offen sind, und entwirf die Erinnerungen.“ Ocur arbeitet in einem Fenster neben dem Chat und zeigt dir, was es tut.',
      'Gmail, WhatsApp, Notion — je ein Login. Ocur liest nur, was du verbindest, und mit einem Klick nimmst du es wieder weg.',
      'Mach aus dem Job eine Automatisierung mit Zeitplan. Ocur führt sie aus, während du weg bist, und meldet sich im Chat — oder auf WhatsApp.',
    ],
  ],
  [
    '.g-start-note',
    'Jedes Fenster hat seinen eigenen Link — teil einen Thread, eine Liste oder einen Deal mit einer Kollegin, und sie landet genau dort.',
  ],

  // pricing (euro for the German market — same numbers, other symbol)
  ['#pricing .g-h2', 'Kostenlos starten. Skalieren, <span class="g-grad">wenn’s überzeugt.</span>'],
  [
    '.g-price-lede',
    'Zwei Leitern, ein Ocur. Allein zahlst du für dein eigenes Ocur. Als Unternehmen kommen alle Menschen kostenlos dazu — bezahlt werden die KI-Worker und die Arbeit, die sie erledigen.',
  ],
  ['.g-seg-t', ['Nur ich', 'Mein Unternehmen']],
  ['.g-seg-s', ['Solo-Pläne', 'Business-Pläne']],
  [
    '.g-worker-note',
    '<strong>Was ist ein KI-Worker?</strong> Ein Kollege, den Ocur für dich laufen lässt — mit Namen, Aufgabe und Zeitplan. Er arbeitet parallel, während du etwas anderes tust.',
  ],
  [
    '.g-tier-lede',
    [
      '<span class="g-tier-tag">Solo</span> Eine Person delegiert — dein eigenes Ocur, dazu KI-Worker, die weitermachen, auch wenn du weg bist.',
      '<span class="g-tier-tag g-tier-tag-hot">Business</span> Das ganze Unternehmen auf einem Ocur: ein gemeinsamer Pool, ein gemeinsames Gedächtnis — und unbegrenzt viele Menschen, immer kostenlos.',
    ],
  ],
  [
    '.g-eyebrow',
    [
      'Zum Ausprobieren',
      'Für den Einstieg',
      'Für alle, die viel delegieren',
      'Für den ganzen Tag',
      'Euer erstes gemeinsames Gehirn',
      'Für ambitionierte Unternehmen',
      'Für Unternehmen &amp; Agenturen',
    ],
  ],
  ['.g-badge', 'Am beliebtesten'],
  [
    '.g-price',
    [
      '€0<span>/Monat</span>',
      '€29<span>/Monat</span>',
      '€149<span>/Monat</span>',
      '€299<span>/Monat</span>',
      '€399<span>/Monat</span>',
      '€1.500<span>/Monat</span>',
      '€5.000<span>/Monat</span>',
    ],
  ],
  [
    '.g-price-alt',
    [
      'Keine Kreditkarte. Keine Frist.',
      'oder €290 im Jahr — 2 Monate geschenkt',
      'oder €1.490 im Jahr — 2 Monate geschenkt',
      'oder €2.990 im Jahr — 2 Monate geschenkt',
      'oder €4.389 im Jahr — 1 Monat geschenkt',
      'oder €16.500 im Jahr — 1 Monat geschenkt',
      'oder €55.000 im Jahr — 1 Monat geschenkt',
    ],
  ],
  [
    '.g-card li',
    [
      // Free
      'Das volle Betriebssystem',
      'E-Mail, Kalender, Dateien, Chat &amp; das Web',
      'Ocur in WhatsApp, Telegram, Slack &amp; Discord',
      'Auf Zuruf: du fragst, Ocur erledigt',
      // Starter
      'Alles aus Free',
      '3× so viel Arbeitsvolumen wie Free',
      'Autopilot — Ocur arbeitet, auch wenn du weg bist',
      'Eigene Telefonnummer und eigenes Postfach',
      'Geplante Jobs, Morgenbriefings, Automatisierungen',
      // Pro
      'Alles aus Starter',
      '5× so viel Volumen wie Starter',
      'Bis zu 10 KI-Worker gleichzeitig',
      'Den ganzen Rückstand in einer Nachricht übergeben',
      // Pro Plus
      'Alles aus Pro',
      'Doppeltes Volumen von Pro',
      'Unbegrenzt viele KI-Worker',
      // Team
      'Unbegrenzt viele Menschen — Einladungen sind gratis',
      '2 KI-Worker mit echten Aufgaben und Zeitplänen',
      'Ein gemeinsamer Pool für das ganze Team',
      'Gemeinsames Firmenwissen und Gedächtnis',
      'Ocur in WhatsApp, Telegram, Slack, Teams &amp; E-Mail',
      // Growth
      'Alles aus Team',
      '5× so viel Pool-Volumen wie Team',
      '5 KI-Worker mit echten Aufgaben und Zeitplänen',
      'Firmenweites Gedächtnis, Leitplanken &amp; Governance',
      'Eigene Tools, Live Apps und Automatisierungen',
      // Scale
      'Alles aus Growth',
      'Fast 3× der Pool von Growth',
      '15 KI-Worker über Teams und Abteilungen hinweg',
      'Intelligence-Digest für die Führung',
      'Priority-Support und Onboarding',
    ],
  ],
  [
    '.g-meta',
    [
      '1,5M Tokens Ocur-Arbeit / Monat',
      '5M Tokens Ocur-Arbeit / Monat',
      '25M Tokens Ocur-Arbeit / Monat',
      '50M Tokens Ocur-Arbeit / Monat',
      '48M Tokens Ocur-Arbeit / Monat, geteilt',
      '240M Tokens Ocur-Arbeit / Monat, geteilt',
      '680M Tokens Ocur-Arbeit / Monat, geteilt',
    ],
  ],
  [
    '.g-cards .g-btn',
    [
      'Kostenlos starten',
      'Starter holen',
      'Pro holen',
      'Pro Plus holen',
      'Team holen',
      'Growth holen',
      'Scale holen',
    ],
  ],
  ['.g-extra strong', ['+1 KI-Worker', 'Top-up', 'Enterprise']],
  [
    '.g-extra span',
    [
      '€199 im Monat — und bringt weitere 25M Tokens Arbeit mit',
      '€100 legen 10M Tokens in den gemeinsamen Pool, jederzeit',
      'Unbegrenztes Volumen, eigene Pool-Größe, eigene Konditionen',
    ],
  ],
  [
    '.g-note',
    [
      'Preise in Euro — außerhalb der EU gilt dieselbe Zahl in US-Dollar. Jährlich zahlen heißt zwei Monate geschenkt, und du kannst jederzeit wechseln, upgraden oder kündigen.',
      'Preise in Euro — außerhalb der EU gilt dieselbe Zahl in US-Dollar. Jährlich zahlen heißt einen Monat geschenkt. Jedes Unternehmen startet kostenlos: erst selbst ausprobieren, dann die anderen dazu holen.',
    ],
  ],

  // book a demo — the band under both ladders, and the Enterprise extra's link
  ['.g-book-kicker', '<span class="g-kdot" aria-hidden="true"></span>Live-Demo'],
  ['.g-book h3', 'Lieber erst mal ansehen?'],
  [
    '.g-book-text',
    'Buch dir 30 Minuten mit dem Gründer — eine Live-Führung durch Ocur an der Arbeit deines eigenen Unternehmens, und klare Antworten auf die harten Fragen.',
  ],
  ['.g-book .g-btn', 'Demo buchen'],
  ['.g-book-sub', '30 Minuten · Videocall · Termin frei wählbar'],
  ['.g-extra-link', 'Sprich mit uns →'],

  // FAQ
  ['#faq .g-h2', 'Fragen, <span class="g-grad">beantwortet.</span>'],
  [
    '.g-faq summary',
    [
      'Ist der Start wirklich kostenlos?',
      'Was unterscheidet Ocur von einem Chat-Assistenten?',
      'Muss ich etwas installieren?',
      'Macht Ocur etwas ohne mein Okay?',
      'Und wenn es einen Fehler macht?',
      'Mit welchen Tools funktioniert es?',
      'Sind unsere Daten sicher?',
      'Kann das ganze Unternehmen mitmachen?',
      'Zahlen wir pro Person?',
      'Wie schnell sind wir startklar?',
      'Kann ich vorher eine Demo bekommen?',
    ],
  ],
  [
    '.g-faq p',
    [
      'Ja, wirklich. Der Free-Plan ist das volle Betriebssystem mit monatlichem Arbeitsvolumen — genug, um Ocur an echten Aufgaben zu testen. Keine Kreditkarte, keine Frist. Überzeugt es, ist das Upgrade einen Klick entfernt.',
      'Ein Chat-Assistent gibt dir eine Antwort — die Arbeit bleibt trotzdem bei dir. Ocur macht den Job fertig, dort, wo er hingehört: mit eigenem Postfach und eigener Telefonnummer, auf Autopilot auch wenn du weg bist, mit lebenden Registern für Versprechen, Geld, Pipeline und Lager. Das Ergebnis landet in deinen Tools — nicht in deiner Zwischenablage.',
      'Nein. Ocur läuft im Browser — und du erreichst Ocur genauso aus WhatsApp, Telegram, Slack oder Discord. Soll es auch auf deinem Rechner arbeiten? Eine kleine Begleit-App verbindet ihn in unter einer Minute.',
      'Nur, wo du es erlaubst. Standardmäßig wartet alles Wichtige auf deine Freigabe. Erst auf Autopilot erledigt Ocur ganze Abläufe von selbst — jeder Schritt protokolliert. Was allein laufen darf, bestimmst du jederzeit, Ruhezeiten inklusive.',
      'Dann siehst du ihn — jede Aktion steht im Protokoll, mit dem Was und dem Warum. Alles Wichtige hat ohnehin auf deine Freigabe gewartet. Korrigier es in ganz normaler Sprache — Ocur merkt sich die Korrektur, und derselbe Fehler passiert kein zweites Mal.',
      'Gmail, Google Kalender &amp; Drive, Notion, GitHub, WhatsApp, Telegram, Slack und Discord — dazu das Web und auf Wunsch deinen eigenen Rechner. Konten verbindest du einzeln und trennst sie jederzeit wieder.',
      'Dein Workspace ist strikt von jedem anderen Kunden getrennt. Ocur sieht nur die Konten, die du verbindest — und jede Verbindung kappst du mit einem Klick. Wir verkaufen deine Daten nie und trainieren keine Modelle damit — die <a href="/de/privacy">Datenschutzerklärung</a> sagt genau, was mit allem passiert, was Ocur anfasst, Google Workspace inklusive. Welcher Dienst was bekommt, und wann, steht in <a href="/de/data">Wohin deine Daten gehen</a>.',
      'Ja — genau dafür ist es gemacht. Alle delegieren an ein gemeinsames Ocur mit geteiltem Wissen. Admins regeln, wer was darf, und an einem Ort siehst du, was erledigt wurde.',
      'Nein. Menschen sind immer kostenlos, egal wie viele ihr seid — eine Kollegin einzuladen kostet nichts. Bezahlt wird Ocurs Arbeit: ein monatliches Volumen davon und die KI-Worker, die eigenständig nach Zeitplan arbeiten. Noch ein Paar Hände? Ein zusätzlicher KI-Worker kostet €199 im Monat und bringt 25M Tokens Arbeit mit.',
      'Minuten, nicht Monate. Ocur läuft im Browser, verbindet sich Login für Login mit deinen Tools und braucht kein IT-Projekt. Die meisten Teams geben ihm schon am ersten Tag echte Arbeit.',
      `Ja. <a href="${BOOK_URL}" target="_blank" rel="noopener" data-book="faq">Buch ein 30-minütiges Gespräch</a> — der Gründer führt dich live durch Ocur, an der Arbeit deines eigenen Unternehmens. Bring deine Fragen mit. Oder du überspringst den Termin: Der Free-Plan ist das volle System — teste Ocur heute an echten Aufgaben und sprich mit uns, sobald du es gesehen hast.`,
    ],
  ],

  // final + dock
  ['.g-final-h', 'Führ dein Unternehmen —<br /><span class="g-grad">nicht deinen Posteingang.</span>'],
  ['.g-final .g-btn', 'Kostenlos starten'],
  ['.g-final-alt span', 'Lieber erst eine Führung?'],
  ['.g-final-alt a', 'Live-Demo buchen'],
  ['.g-foot em', 'Sag es — oder nicht. Es passiert. Du behältst die Kontrolle.'],
  ['.g-foot-links a', ['Datenschutz', 'AGB', 'Wohin deine Daten gehen', 'Sei die KI — das Spiel']],
  ['.g-foot-org', 'ein Produkt der OcurAI, Inc.'],
  ['#g-dock strong', 'Kostenlos starten'],
  ['.g-dock-sub', 'ohne Kreditkarte'],
];

// selector → [attribute, value]
export const DE_ATTRS = [
  ['.g-links', 'aria-label', 'Hauptnavigation'],
  ['.g-menu-links', 'aria-label', 'Menü'],
  ['.g-burger', 'aria-label', 'Menü'],
  [
    '.g-system',
    'aria-label',
    'Ocur im Zentrum eines Sonnensystems, umkreist von Gmail, Google Kalender, Google Drive, Notion, GitHub, Telegram, WhatsApp, Slack, Discord, E-Mail, deinem Rechner und dem Web — plus ein freier Platz für Konnektoren, die du selbst baust',
  ],
  ['.g-social-x', 'aria-label', 'Ocur auf X'],
  ['.g-social-x', 'title', 'Ocur auf X'],
  // the German page points at the German legal pages (/de/privacy, /de/terms);
  // matched on the English href, so this stays correct however the footer moves
  ['.g-foot-links', 'aria-label', 'Rechtliches'],
  ['.g-foot-links a[href="/privacy"]', 'href', '/de/privacy'],
  ['.g-foot-links a[href="/terms"]', 'href', '/de/terms'],
  ['.g-foot-links a[href="/data"]', 'href', '/de/data'],
];
