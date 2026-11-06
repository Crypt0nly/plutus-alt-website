// All German copy lives here, as pure data — imported by the browser
// runtime (src/i18n.js) and by the build-time prerenderer
// (scripts/prerender-de.mjs) that bakes dist/de/index.html. No browser
// APIs in this file. Written as native, conversion-focused German — not a
// literal translation of the English page.

export const TITLE_DE = 'Ocur — das KI-Betriebssystem für Unternehmen';
export const OG_TITLE_DE = 'Ocur — das KI-Betriebssystem für Unternehmen';
export const DESC_DE =
  'Das KI-Betriebssystem für Unternehmen: Ocur beantwortet E-Mails und Anrufe, erledigt die Arbeit direkt in deinen Tools und führt Versprechen, Geld und Pipeline als lebende Register. Kostenlos starten.';

// Link-Vorschau (X, WhatsApp, iMessage, LinkedIn). Kürzer als DESC_DE, weil X
// die Beschreibung in der Karte hart abschneidet. Das Kartenbild dazu ist
// public/og-de.jpg (siehe scripts/gen-og.mjs).
export const TWITTER_DESC_DE =
  'Ocur beantwortet E-Mails und Anrufe, erledigt die Arbeit direkt in deinen Tools und führt Versprechen, Geld und Pipeline als lebende Register. Kostenlos starten — ohne Kreditkarte.';

export const OG_ALT_DE =
  'Ocur — „Weniger Routine. Mehr Unternehmen.“ Ein Ocur-Fenster: In der Freitagslieferung fehlen 40 Stück, klär das mit dem Lieferanten — Lieferant angerufen, €312 zurückgeholt, Nachlieferung im Kalender.';

// The founder's booking page — the same href every data-book link carries
// (src/site.js). Only inline sentence links need it here; the other German
// labels swap text inside existing links.
const BOOK_URL = 'https://api.ocur.ai/api/book/gJM0Hx8-5SY';

// Each marketing page's German title and description, keyed by its English
// path (scripts/prerender-de.mjs writes them into /de, /de/product …). The
// home page keeps the constants above for its link preview.
export const PAGES_DE = {
  '/': { title: TITLE_DE, description: DESC_DE },
  '/product': {
    title: 'Ocur — so funktioniert das KI-Betriebssystem',
    description:
      'Sieh zu, wie Ocur einen Job vom ersten Satz bis zum Ergebnis erledigt: Fakten prüfen, in deinen Tools arbeiten, anrufen und berichten — mit lebenden Registern und deiner Freigabe bei allem Wichtigen.',
  },
  '/pricing': {
    title: 'Ocur Preise — Pläne für dich und dein Unternehmen',
    description:
      'Allein kostenlos starten oder das ganze Unternehmen auf ein Ocur bringen: unbegrenzt viele Menschen, ein gemeinsamer Credit-Pool und KI-Worker. Solo ab 0 €, Business ab 399 € im Monat.',
  },
  '/faq': {
    title: 'Ocur FAQ — Fragen, beantwortet',
    description:
      'Klare Antworten zu Ocur: der kostenlose Plan, unterstützte Tools, Freigaben, was bei Fehlern passiert, deine Daten und die Abrechnung.',
  },
  '/contact': {
    title: 'Kontakt — sprich mit Ocur oder buch eine Demo',
    description:
      'Frag nach einem Plan, einer Einrichtung für dein Team oder dem ersten Job für Ocur — der Gründer liest jede Nachricht persönlich. Oder buch eine 30-minütige Live-Führung.',
  },
};

