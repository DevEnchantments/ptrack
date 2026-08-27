# Graph Report - ptrack  (2026-08-28)

## Corpus Check
- 358 files · ~188,151 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2828 nodes · 6611 edges · 167 communities (144 shown, 23 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 277 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `615da333`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- P-Track — Original Oracle APEX App: Feature Reference
- CreateProjectDto
- seed-demo-data.mjs
- FDD Alignment — P-Track ⇄ Project Tracker FDD
- devDependencies
- ActionItemsRepository
- AssistantEChart.tsx
- seed-adports-demo.mjs
- AccessAdminController
- RequireCapability
- resources.controller.ts
- import.service.ts
- LookupsService
- assistant.service.ts
- ProjectDetailPage.tsx
- compilerOptions
- dashboard.service.ts
- issues.controller.ts
- compilerOptions
- components.json
- SubmissionsService
- devDependencies
- allow
- compilerOptions
- dependencies
- dependencies
- .add
- action-items.service.ts
- MilestoneDetailPage.tsx
- jest
- scripts
- DashboardPage.tsx
- UI Visual Audit & Staged Restyling Plan
- registry.service.ts
- ProjectScoped
- frontend/package.json
- updates.controller.ts
- exclude
- cn
- frontend/tsconfig.json
- dependencies
- backend/package.json
- projects.service.ts
- backend/README.md
- search.service.ts
- AttachmentsRepository
- reminders.service.ts
- app.module.ts
- App.tsx
- AddMilestoneDialog
- ImportPage.tsx
- SubmissionActionDto
- workflow.ts
- CreateProjectWizard.tsx
- CLAUDE.md — P-Track
- projects.ts
- SupabaseAuthGuard
- React + TypeScript + Vite
- people.controller.ts
- templates.controller.ts
- AuthUser
- milestones.service.ts
- seed-generic-lookups.mjs
- index.ts
- NotificationsService
- RecordHistoryService
- attachments.service.ts
- ActionItemsController
- P-Track progress summary
- lib/formulas.ts
- LinksService
- use-me.ts
- AddActionItemDialog.tsx
- project-sections.service.ts
- dev.ps1
- Milestone
- access.decorators.ts
- FORMULAS.md — P-Track calculation registry
- admin.ts
- StatusReportsController
- supabase-error.ts
- users.controller.ts
- access.logic.ts
- UpdateAttachmentDto
- frappe-gantt.d.ts
- .chat
- assistant.chart.ts
- CreateMilestoneDto
- AccessModule
- Findings for `main` from the exploratory refactor branch
- IssuesController
- InitialsAvatar.tsx
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- AddActionItemDialog
- toHttpException
- 2. Findings per surface
- assistant.tools.ts
- @nestjs/swagger
- NotificationBell.tsx
- StatusReportsRepository
- status-reports.service.ts
- directory.ts
- kpis.controller.ts
- ExecuteActionDto
- ProjectAccess
- CreateKpiDto
- templates.service.ts
- lucide-react
- CreateLookupValueDto
- UpdatesController
- RecordHistory.tsx
- tw-animate-css
- CreateProjectWizard
- CommandPalette.tsx
- dashboard.controller.ts
- DatabaseService
- AssistantService
- AddRiskDialog
- program-outcomes.service.ts
- CreateIssueDto
- LinksController
- EditProjectDialog
- toaster.tsx
- AddKpiDialog
- lookups.service.ts
- CreateKpiActionPlanDto
- AssistantPage.tsx
- projects.controller.ts
- TimelinePage.tsx
- KpisPage
- AddPersonDialog
- AppModule
- links.service.ts
- PaginationQueryDto
- A. Capabilities unlocked (ranked by project impact)
- AddAttachmentDialog
- AddLinkDialog
- AddResourceDialog
- AddUpdateDialog
- OutcomeDialog
- WeightEntryDto
- WorkflowPanel
- ValueRow
- prettier
- ts-jest
- ts-loader
- @types/node
- @types/supertest
- columnsFrom
- AddIssueDialog
- AddStatusReportDialog
- access-admin.module.ts
- eslint
- @eslint/js
- react-dom
- react-router-dom
- @supabase/supabase-js
- tailwind-merge
- globals
- vitest
- Injectable

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 155 edges
2. `AuthUser` - 100 edges
3. `CurrentUser` - 96 edges
4. `DatabaseService` - 67 edges
5. `@nestjs/swagger` - 63 edges
6. `Button()` - 52 edges
7. `usePageTitle()` - 51 edges
8. `toast` - 39 edges
9. `cn()` - 36 edges
10. `RecordHistoryService` - 35 edges

## Surprising Connections (you probably didn't know these)
- `AssistantPage()` --calls--> `useMe()`  [EXTRACTED]
  frontend/src/pages/AssistantPage.tsx → frontend/src/lib/use-me.ts
- `StatusReportsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/status-reports/status-reports.controller.ts → backend/src/common/access/access.decorators.ts
- `ProgramOutcomesController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/program-outcomes/program-outcomes.controller.ts → backend/src/common/access/access.decorators.ts
- `ProjectsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/projects/projects.controller.ts → backend/src/common/access/access.decorators.ts
- `LinksController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/links/links.controller.ts → backend/src/common/access/access.decorators.ts

## Import Cycles
- None detected.

## Communities (167 total, 23 thin omitted)

### Community 0 - "P-Track — Original Oracle APEX App: Feature Reference"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "CreateProjectDto"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 2 - "seed-demo-data.mjs"
Cohesion: 0.07
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "FDD Alignment — P-Track ⇄ Project Tracker FDD"
Cohesion: 0.18
Nodes (10): 2. Functionality inventory (FDD FR-01…15 → status), 3. Use cases UC-01…18 — acceptance checklist, 4. Key validations / business rules (FDD 3.3.2), 5. Reports & notifications (defer until math lands), 6. Open questions for the supervisor (blockers marked ⛔), 7. Execution roadmap, 8. Security phase — access model (ASSUMED 2026-08-17; ENFORCED same day, Fares approved "as I see fit"), 9. Conventions carried forward (+2 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (37): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+29 more)

### Community 5 - "ActionItemsRepository"
Cohesion: 0.12
Nodes (7): HistoryInsert, ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds(), ownersLabel(), Injectable

### Community 6 - "AssistantEChart.tsx"
Cohesion: 0.29
Nodes (9): AssistantChart(), AssistantEChart, AssistantEChart(), buildOption(), compact(), fmt, themeColors(), withUnit() (+1 more)

### Community 7 - "seed-adports-demo.mjs"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "AccessAdminController"
Cohesion: 0.14
Nodes (11): AccessAdminController, ApiBody, Body, Controller, Get, Param, Patch, ApiProperty (+3 more)

### Community 9 - "RequireCapability"
Cohesion: 0.13
Nodes (11): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+3 more)

