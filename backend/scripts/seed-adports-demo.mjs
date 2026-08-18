/**
 * AD Ports Group demo seeder — wipes ALL transactional data and rebuilds a
 * ports/maritime/logistics-themed portfolio that exercises every capability:
 * all seven initiative buckets, a flagship Gantt with dependencies and a
 * milestone diamond, a restricted project, KPI project links with scorecard
 * series, a two-cycle submission history covering every workflow state, a
 * high-severity risk, pending members with PoC emails, and activity spread
 * over the past eight weeks for the charts.
 *
 *   backend: node scripts/seed-adports-demo.mjs
 *
 * Keeps: profiles, role_capabilities/access_audit, generic lookups it does
 * not re-theme, saved searches. Everything else transactional is deleted.
 * Deterministic ids under `ad000000-0000-4000-a000-…` make re-runs clean.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const env = {};
for (const line of readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, '');
}
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const did = (block, n) =>
  `ad000000-0000-4000-a000-${String(block * 1000 + n).padStart(12, '0')}`;
// Blocks: 1 projects · 2 outcomes · 3 milestones · 4 action items · 5 issues
// 6 risks · 7 links · 8 resources · 9 updates · 10 status reports
// 11 members · 12 kpis · 13 readings · 14 plans · 15 lookups · 16 cycles/subs
// 17 dependencies · 18 action-item owners

const TODAY = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const daysFromNow = (n) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d;
};
const dISO = (n) => iso(daysFromNow(n));
const tsDaysAgo = (n, hour = 10) => {
  const d = daysFromNow(-n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Corporate network drops the odd request — retry transient failures. */
async function withRetry(label, fn) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const { error } = await fn();
      if (!error) return;
      console.error(`FAILED ${label}: ${error.message}`);
      process.exit(1);
    } catch (err) {
      if (attempt === 4) {
        console.error(`FAILED ${label} after retries: ${err.message}`);
        process.exit(1);
      }
      console.log(`  retry ${label} (${attempt}) — ${err.message}`);
      await sleep(1500 * attempt);
    }
  }
}

async function upsert(table, rows, onConflict = 'id') {
  if (rows.length === 0) return;
  await withRetry(table, () => db.from(table).upsert(rows, { onConflict }));
  console.log(`  ${table}: ${rows.length} rows`);
}

async function wipeAll(table) {
  const { error } = await db.from(table).delete().not('id', 'is', null);
  console.log(`  wipe ${table}: ${error ? 'FAILED ' + error.message : 'ok'}`);
  if (error) process.exit(1);
}

async function fetchAll(table, columns = 'id, name') {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const { data, error } = await db.from(table).select(columns);
      if (error) {
        console.error(`FAILED reading ${table}: ${error.message}`);
        process.exit(1);
      }
      return data ?? [];
    } catch (err) {
      if (attempt === 4) {
        console.error(`FAILED reading ${table} after retries: ${err.message}`);
        process.exit(1);
      }
      await sleep(1500 * attempt);
    }
  }
  return [];
}
const byName = (rows, name) =>
  rows.find((r) => r.name?.toLowerCase() === name.toLowerCase())?.id ?? null;
const pick = (rows, i) => (rows.length ? rows[i % rows.length].id : null);

// ---------------------------------------------------------------------------
// 1. Full transactional wipe (children first where no cascade covers them)
// ---------------------------------------------------------------------------
console.log('Wiping ALL transactional data…');
// Storage objects for attachments, best-effort.
const atts = await db.from('attachments').select('storage_path');
if (!atts.error && (atts.data ?? []).length > 0) {
  await db.storage
    .from('project-attachments')
    .remove(atts.data.map((a) => a.storage_path));
  console.log(`  storage: removed ${atts.data.length} object(s)`);
}
for (const t of [
  'notifications',
  'record_history',
  'submissions',
  'cycles',
  'kpi_action_plans',
  'kpi_readings',
  'kpis',
  'project_templates',
  'projects', // cascades members/outcomes/milestones/deps/AIs/issues/risks/…
  // Re-themed lookup tables (safe once nothing references them; programs
  // before objectives for the FK):
  'strategic_programs',
  'strategic_objectives',
  'project_categories',
  'sectors',
  'deal_types',
]) {
  await wipeAll(t);
}

