// Shared integration data + stroke-icon set used by all three design variants.

export const INTEGRATIONS = [
  { id: 'gmail', label: 'Gmail', glyph: 'mail', color: '#EA4335' },
  { id: 'gcal', label: 'Google Calendar', glyph: 'calendar', color: '#4285F4' },
  { id: 'github', label: 'GitHub', glyph: 'git', color: '#B1BAC4' },
  { id: 'discord', label: 'Discord', glyph: 'chat', color: '#5865F2' },
  { id: 'files', label: 'Files', glyph: 'folder', color: '#F2B23C' },
  { id: 'web', label: 'The web', glyph: 'globe', color: '#2DD4BF' },
  { id: 'apps', label: 'Business apps', glyph: 'apps', color: '#A78BFA' },
  { id: 'local', label: 'Your computer', glyph: 'monitor', color: '#9CA3AF' },
];

const GLYPHS = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  git: '<path d="M6 6v9"/><circle cx="6" cy="18" r="2.6"/><circle cx="6" cy="4" r="2.6"/><circle cx="18" cy="7" r="2.6"/><path d="M18 9.6a9 9 0 0 1-9 9"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.6-.8L3 21l1.8-5.9A8.5 8.5 0 1 1 21 11.5z"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>',
  apps: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
};

export const icon = (glyph, color) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="${color || 'currentColor'}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPHS[glyph]}</svg>`;