### Community 10 - "resources.controller.ts"
Cohesion: 0.08
Nodes (23): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+15 more)

### Community 11 - "import.service.ts"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

### Community 12 - "LookupsService"
Cohesion: 0.13
Nodes (9): LookupsController, Body, Controller, Get, Param, Patch, Post, LookupsService (+1 more)

### Community 13 - "assistant.service.ts"
Cohesion: 0.18
Nodes (12): AssistantEvent, ChatMessageDto, ChatRequestDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, IsIn (+4 more)

### Community 14 - "ProjectDetailPage.tsx"
Cohesion: 0.06
Nodes (44): AdjustWeightsDialog(), SaveTemplateDialog(), SectionCard(), NavSection, Props, SectionNav(), projectAccessLevel(), calculatedProgress() (+36 more)

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 16 - "dashboard.service.ts"
Cohesion: 0.11
Nodes (19): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, plannedProgress(), RISK_HIGH_THRESHOLD, ChartPoint, CLOSED_PROJECT, DashboardData (+11 more)

### Community 17 - "issues.controller.ts"
Cohesion: 0.16
Nodes (7): UpdateIssueDto, Issue, IssueListItem, IssuesRepository, Injectable, IssuesService, Injectable

### Community 18 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "SubmissionsService"
Cohesion: 0.09
Nodes (5): CyclesController, SubmissionsRepository, Injectable, SubmissionsService, Injectable