// selector → replacement innerHTML. A string applies to every match; an
// array applies element-by-element in DOM order.
export const DE = [
  // Interactive product illustrations.
  [".ps-eyebrow", "Die Ocur Familie"],
  ["#ps-title", "Deine Arbeit. <span class=\"g-grad\">Dein Weg.</span>"],
  [".ps-desk-meta", "Dein Workspace"],
  [".ps-greeting", "Mehr Raum für deine Ideen."],
  [".ps-composer > span", "Was möchtest du voranbringen?"],
  ["[data-desk-heading]", "Kalender"],
  [".ps-today", "Heute"],
  [".ps-calendar-title", "Dein Tag im Blick."],
  [".ps-event-one", "Team-Update"],
  [".ps-event-two", "Raum für deine nächste Idee"],
  [".ps-files-kicker", "Dateien"],
  [".ps-files-title", "Alles an seinem Platz."],
  [".ps-folder-one", "Projekte"],
  [".ps-folder-two", "Recherche"],
  [".ps-folder-three", "Marke"],
  [".ps-routines-kicker", "Automationen"],
  [".ps-routines-title", "Schon erledigt."],
  [".ps-routine-one", "Dein Morgenbriefing"],
  [".ps-routine-two", "Den Posteingang freihalten"],
  [".ps-routine-time", "Jeden Werktag · 08:00"],
  [".ps-routine-time-two", "Arbeitet im Hintergrund"],
  [".ps-dock-label-calendar", "Kalender"],
  [".ps-dock-label-files", "Dateien"],
  [".ps-dock-label-routines", "Automationen"],
  [".ps-ocur-copy", "Deine Arbeit, verbunden. Dein ganzer Tag an einem Ort."],
  [".ps-ocur-link", "Ocur kostenlos testen <span aria-hidden=\"true\">↗</span>"],
  [".ps-drops-kicker", "Ein eigener Charakter. Viele Möglichkeiten."],
  [".ps-drops-title", "Lerne dein Team kennen."],
  [".ps-drop-milo-role", "Schwung für jeden Tag"],
  [".ps-drop-sage-role", "Neugier mit System"],
  [".ps-drop-lumi-role", "Eine neue Perspektive"],
  [".ps-chat-milo", "Deine Woche ist organisiert. Schaffen wir Raum für die große Idee?"],
  [".ps-chat-sage", "Die Recherche steht. Finden wir heraus, worauf es ankommt."],
  [".ps-chat-lumi", "Drei Richtungen für deine nächste Kampagne. Welche passt zu dir?"],
  [".ps-drops-copy", "KI-Teammitglieder mit Charakter. Ganz auf dich abgestimmt."],
  [".ps-drops-link", "Deine Drops kennenlernen <span aria-hidden=\"true\">↗</span>"],
  [".ps-world-kicker", "Deine Zentrale, in 3D"],
  [".ps-world-title", "Sieh deinem Team beim Arbeiten zu."],
  [".ps-world-research", "Recherche-Labor"],
  [".ps-world-research-copy", "Olive verbindet die Punkte."],
  [".ps-world-sales", "Vertrieb"],
  [".ps-world-sales-copy", "Milo hat den nächsten Kontakt vorbereitet."],
  [".ps-world-studio", "Kreativstudio"],
  [".ps-world-studio-copy", "Luna arbeitet an deiner nächsten großen Idee."],
  [".ps-world-copy", "Eine lebendige Zentrale für deine Drops und ihre Arbeit."],
  [".ps-world-link", "Durch die Demo-Welt gehen <span aria-hidden=\"true\">↗</span>"],
  [".ps-example-note", "Produktansichten mit Beispieldaten. Wähle ein Produkt zum Entdecken."],

  // The nav, phone menu and footer are drawn in German at build time
  // (scripts/lib/chrome.mjs); these lines only serve the dev ?lang=de view.
  ['header .g-btn-sm', ['Demo buchen', 'Kostenlos starten']],
  ['.g-login', 'Anmelden'],
  ['.g-links a > span:last-child', ['Produkt', 'Preise', 'FAQ']],
  ['.g-menu-links a', ['Startseite', 'Produkt', 'Preise', 'FAQ', 'Kontakt']],
  ['.g-menu-ctas a', ['Kostenlos starten', 'Anmelden', 'Demo buchen']],

  // page heads (product, pricing, FAQ; the others carry their own kickers)
  ['.p-product .pg-kicker', 'Produkt'],
  ['.p-product .pg-title', 'Ein Ocur für die Arbeit <span class="g-grad">im ganzen Unternehmen.</span>'],
  [
    '.p-product .pg-lede',
    'Sag die Aufgabe in ganz normaler Sprache. Ocur prüft die Fakten, arbeitet in den Tools, die du verbindest, und meldet sich zurück — und fragt, bevor etwas Wichtiges passiert.',
  ],
  ['.p-pricing .pg-kicker', 'Preise'],
  ['.g-inline-cta .g-btn', 'Kostenlos starten'],
  ['.g-inline-cta .g-more', 'Demo buchen <span aria-hidden="true">→</span>'],
  ['.p-faq .pg-kicker', 'FAQ'],
  ['.p-contact .pg-kicker', 'Kontakt'],

  // the opening: one promise and two compact actions
  ['#hx-title', '<span class="hx-line"><span>Weniger Routine.</span></span> <span class="hx-line"><em>Mehr Unternehmen.</em></span>'],
  [
    '.hx-sub',
    'Das KI-Betriebssystem für Unternehmen. Es beantwortet E-Mails und Anrufe, arbeitet in den Tools, die du schon nutzt — und fragt, bevor etwas Wichtiges passiert.',
  ],
  ['.hx-primary', 'Kostenlos starten'],
  ['.hx-secondary', 'Demo buchen <span aria-hidden="true">›</span>'],
  ['.hx-micro', 'Free-Plan&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte'],

  // you stay in control (home, first on the rising page)
  ['#g-trust-title', 'Ocur erledigt die Arbeit. <span class="g-grad">Du behältst das Sagen.</span>'],
  [
    '.g-trust-sub',
    'Ocur schreibt E-Mails und telefoniert für dein Unternehmen — also entscheidest du, was es allein tun darf. Alles andere wartet auf dein OK.',
  ],
  [
    '.g-trust-card h3',
    ['Fragt vor allem Wichtigen', 'Jeder Schritt dokumentiert', 'Nur, was du verbindest', 'Deine Daten bleiben deine'],
  ],
  [
    '.g-trust-card p',
    [
      'Ab Werk wartet alles Wichtige auf deine Freigabe. Du legst fest, was allein laufen darf — und kannst es jederzeit wieder einschränken.',
      'Was Ocur getan hat, wann und warum — bis zum Gesprächsprotokoll. Korrigier es in ganz normaler Sprache, und Ocur merkt es sich.',
      'Ocur erreicht nur die Konten, die du verbindest. Jedes davon nimmst du mit einem Klick wieder weg.',
      'Dein Workspace ist von allen anderen Kunden abgeschottet. Wir verkaufen deine Daten nie und trainieren keine Modelle damit.',
    ],
  ],
  ['.g-trust-more', 'Sieh, wohin deine Daten gehen <span aria-hidden="true">→</span>'],

  // the opening's deck: four jobs, one window each (src/hero.js)
  ['.hx-bar-title > span', ['Rechnungen', 'Leads', 'Anrufe', 'Autopilot']],
  ['.hx-state-run', '<i class="g-kdot"></i>Arbeitet'],
  ['.hx-state-done', '<svg class="g-i"><use href="#i-check" /></svg>Erledigt'],
  [
    '.hx-ask-t',
    [
      'Mahn alle Rechnungen an, die seit über 30 Tagen offen sind.',
      'Beantworte neue Leads innerhalb von fünf Minuten — und buch die guten.',
      'Nimm heute Nachmittag meine Anrufe an — ich bin in der Werkstatt.',
      'Jeden Werktag um 6: Posteingang leeren, Rechnungen verschicken, mich auf WhatsApp briefen.',
    ],
  ],
  [
    '.hx-reply-t',
    [
      'Mach ich — erst die Zahlen, dann die Erinnerungen.',
      'Mach ich — ich antworte, sobald sie reinkommen.',
      'Alles klar — ich gehe ran.',
      'Läuft — jeden Werktag um 06:00.',
    ],
  ],
  [
    '.hx-txt strong',
    [
      '4 überfällige Rechnungen · 9.850&nbsp;€',
      'Erinnerungen verschickt — in deinem Ton',
      'Ruft Weber &amp; Co. an — Rechnung #1043',
      '3 neue Leads über deine Website',
      'Geprüft · 2 passen zu euch',
      'Demo gebucht · Nordwerk GmbH',
      'Bäckerei Schmidt · Bestellung für Samstag',
      '200 Brötchen gegen den Bestand geprüft',
      'Zusammenfassung an dich geschickt',
      'Posteingang: 38 erledigt · 3 brauchen dich',
      '7 Rechnungen verschickt · 12.640&nbsp;€',
      'Morgen-Briefing gesendet',
    ],
  ],
  [
    '.hx-txt > span',
    [
      'Aus deinen Büchern',
      '4 E-Mails · Gmail',
      '45 Tage überfällig',
      'Posteingang',
      'Pipeline aktualisiert',
      'Di. 14:00',
      'Angenommen · 01:42',
      'Vorrätig · reserviert',
      'WhatsApp',
      '06:02',
      '06:09',
      '06:12',
    ],
  ],
  ['.hx-done-k', ['Heute eingegangen', 'Erste Antwort nach', 'Heute Nachmittag', 'Bevor du wach warst']],
  [
    '.hx-done-v',
    ['<span data-count="3200" data-suffix="&nbsp;€">3.200&nbsp;€</span>', '<span>4 Min.</span>', '<span>4 Anrufe</span>', '<span>06:12</span>'],
  ],
  [
    '.hx-done-l',
    [
      'Weber zahlt Freitag — Erinnerung steht im Kalender',
      '3 Leads beantwortet · 1 Demo gebucht',
      '1 Bestellung gebucht · 3 Nachrichten notiert',
      'Erledigt — jeden Werktag, auf Autopilot',
    ],
  ],
  ['.hx-compose > span', 'Sag Ocur, was zu tun ist …'],
  ['.hx-chip', ['Rechnungen', 'Leads', 'Anrufe', 'Autopilot']],

  // The product page's chapters.
  ['#demo .oc-chapter-label', 'Vom Vorhaben zur Tat'],
  ['#system .oc-chapter-label', 'Das ganze Bild'],
  ['#features .oc-chapter-label', 'Arbeit, die weitergeht'],
  ['#start .oc-chapter-label', 'Ein kleiner erster Schritt'],

  // connector strip
  ['.g-logos-label', 'Arbeitet in den Tools, die dein Team längst nutzt.'],
  [
    '.g-logos-sub',
    '…und allem, was eine API hat. Keine API? Dann steuert Ocur die App direkt auf deinem Rechner — wie ein Mensch.',
  ],
  ['.g-logos-more', 'Integrationen ansehen <span aria-hidden="true">→</span>'],

  // where to next: one card per page
  ['.g-paths .g-h2', 'Lust auf einen genaueren Blick? <span class="g-grad">Fang an, wo du magst.</span>'],
  ['.g-path h3', ['So funktioniert’s', 'Für dich allein oder fürs ganze Team', 'Fragen, beantwortet']],
  [
    '.g-path p',
    [
      'Verfolge einen Job vom ersten Satz bis zum Ergebnis — und sieh, was Ocur dabei alles im Blick behält.',
      'Allein kostenlos starten. Als Unternehmen kommen alle Menschen kostenlos dazu — bezahlt werden die KI-Worker und ihre Arbeit.',
      'Womit Ocur arbeitet, wann es vorher fragt und was mit deinen Daten passiert.',
    ],
  ],
  [
    '.g-path-go',
    [
      'Produkt entdecken <span aria-hidden="true">→</span>',
      'Preise ansehen <span aria-hidden="true">→</span>',
      'Zur FAQ <span aria-hidden="true">→</span>',
    ],
  ],

  // pinned demo (four scenes: ask → facts + the call → the deal → payoff)
  ['#demo .g-h2', 'Gesagt. <span class="g-grad">Getan.</span>'],
  ['.g-win-pill', '<i class="g-kdot"></i> Autopilot an'],
  ['.g-type', 'In der Freitagslieferung fehlen 40 Stück — klär das mit dem Lieferanten.'],
  ['.g-fan', '<span class="g-fan-mark" aria-hidden="true"><img src="/logo.svg" alt="" /></span>Mach ich — erst die Fakten, dann der Anruf.'],
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
  ['.g-win-compose > span', 'Sag Ocur, was zu tun ist …'],
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

  // Pricing mirrors the Ocur Desktop / oDrops cards in plutus-cloud's
  // frontend/src/lib/plans.ts. Keep these selectors aligned with index.html.
  // Euro for the German market — same numbers, other symbol.
  ['#pricing .g-h2', 'Kostenlos starten. Skalieren, <span class="g-grad">wenn’s überzeugt.</span>'],
  [
    '.g-price-lede',
    'Zwei Leitern, ein Ocur. Allein zahlst du für dein eigenes Ocur. Als Unternehmen kommen alle Menschen kostenlos dazu — bezahlt werden die KI-Worker und die Arbeit, die sie erledigen.',
  ],
  ['.g-seg-t', ['Nur ich', 'Mein Unternehmen']],
  ['.g-seg-s', ['Solo-Pläne', 'Business-Pläne']],
  ['.g-company-interval button', ['Monatlich', 'Alle 6 Monate', 'Jährlich']],
  ['.g-billing-note', 'Wähle, wann du zahlst. Credits erneuern sich bei jedem Plan monatlich.'],
  [
    '.g-worker-note',
    '<strong>Was ist ein KI-Worker?</strong> Ein Kollege, den Ocur für dich laufen lässt — mit Namen, Aufgabe und Zeitplan. Er arbeitet parallel, während du etwas anderes tust.',
  ],
  [
    '.g-tier-lede',
    [
      '<span class="g-tier-tag">Solo</span> Ocur Desktop, oDrops und oWorlds — ein Abo und ein gemeinsames monatliches Credit-Kontingent. Offen für alle.',
      '<span class="g-tier-tag g-tier-tag-hot">Business</span> Das ganze Unternehmen auf einem Ocur: ein gemeinsamer Pool, ein gemeinsames Gedächtnis — und unbegrenzt viele Menschen, immer kostenlos.',
    ],
  ],
  [
    '.g-eyebrow',
    [
      'Ein bisschen mehr erledigt',
      'Ocur, jeden Tag',
      'Ocur als deine rechte Hand',
      'Ocur erledigt deinen ganzen Tag',
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
      '6 Monate: €2.300 · Jahr: €4.389',
      '6 Monate: €8.500 · Jahr: €16.500',
      '6 Monate: €28.500 · Jahr: €55.000',
    ],
  ],
  [
    '.g-card li',
    [
      // Free
      'Ocur Desktop — im Browser oder als App',
      'Gmail, Kalender, Drive, Notion und GitHub verbinden',
      'oDrops · 2 Drops mit den Modellen deiner Wahl erstellen',
      // Starter
      'Ocurs eigene WhatsApp- und iMessage-Leitungen, Telefonnummer und E-Mail',
      'Ocur in WhatsApp, iMessage, Telegram, Slack, Teams und E-Mail',
      'Autopilot im Hintergrund: Dashboards und Widgets bleiben aktuell',
      'Deine Social-Media- und Werbekonten, verbunden',
      'oDrops · 10 Drops erstellen',
      // Pro
      'Alles aus Starter',
      'Platz für geplante Jobs, Briefings und lange Arbeitssitzungen den ganzen Monat',
      'Live Apps und Workflows, die während deiner Abwesenheit laufen',
      'oDrops · 50 Drops erstellen',
      // Pro Plus
      'Alles aus Pro',
      'Für Power-User mit Workflows, KI-Kollegen und Live Apps rund um die Uhr',
      'Priority-Support',
      'oDrops · 100 Drops erstellen',
      // Team
      'Unbegrenzt viele Menschen — Einladungen sind gratis',
      '2 KI-Worker mit echten Aufgaben und Zeitplänen',
      'Ocur in WhatsApp, iMessage, Telegram, Slack, Teams &amp; E-Mail',
      'Jederzeit weitere KI-Worker einstellen — je €199/Monat',
      'Jederzeit aufladen — €100 pro +10M Credits',
      'oDrops-Zugang',
      // Growth
      'Unbegrenzt viele Menschen — Einladungen sind gratis',
      '5 KI-Worker mit echten Aufgaben und Zeitplänen',
      'Firmenweites Gedächtnis, Leitplanken &amp; Governance',
      'Jederzeit weitere KI-Worker einstellen — je €199/Monat',
      'Jederzeit aufladen — €100 pro +10M Credits',
      'oDrops-Zugang',
      // Scale
      'Unbegrenzt viele Menschen — Einladungen sind gratis',
      '15 KI-Worker über Teams und Abteilungen hinweg',
      'Intelligence-Digest für die Führung',
      'Priority-Support und Onboarding',
      'Individuelle Pool-Größe auf Anfrage',
      'oDrops-Zugang',
    ],
  ],
  [
    '.g-meta',
    [
      '1,5M Credits jeden Monat',
      '3M Credits jeden Monat — 2× Free',
      '16M Credits jeden Monat',
      '32M Credits jeden Monat — 2× Pro',
      '48M gemeinsame Credits jeden Monat',
      '180M gemeinsame Credits jeden Monat',
      '600M gemeinsame Credits jeden Monat',
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
      'Jederzeit weitere KI-Worker einstellen — je €199 im Monat',
      '€100 legen 10M Credits in den gemeinsamen Pool; gültig bis zum nächsten monatlichen Reset',
      'Pilot, individuelle Pool-Größe oder Enterprise-Einrichtung mit unserem Team besprechen',
    ],
  ],
  [
    '.g-tiers > .g-note',
    [
      'Jeder kostenpflichtige Tarif enthält das volle Ocur OS, alle verbundenen Kanäle sowie Ocurs eigene Telefonnummer und E-Mail. Preise in Euro — außerhalb der EU gilt dieselbe Zahl in US-Dollar. Jährlich zahlen heißt zwei Monate geschenkt. Jederzeit kündbar oder wechselbar — direkt in deinen Abrechnungseinstellungen.',
      'Preise in Euro — außerhalb der EU gilt dieselbe Zahl in US-Dollar. Wähle monatliche, halbjährliche oder jährliche Abrechnung. Der angezeigte Preis ist der volle Betrag für diesen Zeitraum. Jährlich zahlen heißt einen Monat geschenkt. Credit-Aufladungen verfallen beim nächsten monatlichen Reset. Jederzeit kündbar oder wechselbar.',
    ],
  ],
  [
    '.g-credit-note',
    'Dein Credit-Kontingent wird zwischen Ocur, oDrops und oWorlds geteilt. Teurere Modelle, Ausgaben und Medien verbrauchen mehr Credits; zwischengespeicherte Eingaben weniger. Dein Kontingent erneuert sich monatlich, auch bei halbjährlicher und jährlicher Abrechnung.',
  ],
  ['.g-extra-link', 'Sprich mit uns →'],
  ['.g-price-help', 'Noch Fragen? <a href="/faq">Lies die FAQ</a> oder <a href="/contact#talk">sprich mit uns</a>.'],
  ['.g-card-talk', 'oder erst mit uns sprechen →'],
  [
    '.g-pilot',
    'Noch nicht bereit für einen Business-Plan? <a href="https://app.ocur.ai/?auth=sign-up">Starte kostenlos mit deinem eigenen Konto</a> und wechsle, sobald dein Team dazukommt — oder <a href="/contact#talk" data-talk="pilot">sprich mit uns über einen Pilot</a>.',
  ],

  // pricing questions, answered where people decide
  ['#pf-title', 'Bevor du wählst. <span class="g-grad">Klare Antworten.</span>'],
  [
    '.p-pricing .g-faq summary',
    [
      'Was ist ein Credit?',
      'Was passiert, wenn meine Credits aufgebraucht sind?',
      'Kann ich jederzeit kündigen?',
      'Kann unser Unternehmen Ocur vor dem Kauf testen?',
      'Zahlen wir pro Person?',
    ],
  ],
  [
    '.p-pricing .g-faq p',
    [
      'Credits messen die KI-Arbeit, die Ocur für dich erledigt — lesen, schreiben, in deinen Tools arbeiten, Bilder erstellen. Größere Modelle, lange Antworten und Medien verbrauchen mehr; zwischengespeicherte Eingaben weniger. Dein Kontingent gilt für Ocur, oDrops und oWorlds, erneuert sich jeden Monat, und die App zeigt dir, wie viel du verbraucht hast.',
      'Ocur hält an und sagt dir Bescheid — es gibt keine überraschenden Zusatzkosten. Wechsle in einen größeren Plan, lade bei einem Business-Plan auf oder warte, bis sich dein Kontingent im nächsten Monat erneuert.',
      'Ja. Wechsle oder kündige jederzeit in deinen Abrechnungseinstellungen — ohne Anruf, ohne Formular.',
      'Ja. <a href="https://app.ocur.ai/?auth=sign-up">Starte mit einem kostenlosen Konto</a> und gib Ocur echte Arbeit. Sobald dein Team dazukommt, wählst du einen Business-Plan — alle Menschen sind kostenlos dabei. Lieber ein begleiteter Pilot? <a href="/contact#talk" data-talk="pilot-faq">Sprich mit uns</a>.',
      'Nein. Jeder Business-Plan enthält unbegrenzt viele Menschen — Kollegen einzuladen kostet nichts. Ihr zahlt für einen gemeinsamen monatlichen Credit-Pool und die KI-Worker; jeder weitere KI-Worker kostet €199 im Monat.',
    ],
  ],

  // contact: "Talk to us" (the site's lead form — labels and copy; the
  // status lines live in contact-form.js) beside the founder's booking page
  ['#contact .g-h2', 'Sprich mit uns. <span class="g-grad">Oder sieh es dir erst live an.</span>'],
  [
    '.g-contact-sub',
    'Frag nach einem Plan, einer Einrichtung für dein Team oder dem ersten Job für Ocur — oder buch eine 30-minütige Führung mit dem Gründer.',
  ],
  ['.g-talk-kicker', '<span class="g-kdot" aria-hidden="true"></span>Nachricht'],
  ['.g-talk-h', 'Schreib uns.'],
  [
    '.g-talk-text',
    'Der Gründer liest jede Nachricht persönlich und meldet sich per E-Mail bei dir — oder per Anruf, wenn du eine Nummer dalässt.',
  ],
  [
    '.g-talk .g-field > span',
    [
      'Geschäftliche E-Mail',
      'Name',
      'Unternehmen <em>optional</em>',
      'Teamgröße <em>optional</em>',
      'Telefon <em>optional — damit wir dich anrufen können</em>',
      'Wobei können wir helfen?',
    ],
  ],
  ['.g-talk select option', ['Bitte wählen…', 'Nur ich', '2–10 Personen', '11–50 Personen', '51–200 Personen', '201+ Personen']],
  ['.g-talk button[type="submit"]', 'Nachricht senden'],
  ['.g-talk-sub', 'Liest der Gründer persönlich. <a href="/de/privacy">Datenschutz</a>'],
  ['.g-talk noscript', `<p class="g-talk-noscript">Bitte aktiviere JavaScript, um deine Nachricht zu senden, oder <a href="${BOOK_URL}" target="_blank" rel="noopener">buch ein Gespräch mit dem Gründer</a>.</p>`],
  ['.g-next-kicker', '<span class="g-kdot" aria-hidden="true"></span>Wie es weitergeht'],
  [
    '.g-next-steps li',
    [
      '<strong>Du schreibst.</strong> Ein, zwei Zeilen reichen.',
      '<strong>Der Gründer liest es</strong> — persönlich, kein Bot.',
      '<strong>Du hörst von uns</strong> per E-Mail, oder per Anruf, wenn du eine Nummer dagelassen hast.',
    ],
  ],
  ['.g-book-kicker', '<span class="g-kdot" aria-hidden="true"></span>Live-Demo'],
  ['.g-book-h', 'Lieber erst mal ansehen?'],
  [
    '.g-book-text',
    'Buch dir 30 Minuten mit dem Gründer — eine Live-Führung durch Ocur an der Arbeit deines eigenen Unternehmens, und klare Antworten auf die harten Fragen.',
  ],
  ['.g-book .g-btn', 'Demo buchen'],
  ['.g-book-sub', '30 Minuten · Videocall · Termin frei wählbar'],
  [
    '.g-contact-solo',
    'Nur für dich? Der Free-Plan steht allen offen — <a href="https://app.ocur.ai/?auth=sign-up">kostenlos starten</a>, ohne Formular.',
  ],

  // FAQ
  ['#faq .g-h2', 'Fragen, <span class="g-grad">beantwortet.</span>'],
  ['.faq-lede', 'Klare Antworten zum Einstieg, zur Arbeitsweise von Ocur und dazu, was mit deinen Daten und deiner Rechnung passiert.'],
  ['.faq-ask-h', 'Noch eine Frage offen?'],
  ['.faq-ask-text', 'Frag den Gründer in einem 30-minütigen Gespräch — live, an der Arbeit deines eigenen Unternehmens — oder schreib uns.'],
  ['.faq-ask .g-btn', 'Demo buchen'],
  ['.faq-ask .g-more', 'Sprich mit uns <span aria-hidden="true">→</span>'],
  ['.faq-group-title', ['Der Einstieg', 'So arbeitet Ocur', 'Dein Unternehmen und deine Daten']],
  [
    '.p-faq .g-faq summary',
    [
      'Gibt es einen kostenlosen Plan?',
      'Muss ich etwas installieren?',
      'Wie schnell sind wir startklar?',
      'Kann ich vorher eine Demo bekommen?',
      'Was unterscheidet Ocur von einem Chat-Assistenten?',
      'Macht Ocur etwas ohne mein Okay?',
      'Und wenn es einen Fehler macht?',
      'Mit welchen Tools funktioniert es?',
      'Sind unsere Daten sicher?',
      'Kann das ganze Unternehmen mitmachen?',
      'Zahlen wir pro Person?',
    ],
  ],
  [
    '.p-faq .g-faq p',
    [
      'Ja. Für dich allein steht der Free-Plan allen offen: Ocur Desktop und oDrops mit 1,5M Credits jeden Monat und Zugang zum Erstellen von 2 Drops mit den Modellen deiner Wahl. Keine Kreditkarte, keine Frist. <a href="/pricing">Alle Pläne ansehen</a>.',
      'Nein — Ocur läuft im Browser. Lieber eine eigene App? <a href="https://app.ocur.ai/download" data-download="faq">Lade Ocur Desktop für Windows, macOS oder Linux herunter</a> und melde dich im selben Workspace an. Eine Internetverbindung ist erforderlich. Die Desktop-App enthält Ocur Companion und richtet diesen Computer nach der Anmeldung ein. Über Bildschirmzugriff und Computersteuerung entscheidest du selbst.',
      'Minuten, nicht Monate. Ocur läuft im Browser, verbindet sich Login für Login mit deinen Tools und braucht kein IT-Projekt. Die meisten Teams geben ihm schon am ersten Tag echte Arbeit.',
      `Ja. <a href="${BOOK_URL}" target="_blank" rel="noopener" data-book="faq">Buch ein 30-minütiges Gespräch</a> — der Gründer führt dich live durch Ocur, an der Arbeit deines eigenen Unternehmens. Bring deine Fragen mit. Oder <a href="https://app.ocur.ai/?auth=sign-up">starte kostenlos</a> und probier es erst selbst aus.`,
      'Ein Chat-Assistent gibt dir eine Antwort — die Arbeit bleibt trotzdem bei dir. Ocur macht den Job fertig, dort, wo er hingehört: mit eigenem Postfach und eigener Telefonnummer, auf Autopilot auch wenn du weg bist, mit lebenden Registern für Versprechen, Geld, Pipeline und Lager. Das Ergebnis landet in deinen Tools — nicht in deiner Zwischenablage.',
      'Nur, wo du es erlaubst. Standardmäßig wartet alles Wichtige auf deine Freigabe. Erst auf Autopilot erledigt Ocur ganze Abläufe von selbst — jeder Schritt protokolliert. Was allein laufen darf, bestimmst du jederzeit, Ruhezeiten inklusive.',
      'Dann siehst du ihn — jede Aktion steht im Protokoll, mit dem Was und dem Warum. Alles Wichtige hat ohnehin auf deine Freigabe gewartet. Korrigier es in ganz normaler Sprache — Ocur merkt sich die Korrektur, und derselbe Fehler passiert kein zweites Mal.',
      'Gmail, Google Kalender &amp; Drive, Notion und GitHub — dazu das Web und auf Wunsch deinen eigenen Rechner. Kostenpflichtige Tarife enthalten Ocur in WhatsApp, iMessage, Telegram, Slack, Teams und E-Mail. Konten verbindest du einzeln und trennst sie jederzeit wieder.',
      'Dein Workspace ist strikt von jedem anderen Kunden getrennt. Ocur sieht nur die Konten, die du verbindest — und jede Verbindung kappst du mit einem Klick. Wir verkaufen deine Daten nie und trainieren keine Modelle damit — die <a href="/de/privacy">Datenschutzerklärung</a> sagt genau, was mit allem passiert, was Ocur anfasst, Google Workspace inklusive. Welcher Dienst was bekommt, und wann, steht in <a href="/de/data">Wohin deine Daten gehen</a>.',
      'Ja — genau dafür ist es gemacht. Alle delegieren an ein gemeinsames Ocur mit geteiltem Wissen. Admins regeln, wer was darf, und an einem Ort siehst du, was erledigt wurde.',
      'Nein. Jeder Business-Plan enthält unbegrenzt viele menschliche Mitglieder — eine Kollegin einzuladen kostet nichts. Das Unternehmen bezahlt einen gemeinsamen monatlichen Credit-Pool und KI-Worker mit echten Aufgaben und Zeitplänen. Zusätzliche KI-Worker kosten je €199 im Monat. Credit-Aufladungen ergänzen 10M Credits für €100 und verfallen beim nächsten monatlichen Reset.',
    ],
  ],

  // the closing card
  ['.g-final-h', 'Führ dein Unternehmen —<br /><span class="g-grad">nicht deinen Posteingang.</span>'],
  ['.g-final .g-btn', 'Kostenlos starten'],
  ['.g-micro', 'Free-Plan&nbsp;&nbsp;·&nbsp;&nbsp;Keine Kreditkarte&nbsp;&nbsp;·&nbsp;&nbsp;Keine Frist'],
  ['.g-final-alt span', ['Lieber erst eine Führung?', 'Fragen?']],
  ['.g-final-alt a', ['Live-Demo buchen', 'Sprich mit uns']],
];

