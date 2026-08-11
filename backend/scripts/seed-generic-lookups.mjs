/**
 * Generic lookup values per the supervisor meeting of 2026-08-11 ("generic
 * stuff" for Sector / Type / Status / Tier / Objectives+Programs, all
 * admin-manageable afterwards via /admin/code-tables).
 *
 * Idempotent: inserts only names that don't already exist (case-insensitive);
 * never renames or deletes. The one mutation: project statuses outside the
 * standard five are DEACTIVATED (not deleted), so old records keep rendering
 * while pickers show the generic set.
 *
 *   node scripts/seed-generic-lookups.mjs
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

async function rows(table, columns = 'id, name, is_active, sort_order') {
  const { data, error } = await db.from(table).select(columns);
  if (error) {
    console.error(`FAILED reading ${table}: ${error.message}`);
    process.exit(1);
  }
  return data ?? [];
}

/** Insert any of `names` missing from `table` (case-insensitive). */
async function ensure(table, names, extra = {}) {
  const existing = await rows(table);
  const have = new Set(existing.map((r) => r.name.toLowerCase()));
  const maxSort = Math.max(0, ...existing.map((r) => r.sort_order ?? 0));
  const missing = names.filter((n) => !have.has(n.toLowerCase()));
  if (missing.length > 0) {
    const { error } = await db.from(table).insert(
      missing.map((name, i) => ({
        name,
        sort_order: maxSort + i + 1,
        ...extra,
      })),
    );
    if (error) {
      console.error(`FAILED ${table}: ${error.message}`);
      process.exit(1);
    }
  }
  console.log(`  ${table}: +${missing.length} (${existing.length} existed)`);
  return rows(table);
}

console.log('Seeding generic lookup values…');

await ensure('sectors', [
  'Community Health',
  'Communicable Diseases',
  'Health Services',
  'Population Health',
  'Corporate Services',
]);

await ensure('deal_types', [
  'Strategic',
  'Operational',
  'Improvement',
  'Compliance',
  'Research & Innovation',
]);

await ensure('tiers', ['Tier 1', 'Tier 2', 'Tier 3']);

const objectives = await ensure('strategic_objectives', [
  '1-Empowered Health Conscious Population',
  '2-Accessible and Integrated Care',
  '3-Sustainable Health System',
  '4-Digital Health Excellence',
]);
const objId = (prefix) =>
  objectives.find((o) => o.name.startsWith(prefix))?.id ?? null;

const PROGRAMS = [
  ['1-', 'Early Detection Program'],
  ['1-', 'Health Awareness Program'],
  ['2-', 'Care Access Program'],
  ['2-', 'Care Integration Program'],
  ['3-', 'Health System Efficiency Program'],
  ['3-', 'Workforce Sustainability Program'],
  ['4-', 'Digital Services Program'],
  ['4-', 'Data & Insights Program'],
];
{
  const existing = await rows('strategic_programs');
  const have = new Set(existing.map((r) => r.name.toLowerCase()));
  const missing = PROGRAMS.filter(([, name]) => !have.has(name.toLowerCase()));
  if (missing.length > 0) {
    const { error } = await db.from('strategic_programs').insert(
      missing.map(([prefix, name], i) => ({
        name,
        objective_id: objId(prefix),
        sort_order: existing.length + i + 1,
      })),
    );
    if (error) {
      console.error(`FAILED strategic_programs: ${error.message}`);
      process.exit(1);
    }
  }
  console.log(
    `  strategic_programs: +${missing.length} (${existing.length} existed)`,
  );
}

// Statuses: standard five active, everything else deactivated (not deleted).
const STANDARD = [
  'not started',
  'in progress',
  'on hold',
  'completed',
  'cancelled',
];
{
  const statuses = await rows('project_statuses');
  const toDeactivate = statuses.filter(
    (s) => s.is_active && !STANDARD.includes(s.name.toLowerCase()),
  );
  for (const s of toDeactivate) {
    const { error } = await db
      .from('project_statuses')
      .update({ is_active: false })
      .eq('id', s.id);
    if (error) {
      console.error(`FAILED deactivating status ${s.name}: ${error.message}`);
      process.exit(1);
    }
  }
  console.log(
    `  project_statuses: deactivated ${toDeactivate.length} non-standard (${
      toDeactivate.map((s) => s.name).join(', ') || 'none'
    })`,
  );
}

console.log('Generic lookups ready.');