// ---------------------------------------------------------------------------
// 2. Themed lookups
// ---------------------------------------------------------------------------
console.log('Seeding AD Ports Group lookups…');
const L = (n) => did(15, n);
await upsert('sectors', [
  { id: L(1), name: 'Ports', sort_order: 1 },
  { id: L(2), name: 'Maritime & Shipping', sort_order: 2 },
  { id: L(3), name: 'Logistics', sort_order: 3 },
  { id: L(4), name: 'Economic Cities & Free Zones', sort_order: 4 },
  { id: L(5), name: 'Digital', sort_order: 5 },
]);
await upsert('project_categories', [
  { id: L(6), name: 'Infrastructure Expansion' },
  { id: L(7), name: 'Digital Transformation' },
  { id: L(8), name: 'Sustainability' },
  { id: L(9), name: 'Operational Excellence' },
  { id: L(10), name: 'Customer Experience' },
]);
await upsert('strategic_objectives', [
  { id: L(11), name: 'Grow global trade connectivity', sort_order: 1 },
  { id: L(12), name: 'Digitalize trade & logistics', sort_order: 2 },
  { id: L(13), name: 'Decarbonize operations', sort_order: 3 },
]);
await upsert('strategic_programs', [
  { id: L(14), name: 'Khalifa Port Master Plan', objective_id: L(11), sort_order: 1 },
  { id: L(15), name: 'Smart Ports Program', objective_id: L(12), sort_order: 2 },
  { id: L(16), name: 'Green Maritime Program', objective_id: L(13), sort_order: 3 },
  { id: L(17), name: 'KEZAD Growth Program', objective_id: L(11), sort_order: 4 },
]);
await upsert('deal_types', [
  { id: L(18), name: 'Capital Project', sort_order: 1 },
  { id: L(19), name: 'Joint Venture', sort_order: 2 },
  { id: L(20), name: 'Concession', sort_order: 3 },
  { id: L(21), name: 'Internal Initiative', sort_order: 4 },
]);

// ---------------------------------------------------------------------------
// 3. Reference data
// ---------------------------------------------------------------------------
const profiles = await fetchAll('profiles', 'id, full_name, email');
const me =
  profiles.find((p) => p.email === 'test@ptrack.local')?.id ?? profiles[0].id;
const tester =
  profiles.find((p) => p.email === 'rbac.tester@poc.ptrack.local')?.id ?? null;

const statuses = await fetchAll('project_statuses');
const sizes = await fetchAll('project_sizes');
const tiers = await fetchAll('tiers');
const roles = await fetchAll('project_roles');
const involvement = await fetchAll('involvement_levels');
const aiTypes = await fetchAll('action_item_types');
const issueCats = await fetchAll('issue_categories');
const issueLevels = await fetchAll('issue_levels');
const resourceTypes = await fetchAll('resource_types');
const updateTypes = await fetchAll('update_types');
const riskSources = await fetchAll('risk_sources');
const riskCats = await fetchAll('risk_categories');
const riskProb = await fetchAll('risk_probability_levels', 'id, name, sort_order');
const riskImpact = await fetchAll('risk_impact_levels', 'id, name, sort_order');
const riskResponses = await fetchAll('risk_responses');

const status = {
  inProgress: byName(statuses, 'In Progress') ?? pick(statuses, 0),
  onHold: byName(statuses, 'On Hold') ?? pick(statuses, 1),
  completed: byName(statuses, 'Completed') ?? pick(statuses, 2),
  notStarted: byName(statuses, 'Not Started') ?? pick(statuses, 3),
  cancelled: byName(statuses, 'Cancelled') ?? pick(statuses, 4),
};

