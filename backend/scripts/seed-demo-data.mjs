/**
 * Demo-data seeder. Populates the site with a realistic health-sector
 * portfolio: 8 projects with milestones under outcomes, action items, issues,
 * risks, links, resources, updates, status reports, members, plus 5 entity
 * KPIs and current-cycle submissions.
 *
 * Idempotent: every demo row has a deterministic id under the
 * `dd000000-0000-4000-a000-…` prefix and is upserted, so re-runs never
 * duplicate. Real records are never touched.
 *
 *   node scripts/seed-demo-data.mjs          # seed (or refresh) demo data
 *   node scripts/seed-demo-data.mjs --wipe   # remove every demo row
 *
 * Uses the service-role key from backend/.env (same as the API). Person FK
 * fields can only point at real users (profiles references auth.users), so
 * Owner/PM default to the first profile; extra people are pending members.
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

/** Deterministic demo id: entity block (see ranges below) + index. */
const did = (block, n) =>
  `dd000000-0000-4000-a000-${String(block * 1000 + n).padStart(12, '0')}`;
// Blocks: 1 projects · 2 outcomes · 3 milestones · 4 action items · 5 issues
// 6 risks · 7 links · 8 resources · 9 updates · 10 status reports
// 11 members · 12 kpis · 13 readings · 14 plans · 15 categories/sectors/
// programs · 16 submissions · 18 action-item owners

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

async function upsert(table, rows, onConflict = 'id') {
  if (rows.length === 0) return;
  const { error } = await db.from(table).upsert(rows, { onConflict });
  if (error) {
    console.error(`FAILED ${table}: ${error.message}`);
    process.exit(1);
  }
  console.log(`  ${table}: ${rows.length} rows`);
}

async function fetchAll(table, columns = 'id, name') {
  const { data, error } = await db.from(table).select(columns);
  if (error) {
    console.error(`FAILED reading ${table}: ${error.message}`);
    process.exit(1);
  }
  return data ?? [];
}

const byName = (rows, name) =>
  rows.find((r) => r.name?.toLowerCase() === name.toLowerCase())?.id ?? null;
const pick = (rows, i) => (rows.length ? rows[i % rows.length].id : null);

// ---------------------------------------------------------------------------
// Wipe
// ---------------------------------------------------------------------------
const PROJECT_IDS = Array.from({ length: 8 }, (_, i) => did(1, i + 1));
const KPI_IDS = Array.from({ length: 5 }, (_, i) => did(12, i + 1));
const LOOKUP_IDS = Array.from({ length: 9 }, (_, i) => did(15, i + 1));

if (process.argv.includes('--wipe')) {
  console.log('Wiping demo data…');
  // Projects cascade members/outcomes/milestones/action items/issues/risks/
  // links/resources/updates/status reports/submissions; KPIs cascade
  // readings/plans. Demo lookups (categories/sectors/programs) go last —
  // project FKs to them are set-null, and if a real project adopted one the
  // delete fails FK, so those are best-effort.
  for (const [table, ids] of [
    ['projects', PROJECT_IDS],
    ['kpis', KPI_IDS],
    ['project_categories', LOOKUP_IDS],
    ['sectors', LOOKUP_IDS],
    ['strategic_programs', LOOKUP_IDS],
  ]) {
    const { error } = await db.from(table).delete().in('id', ids);
    console.log(`  ${table}: ${error ? 'left in place (' + error.message + ')' : 'wiped'}`);
  }
  console.log('Done. (The current reporting cycle row is real and stays.)');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
console.log('Seeding demo data…');

const profiles = await fetchAll('profiles', 'id, full_name, email');
if (profiles.length === 0) {
  console.error('No profiles exist — log in once so your profile row exists.');
  process.exit(1);
}
const me = profiles[0].id;

const statuses = await fetchAll('project_statuses');
const sizes = await fetchAll('project_sizes');
const tiers = await fetchAll('tiers');
const objectives = await fetchAll('strategic_objectives');
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
};
const objective1 = pick(objectives, 0);

