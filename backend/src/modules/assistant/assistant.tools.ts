/**
 * Read-only tool catalog for the AI assistant (stage a).
 *
 * Every tool is a thin wrapper over an existing REST endpoint, executed as a
 * loopback HTTP call carrying the REQUESTING USER'S JWT — so the standard
 * guard chain (auth → role → project access) authorizes each call exactly as
 * if the user had clicked. The assistant holds no privileges of its own:
 * restricted projects 404, forbidden actions 403, and the model is told to
 * relay those as plain-language answers.
 */

export interface AssistantTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
  /** Builds the loopback path (+query) from the model-supplied input. */
  path: (input: Record<string, string>) => string;
}

const NO_INPUT = {
  type: 'object',
  properties: {},
  additionalProperties: false,
} as const;

const id = (v: string) => encodeURIComponent(v);

export const READ_TOOLS: AssistantTool[] = [
  {
    name: 'get_me',
    description:
      'Who the current user is: id, name, email, app role and capability ' +
      'list. Call this before answering questions about "my" permissions.',
    input_schema: NO_INPUT,
    path: () => '/users/me',
  },
  {
    name: 'get_my_work',
    description:
      "The user's own open assignments across all projects: action items " +
      'they own and milestones on projects they manage, with due dates.',
    input_schema: NO_INPUT,
    path: () => '/users/me/work',
  },
  {
    name: 'search_records',
    description:
      'Global search across projects, milestones, action items, issues, ' +
      'risks and KPIs by name/title. Use this first to resolve a record the ' +
      'user names into its id and project_id.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search text, min 2 chars.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    path: (i) => `/search?q=${encodeURIComponent(i.query)}`,
  },
  {
    name: 'list_projects',
    description:
      'All projects visible to the user: name, reference id, status, owner, ' +
      'project manager, budget and dates.',
    input_schema: NO_INPUT,
    path: () => '/projects',
  },
  {
    name: 'get_project',
    description: 'Full detail for one project by its id.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID.' },
      },
      required: ['project_id'],
      additionalProperties: false,
    },
    path: (i) => `/projects/${id(i.project_id)}`,
  },
  {
    name: 'get_project_sections',
    description:
      'Every section list of one project in a single call: milestones, ' +
      'action items, issues, risks, links, resources, updates and status ' +
      'reports. The right tool for "summarize project X" or any question ' +
      "about a project's records.",
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID.' },
      },
      required: ['project_id'],
      additionalProperties: false,
    },
    path: (i) => `/projects/${id(i.project_id)}/sections`,
  },
  {
    name: 'get_cycle_status',
    description:
      'Portfolio-wide monthly submission cycle status: the current cycle ' +
      'and, per project, whether it is submitted / in review / validated / ' +
      'approved / returned / rejected / not submitted.',
    input_schema: NO_INPUT,
    path: () => '/reports/cycle-status',
  },
  {
    name: 'report_initiative_progress',
    description:
      'FR-12 Initiative Progress report: one row per project with planned ' +
      'vs calculated progress, delta and health bucket (Over-Achieved, On ' +
      'Target, Needs Attention, Off Target, Severely Off Target, Completed, ' +
      'Not Started). Worst delta first. Use for "which projects are off ' +
      'target / behind / at risk".',
    input_schema: NO_INPUT,
    path: () => '/reports/initiative-progress',
  },
  {
    name: 'report_monthly_performance',
    description:
      'FR-12 Monthly Performance report for a calendar year: per month, ' +
      'milestones due / completed, submissions and approvals.',
    input_schema: {
      type: 'object',
      properties: {
        year: { type: 'string', description: 'Four-digit year, e.g. "2026".' },
      },
      required: ['year'],
      additionalProperties: false,
    },
    path: (i) => `/reports/monthly-performance?year=${id(i.year)}`,
  },
  {
    name: 'list_kpis',
    description:
      'All strategic KPIs with latest reading, target, polarity, linked ' +
      'project and reading history.',
    input_schema: NO_INPUT,
    path: () => '/kpis',
  },
];