// ---------------------------------------------------------------------------
// 4. Projects — engineered to light every initiative bucket
//    planned% comes from start/end vs today (F2); calc% from milestones (F1).
// ---------------------------------------------------------------------------
console.log('Seeding portfolio…');
const P = (i) => did(1, i);
const projects = [
  { // planned ~50, calc ~50 → On Target. Flagship gantt showcase.
    id: P(1), name: 'Khalifa Port South Quay Expansion',
    description: 'New 1,200m deep-water quay wall, four STS cranes, and yard capacity for 1.9M additional TEU.',
    goal: 'Berth capacity live ahead of the 2027 alliance contract window.',
    status_id: status.inProgress, start: -180, end: 180, category: 6, sector: 1,
    tier: 0, deal: 18, priority: true, budget: [860000000, 402000000],
    stakeholders: ['Terminal operating partners', 'Abu Dhabi Customs'],
    manager: me, pmo: me, sponsor: 'Ports Cluster CEO',
  },
  { // planned ~50, calc ~50 → On Target
    id: P(2), name: 'Port Community System 2.0',
    description: 'Next-generation trade single window: vessel calls, cargo clearance, and payments across all terminals.',
    goal: 'All port calls and 90% of clearances digital by mid-2027.',
    status_id: status.inProgress, start: -150, end: 150, category: 7, sector: 5,
    tier: 0, deal: 21, priority: true, budget: [95000000, 41000000],
    stakeholders: ['Customs', 'Shipping lines', 'Freight forwarders'],
    manager: me, pmo: me, sponsor: 'Chief Digital Officer',
  },
  { // planned ~40, calc ~45 → On Target
    id: P(3), name: 'KEZAD Logistics Park Phase 3',
    description: 'Grade-A warehousing build-out with 180,000 sqm of leasable space and shared cold storage.',
    goal: '70% pre-let before handover.',
    status_id: status.inProgress, start: -120, end: 180, category: 6, sector: 4,
    tier: 1, deal: 18, priority: false, budget: [240000000, 88000000],
    stakeholders: ['Anchor tenants', 'Utilities providers'],
    manager: me, pmo: me, sponsor: 'Economic Cities Cluster CEO',
  },
  { // planned ~60, calc ~48 → Needs Attention
    id: P(4), name: 'Fleet Decarbonization Retrofit',
    description: 'Retrofit of 14 harbor craft with hybrid propulsion and shore-power readiness for two terminals.',
    goal: '22% CO2 reduction across the retrofitted fleet.',
    status_id: status.inProgress, start: -150, end: 100, category: 8, sector: 2,
    tier: 1, deal: 21, priority: true, budget: [58000000, 39000000],
    stakeholders: ['Classification society', 'Harbor operations'],
    manager: me, pmo: me, sponsor: 'Maritime Cluster CEO',
  },
  { // planned ~80, calc ~30 → Severely Off Target, flagged at risk
    id: P(5), name: 'Cruise Terminal Passenger Experience',
    description: 'Redesigned arrivals hall, biometric boarding, and retail concessions ahead of the winter season.',
    goal: 'Sub-20-minute curb-to-ship time at peak.',
    status_id: status.inProgress, start: -160, end: 40, category: 10, sector: 1,
    tier: 2, deal: 18, priority: false, budget: [32000000, 27000000],
    stakeholders: ['Cruise lines', 'Immigration authority'],
    manager: me, pmo: me, sponsor: 'Cruise Business Director', atRisk: true,
  },
  { // planned ~30, calc ~70 → Over-Achieved
    id: P(6), name: 'Autonomous Yard Tractor Pilot',
    description: 'Twelve autonomous tractors on a fenced yard loop with remote supervision and charging automation.',
    goal: 'Prove 30% cost-per-move reduction on the pilot loop.',
    status_id: status.inProgress, start: -60, end: 140, category: 7, sector: 5,
    tier: 2, deal: 19, priority: false, budget: [21000000, 9000000],
    stakeholders: ['Technology partner', 'Yard operations'],
    manager: me, pmo: null, sponsor: 'Head of Innovation',
  },
  { // Completed bucket
    id: P(7), name: 'Marine Services Training Academy',
    description: 'Simulator-equipped academy for pilots, tug masters, and VTS operators; accredited curriculum.',
    goal: '400 certified marine professionals per year.',
    status_id: status.completed, start: -420, end: -40, actualEnd: -33,
    category: 9, sector: 2, tier: 1, deal: 21, priority: false,
    budget: [45000000, 43200000],
    stakeholders: ['Maritime academy partners'],
    manager: me, pmo: me, sponsor: 'Maritime Cluster CEO',
  },
  { // planned ~70, calc ~45 → Off Target, on hold
    id: P(8), name: 'Freight Rail Link Integration',
    description: 'Rail siding into the container terminal with automated gate and customs bonded corridor.',
    goal: 'First scheduled container train service running.',
    status_id: status.onHold, start: -200, end: 90, category: 6, sector: 3,
    tier: 0, deal: 20, priority: false, budget: [130000000, 71000000],
    stakeholders: ['National rail operator', 'Customs'],
    manager: me, pmo: null, sponsor: 'Logistics Cluster CEO',
  },
  { // Not Started bucket
    id: P(9), name: 'Port Operations Digital Twin',
    description: 'Live digital twin of berth, yard, and gate operations for scenario planning and disruption response.',
    goal: 'Twin covering the two busiest terminals.',
    status_id: status.notStarted, start: 30, end: 400, category: 7, sector: 5,
    tier: 1, deal: 21, priority: false, budget: [38000000, 0],
    stakeholders: ['Terminal operators'],
    manager: me, pmo: me, sponsor: 'Chief Digital Officer',
  },
  { // planned ~45, calc ~45 → On Target
    id: P(10), name: 'Regional Feeder Network Expansion',
    description: 'Two additional feeder loops connecting Gulf secondary ports, with schedule integration.',
    goal: 'Weekly reliability above 92% on new loops.',
    status_id: status.inProgress, start: -90, end: 120, category: 9, sector: 2,
    tier: 2, deal: 19, priority: false, budget: [64000000, 30000000],
    stakeholders: ['Feeder alliance partners'],
    manager: me, pmo: null, sponsor: 'Head of Shipping Services',
  },
  { // RESTRICTED — security showcase (invisible to unrelated users)
    id: P(11), name: 'Strategic Land Bank Development',
    description: 'Confidential land assembly and masterplanning for the next industrial zone tranche.',
    goal: 'Board approval of the masterplan.',
    status_id: status.inProgress, start: -70, end: 200, category: 6, sector: 4,
    tier: 0, deal: 18, priority: true, budget: [510000000, 46000000],
    stakeholders: ['Board strategy committee'],
    manager: me, pmo: me, sponsor: 'Group CEO', restricted: true,
  },
  { // Cancelled — excluded from the initiative donut
    id: P(12), name: 'Cold Chain Logistics Hub (Legacy Site)',
    description: 'Superseded cold-storage hub proposal on the legacy site; folded into KEZAD Phase 3.',
    goal: 'Superseded by KEZAD Logistics Park Phase 3.',
    status_id: status.cancelled, start: -240, end: -60, category: 6, sector: 3,
    tier: 2, deal: 18, priority: false, budget: [75000000, 4000000],
    stakeholders: [], manager: null, pmo: null, sponsor: 'Logistics Cluster CEO',
  },
];