// Demo lookups (block 15): categories 1-3, sectors 4-6, programs 7-8.
await upsert('project_categories', [
  { id: did(15, 1), name: 'Digital Transformation' },
  { id: did(15, 2), name: 'Public Health' },
  { id: did(15, 3), name: 'Infrastructure' },
]);
await upsert('sectors', [
  { id: did(15, 4), name: 'Health Services', sort_order: 1 },
  { id: did(15, 5), name: 'Population Health', sort_order: 2 },
  { id: did(15, 6), name: 'Corporate Services', sort_order: 3 },
]);
await upsert('strategic_programs', [
  { id: did(15, 7), name: 'Early Detection Program', objective_id: objective1, sort_order: 1 },
  { id: did(15, 8), name: 'Digital Care Program', objective_id: objective1, sort_order: 2 },
]);

// --- Projects (block 1) ----------------------------------------------------
// P1-P3 carry weights summing 100 (formula + submission gate light up).
const P = (i) => did(1, i);
const projects = [
  {
    id: P(1), name: 'National Screening Program Expansion',
    description: 'Extend early-detection screening coverage to three new regions with mobile units and community clinics.',
    goal: 'Raise screening coverage from 42% to 65% of the target population.',
    status_id: status.inProgress, start: -180, end: 120, category: 2, sector: 5,
    tier: 0, priority: true, budget: [1200000, 540000], progress: null,
    stakeholders: ['Ministry of Health', 'Regional Health Authorities'],
    manager: me, pmo: me, sponsor: 'Deputy Minister of Preventive Health',
  },
  {
    id: P(2), name: 'Digital Health Records Rollout',
    description: 'Unified electronic health record across all primary-care centers, replacing three legacy systems.',
    goal: 'All primary-care centers on the unified record by Q2 2027.',
    status_id: status.inProgress, start: -120, end: 300, category: 1, sector: 4,
    tier: 0, priority: true, budget: [3500000, 980000], progress: null,
    stakeholders: ['National Digital Office', 'Primary Care Network'],
    manager: me, pmo: me, sponsor: 'Chief Information Officer',
  },
  {
    id: P(3), name: 'Telemedicine Platform Phase 2',
    description: 'Add remote diagnostics, e-prescriptions, and specialist referral flows to the telemedicine platform.',
    goal: 'Cut average specialist wait time from 31 to 10 days.',
    status_id: status.inProgress, start: -90, end: 90, category: 1, sector: 4,
    tier: 1, priority: false, budget: [850000, 610000], progress: null,
    stakeholders: ['Specialist Council'], manager: me, pmo: null,
    sponsor: 'Director of Digital Care',
  },
  {
    id: P(4), name: 'Community Wellness Campaign',
    description: 'Year-long public campaign on nutrition, activity, and smoking cessation across schools and workplaces.',
    goal: 'Reach 500k residents; 15% enrollment in cessation programs.',
    status_id: status.inProgress, start: -60, end: 210, category: 2, sector: 5,
    tier: 2, priority: false, budget: [400000, 95000], progress: 24,
    stakeholders: ['Education Directorate', 'Chamber of Commerce'],
    manager: null, pmo: me, sponsor: 'Public Health Spokesperson',
  },
  {
    id: P(5), name: 'Hospital Capacity Optimization',
    description: 'Bed-management analytics and discharge-process redesign in the two largest hospitals.',
    goal: 'Reduce average length of stay by 1.2 days.',
    status_id: status.onHold, start: -150, end: 60, category: 3, sector: 4,
    tier: 1, priority: false, budget: [600000, 320000], progress: 45,
    stakeholders: ['Hospital Directors Board'], manager: me, pmo: null,
    sponsor: 'Operations Executive',
  },
  {
    id: P(6), name: 'Health Workforce Training Academy',
    description: 'Standing academy for nursing and allied-health upskilling, with accreditation pathways.',
    goal: '1,200 certified graduates in the first year.',
    status_id: status.completed, start: -400, end: -30, actualEnd: -21,
    category: 3, sector: 6, tier: 1, priority: false,
    budget: [950000, 902000], progress: 100,
    stakeholders: ['Nursing Association'], manager: me, pmo: me,
    sponsor: 'HR Executive Director',
  },
  {
    id: P(7), name: 'Chronic Disease Registry',
    description: 'Single registry for diabetes and hypertension cohorts, feeding care-gap dashboards.',
    goal: 'Registry covering 90% of diagnosed patients.',
    status_id: status.completed, start: -320, end: -60, actualEnd: -75,
    category: 1, sector: 5, tier: 2, priority: false,
    budget: [300000, 264000], progress: 100,
    stakeholders: ['Endocrine Society'], manager: null, pmo: null,
    sponsor: 'Clinical Excellence Lead',
  },
  {
    id: P(8), name: 'Preventive Care Outreach Vans',
    description: 'Procure and staff six mobile clinics for rural preventive-care visits.',
    goal: 'Quarterly visit coverage for all settlements above 500 residents.',
    status_id: status.notStarted, start: 30, end: 365, category: 2, sector: 5,
    tier: 2, priority: false, budget: [720000, 0], progress: 0,
    stakeholders: ['Rural Affairs Office'], manager: me, pmo: null,
    sponsor: 'Regional Programs Director',
  },
];

