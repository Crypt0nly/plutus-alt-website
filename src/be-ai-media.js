// Public drawing data can outlive server-side validation changes. Keep both
// current and historical gallery entries out of HTML interpolation.
export function safeDrawingUrl(value) {
  const prefix = 'data:image/png;base64,';
  if (typeof value !== 'string' || value.length > 220_000 || !value.startsWith(prefix)) return null;
  const encoded = value.slice(prefix.length);
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return null;
  try {
    return atob(encoded).startsWith('\x89PNG\r\n\x1a\n') ? value : null;
  } catch { return null; }
}

export function createGalleryCard(doc, item) {
  const card = doc.createElement('figure');
  card.className = 'ba-gal ba-sketch';
  const drawing = item.kind === 'drawing' ? safeDrawingUrl(item.drawing) : null;
  if (drawing) {
    const img = doc.createElement('img');
    img.src = drawing;
    img.alt = 'a hand-drawn answer';
    card.appendChild(img);
  } else {
    const body = doc.createElement('p');
    body.className = 'ba-answer-text';
    body.textContent = item.kind === 'drawing' ? 'Drawing unavailable' : String(item.text || '');
    card.appendChild(body);
  }
  const caption = doc.createElement('figcaption');
  caption.className = 'ba-hand';
  caption.textContent = `“${String(item.question || '')}”${item.pickedAsAi ? ' · fooled them 🏆' : ''}`;
  card.appendChild(caption);
  return card;
}
