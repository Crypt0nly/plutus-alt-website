// PLUTUS product catalog.
// Every "grocery product" is really a feature of the AI operating system.
// `package` selects which procedural 3D builder is used.
// `specs` are rendered both on the 3D "nutrition facts" panel and in the DOM detail sheet.

export const BRAND = {
  name: 'PLUTUS',
  wordmark: 'PLUTUS',
  promise: 'The AI Operating System for Companies',
  aisleLine: 'Everything your company runs on — stocked on one shelf.',
};

export const PRODUCTS = [
  {
    id: 'neural-flakes',
    name: 'Neural Flakes',
    feature: 'Autonomous Agents',
    aisle: 'Automation',
    package: 'box',
    tagline: 'Self-driving work, served fresh every morning.',
    blurb:
      'A balanced breakfast of autonomous agents that plan, call tools, and finish multi-step work without supervision. Pour them into any process and they get to work — with a human-in-the-loop switch baked right into the box.',
    netwt: 'NET 12B PARAMS',
    flavor: 'ORIGINAL CRUNCH',
    colors: { base: '#F2A33C', accent: '#E2542B', ink: '#3A2410', paper: '#FFF6E6' },
    specs: [
      { label: 'Serving size', value: '1 workflow' },
      { label: 'Agents / box', value: 'Unlimited', big: true },
      { label: 'Tool integrations', value: '400+' },
      { label: 'Autonomy', value: '95%', dv: '95%' },
      { label: 'Median step latency', value: '120 ms' },
      { label: 'Human-in-the-loop', value: 'Included' },
      { label: 'Uptime', value: '99.99%' },
    ],
  },
  {
    id: 'insight-beans',
    name: 'Insight Beans',
    feature: 'Analytics & BI',
    aisle: 'Intelligence',
    package: 'can',
    tagline: 'Slow-simmered signal, ladled straight from raw data.',
    blurb:
      'Hearty, shelf-stable analytics. Ask a question in plain language and Insight Beans simmers your warehouse into dashboards, forecasts, and the one number that actually matters. No can opener required.',
    netwt: 'NET 1 WAREHOUSE',
    flavor: 'NO ADDED NOISE',
    colors: { base: '#1F7A6B', accent: '#F4C145', ink: '#06281F', paper: '#F2FBF7' },
    specs: [
      { label: 'Serving size', value: '1 question' },
      { label: 'Rows per scan', value: '2.0 B', big: true },
      { label: 'Warehouses', value: 'Any' },
      { label: 'Forecast accuracy', value: '92%', dv: '92%' },
      { label: 'Query latency', value: '0.8 s' },
      { label: 'Added noise', value: '0 g' },
      { label: 'Refresh', value: 'Real time' },
    ],
  },
  {
    id: 'flowpress',
    name: 'FlowPress',
    feature: 'Workflow Orchestration',
    aisle: 'Automation',
    package: 'bottle',
    tagline: 'Cold-pressed pipelines. Zero pulp, all throughput.',
    blurb:
      'A raw, cold-pressed orchestration layer that connects every step of every process into one smooth pour. Branch, retry, and fan out across thousands of tasks — bottled fresh and never from concentrate.',
    netwt: 'NET 10k RUNS / DAY',
    flavor: 'COLD-PRESSED',
    colors: { base: '#D8366B', accent: '#FFB3C7', ink: '#3A0E1E', paper: '#FFF0F5' },
    specs: [
      { label: 'Serving size', value: '1 pipeline' },
      { label: 'Concurrent runs', value: '10,000', big: true },
      { label: 'Retries', value: 'Automatic' },
      { label: 'Branching', value: 'Conditional' },
      { label: 'Throughput', value: '99%', dv: '99%' },
      { label: 'Pulp', value: '0%' },
      { label: 'From concentrate', value: 'Never' },
    ],
  },
  {
    id: 'puredata',
    name: 'PureData',
    feature: 'Data Platform & ETL',
    aisle: 'Data',
    package: 'carton',
    tagline: 'Whole, clean, lineage-tracked data. Lactose-free.',
    blurb:
      'Wholesome data on tap. PureData ingests, cleans, and unifies every source into one nutritious platform with full lineage — so every team drinks from the same carton. Always within its freshness date.',
    netwt: 'NET 1 SOURCE OF TRUTH',
    flavor: 'WHOLE • UNIFIED',
    colors: { base: '#2E6BE6', accent: '#BFD6FF', ink: '#0A1E47', paper: '#F4F8FF' },
    specs: [
      { label: 'Serving size', value: '1 platform' },
      { label: 'Connectors', value: '300+', big: true },
      { label: 'Lineage', value: 'End-to-end' },
      { label: 'Freshness', value: '< 5 min' },
      { label: 'Quality', value: '99.5%', dv: '99.5%' },
      { label: 'Governance', value: 'Built in' },
      { label: 'Lactose', value: '0 g' },
    ],
  },
  {
    id: 'deploy-dark-roast',
    name: 'Deploy Dark Roast',
    feature: 'Runtime & Deployment',
    aisle: 'Platform',
    package: 'coffee',
    tagline: 'Ship while it’s hot. Single-origin, zero downtime.',
    blurb:
      'A bold, dark-roast runtime that takes your models and services from commit to production in one smooth pour. Autoscaling, rollbacks, and blue-green deploys roasted in — ethically sourced, fully observable.',
    netwt: 'NET 1 GLOBAL EDGE',
    flavor: 'DARK ROAST',
    colors: { base: '#5A3825', accent: '#C98A4B', ink: '#1C0F08', paper: '#F3E7D7' },
    specs: [
      { label: 'Serving size', value: '1 deploy' },
      { label: 'Cold start', value: '90 ms', big: true },
      { label: 'Regions', value: '34' },
      { label: 'Rollback', value: '1 click' },
      { label: 'Autoscale', value: 'To zero' },
      { label: 'Downtime', value: '0 s' },
      { label: 'Roast level', value: 'Production' },
    ],
  },
  {
    id: 'guardian',
    name: 'Guardian',
    feature: 'Security & Compliance',
    aisle: 'Trust',
    package: 'jar',
    tagline: 'Sealed for freshness. Sealed for SOC 2.',
    blurb:
      'A tamper-evident jar of guardrails, audit trails, and policy controls. Guardian inspects every prompt, redacts what it must, and keeps a receipt for the auditors. Pop the seal and you’re compliant.',
    netwt: 'NET 1 AUDIT TRAIL',
    flavor: 'PRESERVATIVE-FREE',
    colors: { base: '#2B2D6B', accent: '#7FE7C4', ink: '#0B0C24', paper: '#EEF1FF' },
    specs: [
      { label: 'Serving size', value: '1 tenant' },
      { label: 'Certifications', value: 'SOC 2 · ISO', big: true },
      { label: 'PII redaction', value: 'Automatic' },
      { label: 'Audit log', value: 'Immutable' },
      { label: 'Coverage', value: '100%', dv: '100%' },
      { label: 'Data residency', value: 'Your region' },
      { label: 'Backdoors', value: '0' },
    ],
  },
  {
    id: 'connect',
    name: 'Connect',
    feature: 'Integration Mesh',
    aisle: 'Platform',
    package: 'tube',
    tagline: 'A single dab connects your whole stack.',
    blurb:
      'Concentrated integration paste. One squeeze bonds your CRM, ERP, ticketing, and home-grown tools into a single mesh the agents can use. Strong hold, no residue, works on every surface.',
    netwt: 'NET 1 STACK',
    flavor: 'EXTRA STRENGTH',
    colors: { base: '#1DA1C9', accent: '#0B6E8C', ink: '#06303C', paper: '#FFFFFF' },
    specs: [
      { label: 'Serving size', value: '1 app' },
      { label: 'Pre-built apps', value: '500+', big: true },
      { label: 'Auth', value: 'OAuth · SSO' },
      { label: 'Webhooks', value: 'Two-way' },
      { label: 'Bond strength', value: '99%', dv: '99%' },
      { label: 'Residue', value: 'None' },
      { label: 'Drying time', value: 'Instant' },
    ],
  },
  {
    id: 'sage',
    name: 'Sage',
    feature: 'Knowledge & RAG Search',
    aisle: 'Intelligence',
    package: 'box',
    tagline: 'Steep your docs. Sip the answers.',
    blurb:
      'A calming blend of retrieval and reasoning. Sage indexes every document, wiki, and ticket, then brews grounded, cited answers on demand. Naturally caffeinated by your own knowledge — never hallucinated.',
    netwt: 'NET 50M DOCS',
    flavor: 'GROUNDED & CITED',
    colors: { base: '#3E7D4F', accent: '#D8B23A', ink: '#122A18', paper: '#F4F7EE' },
    specs: [
      { label: 'Serving size', value: '1 query' },
      { label: 'Documents', value: '50 M', big: true },
      { label: 'Citations', value: 'Always' },
      { label: 'Languages', value: '95' },
      { label: 'Groundedness', value: '98%', dv: '98%' },
      { label: 'Steep time', value: '0.4 s' },
      { label: 'Hallucination', value: '0 g' },
    ],
  },
];

// Aisles (categories) used by the nav + section copy.
export const AISLES = [
  { id: 'Automation', label: 'Automation', note: 'Agents & orchestration that do the work.' },
  { id: 'Intelligence', label: 'Intelligence', note: 'Analytics, search & grounded reasoning.' },
  { id: 'Data', label: 'Data', note: 'One clean, unified source of truth.' },
  { id: 'Platform', label: 'Platform', note: 'Runtime, deploys & the integration mesh.' },
  { id: 'Trust', label: 'Trust', note: 'Security, compliance & audit baked in.' },
];

export const productById = (id) => PRODUCTS.find((p) => p.id === id);