### Community 21 - "devDependencies"
Cohesion: 0.07
Nodes (27): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom, @testing-library/jest-dom, @testing-library/react (+19 more)

### Community 22 - "allow"
Cohesion: 0.11
Nodes (18): includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema, Bash(git add:*), Bash(git diff:*) (+10 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (27): @base-ui/react, class-variance-authority, clsx, dhtmlx-gantt, echarts, @fontsource-variable/inter, frappe-gantt, dependencies (+19 more)

### Community 25 - "dependencies"
Cohesion: 0.07
Nodes (29): @anthropic-ai/sdk, dependencies, @anthropic-ai/sdk, class-transformer, class-validator, jose, @nestjs/common, @nestjs/config (+21 more)

### Community 26 - ".add"
Cohesion: 0.15
Nodes (13): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+5 more)

### Community 27 - "action-items.service.ts"
Cohesion: 0.12
Nodes (19): COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray (+11 more)

### Community 28 - "MilestoneDetailPage.tsx"
Cohesion: 0.06
Nodes (37): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, formatSize(), Props, TaskAttachments() (+29 more)

### Community 29 - "jest"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "DashboardPage.tsx"
Cohesion: 0.11
Nodes (24): formatDate(), initials(), PersonLike, personName(), relativeTime(), atOffset(), ActionItemsBreakdown(), ActivityLineChart() (+16 more)

### Community 32 - "UI Visual Audit & Staged Restyling Plan"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "registry.service.ts"
Cohesion: 0.15
Nodes (10): RegistryController, Controller, Get, DirectoryMembership, DirectoryPerson, GlobalActionItem, GlobalMilestone, MemberRow (+2 more)

### Community 34 - "ProjectScoped"
Cohesion: 0.15
Nodes (8): ApiTags, ProjectScoped(), ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

### Community 35 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "updates.controller.ts"
Cohesion: 0.11
Nodes (15): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+7 more)

### Community 37 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "cn"
Cohesion: 0.20
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 39 - "frontend/tsconfig.json"
Cohesion: 0.40
Nodes (4): compilerOptions, paths, files, references

### Community 40 - "dependencies"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "backend/package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "projects.service.ts"
Cohesion: 0.12
Nodes (12): MilestoneProgressRow, Project, ProjectDetail, ProjectListRow, ProjectListStats, ProjectsRepository, Injectable, COLUMN_SPEC (+4 more)

### Community 43 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "search.service.ts"
Cohesion: 0.08
Nodes (22): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+14 more)

### Community 45 - "AttachmentsRepository"
Cohesion: 0.11
Nodes (6): AttachmentsRepository, Injectable, AttachmentsService, parseParent(), safeName(), Injectable

### Community 46 - "reminders.service.ts"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 47 - "app.module.ts"
Cohesion: 0.08
Nodes (38): ActionItemsModule, Module, AssistantModule, Module, AttachmentsModule, Module, ImportModule, Module (+30 more)

### Community 48 - "App.tsx"
Cohesion: 0.07
Nodes (44): App(), ProtectedRoute(), Props, Button(), buttonVariants, Skeleton(), Chip(), STATUS_CHIP (+36 more)

### Community 49 - "AddMilestoneDialog"
Cohesion: 0.31
Nodes (9): AddMilestoneDialog(), doDelete(), reset(), resetFields(), submit(), emptyOwner(), ownerFromMilestone(), profileName() (+1 more)

### Community 50 - "ImportPage.tsx"
Cohesion: 0.17
Nodes (15): importApi, ImportSummary, parseCsv(), FieldDef, ImportPage(), commit(), loadCsv(), onFile() (+7 more)

### Community 54 - "SubmissionActionDto"
Cohesion: 0.17
Nodes (14): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, ReportsController, SubmissionsController (+6 more)