// selector → [attribute, value]
export const DE_ATTRS = [
  [".ps-tabs", "aria-label", "Die Ocur Produkte entdecken"],
  [".ps-dock", "aria-label", "Eine Ocur App ansehen"],
  ["[data-desk=\"calendar\"]", "aria-label", "Kalender ansehen"],
  ["[data-desk=\"files\"]", "aria-label", "Dateien ansehen"],
  ["[data-desk=\"automations\"]", "aria-label", "Automationen ansehen"],
  [".ps-drop-roster", "aria-label", "Einen Beispiel-Drop kennenlernen"],
  ["[data-world=\"research\"]", "aria-label", "Das Recherche-Labor entdecken"],
  ["[data-world=\"sales\"]", "aria-label", "Den Vertrieb entdecken"],
  ["[data-world=\"studio\"]", "aria-label", "Das Kreativstudio entdecken"],
  [".ps-world-art > img", "alt", "Das 3D-Büro in oWorlds: Recherche-Labor, Vertrieb, Kreativstudio, Betrieb und Projektraum mit Drops an ihren Schreibtischen, Ocurs Büro mit dem Fuchs und eine Lounge mit Empfang und Aufzug"],

  ['.g-links', 'aria-label', 'Hauptnavigation'],
  ['.hx-demo', 'aria-label', 'Ocur bei der Arbeit: vier Beispiele'],
  ['.hx-play', 'aria-label', 'Beispiele anhalten'],
  ['.g-menu-links', 'aria-label', 'Menü'],
  ['.g-burger', 'aria-label', 'Menü'],
  [
    '.g-system',
    'aria-label',
    'Ocur im Zentrum eines Sonnensystems, umkreist von Gmail, Google Kalender, Google Drive, Notion, GitHub, Telegram, WhatsApp, Slack, Discord, E-Mail, deinem Rechner und dem Web — plus ein freier Platz für Konnektoren, die du selbst baust',
  ],
  ['.g-talk textarea[name="message"]', 'placeholder', 'Ocur soll die 200 Lieferanten-Mails beantworten, die wir jede Woche bekommen.'],
  // the no-JS post tells the backend which language to send the visitor back in
  ['.g-talk input[name="locale"]', 'value', 'de'],
];
