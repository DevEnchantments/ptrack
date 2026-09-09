# Graph Report - ptrack  (2026-09-09)

## Corpus Check
- 365 files · ~212,768 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2867 nodes · 6710 edges · 173 communities (146 shown, 27 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 283 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `374af90a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- P-Track — Original Oracle APEX App: Feature Reference
- CreateProjectDto
- seed-demo-data.mjs
- FDD Alignment — P-Track ⇄ Project Tracker FDD
- devDependencies
- ActionItemsRepository
- HomePage.tsx
- seed-adports-demo.mjs
- access-admin.controller.ts
- allow
- resources.controller.ts
- import.service.ts
- LookupsService
- ChatRequestDto
- ProjectDetailPage.tsx
- compilerOptions
- theme.ts
- CreateIssueDto
- compilerOptions
- components.json
- ProjectAccessService
- devDependencies
- admin.ts
- compilerOptions
- dependencies
- dependencies
- .add
- reminders.service.ts
- RequireCapability
- jest
- scripts
- DashboardPage.tsx
- UI Visual Audit & Staged Restyling Plan
- ProjectsController
- ProjectScoped
- frontend/package.json
- updates.controller.ts
- exclude
- index.ts
- frontend/tsconfig.json
- dependencies
- backend/package.json
- ProjectsRepository
- backend/README.md
- search.controller.ts
- AttachmentsRepository
- ProjectProgressReportPage.tsx
- project-sections.module.ts
- MilestoneDetailPage.tsx
- AddMilestoneDialog
- ImportPage.tsx
- SubmissionsService
- WorkflowPanel.tsx
- MilestonesService
- CLAUDE.md — P-Track
- projects.ts
- SupabaseAuthGuard
- React + TypeScript + Vite
- people.controller.ts
- ActionItemsController
- AuthUser
- users.service.ts
- seed-generic-lookups.mjs
- cn
- app.controller.ts
- templates.service.ts
- import.controller.ts
- action-items.service.ts
- P-Track progress summary
- toHttpException
- CommandPalette.tsx
- App.tsx
- AddMilestoneDialog.tsx
- RisksService
- dev.ps1
- Milestone
- risks.service.ts
- FORMULAS.md — P-Track calculation registry
- templates.controller.ts
- submissions.module.ts
- DatabaseService
- NotificationsService
- access.decorators.ts
- dashboard.service.ts
- frappe-gantt.d.ts
- .chat
- assistant.chart.ts
- ProjectOverviewCards.tsx
- directory.ts
- Findings for `main` from the exploratory refactor branch
- RecordHistoryService
- attachments.service.ts
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- AddActionItemDialog
- clsx
- 2. Findings per surface
- assistant.service.ts
- nest-cli.json
- milestones.module.ts
- status-reports.service.ts
- projects.service.ts
- ValueRow
- CreateKpiDto
- assistant.controller.ts
- .update
- react
- MilestonesController
- lucide-react
- tailwindcss
- LinksService
- RecordHistory.tsx
- ProgramOutcomesService
- CreateProjectWizard
- @testing-library/jest-dom
- vite
- StatusReportsController
- AssistantService
- AddRiskDialog
- CreateAccountDialog
- @tailwindcss/vite
- assistant.service.spec.ts
- EditProjectDialog
- toaster.tsx
- UsersController
- @nestjs/swagger
- program-outcomes.service.ts
- AssistantPage.tsx
- projects.controller.ts
- format.ts
- ProgramOutcomesController
- StatusReportsRepository
- app.module.ts
- links.service.ts
- @eslint/js
- A. Capabilities unlocked (ranked by project impact)
- AddAttachmentDialog
- AddLinkDialog
- AddResourceDialog
- AddUpdateDialog
- OutcomeDialog
- AddKpiDialog
- UpdatesController
- ProjectsService
- LinksController
- CreateMilestoneDto
- ResourcesController
- CreateUpdateDto
- PaginationQueryDto
- risks.repository.ts
- AddPersonDialog
- columnsFrom
- AddIssueDialog
- UpdateMeDto
- AddStatusReportDialog
- AccessModule
- eslint
- ts-jest
- @types/express
- @types/jest
- eslint-plugin-react-hooks
- tw-animate-css
- @types/node
- Module
- Body
- Controller
- Get
- Post

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
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/TasksCard.tsx → frontend/src/lib/api/planning.ts
- `ResourcesController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/resources/resources.controller.ts → backend/src/common/access/access.decorators.ts
- `StatusReportsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/status-reports/status-reports.controller.ts → backend/src/common/access/access.decorators.ts
- `RisksController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/risks/risks.controller.ts → backend/src/common/access/access.decorators.ts
- `ProgramOutcomesController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/program-outcomes/program-outcomes.controller.ts → backend/src/common/access/access.decorators.ts

## Import Cycles
- None detected.

## Communities (173 total, 27 thin omitted)

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
Nodes (37): devDependencies, eslint-config-prettier, @eslint/eslintrc, eslint-plugin-prettier, globals, jest, @nestjs/cli, @nestjs/schematics (+29 more)

### Community 5 - "ActionItemsRepository"
Cohesion: 0.10
Nodes (10): HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds() (+2 more)

### Community 6 - "HomePage.tsx"
Cohesion: 0.07
Nodes (39): ExportCsvDialog(), FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill() (+31 more)

### Community 7 - "seed-adports-demo.mjs"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "access-admin.controller.ts"
Cohesion: 0.09
Nodes (19): APP_ROLES, isCapability(), AccessAdminController, ApiBody, Body, Controller, Get, Param (+11 more)

### Community 9 - "allow"
Cohesion: 0.11
Nodes (18): includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema, Bash(git add:*), Bash(git diff:*) (+10 more)

### Community 10 - "resources.controller.ts"
Cohesion: 0.11
Nodes (14): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+6 more)

### Community 11 - "import.service.ts"
Cohesion: 0.20
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

### Community 12 - "LookupsService"
Cohesion: 0.08
Nodes (22): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+14 more)

### Community 13 - "ChatRequestDto"
Cohesion: 0.18
Nodes (11): ChatMessageDto, ChatRequestDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsString (+3 more)

### Community 14 - "ProjectDetailPage.tsx"
Cohesion: 0.06
Nodes (43): Props, AdjustWeightsDialog(), AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, SaveTemplateDialog() (+35 more)

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 16 - "theme.ts"
Cohesion: 0.22
Nodes (14): AssistantChart(), summaryOf(), EChart(), EChartHost, EChartProps, EChartHost(), EChartHostProps, assistantChartOption() (+6 more)

### Community 17 - "CreateIssueDto"
Cohesion: 0.08
Nodes (23): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+15 more)

### Community 18 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "ProjectAccessService"
Cohesion: 0.24
Nodes (4): ProjectAccessGuard, Injectable, ProjectAccessService, Injectable

### Community 21 - "devDependencies"
Cohesion: 0.07
Nodes (27): eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-refresh, globals, jsdom, @testing-library/react (+19 more)

### Community 22 - "admin.ts"
Cohesion: 0.08
Nodes (23): Props, AdminLookupRow, adminLookupsApi, AdminLookupTable, CapabilityInfo, DirectoryMembership, ImportRowResult, Kpi (+15 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (27): @base-ui/react, class-variance-authority, dhtmlx-gantt, echarts, @fontsource-variable/inter, frappe-gantt, dependencies, @base-ui/react (+19 more)

### Community 25 - "dependencies"
Cohesion: 0.06
Nodes (31): @anthropic-ai/sdk, dependencies, @anthropic-ai/sdk, class-transformer, class-validator, jose, @nestjs/common, @nestjs/config (+23 more)

### Community 26 - ".add"
Cohesion: 0.15
Nodes (13): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+5 more)

### Community 27 - "reminders.service.ts"
Cohesion: 0.19
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 28 - "RequireCapability"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 29 - "jest"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "DashboardPage.tsx"
Cohesion: 0.13
Nodes (25): baseOption(), breakdownOption(), donutOption(), heatmapOption(), lineOption(), Segment, resolveCssColor(), ActionItemsBreakdown() (+17 more)

### Community 32 - "UI Visual Audit & Staged Restyling Plan"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "ProjectsController"
Cohesion: 0.21
Nodes (9): ProjectsController, ApiBody, Body, Controller, Get, Param, Patch, Post (+1 more)

### Community 34 - "ProjectScoped"
Cohesion: 0.16
Nodes (8): ApiTags, ProjectScoped(), ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

### Community 35 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "updates.controller.ts"
Cohesion: 0.16
Nodes (7): UpdateUpdateDto, Injectable, Update, UpdateListItem, UpdatesRepository, Injectable, UpdatesService

### Community 37 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "index.ts"
Cohesion: 0.11
Nodes (34): STATUSES, FREQUENCIES, CategorySelect(), Props, FY_YEARS, PersonAutocomplete(), Props, ProtectedRoute() (+26 more)

### Community 39 - "frontend/tsconfig.json"
Cohesion: 0.40
Nodes (4): compilerOptions, paths, files, references

### Community 40 - "dependencies"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "backend/package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 43 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "search.controller.ts"
Cohesion: 0.09
Nodes (18): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+10 more)

### Community 45 - "AttachmentsRepository"
Cohesion: 0.11
Nodes (6): AttachmentsRepository, Injectable, AttachmentsService, parseParent(), safeName(), Injectable

### Community 46 - "ProjectProgressReportPage.tsx"
Cohesion: 0.18
Nodes (13): calculatedProgress(), kpiAchievement(), kpiDataQuality(), KpiReadingLike, KpiScoreInput, MilestoneProgressRow, PERIODS_PER_YEAR, plannedProgress() (+5 more)

### Community 47 - "project-sections.module.ts"
Cohesion: 0.14
Nodes (14): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+6 more)

### Community 48 - "MilestoneDetailPage.tsx"
Cohesion: 0.06
Nodes (35): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, formatSize(), TaskAttachments(), actionItemsApi (+27 more)

### Community 49 - "AddMilestoneDialog"
Cohesion: 0.31
Nodes (9): AddMilestoneDialog(), doDelete(), reset(), resetFields(), submit(), emptyOwner(), ownerFromMilestone(), profileName() (+1 more)

### Community 50 - "ImportPage.tsx"
Cohesion: 0.17
Nodes (15): importApi, ImportSummary, parseCsv(), FieldDef, ImportPage(), commit(), loadCsv(), onFile() (+7 more)

### Community 54 - "SubmissionsService"
Cohesion: 0.07
Nodes (19): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, CyclesController, ReportsController (+11 more)

### Community 55 - "WorkflowPanel.tsx"
Cohesion: 0.13
Nodes (17): Chip(), personName(), Props, STATUS_CHIP, WorkflowPanel(), Cycle, cyclesApi, CycleStatusReport (+9 more)

### Community 56 - "MilestonesService"
Cohesion: 0.14
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

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

### Community 61 - "people.controller.ts"
Cohesion: 0.06
Nodes (32): ProjectAccess(), CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString (+24 more)

### Community 62 - "ActionItemsController"
Cohesion: 0.23
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 63 - "AuthUser"
Cohesion: 0.08
Nodes (20): AuthUser, CurrentUser, Delete, Get, Delete, Delete, Delete, Get (+12 more)

### Community 64 - "users.service.ts"
Cohesion: 0.21
Nodes (8): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, PendingMembershipRow, planClaim()

### Community 65 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "cn"
Cohesion: 0.20
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 67 - "app.controller.ts"
Cohesion: 0.24
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 68 - "templates.service.ts"
Cohesion: 0.18
Nodes (9): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload, TemplatesService (+1 more)

### Community 69 - "import.controller.ts"
Cohesion: 0.21
Nodes (10): ImportRowsDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, ImportController, ApiBody, Body (+2 more)

### Community 70 - "action-items.service.ts"
Cohesion: 0.12
Nodes (19): COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray (+11 more)

### Community 71 - "P-Track progress summary"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "toHttpException"
Cohesion: 0.13
Nodes (10): toHttpException(), DirectoryMembership, DirectoryPerson, GlobalActionItem, GlobalMilestone, MemberRow, RegistryService, Injectable (+2 more)

### Community 73 - "CommandPalette.tsx"
Cohesion: 0.07
Nodes (34): AppLayout(), NAV_ITEMS, CommandPalette(), Entry, hitPath(), KIND_META, Props, NotificationBell() (+26 more)

### Community 74 - "App.tsx"
Cohesion: 0.06
Nodes (46): App(), Props, Props, Button(), buttonVariants, Skeleton(), accessApi, AdminUser (+38 more)

### Community 75 - "AddMilestoneDialog.tsx"
Cohesion: 0.19
Nodes (26): STATUSES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, Props, Props (+18 more)

### Community 76 - "RisksService"
Cohesion: 0.17
Nodes (4): RisksRepository, Injectable, RisksService, Injectable

### Community 78 - "Milestone"
Cohesion: 0.15
Nodes (19): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+11 more)

### Community 79 - "risks.service.ts"
Cohesion: 0.23
Nodes (10): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+2 more)

### Community 80 - "FORMULAS.md — P-Track calculation registry"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "templates.controller.ts"
Cohesion: 0.12
Nodes (18): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+10 more)

### Community 82 - "submissions.module.ts"
Cohesion: 0.27
Nodes (8): NotificationsModule, Module, ProjectsModule, Module, RisksModule, Module, SubmissionsModule, Module

### Community 83 - "DatabaseService"
Cohesion: 0.07
Nodes (26): logger, DatabaseService, Injectable, Issue, IssueListItem, Link, LinkListItem, ACCESS_LEVELS (+18 more)

### Community 84 - "NotificationsService"
Cohesion: 0.13
Nodes (6): NotificationsController, Controller, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 85 - "access.decorators.ts"
Cohesion: 0.11
Nodes (30): AdminOnly(), CAPABILITY_KEY, MIN_APP_ROLE_KEY, MinAppRole(), PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY, AccessLevel, AppRole (+22 more)

### Community 86 - "dashboard.service.ts"
Cohesion: 0.09
Nodes (23): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, plannedProgress(), RISK_HIGH_THRESHOLD, DashboardController, Controller, DashboardModule (+15 more)

### Community 87 - "frappe-gantt.d.ts"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - ".chat"
Cohesion: 0.19
Nodes (11): ApiOperation, ApiProduces, ApiResponse, AssistantController, Body, Controller, Get, Post (+3 more)

### Community 89 - "assistant.chart.ts"
Cohesion: 0.29
Nodes (8): CHART_LIMITS, DonutChart, isFiniteNumber(), isRecord(), SeriesChart, text(), TimelineChart, validateChartSpec()

### Community 90 - "ProjectOverviewCards.tsx"
Cohesion: 0.22
Nodes (11): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Project, ProjectDetail (+3 more)

### Community 91 - "directory.ts"
Cohesion: 0.13
Nodes (13): AccessLevel, AccessLevelValue, MEMBERSHIP_LEVEL, projectAccessLevel(), AppRole, lookupCache, Me, MyMembership (+5 more)

### Community 92 - "Findings for `main` from the exploratory refactor branch"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 94 - "attachments.service.ts"
Cohesion: 0.16
Nodes (14): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, ATTACHMENTS_BUCKET, PARENT_TABLES, PARENT_TYPES (+6 more)

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

### Community 101 - "assistant.service.ts"
Cohesion: 0.18
Nodes (9): CHART_TOOL, ChartSpec, AssistantAction, AssistantTool, AssistantWriteTool, NO_INPUT, PROJECT_ID, READ_TOOLS (+1 more)

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "milestones.module.ts"
Cohesion: 0.21
Nodes (8): ImportModule, Module, MilestonesModule, Module, ProgramOutcomesModule, Module, TemplatesModule, Module

### Community 104 - "status-reports.service.ts"
Cohesion: 0.21
Nodes (10): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, COLUMN_SPEC (+2 more)

### Community 105 - "projects.service.ts"
Cohesion: 0.22
Nodes (9): MilestoneProgressRow, HISTORY_SELECT, HistoryEntry, PROJECT_HISTORY_SELECT, Project, ProjectDetail, ProjectListRow, ProjectListStats (+1 more)

### Community 106 - "ValueRow"
Cohesion: 1.00
Nodes (3): ValueRow(), patch(), saveName()

### Community 107 - "CreateKpiDto"
Cohesion: 0.05
Nodes (35): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+27 more)

### Community 108 - "assistant.controller.ts"
Cohesion: 0.19
Nodes (7): Injectable, UserThrottlerGuard, ExecuteActionDto, ApiProperty, IsString, MaxLength, IsObject

### Community 109 - ".update"
Cohesion: 0.23
Nodes (8): RisksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 111 - "MilestonesController"
Cohesion: 0.21
Nodes (8): MilestonesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 114 - "LinksService"
Cohesion: 0.17
Nodes (4): LinksRepository, Injectable, LinksService, Injectable

### Community 115 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 116 - "ProgramOutcomesService"
Cohesion: 0.18
Nodes (4): ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable

### Community 118 - "CreateProjectWizard"
Cohesion: 0.33
Nodes (8): CreateProjectWizard(), buildPayload(), next(), submit(), validateStep1(), validateStep2(), validateStep3(), todayISO()

### Community 121 - "StatusReportsController"
Cohesion: 0.19
Nodes (8): StatusReportsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 123 - "AddRiskDialog"
Cohesion: 0.36
Nodes (5): AddRiskDialog(), remove(), reset(), submit(), emptyPerson()

### Community 124 - "CreateAccountDialog"
Cohesion: 0.33
Nodes (7): CreateAccountDialog(), create(), inviteDraft(), isPocEmail(), POC_DOMAIN, pocEmail(), tempPassword()

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "UsersController"
Cohesion: 0.18
Nodes (8): ApiBody, Body, Controller, Get, Patch, Post, Query, UsersController

### Community 130 - "@nestjs/swagger"
Cohesion: 0.16
Nodes (15): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+7 more)

### Community 131 - "program-outcomes.service.ts"
Cohesion: 0.19
Nodes (12): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+4 more)

### Community 132 - "AssistantPage.tsx"
Cohesion: 0.20
Nodes (12): AssistantMarkdown(), components, AssistantAction, assistantApi, AssistantEvent, ChartSpec, ChatMessage, ActionState (+4 more)

### Community 133 - "projects.controller.ts"
Cohesion: 0.13
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 134 - "format.ts"
Cohesion: 0.21
Nodes (11): Props, TasksCard(), dueIn(), formatDate(), initials(), PersonLike, personName(), relativeTime() (+3 more)

### Community 135 - "ProgramOutcomesController"
Cohesion: 0.19
Nodes (8): ProgramOutcomesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 136 - "StatusReportsRepository"
Cohesion: 0.16
Nodes (5): StatusReport, StatusReportDetail, StatusReportListItem, StatusReportsRepository, Injectable

### Community 137 - "app.module.ts"
Cohesion: 0.12
Nodes (15): AppModule, DatabaseModule, Global, Module, AccessAdminModule, Module, AssistantModule, Module (+7 more)

### Community 138 - "links.service.ts"
Cohesion: 0.19
Nodes (12): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+4 more)

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

### Community 146 - "AddKpiDialog"
Cohesion: 0.43
Nodes (5): AddKpiDialog(), remove(), reset(), submit(), emptyPerson()

### Community 147 - "UpdatesController"
Cohesion: 0.21
Nodes (9): ApiBody, Body, Controller, Get, Param, Patch, Post, Query (+1 more)

### Community 148 - "ProjectsService"
Cohesion: 0.21
Nodes (4): projectColumns(), ProjectsService, Injectable, utilizationRatio()

### Community 149 - "LinksController"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 150 - "CreateMilestoneDto"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 151 - "ResourcesController"
Cohesion: 0.23
Nodes (8): ResourcesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 152 - "CreateUpdateDto"
Cohesion: 0.20
Nodes (8): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID

### Community 153 - "PaginationQueryDto"
Cohesion: 0.25
Nodes (7): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type

### Community 154 - "risks.repository.ts"
Cohesion: 0.33
Nodes (3): riskScore(), Risk, RiskListItem

### Community 155 - "AddPersonDialog"
Cohesion: 0.48
Nodes (7): AddPersonDialog(), doRemove(), reset(), resetFields(), submit(), emptyPerson(), memberName()

### Community 157 - "AddIssueDialog"
Cohesion: 0.53
Nodes (5): AddIssueDialog(), remove(), reset(), submit(), emptyPerson()

### Community 158 - "UpdateMeDto"
Cohesion: 0.40
Nodes (4): ApiProperty, IsString, MaxLength, UpdateMeDto

### Community 159 - "AddStatusReportDialog"
Cohesion: 0.70
Nodes (5): AddStatusReportDialog(), remove(), reset(), submit(), today()

### Community 160 - "AccessModule"
Cohesion: 0.67
Nodes (3): AccessModule, Global, Module

## Knowledge Gaps
- **560 isolated node(s):** `name`, `version`, `description`, `author`, `private` (+555 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `ActionItemsRepository`, `ProgramOutcomesController`, `access-admin.controller.ts`, `StatusReportsRepository`, `resources.controller.ts`, `import.service.ts`, `LookupsService`, `CreateIssueDto`, `ProjectAccessService`, `ProjectsService`, `CreateUpdateDto`, `risks.repository.ts`, `columnsFrom`, `updates.controller.ts`, `ProjectsRepository`, `search.controller.ts`, `AttachmentsRepository`, `SubmissionsService`, `MilestonesService`, `people.controller.ts`, `AuthUser`, `users.service.ts`, `templates.service.ts`, `RisksService`, `templates.controller.ts`, `DatabaseService`, `NotificationsService`, `access.decorators.ts`, `dashboard.service.ts`, `attachments.service.ts`, `projects.service.ts`, `CreateKpiDto`, `MilestonesController`, `LinksService`, `ProgramOutcomesService`, `StatusReportsController`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `UsersController`, `@nestjs/swagger`, `program-outcomes.service.ts`, `projects.controller.ts`, `ProgramOutcomesController`, `access-admin.controller.ts`, `links.service.ts`, `resources.controller.ts`, `CreateIssueDto`, `UpdatesController`, `LinksController`, `ResourcesController`, `.add`, `RequireCapability`, `ProjectsController`, `updates.controller.ts`, `search.controller.ts`, `SubmissionsService`, `people.controller.ts`, `ActionItemsController`, `users.service.ts`, `import.controller.ts`, `action-items.service.ts`, `toHttpException`, `risks.service.ts`, `templates.controller.ts`, `NotificationsService`, `access.decorators.ts`, `dashboard.service.ts`, `status-reports.service.ts`, `CreateKpiDto`, `.update`, `MilestonesController`, `StatusReportsController`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AuthUser` to `UsersController`, `@nestjs/swagger`, `program-outcomes.service.ts`, `projects.controller.ts`, `ProgramOutcomesController`, `access-admin.controller.ts`, `links.service.ts`, `resources.controller.ts`, `CreateIssueDto`, `UpdatesController`, `LinksController`, `ResourcesController`, `.add`, `RequireCapability`, `ProjectsController`, `updates.controller.ts`, `search.controller.ts`, `SubmissionsService`, `people.controller.ts`, `ActionItemsController`, `import.controller.ts`, `action-items.service.ts`, `risks.service.ts`, `templates.controller.ts`, `NotificationsService`, `access.decorators.ts`, `dashboard.service.ts`, `status-reports.service.ts`, `CreateKpiDto`, `.update`, `MilestonesController`, `StatusReportsController`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _560 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CreateProjectDto` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `seed-demo-data.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._