### Community 55 - "workflow.ts"
Cohesion: 0.17
Nodes (11): Props, Cycle, CycleStatusReport, CycleStatusRow, dashboardApi, DashboardChartPoint, DashboardData, InitiativeProgressRow (+3 more)

### Community 56 - "CreateProjectWizard.tsx"
Cohesion: 0.17
Nodes (14): sectorsApi, emptyMember(), NEW_SECTOR, Props, StepAccess(), updateMember(), StepConfirmation(), Props (+6 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "projects.ts"
Cohesion: 0.11
Nodes (35): Props, Props, Props, Props, Props, Props, AssistantAction, assistantApi (+27 more)

### Community 59 - "SupabaseAuthGuard"
Cohesion: 0.11
Nodes (11): ApiSecurity, AppController, Controller, Get, AppService, Injectable, IS_PUBLIC_KEY, Public() (+3 more)

### Community 60 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "people.controller.ts"
Cohesion: 0.07
Nodes (30): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+22 more)

### Community 62 - "templates.controller.ts"
Cohesion: 0.13
Nodes (18): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+10 more)

### Community 63 - "AuthUser"
Cohesion: 0.07
Nodes (28): AuthUser, CurrentUser, Delete, Delete, ImportRowsDto, ApiProperty, ArrayMaxSize, ArrayMinSize (+20 more)

### Community 64 - "milestones.service.ts"
Cohesion: 0.08
Nodes (19): AdjustWeightsDto, IsArray, Type, ValidateNested, UpdateMilestoneDto, MilestonesController, ApiBody, Body (+11 more)

### Community 65 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "index.ts"
Cohesion: 0.08
Nodes (35): ExportCsvDialog(), Props, FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow (+27 more)

### Community 67 - "NotificationsService"
Cohesion: 0.13
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 68 - "RecordHistoryService"
Cohesion: 0.13
Nodes (8): DatabaseModule, Global, Module, RecordHistoryService, Injectable, Link, LinkListItem, ProgramOutcome

### Community 69 - "attachments.service.ts"
Cohesion: 0.26
Nodes (8): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, ATTACHMENTS_BUCKET, PARENT_TABLES, PARENT_TYPES

### Community 70 - "ActionItemsController"
Cohesion: 0.27
Nodes (8): ActionItemsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 71 - "P-Track progress summary"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "lib/formulas.ts"
Cohesion: 0.15
Nodes (15): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Project, ProjectDetail (+7 more)

### Community 73 - "LinksService"
Cohesion: 0.17
Nodes (4): LinksRepository, Injectable, LinksService, Injectable

### Community 74 - "use-me.ts"
Cohesion: 0.19
Nodes (13): AppLayout(), NAV_ITEMS, signOut(), atLeastRole(), fetchMe(), listeners, RANK, refreshMe() (+5 more)

### Community 75 - "AddActionItemDialog.tsx"
Cohesion: 0.16
Nodes (39): STATUSES, FREQUENCIES, STATUSES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, CategorySelect(), Props (+31 more)

### Community 76 - "project-sections.service.ts"
Cohesion: 0.10
Nodes (17): riskScore(), CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString (+9 more)

### Community 78 - "Milestone"
Cohesion: 0.11
Nodes (24): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+16 more)

### Community 79 - "access.decorators.ts"
Cohesion: 0.11
Nodes (18): AdminOnly(), CAPABILITY_KEY, MIN_APP_ROLE_KEY, MinAppRole(), PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY, AccessLevel, atLeastRole() (+10 more)

### Community 80 - "FORMULAS.md — P-Track calculation registry"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "admin.ts"
Cohesion: 0.06
Nodes (28): Props, accessApi, AdminLookupRow, adminLookupsApi, AdminLookupTable, AdminUser, CapabilityGrants, CapabilityInfo (+20 more)