await upsert('projects', projects.map((p, i) => ({
  id: p.id, name: p.name, description: p.description, goal: p.goal,
  owner_id: me, project_manager_id: p.manager, pmo_partner_id: p.pmo,
  sponsor: p.sponsor, status_id: p.status_id, size_id: pick(sizes, i),
  category_id: did(15, p.category), sector_id: did(15, p.sector),
  tier_id: pick(tiers, p.tier), strategic_objective_id: objective1,
  strategic_program_id: did(15, 7 + (i % 2)),
  start_date: dISO(p.start), target_end_date: dISO(p.end),
  actual_end_date: p.actualEnd != null ? dISO(p.actualEnd) : null,
  plan_year: 2026, project_number: `PRJ-26-${String(i + 1).padStart(3, '0')}`,
  reference_id: `REF-${1040 + i}`, finance_code: `FIN-${7300 + i}`,
  target_group: 'Residents of covered regions',
  is_priority: p.priority, at_risk: i === 4,
  approved_budget: p.budget[0], utilized_budget: p.budget[1],
  internal_stakeholder: 'PMO Office',
  external_stakeholders: p.stakeholders,
  manual_progress: p.progress, customer: 'Ministry of Health',
  tags: ['demo'], access_control: 'open',
  created_by: me, updated_by: me, created_at: tsDaysAgo(180 - i * 3),
})));

// --- Members (block 11): you + pending names per project -------------------
const PENDING = [
  'Sara Al-Harbi', 'Omar Khalid', 'Lena Haddad', 'Yousef Nasser',
  'Maryam Qasim', 'Tariq Aziz', 'Nora Salem', 'Hassan Radi',
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
    members.push({
      id: did(11, i * 10 + 2 + k), project_id: p.id, user_id: null,
      pending_name: PENDING[(i + k * 3) % PENDING.length],
      role_id: byName(roles, 'Team Member') ?? pick(roles, 1 + k),
      involvement_level_id: pick(involvement, k),
      access_level: 'read_write', status: 'pending', created_by: me,
    });
  }
});
await upsert('project_members', members);

// --- Outcomes (block 2) + milestones (block 3) -----------------------------
const outcomes = [];
const milestones = [];
let msN = 0;
// Per project: [outcome name, milestones: [name, weight, dueOffset, done?, major?]]
const MS_PLANS = [
  [['Regional readiness', [['Site surveys complete', 15, -120, true], ['Mobile units procured', 25, -45, true, true], ['Staff hired & trained', 20, -10, true]]],
   ['Screening live', [['Region A go-live', 20, 20, false, true], ['Region B go-live', 10, 60, false], ['Coverage report published', 10, 110, false]]]],
  [['Foundation', [['Vendor contract signed', 20, -90, true, true], ['Data model unified', 20, -30, true], ['Pilot clinic migrated', 25, 15, false, true]]],
   ['Scale-out', [['Wave 1 (20 centers)', 20, 120, false], ['Wave 2 (all centers)', 15, 280, false]]]],
  [['Clinical features', [['e-Prescription module', 30, -25, true, true], ['Remote diagnostics beta', 40, 30, false], ['Referral flow live', 30, 85, false]]]],
  [['Campaign', [['Creative assets approved', null, -20, true], ['School program launched', null, 25, false, true], ['Workplace program launched', null, 70, false], ['Mid-campaign survey', null, 130, false]]]],
  [['Optimization', [['Analytics dashboard deployed', null, -60, true], ['Discharge redesign pilot', null, -5, false, true], ['Rollout decision', null, 55, false]]]],
  [['Academy', [['Curriculum accredited', null, -300, true, true], ['First cohort enrolled', null, -200, true], ['Graduation ceremony', null, -30, true, true]]]],
  [['Registry', [['Cohort definitions agreed', null, -280, true], ['Data feeds live', null, -150, true, true], ['Care-gap dashboard', null, -80, true]]]],
  [['Procurement', [['Specifications finalized', null, 45, false], ['Tender awarded', null, 120, false, true], ['First van delivered', null, 220, false]]]],
];
MS_PLANS.forEach((plan, pi) => {
  plan.forEach(([oname, items], oi) => {
    const oid = did(2, pi * 10 + oi + 1);
    outcomes.push({
      id: oid, project_id: P(pi + 1), name: oname, sort_order: oi + 1,
      start_date: dISO(projects[pi].start), end_date: dISO(projects[pi].end),
      created_by: me, updated_by: me,
    });
    items.forEach(([name, weight, due, done, major]) => {
      msN += 1;
      milestones.push({
        id: did(3, msN), project_id: P(pi + 1), outcome_id: oid, name,
        weightage: weight, due_date: dISO(due),
        start_date: dISO(due - 30), is_major: Boolean(major),
        status: done ? 'closed_completed' : 'open',
        percent_complete: done ? 100 : due < 0 ? 60 : due < 60 ? 30 : 0,
        completed_date: done ? dISO(due - 3) : null,
        owner_id: me, created_by: me, updated_by: me,
      });
    });
  });
});
await upsert('program_outcomes', outcomes);
await upsert('milestones', milestones);