await upsert('projects', projects.map((p, i) => ({
  id: p.id, name: p.name, description: p.description, goal: p.goal,
  owner_id: me, project_manager_id: p.manager, pmo_partner_id: p.pmo,
  sponsor: p.sponsor, status_id: p.status_id, size_id: pick(sizes, i),
  category_id: L(p.category), sector_id: L(p.sector),
  tier_id: pick(tiers, p.tier), deal_type_id: L(p.deal),
  strategic_objective_id: p.category === 8 ? L(13) : p.category === 7 ? L(12) : L(11),
  strategic_program_id: p.sector === 4 ? L(17) : p.category === 7 ? L(15) : p.category === 8 ? L(16) : L(14),
  start_date: dISO(p.start), target_end_date: dISO(p.end),
  actual_end_date: p.actualEnd != null ? dISO(p.actualEnd) : null,
  plan_year: 2026, project_number: `ADP-26-${String(i + 1).padStart(3, '0')}`,
  reference_id: `ADPG-${2400 + i}`, finance_code: `CAP-${5100 + i}`,
  target_group: 'Group customers and trade partners',
  is_priority: p.priority, at_risk: Boolean(p.atRisk),
  approved_budget: p.budget[0], utilized_budget: p.budget[1],
  internal_stakeholder: 'Group PMO',
  external_stakeholders: p.stakeholders,
  manual_progress: null, customer: 'AD Ports Group',
  tags: ['adports', p.sector === 5 ? 'digital' : p.category === 8 ? 'green' : 'growth'],
  access_control: p.restricted ? 'restricted' : 'open',
  created_by: me, updated_by: me, created_at: tsDaysAgo(200 - i * 6),
})));

// ---------------------------------------------------------------------------
// 5. Members — you on every project; pending people, some with PoC emails
// ---------------------------------------------------------------------------
const PENDING = [
  ['Mariam Al Shamsi', 'mariam.alshamsi@poc.ptrack.local'],
  ['Khalid Al Mansoori', 'khalid.almansoori@poc.ptrack.local'],
  ['Fatima Al Zaabi', null],
  ['Ahmed Al Hosani', null],
  ['Noura Al Kaabi', 'noura.alkaabi@poc.ptrack.local'],
  ['Saif Al Marzooqi', null],
  ['Hessa Al Falasi', null],
  ['Omar Haddad', null],
  ['Layla Nasser', null],
  ['Tariq Aziz', null],
];
const members = [];
projects.forEach((p, i) => {
  members.push({
    id: did(11, i * 10 + 1), project_id: p.id, user_id: me,
    role_id: byName(roles, 'Owner') ?? pick(roles, 0),
    involvement_level_id: pick(involvement, 0),
    access_level: 'read_write_admin', status: 'active', created_by: me,
  });
  for (let k = 0; k < 2 + (i % 2); k++) {
    const [pname, pemail] = PENDING[(i * 2 + k * 3) % PENDING.length];
    members.push({
      id: did(11, i * 10 + 2 + k), project_id: p.id, user_id: null,
      pending_name: pname, pending_email: pemail,
      role_id: pick(roles, 1 + k),
      involvement_level_id: pick(involvement, k),
      access_level: k === 0 ? 'read_write' : 'read_only',
      status: 'pending', created_by: me,
    });
  }
});
// The RBAC tester is a read-only member of the feeder project (grayed-UI demo)
if (tester) {
  members.push({
    id: did(11, 991), project_id: P(10), user_id: tester,
    role_id: pick(roles, 2), involvement_level_id: pick(involvement, 1),
    access_level: 'read_only', status: 'active', created_by: me,
  });
}
await upsert('project_members', members);

