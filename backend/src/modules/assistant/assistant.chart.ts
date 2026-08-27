/**
 * Chart specs the assistant may ask the UI to draw.
 *
 * `render_chart` is neither a read nor a write tool: it touches no data.
 * The model gathers figures with the read tools (under the user's own JWT)
 * and hands them here; the spec is validated and forwarded to the chat UI
 * as a `chart` SSE frame. Nothing in a spec can widen what the user sees.
 */

export const CHART_LIMITS = {
  categories: 12,
  series: 4,
  slices: 10,
  timelineItems: 40,
  label: 80,
  title: 120,
} as const;

export interface SeriesChart {
  type: 'bar' | 'stacked_bar' | 'line';
  title: string;
  unit?: string;
  categories: string[];
  series: { name: string; values: number[] }[];
}

export interface DonutChart {
  type: 'donut';
  title: string;
  unit?: string;
  slices: { label: string; value: number }[];
}

export interface TimelineChart {
  type: 'timeline';
  title: string;
  items: { label: string; start: string; end: string; progress?: number }[];
}

export type ChartSpec = SeriesChart | DonutChart | TimelineChart;

/** JSON Schema handed to the model. Shape is enforced by validateChartSpec. */
export const CHART_TOOL = {
  name: 'render_chart',
  description:
    'Draw a chart in the chat from figures you already obtained with the ' +
    'read tools. Use it whenever the user compares quantities across ' +
    'projects or over time, or asks for a chart, dashboard or timeline. ' +
    'Pass raw numeric values (never scaled or rounded) and put the unit in ' +
    '`unit` (e.g. "AED", "%", "milestones"). Use the exact record names ' +
    'the tools returned as categories, slice labels and item labels (never ' +
    'abbreviate them; the UI truncates long labels itself). Types: bar / stacked_bar / ' +
    'line need `categories` + `series`; donut needs `slices`; timeline ' +
    'needs `items` with ISO dates. Call it once, then summarize the key ' +
    'finding in one or two sentences.',
  input_schema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['bar', 'stacked_bar', 'line', 'donut', 'timeline'],
      },
      title: { type: 'string', description: 'Short chart title.' },
      unit: {
        type: 'string',
        description: 'Unit of the values, shown on the axis and tooltips.',
      },
      categories: {
        type: 'array',
        items: { type: 'string' },
        description: 'X-axis labels for bar/stacked_bar/line (max 12).',
      },
      series: {
        type: 'array',
        description:
          'One entry per series (max 4); values align to categories.',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            values: { type: 'array', items: { type: 'number' } },
          },
          required: ['name', 'values'],
        },
      },
      slices: {
        type: 'array',
        description: 'Donut slices (max 10).',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            value: { type: 'number' },
          },
          required: ['label', 'value'],
        },
      },
      items: {
        type: 'array',
        description: 'Timeline bars (max 40), dates as YYYY-MM-DD.',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            start: { type: 'string' },
            end: { type: 'string' },
            progress: { type: 'number', description: '0-100, optional.' },
          },
          required: ['label', 'start', 'end'],
        },
      },
    },
    required: ['type', 'title'],
  },
} as const;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isFiniteNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function text(v: unknown, max: number, what: string): string {
  if (typeof v !== 'string' || v.trim().length === 0) {
    throw new Error(`${what} must be a non-empty string.`);
  }
  return v.trim().slice(0, max);
}

/**
 * Validates a raw tool input into a ChartSpec, or throws with a message the
 * model can act on (it is returned as the tool result, not as an exception).
 */
