// Public product claims live here. Do not add integrations or guarantees that
// are not supported by the product and the homepage. Prices stay on /#pricing.
export const contentPages = [
  {
    path: '/product',
    en: {
      title: 'Ocur — AI operating system for business operations',
      label: 'The product',
      description: 'Ocur handles work across email, calls, calendars, files and business tools, with shared company memory, live ledgers and approval controls.',
      heading: 'One Ocur for the work across your company.',
      intro: 'Ocur is an AI operating system for companies. Give it a job in plain language: it checks the information, works inside the tools you connect, and brings the result back to your workspace.',
      sections: [
        ['Work that reaches your tools', '<p>Ask Ocur to find overdue invoices and draft reminders, check a supplier delivery, or prepare a customer follow-up. It can work across email, calendar, files, chat and the web. Its own inbox and phone line let it handle conversations as part of the job.</p><p>Start with one connected account and one task. Review the result before expanding the work you delegate. See the <a href="/integrations">integration options</a> and two examples: <a href="/use-cases/invoice-follow-up">invoice follow-ups</a> and <a href="/use-cases/business-phone">business calls</a>.</p>'],
        ['Company memory and live ledgers', '<p>Ocur brings shared context to the next task. Commitments track promises and follow-ups; financial ledgers keep receivables and payables tied to activity; pipeline and inventory records follow what happened in the connected tools.</p><p>Teams delegate to one shared Ocur. Human members join without a per-seat charge, while business plans provide a shared allowance of AI work and scheduled AI workers. The <a href="/#pricing">current plans</a> explain the allowances and billing.</p>'],
        ['On demand or on a schedule', '<p>Work can start with your message or run as an automation. Autopilot and scheduled jobs require a paid plan. AI workers can take on recurring jobs while you are away and report the outcome in your workspace.</p><p>You set the boundaries. Administrators decide what may run independently and what waits for approval. Actions stay on the record so you can review what happened and correct the next run.</p>'],
        ['Start in your browser', '<p>Ocur runs in your browser. A desktop app is also available for Windows, macOS and Linux, with access to the same workspace and an included Companion for connecting your computer. Computer-control permissions remain your choice.</p><p>Reasoning runs on hosted services. Read <a href="/data">where your data goes</a> and the <a href="/privacy">privacy policy</a> before connecting company information.</p>'],
      ],
    },
    de: {
      title: 'Ocur — KI-Betriebssystem für Unternehmensabläufe',
      label: 'Das Produkt',
      description: 'Ocur erledigt Aufgaben über E-Mail, Telefon, Kalender, Dateien und Geschäftstools hinweg — mit gemeinsamem Wissen, Registern und Freigaben.',
      heading: 'Ein Ocur für die Arbeit in deinem Unternehmen.',
      intro: 'Ocur ist ein KI-Betriebssystem für Unternehmen. Beschreibe eine Aufgabe in normaler Sprache: Ocur prüft die Informationen, arbeitet in den verbundenen Tools und liefert das Ergebnis in deinen Arbeitsbereich.',
      sections: [
        ['Arbeit direkt in deinen Tools', '<p>Ocur kann offene Rechnungen finden und Erinnerungen entwerfen, eine Lieferantenlieferung prüfen oder eine Kundennachricht vorbereiten. Es arbeitet mit E-Mail, Kalender, Dateien, Chat und dem Web. Ein eigener Posteingang und eine eigene Telefonnummer ermöglichen Gespräche als Teil der Aufgabe.</p><p>Beginne mit einem verbundenen Konto und einer Aufgabe. Prüfe das Ergebnis, bevor du mehr Arbeit delegierst. Hier findest du die <a href="/de/integrations">Integrationen</a> sowie Beispiele für <a href="/de/use-cases/invoice-follow-up">Rechnungserinnerungen</a> und <a href="/de/use-cases/business-phone">Geschäftsanrufe</a>.</p>'],
        ['Gemeinsames Wissen und lebende Register', '<p>Ocur nimmt den Zusammenhang zur nächsten Aufgabe mit. Zusagen und Nachfassaufgaben bleiben im Blick; finanzielle Register verknüpfen Forderungen und Verbindlichkeiten mit tatsächlichen Vorgängen. Pipeline und Lagerbestand folgen den Aktivitäten in deinen Tools.</p><p>Teams delegieren an ein gemeinsames Ocur. Menschliche Mitglieder zahlen keine Gebühr pro Sitzplatz. Geschäftstarife enthalten ein gemeinsames Arbeitskontingent und KI-Mitarbeiter mit geplanten Aufgaben. Die <a href="/de#pricing">aktuellen Tarife</a> erklären Kontingente und Abrechnung.</p>'],
        ['Auf Anfrage oder nach Zeitplan', '<p>Eine Nachricht kann die Arbeit starten; wiederkehrende Aufgaben lassen sich als Automation einrichten. Autopilot und geplante Aufgaben benötigen einen kostenpflichtigen Tarif. KI-Mitarbeiter bearbeiten wiederkehrende Aufgaben während deiner Abwesenheit und berichten im Arbeitsbereich.</p><p>Du setzt die Grenzen. Administratoren entscheiden, was eigenständig laufen darf und was auf Freigabe wartet. Die Schritte bleiben dokumentiert, damit du Ergebnisse prüfen und den nächsten Durchlauf korrigieren kannst.</p>'],
        ['Im Browser beginnen', '<p>Ocur läuft im Browser. Die Desktop-App für Windows, macOS und Linux öffnet denselben Arbeitsbereich und enthält den Companion, um deinen Computer zu verbinden. Berechtigungen für die Computersteuerung bleiben deine Entscheidung.</p><p>Die Verarbeitung erfolgt über gehostete Dienste. Lies <a href="/de/data">wohin deine Daten gehen</a> und die <a href="/de/privacy">Datenschutzerklärung</a>, bevor du Unternehmensinformationen verbindest.</p>'],
      ],
    },
  },
  {
    path: '/integrations',
    en: {
      title: 'Ocur integrations — email, calendar, files and business tools',
      label: 'Integrations',
      description: 'Connect Gmail, Google Calendar, Google Drive, Notion and GitHub to Ocur, use messaging channels, or extend its work with APIs and computer control.',
      heading: 'Work inside the tools you already use.',
      intro: 'Ocur connects to the accounts you choose, so a task can move from finding information to doing the work where it belongs. Connect accounts one at a time, and disconnect them when you no longer want Ocur to use them.',
      sections: [
        ['Email, calendars and files', '<p>Connect Gmail, Google Calendar and Google Drive. Ocur can use connected information to prepare replies, coordinate schedules and work with files. A job such as <a href="/use-cases/invoice-follow-up">preparing invoice reminders</a> can bring information from more than one account into the same task.</p><p>Sign in to Ocur, open Connectors and connect the account you want to use. Available actions depend on the permissions you grant and the accounts your workspace has connected.</p>'],
        ['Knowledge and development tools', '<p>Notion and GitHub connections let work include the knowledge and development tools your company already uses. Describe the job and identify the relevant account or source so Ocur can check the context.</p><p>Connecting a tool does not mean every task needs access to it. Choose which accounts Ocur may reach and keep approvals for actions you want to review.</p>'],
        ['Messaging channels', '<p>Paid plans include Ocur on WhatsApp, iMessage, Telegram, Slack, Teams and email, as well as Ocur\'s own WhatsApp and iMessage lines, call number and email. Check the <a href="/#pricing">current plan details</a> for the features and allowances.</p><p>Messaging channels are ways to reach Ocur. A connected Gmail or Drive account provides separate access to that service; each connection has its own permissions.</p>'],
        ['APIs and your computer', '<p>Ocur can build tools and connectors for services with an API. This is an extension path, rather than a claim that every service already has a ready-made connector. When an application needs interaction on your computer, Ocur can use the connected computer with your permission.</p><p>The desktop app includes Companion. Computer control needs the machine connected and the relevant permissions enabled. Read <a href="/data">the data map</a> for how external services receive information during a task.</p>'],
      ],
    },
    de: {
      title: 'Ocur-Integrationen — E-Mail, Kalender und Geschäftstools',
      label: 'Integrationen',
      description: 'Verbinde Gmail, Google Kalender, Google Drive, Notion und GitHub mit Ocur. Nutze Nachrichtenkanäle, APIs und die Steuerung deines Computers.',
      heading: 'Arbeit in den Tools, die du schon nutzt.',
      intro: 'Ocur verbindet sich mit den Konten, die du auswählst. So wird aus gefundenen Informationen eine erledigte Aufgabe im passenden Tool. Verbinde Konten einzeln und trenne sie wieder, wenn Ocur sie nicht mehr verwenden soll.',
      sections: [
        ['E-Mail, Kalender und Dateien', '<p>Verbinde Gmail, Google Kalender und Google Drive. Ocur kann verbundene Informationen nutzen, um Antworten vorzubereiten, Termine abzustimmen und mit Dateien zu arbeiten. Eine Aufgabe wie <a href="/de/use-cases/invoice-follow-up">Rechnungserinnerungen vorbereiten</a> kann Informationen aus mehreren Konten zusammenführen.</p><p>Melde dich bei Ocur an, öffne Connectors und verbinde das gewünschte Konto. Welche Aktionen verfügbar sind, hängt von deinen Berechtigungen und den im Arbeitsbereich verbundenen Konten ab.</p>'],
        ['Wissen und Entwicklung', '<p>Über Notion und GitHub kann Ocur die Wissens- und Entwicklungstools deines Unternehmens einbeziehen. Beschreibe die Aufgabe und nenne das relevante Konto oder die Quelle, damit Ocur den Zusammenhang prüfen kann.</p><p>Eine Verbindung bedeutet nicht, dass jede Aufgabe sie benötigt. Wähle die erreichbaren Konten und behalte Freigaben für Aktionen, die du prüfen möchtest.</p>'],
        ['Nachrichtenkanäle', '<p>Kostenpflichtige Tarife enthalten Ocur in WhatsApp, iMessage, Telegram, Slack, Teams und E-Mail sowie Ocurs eigene WhatsApp- und iMessage-Leitungen, Telefonnummer und E-Mail. Die <a href="/de#pricing">aktuellen Tarifdetails</a> erklären Funktionen und Kontingente.</p><p>Nachrichtenkanäle sind Wege, Ocur zu erreichen. Ein verbundenes Gmail- oder Drive-Konto ermöglicht getrennt davon den Zugriff auf diesen Dienst. Jede Verbindung hat eigene Berechtigungen.</p>'],
        ['APIs und dein Computer', '<p>Ocur kann Tools und Konnektoren für Dienste mit API bauen. Das ist eine Möglichkeit zur Erweiterung; nicht jeder Dienst hat bereits einen fertigen Konnektor. Benötigt eine Anwendung Interaktion auf deinem Computer, kann Ocur den verbundenen Computer mit deiner Erlaubnis bedienen.</p><p>Die Desktop-App enthält den Companion. Computersteuerung erfordert einen verbundenen Rechner und die passenden Berechtigungen. Die <a href="/de/data">Datenübersicht</a> beschreibt, wann externe Dienste Informationen für eine Aufgabe erhalten.</p>'],
      ],
    },
  },
  {
    path: '/use-cases/invoice-follow-up',
    en: {
      title: 'AI invoice follow-ups with Ocur — prepare payment reminders',
      label: 'Invoice follow-ups',
      description: 'Use Ocur to find unpaid invoices, check customer conversations and draft payment reminders for review, with follow-up work on a schedule when enabled.',
      heading: 'Keep invoice follow-ups moving.',
      intro: 'Give Ocur the first job: “Find the three invoices we are still owed and draft the reminders.” It can check the connected sources and prepare the next step while you stay in charge of what gets sent.',
      sections: [
        ['Start with the evidence', '<p>Connect the accounts that contain the relevant invoices, files and correspondence. Ask Ocur to identify the unpaid invoices from those sources and show the evidence for each one. Include the period, customer or folder when that helps narrow the task.</p><p>Make the source clear. An email saying a payment is expected is not the same as evidence that it arrived. The financial ledgers described on the homepage tie records to real activity; review the underlying information before approving a reminder.</p>'],
        ['Draft a reminder with context', '<p>Ask Ocur to consider the existing customer conversation before drafting a message. Specify the tone, the invoice details to include and whether a colleague must review it. A useful first task ends with drafts you can inspect.</p><p>Example: “Check these invoices against the customer threads. Draft a polite reminder for each unpaid item, include the invoice reference, and wait for my approval before sending.”</p>'],
        ['Make follow-up a recurring job', '<p>Once the first run works, a paid plan can run the job on a schedule. Define the connected sources, timing, approval boundary and where you want the report. Ocur tracks commitments and keeps the work on the record.</p><p>Set the rules for exceptions too: a disputed invoice, a promised payment date or an uncertain status can come back to you for a decision. Payment recovery depends on the customer and the evidence; a reminder is a workflow, not a guaranteed collection result.</p>'],
        ['Try it on a small set', '<p>Start with a few invoices and review the drafts. Expand the scope after you are comfortable with the connected sources and the results. See <a href="/integrations">supported tools</a>, <a href="/#pricing">plan details</a> and <a href="/data">where your data goes</a>.</p>'],
      ],
    },
    de: {
      title: 'Rechnungserinnerungen mit KI — Ocur bereitet das Nachfassen vor',
      label: 'Rechnungserinnerungen',
      description: 'Ocur findet offene Rechnungen in verbundenen Quellen, prüft Kundenverläufe und entwirft Zahlungserinnerungen zur Freigabe — bei Bedarf nach Zeitplan.',
      heading: 'Bei offenen Rechnungen dranbleiben.',
      intro: 'Gib Ocur die erste Aufgabe: „Finde die drei Rechnungen, deren Zahlung noch offen ist, und entwirf Erinnerungen.“ Ocur prüft die verbundenen Quellen und bereitet den nächsten Schritt vor. Du entscheidest, was gesendet wird.',
      sections: [
        ['Mit den Belegen beginnen', '<p>Verbinde die Konten mit den relevanten Rechnungen, Dateien und Nachrichten. Bitte Ocur, offene Rechnungen anhand dieser Quellen zu finden und für jede den Beleg zu zeigen. Ein Zeitraum, Kunde oder Ordner kann die Aufgabe eingrenzen.</p><p>Benenne die Quelle klar. Eine angekündigte Zahlung belegt noch keinen Zahlungseingang. Die auf der Homepage beschriebenen finanziellen Register verknüpfen Einträge mit tatsächlichen Vorgängen. Prüfe die Grundlage, bevor du eine Erinnerung freigibst.</p>'],
        ['Eine Erinnerung mit Zusammenhang entwerfen', '<p>Bitte Ocur, vor dem Entwurf den bisherigen Kundenverlauf zu berücksichtigen. Lege Ton, Rechnungsangaben und gegebenenfalls die Prüfung durch einen Kollegen fest. Eine gute erste Aufgabe endet mit Entwürfen, die du ansehen kannst.</p><p>Beispiel: „Prüfe diese Rechnungen anhand der Kundenverläufe. Entwirf für jeden offenen Posten eine freundliche Erinnerung mit Rechnungsreferenz und warte vor dem Senden auf meine Freigabe.“</p>'],
        ['Das Nachfassen wiederholen lassen', '<p>Wenn der erste Durchlauf funktioniert, kann ein kostenpflichtiger Tarif die Aufgabe nach Zeitplan ausführen. Definiere Quellen, Zeitpunkt, Freigabegrenzen und den Ort für den Bericht. Ocur verfolgt Zusagen und dokumentiert die Arbeit.</p><p>Lege auch fest, wie mit Ausnahmen umzugehen ist: bestrittene Rechnungen, zugesagte Zahlungstermine oder unklare Zustände können zur Entscheidung an dich zurückgehen. Ein Zahlungseingang hängt vom Kunden und den Belegen ab. Eine Erinnerung garantiert keine Zahlung.</p>'],
        ['Mit wenigen Rechnungen ausprobieren', '<p>Beginne mit einer kleinen Auswahl und prüfe die Entwürfe. Erweitere den Umfang, wenn Quellen und Ergebnisse passen. Hier findest du <a href="/de/integrations">unterstützte Tools</a>, <a href="/de#pricing">Tarifdetails</a> und die <a href="/de/data">Datenübersicht</a>.</p>'],
      ],
    },
  },
  {
    path: '/use-cases/business-phone',
    en: {
      title: 'AI business calls with Ocur — phone work with your approval',
      label: 'Business calls',
      description: 'Ocur can answer business calls or call a supplier with connected context, clear approval boundaries and a transcript of the conversation.',
      heading: 'Delegate the call. Keep the decision.',
      intro: 'Ocur can use its own phone number to handle business calls. Give it the context, the job and the limits: what it may say, what it may agree to, and when it needs to bring a decision back to you.',
      sections: [
        ['Prepare the facts before the call', '<p>The homepage demonstrates a supplier delivery that arrived 40 units short. Ocur checks the order, delivery note and contract before calling the supplier. The demonstration shows how a task can move across connected records, a conversation and a follow-up.</p><p>For your own job, name the relevant supplier or customer, identify the source documents and explain the outcome you want. Keep uncertain information visible so it can be checked before a commitment is made.</p>'],
        ['Set what Ocur may agree to', '<p>State the approval boundary in the task. For example: “Call the supplier about the short delivery. Ask for a redelivery date, but bring any proposed settlement back to me before accepting.”</p><p>Administrators can set what runs independently and what waits for sign-off. Ocur can answer calls and handle the conversation within the permissions you set; the important decisions remain subject to your rules.</p>'],
        ['Keep the conversation and follow-up together', '<p>The phone workflow gives you a transcript, so you can review the conversation. Ask Ocur to bring back the outcome, record any commitment and prepare the next step in the connected tools. A call about a delivery can lead to a calendar entry or a written confirmation when those actions are allowed.</p><p>The supplier example is a demonstration of the workflow. The outcome of a real call depends on the other party and the information available.</p>'],
        ['Check the plan and try one call', '<p>An Ocur phone number is listed on paid plans; availability and allowances are described in the <a href="/#pricing">current plan details</a>. Start with one bounded task and review its transcript before assigning more work.</p><p>See <a href="/product">how Ocur works</a>, the <a href="/integrations">connected tools</a>, and <a href="/data">where call-related data goes</a>.</p>'],
      ],
    },
    de: {
      title: 'Geschäftsanrufe mit KI — Ocur telefoniert mit deinen Freigaben',
      label: 'Geschäftsanrufe',
      description: 'Ocur kann Geschäftsanrufe annehmen oder Lieferanten anrufen — mit verbundenen Informationen, klaren Freigabegrenzen und einem Gesprächsprotokoll.',
      heading: 'Den Anruf delegieren. Die Entscheidung behalten.',
      intro: 'Ocur kann über eine eigene Telefonnummer Geschäftsanrufe bearbeiten. Gib ihm Zusammenhang, Aufgabe und Grenzen: Was darf es sagen, was darf es zusagen und wann muss eine Entscheidung zu dir zurückkommen?',
      sections: [
        ['Vor dem Anruf die Fakten prüfen', '<p>Die Homepage zeigt eine Lieferantenlieferung, bei der 40 Einheiten fehlen. Ocur prüft Bestellung, Lieferschein und Vertrag, bevor es den Lieferanten anruft. Die Demonstration verbindet Unterlagen, Gespräch und Nachbereitung in einer Aufgabe.</p><p>Nenne für deine Aufgabe den Lieferanten oder Kunden, die relevanten Unterlagen und das gewünschte Ergebnis. Lass Unsicherheiten sichtbar, damit sie vor einer Zusage geprüft werden können.</p>'],
        ['Festlegen, was Ocur zusagen darf', '<p>Beschreibe die Freigabegrenze in der Aufgabe. Zum Beispiel: „Ruf den Lieferanten wegen der unvollständigen Lieferung an. Frage nach einem Nachliefertermin, aber leg mir eine vorgeschlagene Einigung vor, bevor du sie annimmst.“</p><p>Administratoren bestimmen, was eigenständig läuft und was auf Freigabe wartet. Ocur kann Anrufe annehmen und Gespräche innerhalb deiner Berechtigungen führen. Wichtige Entscheidungen folgen deinen Regeln.</p>'],
        ['Gespräch und Nachbereitung zusammenhalten', '<p>Du erhältst ein Gesprächsprotokoll, um den Verlauf prüfen zu können. Bitte Ocur, das Ergebnis zurückzubringen, Zusagen festzuhalten und den nächsten Schritt in den verbundenen Tools vorzubereiten. Ein Liefergespräch kann zu einem Kalendereintrag oder einer schriftlichen Bestätigung führen, wenn du diese Aktionen erlaubt hast.</p><p>Das Lieferantenbeispiel zeigt einen Arbeitsablauf. Das Ergebnis eines echten Gesprächs hängt von der anderen Partei und den verfügbaren Informationen ab.</p>'],
        ['Tarif prüfen und einen Anruf ausprobieren', '<p>Eine eigene Ocur-Telefonnummer wird in kostenpflichtigen Tarifen genannt. Verfügbarkeit und Kontingente stehen in den <a href="/de#pricing">aktuellen Tarifdetails</a>. Beginne mit einer begrenzten Aufgabe und prüfe das Protokoll, bevor du mehr delegierst.</p><p>Hier findest du <a href="/de/product">das Produkt</a>, die <a href="/de/integrations">verbundenen Tools</a> und die <a href="/de/data">Datenübersicht für Anrufe</a>.</p>'],
      ],
    },
  },
];