// --- Action items (block 4) + owners (block 18) ----------------------------
const AI_TITLES = [
  ['Confirm cold-chain logistics for mobile units', -8, 'open'],
  ['Approve region B staffing plan', 4, 'open'],
  ['Close out survey findings', -40, 'closed_completed'],
  ['Draft data-retention policy', 2, 'open'],
  ['Review vendor SLA penalties', 12, 'open'],
  ['Legacy system decommission checklist', -20, 'closed_completed'],
  ['Recruit tele-dermatology specialists', 6, 'open'],
  ['Load-test video infrastructure', -15, 'closed_completed'],
  ['Book school visits for September', 3, 'open'],
  ['Print campaign materials', -25, 'closed_completed'],
  ['Validate bed-occupancy data feed', -5, 'open'],
  ['Schedule discharge-team workshops', 9, 'open'],
  ['Archive academy course materials', -35, 'closed_completed'],
  ['Publish registry data dictionary', -90, 'closed_completed'],
  ['Prepare van tender documents', 18, 'open'],
  ['Shortlist van suppliers', 40, 'open'],
];
const actionItems = AI_TITLES.map(([title, due, st], i) => ({
  id: did(4, i + 1), project_id: P((i % 8) + 1), title,
  description: 'Demo action item seeded for portfolio review.',
  type_id: pick(aiTypes, i), due_date: dISO(due), status: st,
  owner_id: me, created_by: me, updated_by: me,
  created_at: tsDaysAgo(Math.max(5, Math.abs(due) + 10)),
}));
await upsert('action_items', actionItems);
await upsert('action_item_owners', actionItems.map((a, i) => ({
  id: did(18, i + 1), action_item_id: a.id, user_id: me, slot: 1,
})));

// --- Issues (block 5) ------------------------------------------------------
const ISSUES = [
  ['Mobile unit delivery delayed by customs', 1, 'open', 'Escalate through the logistics broker; weekly follow-up.'],
  ['Region A clinic staffing gap', 1, 'in_progress', 'Temporary rotation from central clinics approved.'],
  ['Legacy system export missing lab codes', 2, 'open', 'Vendor patch requested; manual mapping in the interim.'],
  ['Clinic Wi-Fi below platform requirements', 3, 'resolved', 'Routers upgraded during the pilot.'],
  ['Campaign printer over budget', 4, 'resolved', 'Re-tendered; alternate supplier selected.'],
  ['Discharge data quality inconsistent', 5, 'open', 'Data stewards assigned per ward.'],
  ['Registry duplicate patient records', 7, 'closed', 'Deduplication run completed.'],
];
await upsert('issues', ISSUES.map(([title, proj, st, rec], i) => ({
  id: did(5, i + 1), project_id: P(proj), title,
  description: 'Demo issue seeded for portfolio review.',
  recommendation: rec, reported_by: PENDING[i % PENDING.length],
  category_id: pick(issueCats, i), level_id: pick(issueLevels, i),
  status: st, date_closed: st === 'closed' || st === 'resolved' ? dISO(-10 - i) : null,
  reference_identifier: `ISS-${2600 + i}`,
  created_by: me, updated_by: me, created_at: tsDaysAgo(30 + i * 4),
})));