export function validateChartSpec(input: unknown): ChartSpec {
  if (!isRecord(input)) throw new Error('Chart spec must be an object.');
  const title = text(input.title, CHART_LIMITS.title, 'title');
  const unit =
    input.unit === undefined ? undefined : text(input.unit, 24, 'unit');

  switch (input.type) {
    case 'bar':
    case 'stacked_bar':
    case 'line': {
      const categories = input.categories;
      const series = input.series;
      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error(
          `${input.type} charts need a non-empty categories array.`,
        );
      }
      if (categories.length > CHART_LIMITS.categories) {
        throw new Error(
          `Too many categories (${categories.length}); max ${CHART_LIMITS.categories}. Aggregate or pick the top ones.`,
        );
      }
      if (!Array.isArray(series) || series.length === 0) {
        throw new Error(`${input.type} charts need a non-empty series array.`);
      }
      if (series.length > CHART_LIMITS.series) {
        throw new Error(
          `Too many series (${series.length}); max ${CHART_LIMITS.series}.`,
        );
      }
      const cats = categories.map((c, i) =>
        text(c, CHART_LIMITS.label, `categories[${i}]`),
      );
      const ser = series.map((s, i) => {
        if (!isRecord(s)) throw new Error(`series[${i}] must be an object.`);
        const name = text(s.name, CHART_LIMITS.label, `series[${i}].name`);
        const values = s.values;
        if (!Array.isArray(values) || values.length !== cats.length) {
          throw new Error(
            `series[${i}].values must have exactly ${cats.length} numbers (one per category).`,
          );
        }
        if (!values.every(isFiniteNumber)) {
          throw new Error(`series[${i}].values must all be finite numbers.`);
        }
        return { name, values };
      });
      return { type: input.type, title, unit, categories: cats, series: ser };
    }
    case 'donut': {
      const slices = input.slices;
      if (!Array.isArray(slices) || slices.length === 0) {
        throw new Error('donut charts need a non-empty slices array.');
      }
      if (slices.length > CHART_LIMITS.slices) {
        throw new Error(
          `Too many slices (${slices.length}); max ${CHART_LIMITS.slices}.`,
        );
      }
      const out = slices.map((s, i) => {
        if (!isRecord(s)) throw new Error(`slices[${i}] must be an object.`);
        const value = s.value;
        if (!isFiniteNumber(value) || value < 0) {
          throw new Error(`slices[${i}].value must be a non-negative number.`);
        }
        return {
          label: text(s.label, CHART_LIMITS.label, `slices[${i}].label`),
          value,
        };
      });
      return { type: 'donut', title, unit, slices: out };
    }
    case 'timeline': {
      const items = input.items;
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('timeline charts need a non-empty items array.');
      }
      if (items.length > CHART_LIMITS.timelineItems) {
        throw new Error(
          `Too many timeline items (${items.length}); max ${CHART_LIMITS.timelineItems}.`,
        );
      }
      const out = items.map((it, i) => {
        if (!isRecord(it)) throw new Error(`items[${i}] must be an object.`);
        const start = text(it.start, 10, `items[${i}].start`);
        const end = text(it.end, 10, `items[${i}].end`);
        if (!ISO_DATE.test(start) || !ISO_DATE.test(end)) {
          throw new Error(`items[${i}] dates must be YYYY-MM-DD.`);
        }
        if (Number.isNaN(Date.parse(start)) || Number.isNaN(Date.parse(end))) {
          throw new Error(`items[${i}] has an invalid date.`);
        }
        if (start > end) {
          throw new Error(`items[${i}].start must not be after end.`);
        }
        let progress: number | undefined;
        if (it.progress !== undefined) {
          if (
            !isFiniteNumber(it.progress) ||
            it.progress < 0 ||
            it.progress > 100
          ) {
            throw new Error(`items[${i}].progress must be between 0 and 100.`);
          }
          progress = it.progress;
        }
        return {
          label: text(it.label, CHART_LIMITS.label, `items[${i}].label`),
          start,
          end,
          ...(progress === undefined ? {} : { progress }),
        };
      });
      return { type: 'timeline', title, items: out };
    }
    default:
      throw new Error(
        'type must be one of bar, stacked_bar, line, donut, timeline.',
      );
  }
}
