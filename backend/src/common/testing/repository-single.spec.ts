import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * A STATIC guard, not a behavioural test (REFACTOR-PLAN v2, B4).
 *
 * `.single()` makes PostgREST treat "no rows" as error PGRST116, which falls
 * through `toHttpException`'s default branch and surfaces as a 500. On a
 * project-scoped `update` that is reachable with an ordinary well-formed UUID
 * belonging to someone else's project, and it shipped in nine modules before
 * anyone noticed.
 *
 * The invariant is "a foreign id cannot produce a 500". Two designs used to
 * satisfy it — repository-returns-null, or a service pre-check — so this guard
 * originally allowed either. On 2026-08-19 the two pre-check modules moved to
 * `maybeSingle()` as well, because the pre-check design still raced: delete the
 * row between the check and the write and the `.single()` underneath 500s
 * anyway. With one design left, the guard is a flat rule again, which is both
 * stricter and far less brittle than parsing services to find out which design
 * a module chose.
 *
 * The conformance suite cannot catch this: it mocks the repository, so it
 * verifies the service's half and not this one. Asserting on source text is
 * unusual and a little brittle (rename the method and this stops looking), but
 * it targets the exact shape that caused the defect and needs no database.
 */
describe('repository guard: a foreign id must not be able to 500', () => {
  const modulesDir = join(__dirname, '..', '..', 'modules');

  const read = (path: string): string | null => {
    try {
      return readFileSync(path, 'utf8');
    } catch {
      return null;
    }
  };

  const modules = readdirSync(modulesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((name) => name.name)
    .map((module) => ({
      module,
      repository: read(join(modulesDir, module, `${module}.repository.ts`)),
    }))
    .filter((m) => m.repository !== null);

  /** The body of an `async update(projectId, …)`, or null if there isn't one. */
  const projectScopedUpdate = (source: string): string | null =>
    /async update\(\s*\n?\s*projectId[\s\S]*?\n {2}\}/.exec(source)?.[0] ??
    null;

  it('found modules to check', () => {
    expect(modules.length).toBeGreaterThan(5);
  });

  for (const { module, repository } of modules) {
    const repoUpdate = projectScopedUpdate(repository!);
    if (!repoUpdate) continue;

    it(`${module}: update() reports a missing row as null, not PGRST116`, () => {
      const usesSingle =
        repoUpdate.includes('.single()') &&
        !repoUpdate.includes('.maybeSingle');

      expect(usesSingle).toBe(false);
    });
  }
});