### Community 82 - "StatusReportsController"
Cohesion: 0.19
Nodes (8): StatusReportsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 83 - "supabase-error.ts"
Cohesion: 0.16
Nodes (12): HISTORY_SELECT, HistoryEntry, PROJECT_HISTORY_SELECT, logger, ActionItem, ActionItemComment, ActionItemListItem, Milestone (+4 more)

### Community 84 - "users.controller.ts"
Cohesion: 0.07
Nodes (23): CAPABILITY_KEYS, ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiProperty (+15 more)

### Community 85 - "access.logic.ts"
Cohesion: 0.18
Nodes (15): APP_ROLES, AppRole, CAPABILITIES, Capability, DEFAULT_GRANTS, GRANTABLE_ROLES, GrantableRole, isAppRole() (+7 more)

### Community 86 - "UpdateAttachmentDto"
Cohesion: 0.33
Nodes (6): ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, UpdateAttachmentDto

### Community 87 - "frappe-gantt.d.ts"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - ".chat"
Cohesion: 0.19
Nodes (9): ApiOperation, ApiProduces, AssistantController, Body, Controller, Get, Post, Req (+1 more)

### Community 89 - "assistant.chart.ts"
Cohesion: 0.23
Nodes (10): CHART_LIMITS, CHART_TOOL, ChartSpec, DonutChart, isFiniteNumber(), isRecord(), SeriesChart, text() (+2 more)

### Community 90 - "CreateMilestoneDto"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 91 - "AccessModule"
Cohesion: 0.67
Nodes (3): AccessModule, Global, Module

### Community 92 - "Findings for `main` from the exploratory refactor branch"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 93 - "IssuesController"
Cohesion: 0.23
Nodes (8): IssuesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 94 - "InitialsAvatar.tsx"
Cohesion: 0.47
Nodes (5): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.15
Nodes (10): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🏗 Architecture, 📚 More docs, 🧪 Quality, 🚀 Quick start (+2 more)

### Community 98 - "AddActionItemDialog"
Cohesion: 0.27
Nodes (12): AddActionItemDialog(), doDelete(), reset(), resetFields(), setMe(), setOwnerAt(), submit(), emptyOwner() (+4 more)

### Community 99 - "toHttpException"
Cohesion: 0.27
Nodes (3): toHttpException(), KpisRepository, Injectable

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 101 - "assistant.tools.ts"
Cohesion: 0.20
Nodes (7): AssistantAction, AssistantTool, AssistantWriteTool, NO_INPUT, PROJECT_ID, READ_TOOLS, WRITE_TOOLS

### Community 102 - "@nestjs/swagger"
Cohesion: 0.15
Nodes (11): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot, ReplaceGrantsDto, ApiProperty (+3 more)

### Community 103 - "NotificationBell.tsx"
Cohesion: 0.29
Nodes (8): NotificationBell(), markAll(), openItem(), refresh(), pathFor(), timeAgo(), AppNotification, notificationsApi

### Community 104 - "StatusReportsRepository"
Cohesion: 0.16
Nodes (5): StatusReport, StatusReportDetail, StatusReportListItem, StatusReportsRepository, Injectable

### Community 105 - "status-reports.service.ts"
Cohesion: 0.21
Nodes (10): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, COLUMN_SPEC (+2 more)

### Community 106 - "directory.ts"
Cohesion: 0.14
Nodes (12): AccessLevel, AccessLevelValue, MEMBERSHIP_LEVEL, AppRole, lookupCache, Me, MyMembership, MyWork (+4 more)

### Community 107 - "kpis.controller.ts"
Cohesion: 0.18
Nodes (9): UpdateKpiActionPlanDto, UpdateKpiDto, Patch, KpisModule, Module, Kpi, KpiActionPlan, KpiListItem (+1 more)

### Community 108 - "ExecuteActionDto"
Cohesion: 0.33
Nodes (5): ExecuteActionDto, ApiProperty, IsString, MaxLength, IsObject

### Community 109 - "ProjectAccess"
Cohesion: 0.21
Nodes (9): ProjectAccess(), RisksController, ApiBody, Body, Controller, Get, Param, Patch (+1 more)