// --- Risks (block 6) -------------------------------------------------------
const probOf = (n) => byName(riskProb, n) ?? pick(riskProb, 0);
const impactOf = (n) => byName(riskImpact, n) ?? pick(riskImpact, 0);
const RISKS = [
  ['Screening demand exceeds clinic capacity', 1, 'High', 'High', 'Pre-booked appointment quotas per region.'],
  ['Community hesitancy lowers turnout', 1, 'Medium', 'High', 'Local-leader engagement plan before each launch.'],
  ['Data migration corrupts historical records', 2, 'Medium', 'High', 'Dual-run with checksum audits for 60 days.'],
  ['Key vendor engineer attrition', 2, 'Medium', 'Medium', 'Knowledge-transfer clause enforced quarterly.'],
  ['Bandwidth costs exceed forecast', 3, 'High', 'Medium', 'Renegotiate telecom bundle at 6-month mark.'],
  ['Campaign message fatigue', 4, 'Medium', 'Low', 'Rotate creative sets every six weeks.'],
  ['Hold extends past funding window', 5, 'High', 'High', 'Monthly steering check-in; re-baseline plan ready.'],
  ['Van maintenance capacity unclear', 8, 'Low', 'Medium', 'Include maintenance contract in the tender.'],
];
await upsert('risks', RISKS.map(([statement, proj, prob, imp, plan], i) => ({
  id: did(6, i + 1), project_id: P(proj), statement,
  identified_by: PENDING[(i + 2) % PENDING.length], date_identified: dISO(-60 + i * 5),
  source_id: pick(riskSources, i), category_id: pick(riskCats, i),
  probability_id: probOf(prob), impact_id: impactOf(imp),
  response_id: pick(riskResponses, i), response_plan: plan,
  owner_id: me, status: i === 5 ? 'closed' : 'open',
  type: i === 6 ? 'issue' : 'risk',
  created_by: me, updated_by: me,
})));

// --- Links (block 7) + resources (block 8) ---------------------------------
const links = [];
const resources = [];
projects.forEach((p, i) => {
  links.push({
    id: did(7, i * 2 + 1), project_id: p.id, label: 'Project charter',
    url: 'https://example.org/charter', is_gold: i < 2,
    created_by: me, updated_by: me,
  });
  links.push({
    id: did(7, i * 2 + 2), project_id: p.id, label: 'Steering minutes',
    url: 'https://example.org/minutes', is_gold: false,
    created_by: me, updated_by: me,
  });
  resources.push({
    id: did(8, i + 1), project_id: p.id,
    name: `${PENDING[i]} (contractor)`, type_id: pick(resourceTypes, i),
    description: 'Demo resource seeded for portfolio review.',
    created_by: me, updated_by: me,
  });
});
await upsert('links', links);
await upsert('resources', resources);

// --- Updates (block 9): staggered over the past 8 weeks --------------------
const HEADLINES = [
  'Weekly checkpoint held', 'Steering committee update', 'Milestone review',
  'Risk review completed', 'Budget checkpoint', 'Stakeholder briefing',
];
const updates = [];
let upN = 0;
projects.forEach((p, i) => {
  const count = [6, 7, 4, 5, 3, 2, 2, 3][i];
  for (let k = 0; k < count; k++) {
    upN += 1;
    updates.push({
      id: did(9, upN), project_id: p.id,
      headline: HEADLINES[(i + k) % HEADLINES.length],
      body: 'Progress on track against the current plan; details in the linked minutes. (Demo update.)',
      type_id: pick(updateTypes, k), author_id: me,
      is_gold: k === 0 && i < 3,
      created_by: me, updated_by: me,
      created_at: tsDaysAgo(k * 8 + (i % 5), 9 + (k % 6)),
    });
  }
});
await upsert('updates', updates);

// --- Status reports (block 10) ---------------------------------------------
const reports = [];
projects.slice(0, 5).forEach((p, i) => {
  reports.push({
    id: did(10, i * 2 + 1), project_id: p.id,
    title: 'Monthly status report — July 2026',
    summary: 'Delivery broadly on plan; one supply risk under active mitigation. (Demo report.)',
    report_date: dISO(-20), author_id: me, created_by: me, updated_by: me,
  });
  reports.push({
    id: did(10, i * 2 + 2), project_id: p.id,
    title: 'Monthly status report — June 2026',
    summary: 'Baseline confirmed; procurement started. (Demo report.)',
    report_date: dISO(-50), author_id: me, created_by: me, updated_by: me,
  });
});
await upsert('status_reports', reports);

