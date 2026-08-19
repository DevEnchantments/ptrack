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
 * The invariant is "a foreign id cannot produce a 500", and two designs satisfy
 * it: the repository returns null via `maybeSingle()` and the service raises
 * 404, or the service pre-checks with `get()` before writing. This asserts the
 * invariant, so either is allowed and neither is mandated — a module with
 * *neither* fails.
 *
 * The conformance suite cannot catch this: it mocks the repository, so it
 * verifies the service's half and not this one. Asserting on source text is
 * unusual and a little brittle (rename the methods and this stops looking), but
 * it targets the exact shape that caused the defect and needs no database.
 *
 * Known residue: the pre-check design still has a race. If the row is deleted
 * between the check and the write, the `.single()` underneath still 500s.
 * Narrow enough to accept, wide enough to write down.
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
      service: read(join(modulesDir, module, `${module}.service.ts`)),
    }))
    .filter((m) => m.repository !== null && m.service !== null);

  /** The body of an `async update(projectId, …)`, or null if there isn't one. */
  const projectScopedUpdate = (source: string): string | null =>
    /async update\(\s*\n?\s*projectId[\s\S]*?\n {2}\}/.exec(source)?.[0] ??
    null;

  it('found modules to check', () => {
    expect(modules.length).toBeGreaterThan(5);
  });

  for (const { module, repository, service } of modules) {
    const repoUpdate = projectScopedUpdate(repository!);
    if (!repoUpdate) continue;

    it(`${module}: a missing row cannot reach toHttpException's default branch`, () => {
      const usesSingle =
        repoUpdate.includes('.single()') &&
        !repoUpdate.includes('.maybeSingle');
      if (!usesSingle) return; // repository reports "not found" as null

      // Otherwise the service must have checked before writing.
      const serviceUpdate = projectScopedUpdate(service!) ?? '';
      const preChecks =
        serviceUpdate.includes('this.get(') ||
        serviceUpdate.includes('findOne(');

      expect(usesSingle && !preChecks).toBe(false);
    });
  }
});
