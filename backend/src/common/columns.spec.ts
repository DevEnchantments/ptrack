import { columnsFrom } from './columns';

/**
 * Shared write-path infrastructure (REFACTOR-PLAN 1c), so it is pinned
 * directly rather than only through its three callers. The `??` vs `||`
 * distinction is the one that silently corrupts data if it ever slips.
 */
describe('columnsFrom', () => {
  it('includes only the keys the DTO actually sent', () => {
    expect(
      columnsFrom({ a: 'x' }, { trimmed: ['a'], asIs: ['b', 'c'] }),
    ).toEqual({ a: 'x' });
  });

  it('treats an explicit null as sent, but undefined as absent', () => {
    expect(
      columnsFrom({ a: null, b: undefined }, { nullable: ['a', 'b'] }),
    ).toEqual({ a: null });
  });

  it('trims required text without ever nulling it', () => {
    expect(
      columnsFrom({ a: '  x  ', b: '   ' }, { trimmed: ['a', 'b'] }),
    ).toEqual({ a: 'x', b: '' });
  });

  it('collapses blank optional text to null', () => {
    expect(
      columnsFrom(
        { a: '  x  ', b: '   ', c: null },
        { trimmedOrNull: ['a', 'b', 'c'] },
      ),
    ).toEqual({ a: 'x', b: null, c: null });
  });

  it('keeps a numeric zero on nullable columns', () => {
    // `?? null` not `|| null` — 0% progress and a 0 budget are real values.
    expect(columnsFrom({ a: 0, b: null }, { nullable: ['a', 'b'] })).toEqual({
      a: 0,
      b: null,
    });
  });

  it('clears an empty date string but keeps a real one', () => {
    expect(
      columnsFrom({ a: '', b: '2026-08-31' }, { dateOrNull: ['a', 'b'] }),
    ).toEqual({ a: null, b: '2026-08-31' });
  });

  it('clears an empty array but keeps a populated one', () => {
    expect(
      columnsFrom(
        { a: [], b: ['x'], c: null },
        { arrayOrNull: ['a', 'b', 'c'] },
      ),
    ).toEqual({ a: null, b: ['x'], c: null });
  });

  it('passes booleans and enums through untouched, including false', () => {
    expect(
      columnsFrom({ a: false, b: 'restricted' }, { asIs: ['a', 'b'] }),
    ).toEqual({ a: false, b: 'restricted' });
  });
});
