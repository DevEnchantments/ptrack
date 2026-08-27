import { validateChartSpec } from './assistant.chart';

describe('validateChartSpec', () => {
  it('accepts a grouped bar chart and trims labels', () => {
    const spec = validateChartSpec({
      type: 'bar',
      title: ' Budget vs spent ',
      unit: 'AED',
      categories: ['A', 'B'],
      series: [
        { name: 'Approved', values: [100, 200] },
        { name: 'Utilized', values: [50, 75] },
      ],
    });
    expect(spec).toEqual({
      type: 'bar',
      title: 'Budget vs spent',
      unit: 'AED',
      categories: ['A', 'B'],
      series: [
        { name: 'Approved', values: [100, 200] },
        { name: 'Utilized', values: [50, 75] },
      ],
    });
  });

  it('rejects series whose length does not match the categories', () => {
    expect(() =>
      validateChartSpec({
        type: 'line',
        title: 't',
        categories: ['Jan', 'Feb', 'Mar'],
        series: [{ name: 's', values: [1, 2] }],
      }),
    ).toThrow(/exactly 3 numbers/);
  });

  it('rejects non-numeric values', () => {
    expect(() =>
      validateChartSpec({
        type: 'bar',
        title: 't',
        categories: ['A'],
        series: [{ name: 's', values: ['12'] }],
      }),
    ).toThrow(/finite numbers/);
  });

  it('caps the number of categories', () => {
    expect(() =>
      validateChartSpec({
        type: 'bar',
        title: 't',
        categories: Array.from({ length: 13 }, (_, i) => `c${i}`),
        series: [{ name: 's', values: Array(13).fill(1) }],
      }),
    ).toThrow(/Too many categories/);
  });

  it('accepts a donut and rejects negative slices', () => {
    expect(
      validateChartSpec({
        type: 'donut',
        title: 't',
        slices: [{ label: 'x', value: 1 }],
      }),
    ).toMatchObject({ type: 'donut', slices: [{ label: 'x', value: 1 }] });
    expect(() =>
      validateChartSpec({
        type: 'donut',
        title: 't',
        slices: [{ label: 'x', value: -1 }],
      }),
    ).toThrow(/non-negative/);
  });

  it('validates timeline dates and ordering', () => {
    expect(
      validateChartSpec({
        type: 'timeline',
        title: 't',
        items: [
          { label: 'm', start: '2026-01-01', end: '2026-02-01', progress: 40 },
        ],
      }),
    ).toMatchObject({ type: 'timeline' });
    expect(() =>
      validateChartSpec({
        type: 'timeline',
        title: 't',
        items: [{ label: 'm', start: '2026-03-01', end: '2026-02-01' }],
      }),
    ).toThrow(/not be after end/);
    expect(() =>
      validateChartSpec({
        type: 'timeline',
        title: 't',
        items: [{ label: 'm', start: '01/03/2026', end: '2026-02-01' }],
      }),
    ).toThrow(/YYYY-MM-DD/);
  });

  it('rejects unknown types and missing titles', () => {
    expect(() => validateChartSpec({ type: 'radar', title: 't' })).toThrow(
      /type must be one of/,
    );
    expect(() => validateChartSpec({ type: 'bar' })).toThrow(/title/);
  });
});