// ---------------------------------------------------------------------------
// 6. Outcomes + milestones — calc% tuned per project for the buckets
//    [name, weight, dueOffset, pct, major?, noStart?]  pct=100 ⇒ completed
// ---------------------------------------------------------------------------
const MS_PLANS = [
  // P1 flagship — 3 outcomes, weights sum 100, dependency chain + diamond
  [['Marine works', [
      ['Dredging & reclamation complete', 20, -60, 100, true],
      ['Quay wall piling', 20, -10, 80],
      ['Quay wall deck pour', 10, 45, 20],
    ]],
   ['Equipment', [
      ['STS cranes ordered', 15, -90, 100, true],
      ['Cranes delivered & erected', 15, 90, 0, true],
    ]],
   ['Commissioning', [
      ['Yard systems integration', 10, 130, 0],
      ['Operational readiness certified', 10, 170, 0, true, true],
    ]]],
  // P2 — weights sum 100, ~calc 50
  [['Platform build', [
      ['Vessel-call module live', 30, -40, 100, true],
      ['Cargo clearance module', 30, 20, 50],
    ]],
   ['Adoption', [
      ['Top-10 lines onboarded', 20, 70, 20],
      ['Forwarder self-service portal', 20, 120, 0],
    ]]],
  // P3 — weights sum 100, ~calc 45
  [['Construction', [
      ['Enabling works complete', 25, -60, 100],
      ['Warehouse shells up', 35, 30, 40, true],
    ]],
   ['Leasing', [
      ['Anchor tenant signed', 20, -15, 100, true],
      ['50% pre-let reached', 20, 90, 0],
    ]]],
  // P4 — calc ~48 vs planned ~60 → Needs Attention
  [['Retrofit waves', [
      ['Design & class approval', null, -100, 100, true],
      ['Wave 1 (5 craft) retrofitted', null, -20, 70],
      ['Wave 2 (5 craft)', null, 40, 20],
      ['Wave 3 (4 craft) + shore power', null, 90, 0],
    ]]],
  // P5 — calc ~30 vs planned ~80 → Severely Off Target
  [['Terminal works', [
      ['Concept design approved', null, -120, 100],
      ['Arrivals hall strip-out', null, -50, 60, true],
      ['Biometric gates installed', null, -10, 10],
      ['Retail fit-out', null, 30, 0],
    ]]],
  // P6 — calc ~70 vs planned ~30 → Over-Achieved
  [['Pilot', [
      ['Loop fenced & mapped', null, -30, 100],
      ['First 6 tractors operating', null, 20, 90, true],
      ['Full fleet + KPI report', null, 100, 30],
    ]]],
  // P7 — completed
  [['Academy', [
      ['Simulators commissioned', null, -300, 100, true],
      ['Curriculum accredited', null, -180, 100],
      ['First cohort graduated', null, -60, 100, true],
    ]]],
  // P8 — calc ~45 vs planned ~70 → Off Target
  [['Rail link', [
      ['Alignment & design frozen', null, -150, 100],
      ['Siding civil works', null, -30, 60, true],
      ['Automated gate systems', null, 30, 10],
      ['Bonded corridor approval', null, 80, 0],
    ]]],
  // P9 — not started
  [['Foundation', [
      ['Vendor selection', null, 60, 0],
      ['Data integration design', null, 120, 0],
    ]]],
  // P10 — calc ~45 vs planned ~45 → On Target
  [['Network', [
      ['Loop 1 schedule live', null, -20, 100, true],
      ['Loop 2 port agreements', null, 30, 40],
      ['Reliability dashboard', null, 80, 0],
    ]]],
  // P11 restricted
  [['Masterplan', [
      ['Land assembly complete', null, -10, 70, true],
      ['Masterplan draft', null, 60, 20],
      ['Board approval', null, 150, 0, true],
    ]]],
  // P12 cancelled
  [['Proposal', [
      ['Feasibility study', null, -180, 100],
      ['Investment committee review', null, -90, 0],
    ]]],
];
const outcomes = [];
const milestones = [];
let msN = 0;
const msIdOf = {}; // "pi:name" -> id for dependencies
MS_PLANS.forEach((plan, pi) => {
  plan.forEach(([oname, items], oi) => {
    const oid = did(2, pi * 10 + oi + 1);
    outcomes.push({
      id: oid, project_id: P(pi + 1), name: oname, sort_order: oi + 1,
      start_date: dISO(projects[pi].start), end_date: dISO(projects[pi].end),
      created_by: me, updated_by: me,
    });
    items.forEach(([name, weight, due, pct, major, noStart]) => {
      msN += 1;
      const id = did(3, msN);
      msIdOf[`${pi + 1}:${name}`] = id;
      milestones.push({
        id, project_id: P(pi + 1), outcome_id: oid, name,
        weightage: weight, due_date: dISO(due),
        original_due_date: dISO(due),
        start_date: noStart ? null : dISO(due - 45),
        is_major: Boolean(major),
        status: pct === 100 ? 'closed_completed' : 'open',
        percent_complete: pct,
        completed_date: pct === 100 ? dISO(due - 4) : null,
        owner_id: me, created_by: me, updated_by: me,
      });
    });
  });
});
await upsert('program_outcomes', outcomes);
await upsert('milestones', milestones);

// Dependencies: P1 chain (piling→deck→cranes erected→readiness) + P3 pair
const dep = (n, pi, from, to) => ({
  id: did(17, n), project_id: P(pi),
  source_id: msIdOf[`${pi}:${from}`], target_id: msIdOf[`${pi}:${to}`],
});
await upsert('milestone_dependencies', [
  dep(1, 1, 'Quay wall piling', 'Quay wall deck pour'),
  dep(2, 1, 'Quay wall deck pour', 'Cranes delivered & erected'),
  dep(3, 1, 'Cranes delivered & erected', 'Operational readiness certified'),
  dep(4, 1, 'Yard systems integration', 'Operational readiness certified'),
  dep(5, 3, 'Warehouse shells up', '50% pre-let reached'),
]);

