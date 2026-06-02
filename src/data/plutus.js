// Plutus scrollytelling content model.
// One persistent 3D world (an agent "core" surrounded by your tools); scrolling
// walks through the beats of a single task — prompt to done.
// Copy is drafted from myplutus.ai's public description — swap in the exact
// wording from the live site when ready.

export const BRAND = {
  name: 'Plutus',
  tagline: 'The AI agent that actually does your work.',
};

// Tools shown as nodes in the constellation. `glyph` selects a procedural icon.
export const INTEGRATIONS = [
  { id: 'gmail', label: 'Gmail', glyph: 'mail', color: '#EA4335' },
  { id: 'gcal', label: 'Google Calendar', glyph: 'calendar', color: '#4285F4' },
  { id: 'github', label: 'GitHub', glyph: 'git', color: '#E6EDF3' },
  { id: 'discord', label: 'Discord', glyph: 'chat', color: '#5865F2' },
  { id: 'files', label: 'Files', glyph: 'folder', color: '#F2B23C' },
  { id: 'web', label: 'The web', glyph: 'globe', color: '#2DD4BF' },
  { id: 'apps', label: 'Business apps', glyph: 'apps', color: '#A78BFA' },
  { id: 'local', label: 'Your computer', glyph: 'monitor', color: '#9CA3AF' },
];

// Each beat = one full-height section = one camera station.
// `focus` optionally points the beat at a specific scene element / state.
export const BEATS = [
  {
    id: 'hero',
    kicker: 'Meet Plutus',
    title: 'The AI agent that actually does your work.',
    body:
      'Give it a goal in plain language. Plutus understands what you want, gathers the context, uses your tools, and gets it done — then tells you exactly what changed.',
    ctas: [
      { label: 'Put Plutus to work', href: '#beat-cta', kind: 'solid' },
      { label: 'See how it works', href: '#beat-ask', kind: 'ghost' },
    ],
    state: 'idle',
  },
  {
    id: 'ask',
    kicker: '01 · You ask',
    title: 'Just say what you want.',
    body:
      'Describe the outcome in plain language — “research our top 3 competitors”, “clean up the open PRs”, “plan Thursday’s launch”. No new workflow to learn.',
    state: 'prompt',
  },
  {
    id: 'understand',
    kicker: '02 · It understands',
    title: 'Plutus turns your goal into a plan.',
    body:
      'It works out what needs to happen and in what order — breaking a fuzzy request into concrete, checkable steps before it touches anything.',
    state: 'plan',
  },
  {
    id: 'context',
    kicker: '03 · It gathers context',
    title: 'It already knows how you work.',
    body:
      'Projects, preferences, contacts and reusable routines live in one workspace. Plutus remembers — so you don’t repeat yourself.',
    state: 'context',
  },
  {
    id: 'tools',
    kicker: '04 · It uses your tools',
    title: 'It works inside the apps you already use.',
    body:
      'Gmail, Google Calendar, GitHub, Discord and 10+ integrations. Email, calendars, chat, files and the web — Plutus reaches into all of them, no copy-paste required.',
    state: 'tools',
  },
  {
    id: 'approve',
    kicker: '05 · You stay in control',
    title: 'Nothing important happens without your nod.',
    body:
      'Plutus pauses for approval before consequential actions. Review the step, approve it, or send it back — your hand stays on the wheel.',
    state: 'approve',
  },
  {
    id: 'work',
    kicker: '06 · It does the work',
    title: 'Real output, saved where it belongs.',
    body:
      'Drafts emails, organizes files, writes and commits code, books time, creates assets — then puts the results back into the right tools.',
    state: 'work',
  },
  {
    id: 'report',
    kicker: '07 · It reports back',
    title: 'You see exactly what changed.',
    body:
      'Every run ends with a clear summary: what Plutus did, where it did it, and what’s worth a second look.',
    state: 'report',
  },
  {
    id: 'team',
    kicker: '08 · Team-ready',
    title: 'Delegate as a team.',
    body:
      'Invite people, share knowledge and routines, review each other’s work, and keep control over what gets done across the org.',
    state: 'team',
  },
  {
    id: 'deploy',
    kicker: '09 · Cloud or local',
    title: 'Run it your way.',
    body:
      'Start instantly in the cloud, or run Plutus locally for private, on-machine work. Same agent, your choice of where it lives.',
    state: 'deploy',
  },
  {
    id: 'cta',
    kicker: 'Get started',
    title: 'Stop managing tools. Start delegating outcomes.',
    body: 'Put Plutus to work today — give it a goal and watch it follow through.',
    ctas: [{ label: 'Put Plutus to work', href: '#', kind: 'solid' }],
    state: 'idle',
  },
];
