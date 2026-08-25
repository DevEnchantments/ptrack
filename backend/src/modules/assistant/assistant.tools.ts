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

/**
 * Stage b: write tools. A write tool is NEVER executed by the model loop —
 * invoking it only produces a pending action that the chat UI renders as a
 * confirmation card. Execution happens exclusively through
 * POST /assistant/execute after the user clicks Confirm, again as a loopback
 * call under the user's own JWT. The catalog below is the single source of
 * truth: /assistant/execute refuses anything not built from it.
 */

export interface AssistantAction {
  method: 'POST' | 'PATCH';
  path: string;
  body: Record<string, unknown>;
}

export interface AssistantWriteTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
  /** Builds the concrete API call from the model-supplied input. */
  action: (input: Record<string, string>) => AssistantAction;
  /** One human-readable line for the confirmation card. */
  summary: (input: Record<string, string>) => string;
}

const req = (props: Record<string, unknown>, required: string[]) => ({
  type: 'object',
  properties: props,
  required,
  additionalProperties: false,
});

const PROJECT_ID = {
  type: 'string',
  description: 'Project UUID (resolve via search_records or list_projects).',
};

export const WRITE_TOOLS: AssistantWriteTool[] = [
  {
    name: 'create_action_item',
    description:
      'Prepare a new action item on a project for the user to confirm. ' +
      'Requires a due date (YYYY-MM-DD); ask the user if they gave none.',
    input_schema: req(
      {
        project_id: PROJECT_ID,
        title: { type: 'string', description: 'Short imperative title.' },
        due_date: { type: 'string', description: 'Due date, YYYY-MM-DD.' },
        description: { type: 'string', description: 'Optional detail.' },
      },
      ['project_id', 'title', 'due_date'],
    ),
    action: (i) => ({
      method: 'POST',
      path: `/projects/${id(i.project_id)}/action-items`,
      body: {
        title: i.title,
        due_date: i.due_date,
        status: 'open',
        ...(i.description ? { description: i.description } : {}),
      },
    }),
    summary: (i) => `Create action item "${i.title}" due ${i.due_date}`,
  },
  {
    name: 'complete_action_item',
    description:
      'Prepare marking an existing action item as completed, for the user ' +
      'to confirm. Resolve the action item id via search_records or ' +
      'get_project_sections first.',
    input_schema: req(
      {
        project_id: PROJECT_ID,
        action_item_id: { type: 'string', description: 'Action item UUID.' },
        title: { type: 'string', description: 'Its title, for the card.' },
      },
      ['project_id', 'action_item_id', 'title'],
    ),
    action: (i) => ({
      method: 'PATCH',
      path: `/projects/${id(i.project_id)}/action-items/${id(i.action_item_id)}`,
      body: { status: 'closed_completed' },
    }),
    summary: (i) => `Mark action item "${i.title}" as completed`,
  },
  {
    name: 'create_issue',
    description: 'Prepare a new issue on a project for the user to confirm.',
    input_schema: req(
      {
        project_id: PROJECT_ID,
        title: { type: 'string', description: 'Issue title.' },
        description: { type: 'string', description: 'Optional detail.' },
      },
      ['project_id', 'title'],
    ),
    action: (i) => ({
      method: 'POST',
      path: `/projects/${id(i.project_id)}/issues`,
      body: {
        title: i.title,
        status: 'open',
        ...(i.description ? { description: i.description } : {}),
      },
    }),
    summary: (i) => `Log issue "${i.title}"`,
  },
  {
    name: 'create_risk',
    description: 'Prepare a new risk on a project for the user to confirm.',
    input_schema: req(
      {
        project_id: PROJECT_ID,
        statement: { type: 'string', description: 'The risk statement.' },
      },
      ['project_id', 'statement'],
    ),
    action: (i) => ({
      method: 'POST',
      path: `/projects/${id(i.project_id)}/risks`,
      body: { statement: i.statement },
    }),
    summary: (i) => `Log risk "${i.statement}"`,
  },
  {
    name: 'add_update',
    description:
      'Prepare posting a progress update on a project for the user to confirm.',
    input_schema: req(
      {
        project_id: PROJECT_ID,
        body: { type: 'string', description: 'The update text.' },
      },
      ['project_id', 'body'],
    ),
    action: (i) => ({
      method: 'POST',
      path: `/projects/${id(i.project_id)}/updates`,
      body: { body: i.body },
    }),
    summary: (i) => `Post update: "${i.body.slice(0, 80)}"`,
  },
  {
    name: 'submit_cycle',
    description:
      "Prepare submitting a project's current monthly reporting cycle for " +
      'review, for the user to confirm. The submission gate (mandatory ' +
      'fields, milestone weights totaling 100) is enforced on execution.',
    input_schema: req(
      {
        project_id: PROJECT_ID,
        comment: { type: 'string', description: 'Optional comment.' },
      },
      ['project_id'],
    ),
    action: (i) => ({
      method: 'POST',
      path: `/projects/${id(i.project_id)}/submissions/submit`,
      body: i.comment ? { comment: i.comment } : {},
    }),
    summary: () => 'Submit this month\u2019s reporting cycle for review',
  },
];
