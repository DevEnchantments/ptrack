import { NotFoundException } from '@nestjs/common';

/**
 * The contract every project-scoped module implicitly claims, asserted in one
 * place (REFACTOR-PLAN v2, B4).
 *
 * The point is Liskov's, minus the inheritance: these services are not
 * subclasses of anything, but they all implement the same conceptual contract,
 * and a caller should be able to move between them without the rules changing.
 * They did not. `PATCH` with a foreign id returned 500 in nine modules and 404
 * in three, and `people.remove` silently no-opped where every sibling 404s.
 * Both were found by reading, module by module. This makes that class of drift
 * a failing test instead, including for the module added next month.
 *
 * KNOWN LIMIT, so nobody over-trusts a green run: these are service-level
 * tests over mocked repositories. They prove the service turns "row not found"
 * into a 404. They do NOT prove the repository reports "not found" rather than
 * throwing — that half lives behind the Supabase client and has no unit-level
 * safety net. `repository-single.spec.ts` guards the specific shape that
 * caused it, statically.
 */

type Mocks = Record<string, jest.Mock>;

export interface ProjectScopedContract<S, M extends Mocks> {
  /** A fresh service plus the repository mocks it was built with. */
  build: () => { service: S; mocks: M };
  /** Call `update` with any patch. */
  update: (service: S) => Promise<unknown>;
  /** Call `remove`. */
  remove: (service: S) => Promise<unknown>;
  /**
   * Make the mocks behave as if the id belongs to another project: whatever
   * this module reads to decide (its `update`, or a `findOne` pre-check)
   * should report nothing found.
   */
  foreignId: (mocks: M) => void;
  /**
   * The audit-log mock, or a documented reason this module has none. A reason
   * is required rather than optional so an opt-out reads as a deliberate
   * exception in the test output, not as silence.
   */
  audit: ((mocks: M) => jest.Mock) | { skip: string };
}

export function describeProjectScopedContract<S, M extends Mocks>(
  moduleName: string,
  contract: ProjectScopedContract<S, M>,
): void {
  describe(`${moduleName}: project-scoped contract`, () => {
    it('404s on update when the record is not in this project', async () => {
      const { service, mocks } = contract.build();
      contract.foreignId(mocks);

      await expect(contract.update(service)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('404s on remove when the record is not in this project', async () => {
      const { service, mocks } = contract.build();
      contract.foreignId(mocks);

      await expect(contract.remove(service)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    const audit = contract.audit;
    if (typeof audit !== 'function') {
      it.skip(`writes an audit row on remove — EXCEPTION: ${audit.skip}`, () => {
        // Intentionally empty: the skip reason is the assertion.
      });
      return;
    }

    it('writes no audit row when remove is rejected', async () => {
      const { service, mocks } = contract.build();
      contract.foreignId(mocks);

      await expect(contract.remove(service)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(audit(mocks)).not.toHaveBeenCalled();
    });

    it('writes exactly one audit row on a successful remove', async () => {
      const { service, mocks } = contract.build();

      await contract.remove(service);

      expect(audit(mocks)).toHaveBeenCalledTimes(1);
    });
  });
}