### Community 110 - "CreateKpiDto"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 111 - "templates.service.ts"
Cohesion: 0.17
Nodes (9): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload, TemplatesService (+1 more)

### Community 113 - "CreateLookupValueDto"
Cohesion: 0.21
Nodes (11): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+3 more)

### Community 114 - "UpdatesController"
Cohesion: 0.21
Nodes (9): ApiBody, Body, Controller, Get, Param, Patch, Post, Query (+1 more)

### Community 115 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 118 - "CreateProjectWizard"
Cohesion: 0.33
Nodes (8): CreateProjectWizard(), buildPayload(), next(), submit(), validateStep1(), validateStep2(), validateStep3(), todayISO()

### Community 119 - "CommandPalette.tsx"
Cohesion: 0.18
Nodes (9): CommandPalette(), Entry, hitPath(), KIND_META, Props, SavedSearch, searchApi, SearchHit (+1 more)

### Community 120 - "dashboard.controller.ts"
Cohesion: 0.21
Nodes (7): DashboardController, Controller, Get, DashboardModule, Module, DashboardService, Injectable

### Community 121 - "DatabaseService"
Cohesion: 0.13
Nodes (6): AppRoleService, Injectable, DatabaseService, Injectable, AccessAdminService, Injectable

### Community 123 - "AddRiskDialog"
Cohesion: 0.36
Nodes (5): AddRiskDialog(), remove(), reset(), submit(), emptyPerson()

### Community 124 - "program-outcomes.service.ts"
Cohesion: 0.07
Nodes (24): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+16 more)

### Community 125 - "CreateIssueDto"
Cohesion: 0.17
Nodes (10): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+2 more)

### Community 126 - "LinksController"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "AddKpiDialog"
Cohesion: 0.43
Nodes (5): AddKpiDialog(), remove(), reset(), submit(), emptyPerson()

### Community 130 - "lookups.service.ts"
Cohesion: 0.17
Nodes (10): LookupsModule, Module, ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED, CacheSlot, EXTRA_COLUMNS (+2 more)

### Community 131 - "CreateKpiActionPlanDto"
Cohesion: 0.29
Nodes (10): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+2 more)

### Community 132 - "AssistantPage.tsx"
Cohesion: 0.22
Nodes (8): AssistantMarkdown(), components, ActionState, AssistantPage(), SUGGESTIONS, TOOL_LABELS, Turn, TurnAction

### Community 133 - "projects.controller.ts"
Cohesion: 0.08
Nodes (22): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+14 more)

### Community 134 - "TimelinePage.tsx"
Cohesion: 0.29
Nodes (8): GlobalMilestone, registryApi, milestonesApi, addDays(), iso(), statusClass(), TimelinePage(), VIEW_MODES

### Community 135 - "KpisPage"
Cohesion: 0.22
Nodes (6): kpiAchievement(), formatValue(), KpiDetail(), KpisPage(), sortedReadings(), Trend()

### Community 136 - "AddPersonDialog"
Cohesion: 0.19
Nodes (14): AddPersonDialog(), doRemove(), reset(), resetFields(), submit(), emptyPerson(), memberName(), CreateAccountDialog() (+6 more)

### Community 138 - "links.service.ts"
Cohesion: 0.19
Nodes (12): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+4 more)

### Community 139 - "PaginationQueryDto"
Cohesion: 0.25
Nodes (7): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type

### Community 140 - "A. Capabilities unlocked (ranked by project impact)"
Cohesion: 0.20
Nodes (9): A1. Email subsystem, stage d — no longer blocked on supervisor SMTP, A2. Docker Desktop → local Supabase stack, A3. Browser e2e with Playwright, A4. Free tool choice, A. Capabilities unlocked (ranked by project impact), B. Workaround teardown (small, opportunistic), C. Explicitly unchanged, New-laptop unlocks (post-migration backlog) (+1 more)

### Community 141 - "AddAttachmentDialog"
Cohesion: 0.83
Nodes (4): AddAttachmentDialog(), remove(), reset(), submit()

