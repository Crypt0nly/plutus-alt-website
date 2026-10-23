// Static, bilingual marketing content. Rendered by Vite and the German prerender.
// The tour is explicitly illustrative; it never reads or writes customer data.
const icons = {
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  flow: '<rect x="3" y="3" width="6" height="6" rx="2"/><rect x="15" y="15" width="6" height="6" rx="2"/><path d="M6 9v9h9M9 6h9v9"/>',
  files: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h5"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m8 12 3 3 5-6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 6 9 7 9-7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

export function renderDesignBar(lang = 'en') {
  const de = lang === 'de';
  return `<aside class="design-bar" aria-label="${de ? 'Website-Design' : 'Website design'}">
    <span>${de ? 'Ein neuer Blick auf Ocur' : 'A fresh look at Ocur'}</span>
    <div role="group" aria-label="${de ? 'Design wählen' : 'Choose a design'}">
      <button type="button" data-design-choice="classic" aria-pressed="true">${de ? 'Bisheriges Design' : 'Original'}</button>
      <button type="button" data-design-choice="cloud" aria-pressed="false">${de ? 'Neues Design' : 'New design'} <span aria-hidden="true">↗</span></button>
    </div>
  </aside>`;
}

export function renderCloudLanding(lang = 'en') {
  const t = (en, de) => lang === 'de' ? de : en;
  const link = (en, de) => lang === 'de' ? de : en;
  return `<div class="c-landing" data-language="${lang}">
    <section class="c-hero c-wrap" aria-labelledby="c-title">
      <p class="c-eyebrow"><span class="c-dot"></span> ${t('Your company. Working together.', 'Dein Unternehmen. Im Zusammenspiel.')}</p>
      <h2 id="c-title" role="heading" aria-level="1">${t('Less busywork.<br><span>More possibility.</span>', 'Weniger Kleinkram.<br><span>Mehr Möglichkeiten.</span>')}</h1>
      <p class="c-intro">${t('Meet Ocur, the AI operating system for your company. Bring your tools, knowledge and everyday work together. Give the next step to Ocur.', 'Ocur ist das KI-Betriebssystem für dein Unternehmen. Deine Tools, dein Wissen und die tägliche Arbeit an einem Ort. Überlass Ocur den nächsten Schritt.')}</p>
      <div class="c-actions"><a class="c-button c-primary" href="https://app.ocur.ai/?auth=sign-up">${t('Start free', 'Kostenlos starten')} ${icon('arrow')}</a><a class="c-button c-secondary" href="#cloud-demo">${t('Explore Ocur', 'Ocur entdecken')} <span aria-hidden="true">↓</span></a></div>
      <p class="c-fine">${t('No credit card required', 'Keine Kreditkarte nötig')}<span aria-hidden="true"> · </span><a href="https://app.ocur.ai/download" data-download="cloud-hero">${t('Available on desktop', 'Auch als Desktop-App')} ${icon('arrow')}</a></p>
    </section>

    <section class="c-showcase c-wrap" id="cloud-demo" aria-label="${t('Interactive product tour', 'Interaktive Produkttour')}">
      <div class="c-workspace">
        <div class="c-window-bar"><span class="c-window-brand"><img src="/logo.svg" alt="" width="22" height="22"> Ocur <span class="c-divider">/</span> <span>${t('Your workspace', 'Dein Arbeitsplatz')}</span></span><span class="c-example">${t('Interactive example', 'Interaktives Beispiel')}</span></div>
        <div class="c-workspace-body">
          <div class="c-tour-nav" role="group" aria-label="${t('Explore the workspace', 'Arbeitsplatz entdecken')}">
            <button type="button" data-tour="today" aria-pressed="true" aria-controls="c-panel-today">${icon('sun')}${t('Today', 'Heute')}</button>
            <button type="button" data-tour="routines" aria-pressed="false" aria-controls="c-panel-routines">${icon('flow')}${t('Automations', 'Automationen')}</button>
            <button type="button" data-tour="knowledge" aria-pressed="false" aria-controls="c-panel-knowledge">${icon('files')}${t('Knowledge', 'Wissen')}</button>
          </div>
          <section class="c-panel" id="c-panel-today" aria-labelledby="c-today-title">
            <div class="c-panel-heading"><div><p class="c-caption">${t('A little clarity for your day', 'Ein klarer Blick auf deinen Tag')}</p><h2 id="c-today-title">${t('Room to focus.', 'Raum für das Wesentliche.')}</h2></div><span class="c-status">${icon('shield')}${t('You stay in control', 'Du behältst die Kontrolle')}</span></div>
            <div class="c-desk-grid">
              <article class="c-focus-card"><p class="c-label">${icon('mail')}${t('Ready for your review', 'Bereit zur Prüfung')}</p><h3>${t('The follow-up?<br>Already drafted.', 'Das Follow-up?<br>Schon vorbereitet.')}</h3><p>${t('The conversation, the context, the next step. Together, before you even open your inbox.', 'Das Gespräch, der Kontext, der nächste Schritt. Alles zusammen, bevor du dein Postfach öffnest.')}</p><div class="c-source-tags"><span>${icon('mail')} ${t('Email', 'E-Mail')}</span><span>${icon('files')} CRM</span></div><button class="c-button c-primary" type="button" data-open-tour>${t('Review example draft', 'Beispielentwurf ansehen')} ${icon('arrow')}</button><span class="c-review-note">${t('Prepared by Ocur. Approved by you.', 'Von Ocur vorbereitet. Von dir freigegeben.')}</span></article>
              <aside class="c-agenda"><h3>${t('Working in the background', 'Läuft im Hintergrund')}</h3><div class="c-task">${icon('sun')}<div><strong>${t('Your morning briefing', 'Dein Morgenbriefing')}</strong><p>${t('The day ahead, in one clear view', 'Der Tag auf einen Blick')}</p></div></div><div class="c-task">${icon('flow')}<div><strong>${t('The details, connected', 'Details im Zusammenhang')}</strong><p>${t('Promises, relationships and next steps', 'Zusagen, Kontakte und nächste Schritte')}</p></div></div><div class="c-task">${icon('files')}<div><strong>${t('Knowledge that stays with you', 'Wissen, das bleibt')}</strong><p>${t('Your company’s context, ready to use', 'Der Kontext deines Unternehmens, griffbereit')}</p></div></div><a href="#cloud-system">${t('See how it connects', 'So hängt alles zusammen')} <span aria-hidden="true">→</span></a></aside>
            </div>
          </section>
          <section class="c-panel" id="c-panel-routines" aria-labelledby="c-routines-title" hidden>
            <div class="c-panel-heading"><div><p class="c-caption">${t('Give recurring work a rhythm', 'Gib wiederkehrender Arbeit einen Rhythmus')}</p><h2 id="c-routines-title">${t('Set it up. Get on with your day.', 'Einrichten. Und weiter geht’s.')}</h2></div></div>
            <div class="c-routine-grid">${[
              ['sun', t('A clear start', 'Ein klarer Start'), t('Bring email, calendar and open commitments into a morning briefing.', 'E-Mails, Kalender und offene Zusagen in einem Morgenbriefing.'), t('Every weekday', 'Jeden Werktag')],
              ['mail', t('Follow through', 'Dranbleiben'), t('Prepare a reminder when an invoice or a conversation needs attention.', 'Eine Erinnerung vorbereiten, wenn eine Rechnung oder ein Gespräch Aufmerksamkeit braucht.'), t('On your schedule', 'Nach deinem Zeitplan')],
              ['files', t('Keep an eye on the market', 'Den Markt im Blick'), t('Collect relevant updates and bring the useful ones into your next briefing.', 'Relevante Neuigkeiten sammeln und die wichtigen ins nächste Briefing bringen.'), t('A recurring research routine', 'Regelmäßige Recherche')],
            ].map(([i, title, text, time]) => `<article class="c-routine"><span class="c-icon-tile">${icon(i)}</span><h3>${title}</h3><p>${text}</p><span class="c-routine-time">${icon('clock')}${time}</span></article>`).join('')}</div>
            <p class="c-panel-foot">${t('Choose the tools, timing and approvals for each routine.', 'Wähle Tools, Zeitplan und Freigaben für jede Routine.')} <a href="${link('/product', '/de/product')}">${t('About automations', 'Mehr zu Automationen')} →</a></p>
          </section>
          <section class="c-panel" id="c-panel-knowledge" aria-labelledby="c-knowledge-title" hidden>
            <div class="c-panel-heading"><div><p class="c-caption">${t('Context, without the searching', 'Kontext, ohne langes Suchen')}</p><h2 id="c-knowledge-title">${t('One shared understanding.', 'Ein gemeinsames Verständnis.')}</h2></div></div>
            <div class="c-knowledge-grid"><article class="c-knowledge-main"><span class="c-icon-tile">${icon('files')}</span><h3>${t('“What did we agree?”', '„Was hatten wir vereinbart?“')}</h3><p>${t('Your documents, conversations and company memory give Ocur the context to help. Pick up where you left off, with the source close at hand.', 'Dokumente, Gespräche und das Unternehmensgedächtnis geben Ocur den Kontext. Mach dort weiter, wo du aufgehört hast — mit der Quelle direkt dabei.')}</p><a href="${link('/product', '/de/product')}">${t('Explore the operating system', 'Das Betriebssystem entdecken')} →</a></article><div class="c-knowledge-list">${[t('Documents & files', 'Dokumente & Dateien'), t('Conversations & decisions', 'Gespräche & Entscheidungen'), t('Relationships & commitments', 'Kontakte & Zusagen')].map(x=>`<div>${icon('check')}<span>${x}</span></div>`).join('')}<p>${t('Connect the sources you choose. Manage access in your workspace.', 'Verbinde die Quellen deiner Wahl. Verwalte den Zugriff in deinem Arbeitsplatz.')}</p></div></div>
          </section>
        </div>
        <div class="c-window-foot"><span>${icon('shield')}${t('Your tools. Your context. Your say.', 'Deine Tools. Dein Kontext. Deine Entscheidung.')}</span><span>${t('Illustrative tour · no live company data', 'Beispieltour · keine echten Unternehmensdaten')}</span></div>
      </div>
      <p class="c-tour-caption">${t('A place for the work. A little more space for you.', 'Ein Ort für die Arbeit. Ein bisschen mehr Raum für dich.')}</p>
    </section>

    <section class="c-connections c-wrap" aria-labelledby="c-connections-title"><p id="c-connections-title">${t('At home in the tools you already use', 'Zuhause in den Tools, die du schon nutzt')}</p><div><span>Gmail</span><span>Google Calendar</span><span>Drive</span><span>Slack</span><span>Notion</span><span>GitHub</span></div><a href="${link('/integrations', '/de/integrations')}">${t('Explore integrations', 'Integrationen entdecken')} <span aria-hidden="true">↗</span></a></section>

    <section class="c-system c-wrap" id="cloud-system"><div class="c-section-heading"><p class="c-eyebrow">${t('From a conversation to a company', 'Vom Gespräch zum Unternehmen')}</p><h2>${t('Everything connected.<br>Nothing in your way.', 'Alles verbunden.<br>Freie Bahn für deine Arbeit.')}</h2><p>${t('Work moves between people, tools and decisions. Ocur keeps the context together, so you can keep moving.', 'Arbeit verbindet Menschen, Tools und Entscheidungen. Ocur hält den Kontext zusammen, damit du vorankommst.')}</p></div><div class="c-benefits">${[
      ['flow', t('Delegate the next step.', 'Den nächsten Schritt delegieren.'), t('Ask in plain language. Ocur works across your connected tools and brings the result back to you.', 'Sag es in deinen Worten. Ocur arbeitet in deinen verbundenen Tools und bringt das Ergebnis zurück.'), t('Explore a workflow', 'Einen Ablauf entdecken'), link('/use-cases/invoice-follow-up', '/de/use-cases/invoice-follow-up')],
      ['files', t('A company that remembers.', 'Ein Unternehmen, das sich erinnert.'), t('Relationships, commitments, money and stock share the same context. Less catching up. More moving forward.', 'Kontakte, Zusagen, Finanzen und Bestand teilen denselben Kontext. Weniger Nachfragen. Mehr Fortschritt.'), t('Meet the system', 'Das System kennenlernen'), link('/product', '/de/product')],
      ['shield', t('Autonomy, on your terms.', 'Autonomie nach deinen Regeln.'), t('Decide what can run independently and what needs approval. Review the work and stay close to the decisions.', 'Entscheide, was selbstständig laufen darf und was eine Freigabe braucht. Prüfe die Arbeit und behalte Entscheidungen im Blick.'), t('Understand data & control', 'Daten & Kontrolle verstehen'), link('/data', '/de/data')],
    ].map(([i,title,text,label,href])=>`<article><span class="c-icon-tile">${icon(i)}</span><h3>${title}</h3><p>${text}</p><a href="${href}">${label} ${icon('arrow')}</a></article>`).join('')}</div></section>

    <section class="c-start c-wrap" id="cloud-start"><div><p class="c-eyebrow">${t('Start with one useful thing', 'Fang mit einer hilfreichen Sache an')}</p><h2>${t('Your next ten minutes.<br>A different kind of workday.', 'Deine nächsten zehn Minuten.<br>Ein anderer Arbeitstag.')}</h2><a class="c-button c-primary" href="https://app.ocur.ai/?auth=sign-up">${t('Find your first task', 'Deine erste Aufgabe finden')} ${icon('arrow')}</a></div><ol>${[
      [t('Make yourself at home', 'Richte dich ein'), t('Open your workspace in the browser or the desktop app.', 'Öffne deinen Arbeitsplatz im Browser oder in der Desktop-App.')],
      [t('Connect one tool', 'Verbinde ein Tool'), t('Choose a source Ocur needs for the job. You decide what to share.', 'Wähle eine Quelle für die Aufgabe. Du entscheidest, was du teilst.')],
      [t('Hand over the first task', 'Gib die erste Aufgabe ab'), t('Ask for a briefing, a draft or a follow-up. Review the result together.', 'Frag nach einem Briefing, Entwurf oder Follow-up. Prüfe das Ergebnis mit Ocur.')],
    ].map(([title,text],i)=>`<li><span>0${i+1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}</ol></section>

    <dialog class="c-dialog" id="c-draft-dialog" aria-labelledby="c-draft-title"><form method="dialog"><button class="c-dialog-close" aria-label="${t('Close draft', 'Entwurf schließen')}">×</button></form><p class="c-eyebrow">${t('An example, ready for review', 'Ein Beispiel, bereit zur Prüfung')}</p><h2 id="c-draft-title">${t('The follow-up, with context.', 'Das Follow-up, mit Kontext.')}</h2><div class="c-draft"><p><strong>${t('Subject: Next steps from our conversation', 'Betreff: Nächste Schritte nach unserem Gespräch')}</strong></p><p>${t('Thanks for the conversation. I’ve brought the next steps together so we can keep things moving:', 'Danke für das Gespräch. Ich habe die nächsten Schritte zusammengestellt, damit es weitergeht:')}</p><ul><li>${t('Confirm the scope and the people involved.', 'Umfang und beteiligte Personen bestätigen.')}</li><li>${t('Share the documents we discussed.', 'Die besprochenen Dokumente teilen.')}</li><li>${t('Agree on a time for the next check-in.', 'Einen Termin für die nächste Abstimmung vereinbaren.')}</li></ul></div><p class="c-fine">${t('This is an illustrative draft. No message is sent and no account is connected.', 'Dies ist ein Beispielentwurf. Es wird keine Nachricht gesendet und kein Konto verbunden.')}</p><form method="dialog"><button class="c-button c-secondary">${t('Back to the tour', 'Zurück zur Tour')}</button></form></dialog>
  </div>`;
}