// ---------------------------------------------------------------------------
// 7. Action items — due dates spread for reminders/My-work/relative dates
// ---------------------------------------------------------------------------
const AI_ROWS = [
  ['Approve quay deck pour method statement', 1, -6, 'open'],
  ['Confirm crane delivery vessel booking', 1, 5, 'open'],
  ['Close dredging environmental report', 1, -30, 'closed_completed'],
  ['Sign customs API integration agreement', 2, 0, 'open'],
  ['Line onboarding playbook review', 2, 9, 'open'],
  ['Retire legacy EDI gateway', 2, -25, 'closed_completed'],
  ['Award cold-store MEP package', 3, 3, 'open'],
  ['Tenant fit-out guidelines published', 3, -18, 'closed_completed'],
  ['Wave 2 dry-dock slots booked', 4, -4, 'open'],
  ['Shore-power cable routing survey', 4, 14, 'open'],
  ['Biometric vendor escalation meeting', 5, -2, 'open'],
  ['Re-baseline cruise season plan', 5, 6, 'open'],
  ['Publish pilot safety case', 6, 11, 'open'],
  ['Tractor charging bay handover', 6, -12, 'closed_completed'],
  ['Archive academy accreditation pack', 7, -70, 'closed_completed'],
  ['Rail operator steering session', 8, 8, 'open'],
  ['Twin vendor shortlist criteria', 9, 21, 'open'],
  ['Loop 2 berth window negotiation', 10, 4, 'open'],
  ['Land valuation review (confidential)', 11, 7, 'open'],
];
const actionItems = AI_ROWS.map(([title, proj, due, st], i) => ({
  id: did(4, i + 1), project_id: P(proj), title,
  description: 'Seeded for the AD Ports portfolio demo.',
  type_id: pick(aiTypes, i), due_date: dISO(due), status: st,
  owner_id: me, created_by: me, updated_by: me,
  created_at: tsDaysAgo(Math.max(4, Math.abs(due) + 8)),
}));
await upsert('action_items', actionItems);
await upsert('action_item_owners', actionItems.map((a, i) => ({
  id: did(18, i + 1), action_item_id: a.id, user_id: me, slot: 1,
})));

// ---------------------------------------------------------------------------
// 8. Issues, risks (incl. one High/High), links, resources
// ---------------------------------------------------------------------------
const ISSUES = [
  ['Crane vessel berth clash with liner schedule', 1, 'open', 'Coordinate berth window with alliance planners.'],
  ['Clearance module rejects legacy HS codes', 2, 'in_progress', 'Mapping table patch scheduled with customs.'],
  ['Warehouse steel delivery slipped two weeks', 3, 'open', 'Re-sequence bays; recover in fit-out.'],
  ['Retrofit yard congestion at dry dock', 4, 'resolved', 'Second dock slot secured.'],
  ['Biometric gate false-reject rate high', 5, 'open', 'Vendor tuning sprint; fallback lanes staffed.'],
  ['Rail gate OCR misreads container prefixes', 8, 'open', 'Camera reposition and retraining planned.'],
  ['Academy simulator license audit finding', 7, 'closed', 'Licenses trued up.'],
];
await upsert('issues', ISSUES.map(([title, proj, st, rec], i) => ({
  id: did(5, i + 1), project_id: P(proj), title,
  description: 'Seeded for the AD Ports portfolio demo.',
  recommendation: rec, reported_by: PENDING[i % PENDING.length][0],
  category_id: pick(issueCats, i), level_id: pick(issueLevels, i),
  status: st, date_closed: st === 'closed' || st === 'resolved' ? dISO(-8 - i) : null,
  reference_identifier: `ADI-${3100 + i}`,
  created_by: me, updated_by: me, created_at: tsDaysAgo(26 + i * 5),
})));

const probOf = (n) => byName(riskProb, n) ?? pick(riskProb, 0);
const impactOf = (n) => byName(riskImpact, n) ?? pick(riskImpact, 0);
const RISKS = [
  ['Crane erection weather window missed pushes readiness past contract date', 1, 'High', 'High', 'Erection contingency plan with night shifts; weekly weather gate reviews.'],
  ['Customs API changes destabilize clearance flows', 2, 'Medium', 'High', 'Joint change-control board with customs; staging environment mirrors production.'],
  ['Pre-let demand softens with regional capacity glut', 3, 'Medium', 'Medium', 'Broker incentives and anchor-tenant expansion options.'],
  ['Hybrid propulsion supplier single-source dependency', 4, 'Medium', 'High', 'Qualify second yard for wave 3; escrow design package.'],
  ['Cruise season opens before biometric stability', 5, 'High', 'High', 'Manual fallback lanes staffed; vendor penalty clause invoked.'],
  ['Autonomy permit scope narrower than pilot design', 6, 'Low', 'Medium', 'Regulator embedded in pilot steering.'],
  ['Rail hold extends past funding window', 8, 'High', 'Medium', 'Monthly steering with operator; re-baseline ready.'],
  ['Land assembly leak moves market pricing', 11, 'Medium', 'High', 'Strict need-to-know list; staged announcements.'],
];
await upsert('risks', RISKS.map(([statement, proj, prob, imp, plan], i) => ({
  id: did(6, i + 1), project_id: P(proj), statement,
  identified_by: PENDING[(i + 1) % PENDING.length][0],
  date_identified: dISO(-70 + i * 6),
  source_id: pick(riskSources, i), category_id: pick(riskCats, i),
  probability_id: probOf(prob), impact_id: impactOf(imp),
  response_id: pick(riskResponses, i), response_plan: plan,
  owner_id: me, status: 'open', type: i === 6 ? 'issue' : 'risk',
  created_by: me, updated_by: me,
})));

