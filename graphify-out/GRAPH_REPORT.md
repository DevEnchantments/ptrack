# Graph Report - ptrack  (2026-08-28)

## Corpus Check
- 362 files · ~212,940 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2845 nodes · 6673 edges · 150 communities (127 shown, 23 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 277 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `739083fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- P-Track — Original Oracle APEX App: Feature Reference
- import.service.ts
- seed-demo-data.mjs
- FDD Alignment — P-Track ⇄ Project Tracker FDD
- devDependencies
- toHttpException
- index.ts
- seed-adports-demo.mjs
- AccessAdminController
- RequireCapability
- resources.controller.ts
- ProjectAccess
- lookups.service.ts
- ChatRequestDto
- ProjectDetailPage.tsx
- compilerOptions
- dashboard.service.ts
- CreateIssueDto
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
- ProjectSectionsController
- frontend/package.json
- updates.controller.ts
- exclude
- cn
- frontend/tsconfig.json
- dependencies
- backend/package.json
- projects.service.ts
- backend/README.md
- search.controller.ts
- attachments.service.ts
- reminders.service.ts
- app.module.ts
- App.tsx
- AddMilestoneDialog
- ImportPage.tsx
- SubmissionActionDto
- workflow.ts
- MilestonesController
- CLAUDE.md — P-Track
- projects.ts
- SupabaseAuthGuard
- React + TypeScript + Vite
- CreatePersonDto
- CreateTemplateDto
- CurrentUser
- MilestonesService
- seed-generic-lookups.mjs
- HomePage.tsx
- app.controller.ts
- DatabaseModule
- ReportsService
- ActionItemsController
- P-Track progress summary
- ProjectOverviewCards.tsx
- assistant.service.ts
- use-me.ts
- AddActionItemDialog.tsx
- risks.service.ts
- dev.ps1
- Milestone
- database.service.ts
- FORMULAS.md — P-Track calculation registry
- admin.ts
- project-sections.service.ts
- DatabaseService
- users.controller.ts
- access.logic.ts
- AddPersonDialog
- frappe-gantt.d.ts
- .chat
- assistant.chart.ts
- milestones.service.ts
- search.module.ts
- Findings for `main` from the exploratory refactor branch
- UsersModule
- InitialsAvatar.tsx
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- AddActionItemDialog
- clsx
- 2. Findings per surface
- assistant.tools.ts
- nest-cli.json
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- status-reports.service.ts
- directory.ts
- CreateKpiDto
- ExecuteActionDto
- risks.controller.ts
- react
- templates.service.ts
- lucide-react
- tailwindcss
- @tailwindcss/vite
- RecordHistory.tsx
- tw-animate-css
- CreateProjectWizard
- @testing-library/jest-dom
- vite
- AppRoleService
- AssistantService
- AddRiskDialog
- program-outcomes.service.ts
- EditProjectDialog
- toaster.tsx
- AddKpiDialog
- AssistantPage.tsx
- UpdateProjectDto
- KpisPage.tsx
- CreateAccountDialog.tsx
- AppModule
- links.service.ts
- AuthUser
- A. Capabilities unlocked (ranked by project impact)
- AddAttachmentDialog
- AddLinkDialog
- AddResourceDialog
- AddUpdateDialog
- OutcomeDialog
- ValueRow
- prettier
- ts-jest
- ts-loader
- @types/node
- @types/supertest
- AddIssueDialog
- AddStatusReportDialog
- access-admin.module.ts

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
- `MyWorkStrip()` --calls--> `dueIn()`  [EXTRACTED]
  frontend/src/pages/DashboardPage.tsx → frontend/src/lib/format.ts
- `AccessAdminController` --references--> `RequireCapability()`  [EXTRACTED]
  backend/src/modules/access-admin/access-admin.controller.ts → backend/src/common/access/access.decorators.ts
- `ImportController` --references--> `RequireCapability()`  [EXTRACTED]
  backend/src/modules/import/import.controller.ts → backend/src/common/access/access.decorators.ts
- `ActionItemsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/action-items/action-items.controller.ts → backend/src/common/access/access.decorators.ts
- `AttachmentsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/attachments/attachments.controller.ts → backend/src/common/access/access.decorators.ts

## Import Cycles
- None detected.

## Communities (150 total, 23 thin omitted)

### Community 0 - "P-Track — Original Oracle APEX App: Feature Reference"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "import.service.ts"
Cohesion: 0.06
Nodes (42): ImportRowsDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, ImportController, ApiBody, Body (+34 more)

### Community 2 - "seed-demo-data.mjs"
Cohesion: 0.07
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "FDD Alignment — P-Track ⇄ Project Tracker FDD"
Cohesion: 0.18
Nodes (10): 2. Functionality inventory (FDD FR-01…15 → status), 3. Use cases UC-01…18 — acceptance checklist, 4. Key validations / business rules (FDD 3.3.2), 5. Reports & notifications (defer until math lands), 6. Open questions for the supervisor (blockers marked ⛔), 7. Execution roadmap, 8. Security phase — access model (ASSUMED 2026-08-17; ENFORCED same day, Fares approved "as I see fit"), 9. Conventions carried forward (+2 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (37): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+29 more)

### Community 5 - "toHttpException"
Cohesion: 0.11
Nodes (7): toHttpException(), ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds(), ownersLabel(), Injectable

### Community 6 - "index.ts"
Cohesion: 0.09
Nodes (25): Props, SectionCard(), formatSize(), Props, TaskAttachments(), Button(), buttonVariants, Skeleton() (+17 more)

### Community 7 - "seed-adports-demo.mjs"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "AccessAdminController"
Cohesion: 0.11
Nodes (15): AccessAdminController, ApiBody, Body, Controller, Get, Param, Patch, ReplaceGrantsDto (+7 more)

### Community 9 - "RequireCapability"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 10 - "resources.controller.ts"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "ProjectAccess"
Cohesion: 0.11
Nodes (19): ProjectAccess(), PeopleController, ApiBody, Body, Controller, Delete, Param, Patch (+11 more)

### Community 12 - "lookups.service.ts"
Cohesion: 0.06
Nodes (30): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+22 more)

### Community 13 - "ChatRequestDto"
Cohesion: 0.18
Nodes (11): ChatMessageDto, ChatRequestDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsString (+3 more)

### Community 14 - "ProjectDetailPage.tsx"
Cohesion: 0.06
Nodes (41): Props, AdjustWeightsDialog(), SaveTemplateDialog(), NavSection, Props, SectionNav(), personName(), WorkflowPanel() (+33 more)

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 16 - "dashboard.service.ts"
Cohesion: 0.12
Nodes (18): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), RISK_HIGH_THRESHOLD, DashboardController, Controller (+10 more)

### Community 17 - "CreateIssueDto"
Cohesion: 0.07
Nodes (25): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+17 more)

### Community 18 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "SubmissionsService"
Cohesion: 0.09
Nodes (7): Cycle, Submission, SubmissionListItem, SubmissionsRepository, Injectable, SubmissionsService, Injectable

### Community 21 - "devDependencies"
Cohesion: 0.07
Nodes (27): devDependencies, eslint, @eslint/js, globals, jsdom, @testing-library/react, @testing-library/user-event, @types/node (+19 more)

### Community 22 - "allow"
Cohesion: 0.11
Nodes (18): includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema, Bash(git add:*), Bash(git diff:*) (+10 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (27): @base-ui/react, class-variance-authority, dhtmlx-gantt, echarts, @fontsource-variable/inter, frappe-gantt, dependencies, @base-ui/react (+19 more)

### Community 25 - "dependencies"
Cohesion: 0.07
Nodes (29): @anthropic-ai/sdk, dependencies, @anthropic-ai/sdk, class-transformer, class-validator, jose, @nestjs/common, @nestjs/config (+21 more)

### Community 26 - ".add"
Cohesion: 0.09
Nodes (20): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Delete, Get, Param (+12 more)

### Community 27 - "action-items.service.ts"
Cohesion: 0.12
Nodes (17): columnsFrom(), ColumnSpec, COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional (+9 more)

### Community 28 - "MilestoneDetailPage.tsx"
Cohesion: 0.08
Nodes (29): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, ActionItemComment, actionItemsApi, projectsApi (+21 more)

### Community 29 - "jest"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "DashboardPage.tsx"
Cohesion: 0.07
Nodes (46): AssistantChart(), summaryOf(), EChart(), EChartHost, EChartProps, EChartHost(), EChartHostProps, assistantChartOption() (+38 more)

### Community 32 - "UI Visual Audit & Staged Restyling Plan"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "registry.service.ts"
Cohesion: 0.17
Nodes (11): RegistryController, Controller, RegistryModule, Module, DirectoryMembership, DirectoryPerson, GlobalActionItem, GlobalMilestone (+3 more)

### Community 34 - "ProjectSectionsController"
Cohesion: 0.29
Nodes (5): ApiTags, ProjectSectionsController, Controller, Get, Param

### Community 35 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "updates.controller.ts"
Cohesion: 0.06
Nodes (31): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+23 more)

### Community 37 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "cn"
Cohesion: 0.08
Nodes (38): CategorySelect(), Props, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+30 more)

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
Cohesion: 0.13
Nodes (11): Project, ProjectDetail, ProjectListRow, ProjectListStats, ProjectsRepository, Injectable, COLUMN_SPEC, projectColumns() (+3 more)

### Community 43 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "search.controller.ts"
Cohesion: 0.10
Nodes (16): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+8 more)

### Community 45 - "attachments.service.ts"
Cohesion: 0.09
Nodes (14): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, ATTACHMENTS_BUCKET, AttachmentsRepository, PARENT_TABLES (+6 more)

### Community 46 - "reminders.service.ts"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 47 - "app.module.ts"
Cohesion: 0.10
Nodes (32): ActionItemsModule, Module, AttachmentsModule, Module, ImportModule, Module, IssuesModule, Module (+24 more)

### Community 48 - "App.tsx"
Cohesion: 0.06
Nodes (50): App(), ExportCsvDialog(), Props, ProtectedRoute(), Props, TagChips(), GlobalMilestone, registryApi (+42 more)

### Community 49 - "AddMilestoneDialog"
Cohesion: 0.31
Nodes (9): AddMilestoneDialog(), doDelete(), reset(), resetFields(), submit(), emptyOwner(), ownerFromMilestone(), profileName() (+1 more)

### Community 50 - "ImportPage.tsx"
Cohesion: 0.21
Nodes (13): parseCsv(), FieldDef, ImportPage(), commit(), loadCsv(), onFile(), rowRecord(), MILESTONE_FIELDS (+5 more)

### Community 54 - "SubmissionActionDto"
Cohesion: 0.16
Nodes (15): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, CyclesController, ReportsController (+7 more)

### Community 55 - "workflow.ts"
Cohesion: 0.11
Nodes (20): NotificationBell(), markAll(), openItem(), refresh(), pathFor(), timeAgo(), Props, AppNotification (+12 more)

### Community 56 - "MilestonesController"
Cohesion: 0.23
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "projects.ts"
Cohesion: 0.15
Nodes (28): Props, Props, Props, Props, Props, apiUpload(), Attachment, AttachmentDetail (+20 more)

### Community 59 - "SupabaseAuthGuard"
Cohesion: 0.18
Nodes (4): IS_PUBLIC_KEY, AuthedRequest, SupabaseAuthGuard, Injectable

### Community 60 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "CreatePersonDto"
Cohesion: 0.07
Nodes (22): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+14 more)

### Community 62 - "CreateTemplateDto"
Cohesion: 0.14
Nodes (16): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+8 more)

### Community 63 - "CurrentUser"
Cohesion: 0.08
Nodes (15): CurrentUser, Get, Delete, Delete, NotificationsController, Controller, Get, Param (+7 more)

### Community 64 - "MilestonesService"
Cohesion: 0.13
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 65 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "HomePage.tsx"
Cohesion: 0.11
Nodes (21): FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES (+13 more)

### Community 67 - "app.controller.ts"
Cohesion: 0.24
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 68 - "DatabaseModule"
Cohesion: 0.67
Nodes (3): DatabaseModule, Global, Module

### Community 69 - "ReportsService"
Cohesion: 0.25
Nodes (6): PortfolioReportsController, Controller, ReportsModule, Module, ReportsService, Injectable

### Community 70 - "ActionItemsController"
Cohesion: 0.21
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 71 - "P-Track progress summary"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "ProjectOverviewCards.tsx"
Cohesion: 0.22
Nodes (11): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Project, ProjectDetail (+3 more)

### Community 73 - "assistant.service.ts"
Cohesion: 0.43
Nodes (3): AssistantModule, Module, AssistantEvent

### Community 74 - "use-me.ts"
Cohesion: 0.14
Nodes (15): AppLayout(), NAV_ITEMS, CommandPalette(), hitPath(), signOut(), atLeastRole(), fetchMe(), listeners (+7 more)

### Community 75 - "AddActionItemDialog.tsx"
Cohesion: 0.15
Nodes (37): STATUSES, FREQUENCIES, STATUSES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props (+29 more)

### Community 76 - "risks.service.ts"
Cohesion: 0.08
Nodes (11): riskScore(), NotificationsRepository, Injectable, NotificationsService, Injectable, Risk, RiskListItem, RisksRepository (+3 more)

### Community 78 - "Milestone"
Cohesion: 0.13
Nodes (21): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+13 more)

### Community 79 - "database.service.ts"
Cohesion: 0.11
Nodes (15): PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY, AccessModule, Global, Module, LEVEL_LABEL, ProjectAccessGuard, Injectable (+7 more)

### Community 80 - "FORMULAS.md — P-Track calculation registry"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "admin.ts"
Cohesion: 0.09
Nodes (23): Entry, KIND_META, Props, accessApi, AdminLookupRow, adminLookupsApi, AdminLookupTable, AdminUser (+15 more)

### Community 83 - "DatabaseService"
Cohesion: 0.09
Nodes (16): HISTORY_SELECT, HistoryEntry, HistoryInsert, PROJECT_HISTORY_SELECT, logger, DatabaseService, Injectable, RecordHistoryService (+8 more)

### Community 84 - "users.controller.ts"
Cohesion: 0.07
Nodes (22): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiProperty, IsString (+14 more)

### Community 85 - "access.logic.ts"
Cohesion: 0.18
Nodes (17): CAPABILITY_KEY, MIN_APP_ROLE_KEY, APP_ROLES, AppRole, atLeastRole(), CAPABILITIES, CAPABILITY_KEYS, DEFAULT_GRANTS (+9 more)

### Community 86 - "AddPersonDialog"
Cohesion: 0.48
Nodes (7): AddPersonDialog(), doRemove(), reset(), resetFields(), submit(), emptyPerson(), memberName()

### Community 87 - "frappe-gantt.d.ts"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - ".chat"
Cohesion: 0.19
Nodes (9): ApiOperation, ApiProduces, AssistantController, Body, Controller, Get, Post, Req (+1 more)

### Community 89 - "assistant.chart.ts"
Cohesion: 0.23
Nodes (10): CHART_LIMITS, CHART_TOOL, ChartSpec, DonutChart, isFiniteNumber(), isRecord(), SeriesChart, text() (+2 more)

### Community 90 - "milestones.service.ts"
Cohesion: 0.09
Nodes (26): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+18 more)

### Community 92 - "Findings for `main` from the exploratory refactor branch"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

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

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 101 - "assistant.tools.ts"
Cohesion: 0.20
Nodes (7): AssistantAction, AssistantTool, AssistantWriteTool, NO_INPUT, PROJECT_ID, READ_TOOLS, WRITE_TOOLS

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 105 - "status-reports.service.ts"
Cohesion: 0.08
Nodes (23): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+15 more)

### Community 106 - "directory.ts"
Cohesion: 0.14
Nodes (12): AccessLevel, AccessLevelValue, MEMBERSHIP_LEVEL, AppRole, lookupCache, Me, MyMembership, MyWork (+4 more)

### Community 107 - "CreateKpiDto"
Cohesion: 0.05
Nodes (35): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+27 more)

### Community 108 - "ExecuteActionDto"
Cohesion: 0.33
Nodes (5): ExecuteActionDto, ApiProperty, IsString, MaxLength, IsObject

### Community 109 - "risks.controller.ts"
Cohesion: 0.11
Nodes (19): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+11 more)

### Community 111 - "templates.service.ts"
Cohesion: 0.08
Nodes (15): ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable, Delete, Param, dayOffset(), materializeOffset() (+7 more)

### Community 115 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 118 - "CreateProjectWizard"
Cohesion: 0.33
Nodes (8): CreateProjectWizard(), buildPayload(), next(), submit(), validateStep1(), validateStep2(), validateStep3(), todayISO()

### Community 121 - "AppRoleService"
Cohesion: 0.13
Nodes (10): Capability, isCapability(), AppRoleGuard, Injectable, AppRoleService, Injectable, CapabilityService, Injectable (+2 more)

### Community 123 - "AddRiskDialog"
Cohesion: 0.36
Nodes (5): AddRiskDialog(), remove(), reset(), submit(), emptyPerson()

### Community 124 - "program-outcomes.service.ts"
Cohesion: 0.11
Nodes (21): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+13 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "AddKpiDialog"
Cohesion: 0.43
Nodes (5): AddKpiDialog(), remove(), reset(), submit(), emptyPerson()

### Community 132 - "AssistantPage.tsx"
Cohesion: 0.16
Nodes (13): AssistantMarkdown(), components, AssistantAction, assistantApi, AssistantEvent, ChartSpec, ChatMessage, ActionState (+5 more)

### Community 133 - "UpdateProjectDto"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 135 - "KpisPage.tsx"
Cohesion: 0.09
Nodes (23): Props, Kpi, KpiReading, kpisApi, calculatedProgress(), kpiAchievement(), kpiDataQuality(), KpiReadingLike (+15 more)

### Community 136 - "CreateAccountDialog.tsx"
Cohesion: 0.32
Nodes (9): CreateAccountDialog(), create(), Props, EMAIL_RE, inviteDraft(), isPocEmail(), POC_DOMAIN, pocEmail() (+1 more)

### Community 138 - "links.service.ts"
Cohesion: 0.07
Nodes (26): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+18 more)

### Community 139 - "AuthUser"
Cohesion: 0.15
Nodes (10): AdminOnly(), MinAppRole(), ProjectScoped(), AccessLevel, AuthUser, CreateCommentDto, ApiProperty, IsString (+2 more)

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
- **558 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+553 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `import.service.ts`, `AccessAdminController`, `links.service.ts`, `resources.controller.ts`, `lookups.service.ts`, `dashboard.service.ts`, `CreateIssueDto`, `SubmissionsService`, `.add`, `registry.service.ts`, `updates.controller.ts`, `projects.service.ts`, `search.controller.ts`, `attachments.service.ts`, `CreatePersonDto`, `MilestonesService`, `risks.service.ts`, `database.service.ts`, `DatabaseService`, `users.controller.ts`, `access.logic.ts`, `status-reports.service.ts`, `CreateKpiDto`, `templates.service.ts`, `AppRoleService`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `import.service.ts`, `AccessAdminController`, `RequireCapability`, `links.service.ts`, `ProjectAccess`, `resources.controller.ts`, `dashboard.service.ts`, `CreateIssueDto`, `.add`, `registry.service.ts`, `updates.controller.ts`, `search.controller.ts`, `SubmissionActionDto`, `MilestonesController`, `CreateTemplateDto`, `CurrentUser`, `ActionItemsController`, `database.service.ts`, `users.controller.ts`, `access.logic.ts`, `milestones.service.ts`, `status-reports.service.ts`, `CreateKpiDto`, `risks.controller.ts`, `program-outcomes.service.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `CurrentUser` to `import.service.ts`, `AccessAdminController`, `RequireCapability`, `links.service.ts`, `AuthUser`, `ProjectAccess`, `resources.controller.ts`, `dashboard.service.ts`, `CreateIssueDto`, `.add`, `registry.service.ts`, `updates.controller.ts`, `search.controller.ts`, `SubmissionActionDto`, `MilestonesController`, `CreateTemplateDto`, `ActionItemsController`, `users.controller.ts`, `milestones.service.ts`, `status-reports.service.ts`, `CreateKpiDto`, `risks.controller.ts`, `program-outcomes.service.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _558 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `import.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061952861952861954 - nodes in this community are weakly interconnected._
- **Should `seed-demo-data.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._