### Community 142 - "AddLinkDialog"
Cohesion: 0.83
Nodes (4): AddLinkDialog(), remove(), reset(), submit()

### Community 143 - "AddResourceDialog"
Cohesion: 0.83
Nodes (4): AddResourceDialog(), remove(), reset(), submit()

### Community 144 - "AddUpdateDialog"
Cohesion: 0.83
Nodes (4): AddUpdateDialog(), remove(), reset(), submit()

### Community 145 - "OutcomeDialog"
Cohesion: 0.83
Nodes (4): OutcomeDialog(), remove(), reset(), submit()

### Community 146 - "WeightEntryDto"
Cohesion: 0.29
Nodes (7): ApiProperty, ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 148 - "ValueRow"
Cohesion: 1.00
Nodes (3): ValueRow(), patch(), saveName()

### Community 155 - "AddIssueDialog"
Cohesion: 0.53
Nodes (5): AddIssueDialog(), remove(), reset(), submit(), emptyPerson()

### Community 156 - "AddStatusReportDialog"
Cohesion: 0.70
Nodes (5): AddStatusReportDialog(), remove(), reset(), submit(), today()

## Knowledge Gaps
- **564 isolated node(s):** `CHART_LIMITS`, `SeriesChart`, `DonutChart`, `TimelineChart`, `name` (+559 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `lookups.service.ts`, `ActionItemsRepository`, `AccessAdminController`, `resources.controller.ts`, `import.service.ts`, `LookupsService`, `dashboard.service.ts`, `issues.controller.ts`, `SubmissionsService`, `columnsFrom`, `registry.service.ts`, `updates.controller.ts`, `projects.service.ts`, `search.service.ts`, `AttachmentsRepository`, `people.controller.ts`, `templates.controller.ts`, `milestones.service.ts`, `NotificationsService`, `RecordHistoryService`, `attachments.service.ts`, `LinksService`, `project-sections.service.ts`, `access.decorators.ts`, `StatusReportsController`, `supabase-error.ts`, `users.controller.ts`, `access.logic.ts`, `StatusReportsRepository`, `kpis.controller.ts`, `templates.service.ts`, `DatabaseService`, `program-outcomes.service.ts`, `CreateIssueDto`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `projects.controller.ts`, `AccessAdminController`, `RequireCapability`, `links.service.ts`, `resources.controller.ts`, `dashboard.service.ts`, `issues.controller.ts`, `.add`, `action-items.service.ts`, `registry.service.ts`, `updates.controller.ts`, `search.service.ts`, `SubmissionActionDto`, `people.controller.ts`, `templates.controller.ts`, `milestones.service.ts`, `ActionItemsController`, `project-sections.service.ts`, `access.decorators.ts`, `StatusReportsController`, `users.controller.ts`, `access.logic.ts`, `IssuesController`, `@nestjs/swagger`, `status-reports.service.ts`, `kpis.controller.ts`, `ProjectAccess`, `UpdatesController`, `dashboard.controller.ts`, `program-outcomes.service.ts`, `LinksController`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AuthUser` to `projects.controller.ts`, `AccessAdminController`, `RequireCapability`, `links.service.ts`, `resources.controller.ts`, `dashboard.service.ts`, `issues.controller.ts`, `.add`, `action-items.service.ts`, `registry.service.ts`, `updates.controller.ts`, `search.service.ts`, `SubmissionActionDto`, `people.controller.ts`, `templates.controller.ts`, `milestones.service.ts`, `ActionItemsController`, `project-sections.service.ts`, `StatusReportsController`, `users.controller.ts`, `IssuesController`, `@nestjs/swagger`, `status-reports.service.ts`, `kpis.controller.ts`, `ProjectAccess`, `UpdatesController`, `dashboard.controller.ts`, `program-outcomes.service.ts`, `LinksController`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `CHART_LIMITS`, `SeriesChart`, `DonutChart` to the rest of the system?**
  _564 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CreateProjectDto` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `seed-demo-data.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._