const links = [];
const resources = [];
projects.forEach((p, i) => {
  links.push({
    id: did(7, i * 2 + 1), project_id: p.id, label: 'Business case',
    url: 'https://example.org/business-case', is_gold: i < 3,
    created_by: me, updated_by: me,
  });
  links.push({
    id: did(7, i * 2 + 2), project_id: p.id, label: 'Steering pack',
    url: 'https://example.org/steering', is_gold: false,
    created_by: me, updated_by: me,
  });
  resources.push({
    id: did(8, i + 1), project_id: p.id,
    name: `${PENDING[i % PENDING.length][0]} (consultant)`,
    type_id: pick(resourceTypes, i),
    description: 'Seeded for the AD Ports portfolio demo.',
    created_by: me, updated_by: me,
  });
});
await upsert('links', links);
await upsert('resources', resources);

// ---------------------------------------------------------------------------
// 9. Updates over 8 weeks + status reports
// ---------------------------------------------------------------------------
const HEADLINES = [
  'Weekly delivery checkpoint', 'Cluster steering update', 'Milestone review',
  'Risk deep-dive held', 'Budget checkpoint', 'Partner briefing',
];
const updates = [];
let upN = 0;
projects.forEach((p, i) => {
  const count = [7, 6, 5, 5, 6, 4, 2, 4, 2, 4, 3, 1][i];
  for (let k = 0; k < count; k++) {
    upN += 1;
    updates.push({
      id: did(9, upN), project_id: p.id,
      headline: HEADLINES[(i + k) % HEADLINES.length],
      body: 'Progress reviewed against the integrated plan; actions tracked in the register. (Demo update.)',
      type_id: pick(updateTypes, k), author_id: me,
      is_gold: k === 0 && i < 3,
      created_by: me, updated_by: me,
      created_at: tsDaysAgo(k * 7 + (i % 6), 8 + (k % 8)),
    });
  }
});
await upsert('updates', updates);

const reports = [];
projects.slice(0, 6).forEach((p, i) => {
  reports.push({
    id: did(10, i * 2 + 1), project_id: p.id,
    title: 'Monthly status report — July 2026',
    summary: 'Delivery tracked against the cluster plan; key risks under active mitigation. (Demo report.)',
    report_date: dISO(-21), author_id: me, created_by: me, updated_by: me,
  });
  reports.push({
    id: did(10, i * 2 + 2), project_id: p.id,
    title: 'Monthly status report — June 2026',
    summary: 'Baseline confirmed; procurement and mobilization underway. (Demo report.)',
    report_date: dISO(-52), author_id: me, created_by: me, updated_by: me,
  });
});
await upsert('status_reports', reports);

