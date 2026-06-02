// The slide-in product sheet. Mirrors the 3D "AI Facts" label as crisp HTML.

export function createDetailSheet() {
  const sheet = document.getElementById('sheet');
  const scrim = document.getElementById('sheet-scrim');
  let open = false;

  function factsTable(p) {
    const hero = p.specs.find((s) => s.big) || p.specs[1];
    const rows = p.specs
      .filter((s) => s !== hero)
      .map((s) => {
        const right = s.dv
          ? `${s.value} &nbsp;<span style="color:var(--muted)">${s.dv}</span>`
          : s.value;
        return `<tr><td>${s.label}</td><td>${right}</td></tr>`;
      })
      .join('');
    return `
      <div class="facts">
        <h3>AI Facts</h3>
        <div class="serving">1 license &middot; ${p.feature} &middot; ${p.netwt}</div>
        <div class="hero-row"><span>${hero.label}</span><span>${hero.value}</span></div>
        <div class="col-head">% Service Level</div>
        <table><tbody>${rows}</tbody></table>
        <p class="foot">% Service Level shows how much of a typical enterprise need one serving of
          ${p.name} covers. Part of the PLUTUS balanced stack — a complete diet of company intelligence.</p>
      </div>`;
  }

  function render(p) {
    sheet.style.setProperty('--c', p.colors.base);
    sheet.innerHTML = `
      <button class="sheet-close" aria-label="Close">✕</button>
      <div class="sheet-head" style="background:${p.colors.base}">
        <span class="chip">Aisle · ${p.aisle}</span>
        <h2>${p.name}</h2>
        <div class="feature">${p.feature}</div>
      </div>
      <div class="sheet-body">
        <p class="blurb">${p.blurb}</p>
        ${factsTable(p)}
        <div class="sheet-actions">
          <a class="btn btn-accent" href="#checkout" data-close>Add to basket</a>
          <button class="btn btn-ghost" data-close>Book a tasting</button>
        </div>
      </div>
    `;
    sheet.querySelector('.sheet-close').addEventListener('click', close);
    sheet.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  }

  function openWith(p) {
    render(p);
    scrim.hidden = false;
    // force a reflow so the slide-in transition always plays
    void sheet.offsetWidth;
    sheet.classList.add('open');
    scrim.classList.add('show');
    sheet.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('sheet-open'); // lock the scroller
    open = true;
  }

  function close() {
    if (!open) return;
    sheet.classList.remove('open');
    scrim.classList.remove('show');
    sheet.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('sheet-open');
    open = false;
    setTimeout(() => {
      if (!open) scrim.hidden = true;
    }, 400);
  }

  scrim.addEventListener('click', close);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  return { open: openWith, close, get isOpen() { return open; } };
}