// --- KPIs (block 12) + readings (13) + plans (14) --------------------------
const KPIS = [
  ['Screening coverage rate', '%', 'higher_is_better', 42, 65, 1, [43.2, 45.1, 47.8, 49.5, 52.3, 54.1], true],
  ['Average specialist wait time', 'days', 'lower_is_better', 31, 10, 0, [31, 29, 27, 26, 24, 22], true],
  ['EHR adoption rate', '%', 'higher_is_better', 0, 100, 0, [4, 9, 15, 22, 28, 34], false],
  ['Patient satisfaction index', 'pts', 'higher_is_better', 71, 85, 1, [71.5, 72.0, 71.2, 73.4, 74.8, 74.1], false],
  ['Average length of stay', 'days', 'lower_is_better', 6.8, 5.6, 1, [6.8, 6.7, 6.9, 6.6, 6.6, 6.5], false],
];
await upsert('kpis', KPIS.map(([name, unit, polarity, baseline, target, dp, , priority], i) => ({
  id: did(12, i + 1), name, unit, polarity, baseline, target,
  decimal_places: dp, frequency: 'monthly', is_priority: priority,
  pillar: 'Community Health', entity: 'Ministry of Health',
  description: 'Demo KPI seeded for portfolio review.',
  data_source: 'Monthly operations extract',
  calculation_method: 'Described in the KPI charter; computation awaits formula sign-off.',
  tier_id: pick(tiers, i), objective_id: objective1, owner_id: me,
  created_by: me, updated_by: me,
})));
const readings = [];
KPIS.forEach(([, , , , , , series], ki) => {
  series.forEach((value, mi) => {
    const d = new Date(TODAY);
    d.setMonth(d.getMonth() - (series.length - 1 - mi), 28);
    readings.push({
      id: did(13, ki * 10 + mi + 1), kpi_id: did(12, ki + 1),
      reading_date: iso(d), value,
      performance_analysis: mi === series.length - 1 ? 'Latest cycle; trend consistent with plan. (Demo.)' : null,
      created_by: me,
    });
  });
});
await upsert('kpi_readings', readings);
await upsert('kpi_action_plans', [
  { id: did(14, 1), kpi_id: did(12, 1), description: 'Extend screening vans to the western region.', owner: 'Outreach team lead', due_date: dISO(55), status: 'open', created_by: me },
  { id: did(14, 2), kpi_id: did(12, 2), description: 'Open Saturday specialist slots at two hospitals.', owner: 'Scheduling office', due_date: dISO(25), status: 'open', created_by: me },
  { id: did(14, 3), kpi_id: did(12, 4), description: 'Roll out post-visit SMS survey v2.', owner: 'Experience team', due_date: dISO(-10), status: 'done', created_by: me },
]);

// --- Current cycle + submissions (block 16) --------------------------------
const monthStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
const monthEnd = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0);
const existing = await db
  .from('cycles')
  .select('id')
  .eq('period_start', iso(monthStart))
  .maybeSingle();
let cycleId = existing.data?.id;
if (!cycleId) {
  cycleId = did(16, 999);
  await upsert('cycles', [{
    id: cycleId,
    name: TODAY.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    period_start: iso(monthStart), period_end: iso(monthEnd), status: 'open',
  }]);
}
await upsert('submissions', [
  { id: did(16, 1), project_id: P(1), cycle_id: cycleId, status: 'review', comment: 'August cycle submission. (Demo.)', submitted_by: me, submitted_at: tsDaysAgo(2), created_by: me, updated_by: me },
  { id: did(16, 2), project_id: P(2), cycle_id: cycleId, status: 'approved', comment: 'August cycle submission. (Demo.)', submitted_by: me, submitted_at: tsDaysAgo(3), validated_by: me, validated_at: tsDaysAgo(2), approved_by: me, approved_at: tsDaysAgo(1), created_by: me, updated_by: me },
  { id: did(16, 3), project_id: P(3), cycle_id: cycleId, status: 'draft', created_by: me, updated_by: me },
], 'project_id,cycle_id');

console.log('Demo data seeded.');