// ---------------------------------------------------------------------------
// 10. KPIs — themed, with series for F6/F7 and project links for the KPI tab
// ---------------------------------------------------------------------------
const KPIS = [
  ['Container throughput', 'M TEU', 'higher_is_better', 4.9, 6.0, 1, [5.0, 5.1, 5.2, 5.3, 5.45, 5.6], true, 1],
  ['Vessel turnaround time', 'hours', 'lower_is_better', 21, 14, 0, [21, 20, 19, 18, 17, 16], true, 1],
  ['Digital clearance share', '%', 'higher_is_better', 38, 90, 0, [41, 46, 52, 58, 63, 69], true, 2],
  ['KEZAD occupancy rate', '%', 'higher_is_better', 62, 80, 0, [63, 64, 66, 67, 69, 71], false, 3],
  ['CO2 intensity per TEU', 'kg', 'lower_is_better', 14.2, 11.0, 1, [14.1, 13.9, 13.8, 13.6, 13.5, 13.3], false, 4],
  ['Cruise passengers handled', 'k', 'higher_is_better', 480, 700, 0, [495, 510, 520, 540, 555, 560], false, 5],
  ['Rail freight modal share', '%', 'higher_is_better', 4, 12, 1, [4.1, 4.3, 4.4, 4.6, 4.7, 4.9], false, null],
  ['Trade partner NPS', 'pts', 'higher_is_better', 41, 60, 0, [42, 44, 43, 47, 49, 50], false, null],
];
await upsert('kpis', KPIS.map(([name, unit, polarity, baseline, target, dp, , priority, proj], i) => ({
  id: did(12, i + 1), name, unit, polarity, baseline, target,
  decimal_places: dp, frequency: 'monthly', is_priority: priority,
  pillar: 'Trade & Logistics', entity: 'AD Ports Group',
  description: 'Seeded for the AD Ports portfolio demo.',
  data_source: 'Group operations data mart',
  calculation_method: 'Monthly extract per the KPI charter definition.',
  tier_id: pick(tiers, i), objective_id: i === 4 ? L(13) : i === 2 ? L(12) : L(11),
  owner_id: me, project_id: proj ? P(proj) : null,
  created_by: me, updated_by: me,
})));
const readings = [];
KPIS.forEach(([, , , , , , series], ki) => {
  series.forEach((value, mi) => {
    const d = new Date(TODAY);
    d.setMonth(d.getMonth() - (series.length - 1 - mi), 26);
    readings.push({
      id: did(13, ki * 10 + mi + 1), kpi_id: did(12, ki + 1),
      reading_date: iso(d), value,
      performance_analysis:
        mi >= series.length - 2
          ? 'Trend consistent with the cluster plan. (Demo analysis.)'
          : null,
      created_by: me,
    });
  });
});
await upsert('kpi_readings', readings);
await upsert('kpi_action_plans', [
  { id: did(14, 1), kpi_id: did(12, 2), description: 'Pilot just-in-time vessel call optimization on the two busiest berths.', owner: 'Marine operations', due_date: dISO(40), status: 'open', created_by: me },
  { id: did(14, 2), kpi_id: did(12, 3), description: 'Onboard the top-20 forwarders to self-service clearance.', owner: 'Digital adoption team', due_date: dISO(60), status: 'open', created_by: me },
  { id: did(14, 3), kpi_id: did(12, 5), description: 'Switch harbor craft to B30 biofuel blend.', owner: 'Fleet engineering', due_date: dISO(-15), status: 'done', created_by: me },
]);

// ---------------------------------------------------------------------------
// 11. Cycles + submissions — previous month approved, current month a full mix
// ---------------------------------------------------------------------------
// UTC month bounds — the app's cycle lookups compare UTC-derived dates, and
// local Gulf time (UTC+4) would shift period_start into the previous month.
const monthStart = (off) =>
  new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + off, 1));
const monthEnd = (off) =>
  new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + off + 1, 0));
const cycleName = (off) =>
  monthStart(off).toLocaleString('en-US', { month: 'long', year: 'numeric' });
const prevCycle = did(16, 998);
const curCycle = did(16, 999);
await upsert('cycles', [
  { id: prevCycle, name: cycleName(-1), period_start: iso(monthStart(-1)), period_end: iso(monthEnd(-1)), status: 'closed' },
  { id: curCycle, name: cycleName(0), period_start: iso(monthStart(0)), period_end: iso(monthEnd(0)), status: 'open' },
]);
const sub = (n, proj, cycle, st, extra = {}) => ({
  id: did(16, n), project_id: P(proj), cycle_id: cycle, status: st,
  comment: 'Cycle submission. (Demo.)', created_by: me, updated_by: me,
  ...extra,
});
const submitted = (ago) => ({ submitted_by: me, submitted_at: tsDaysAgo(ago) });
await upsert('submissions', [
  // previous month: approved history
  sub(1, 1, prevCycle, 'approved', { ...submitted(34), validated_by: me, validated_at: tsDaysAgo(33), approved_by: me, approved_at: tsDaysAgo(32) }),
  sub(2, 2, prevCycle, 'approved', { ...submitted(35), validated_by: me, validated_at: tsDaysAgo(33), approved_by: me, approved_at: tsDaysAgo(31) }),
  sub(3, 4, prevCycle, 'approved', { ...submitted(33), validated_by: me, validated_at: tsDaysAgo(32), approved_by: me, approved_at: tsDaysAgo(30) }),
  // current month: every state represented
  sub(11, 1, curCycle, 'review', submitted(2)),
  sub(12, 2, curCycle, 'approved', { ...submitted(4), validated_by: me, validated_at: tsDaysAgo(3), approved_by: me, approved_at: tsDaysAgo(1) }),
  sub(13, 3, curCycle, 'validated', { ...submitted(3), validated_by: me, validated_at: tsDaysAgo(1) }),
  sub(14, 4, curCycle, 'returned', { ...submitted(5), returned_by: me, returned_at: tsDaysAgo(2), decision_comment: 'Please add wave-2 recovery detail.' }),
  sub(15, 5, curCycle, 'review', submitted(1)),
  sub(16, 6, curCycle, 'draft', {}),
  sub(17, 10, curCycle, 'rejected', { ...submitted(6), returned_by: me, returned_at: tsDaysAgo(4), decision_comment: 'Superseded by the revised loop plan.' }),
], 'project_id,cycle_id');

console.log('AD Ports Group demo data seeded.');
