# Graph Report - ptrack  (2026-08-28)

## Corpus Check
- 362 files · ~211,178 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2845 nodes · 6669 edges · 168 communities (149 shown, 19 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 277 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e08ef41b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- P-Track — Original Oracle APEX App: Feature Reference
- import.service.ts
- seed-demo-data.mjs
- FDD Alignment — P-Track ⇄ Project Tracker FDD
- devDependencies
- ActionItemsRepository
- ProjectProgressReportPage.tsx
- seed-adports-demo.mjs
- access-admin.controller.ts
- RequireCapability
- resources.controller.ts
- ProjectsController
- LookupsService
- ChatRequestDto
- ProjectDetailPage.tsx
- compilerOptions
- dashboard.service.ts
- CreateIssueDto
- compilerOptions
- components.json
- toHttpException
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
- RecordHistoryService
- ProjectSectionsController
- frontend/package.json
- updates.controller.ts
- exclude
- EditProjectDialog.tsx
- frontend/tsconfig.json
- dependencies
- backend/package.json
- projects.repository.ts
- backend/README.md
- search.controller.ts
- AttachmentsRepository
- reminders.service.ts
- project-sections.module.ts
- App.tsx
- AddMilestoneDialog
- ImportPage.tsx
- SubmissionsService
- workflow.ts
- MilestonesController
- CLAUDE.md — P-Track
- projects.ts
- SupabaseAuthGuard
- React + TypeScript + Vite
- people.controller.ts
- CreateTemplateDto
- AuthUser
- MilestonesService
- seed-generic-lookups.mjs
- index.ts
- app.controller.ts
- DatabaseModule
- CreateProjectDto
- ActionItemsController
- P-Track progress summary
- ProjectOverviewCards.tsx
- assistant.service.ts
- use-me.ts
- AddActionItemDialog.tsx
- projects.service.ts
- dev.ps1
- Milestone
- ProjectAccessService
- FORMULAS.md — P-Track calculation registry
- admin.ts
- submissions.module.ts
- DatabaseService
- users.controller.ts
- access.logic.ts
- AddPersonDialog
- frappe-gantt.d.ts
- .chat
- assistant.chart.ts
- milestones.service.ts
- kpis.controller.ts
- Findings for `main` from the exploratory refactor branch
- links.service.ts
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
- StatusReportsController
- status-reports.service.ts
- ProfilePage.tsx
- KpisRepository
- ExecuteActionDto
- risks.service.ts
- react
- project-sections.service.ts
- lucide-react
- tailwindcss
- @tailwindcss/vite
- RecordHistory.tsx
- tw-animate-css
- CreateProjectWizard
- @testing-library/jest-dom
- vite
- AccessAdminService
- AssistantService
- AddRiskDialog
- program-outcomes.service.ts
- cn
- templates.service.ts
- EditProjectDialog
- toaster.tsx
- AddKpiDialog
- AdjustWeightsDto
- ImportRowsDto
- CreateKpiDto
- UpdateProjectDto
- CreateLookupValueDto
- KpisPage.tsx
- CreateAccountDialog.tsx
- app.module.ts
- LinksService
- CurrentUser
- A. Capabilities unlocked (ranked by project impact)
- AddAttachmentDialog
- AddLinkDialog
- AddResourceDialog
- AddUpdateDialog
- OutcomeDialog
- .update
- CommandPalette.tsx
- LinksController
- prettier
- ts-jest
- ts-loader
- @types/node
- @types/supertest
- UpdateAttachmentDto
- AddIssueDialog
- AddStatusReportDialog
- NotificationBell.tsx
- lookups.service.ts
- HomePage
- columnsFrom
- DashboardController
- kpis.repository.ts
- refreshMe
- status-reports.repository.ts
- AccessModule
- WorkflowPanel
- @types/node

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
- `Props` --references--> `ProjectMemberInput`  [EXTRACTED]
  frontend/src/components/PersonAutocomplete.tsx → frontend/src/pages/CreateProjectWizard.tsx
- `CategoryDonut()` --calls--> `donutOption()`  [EXTRACTED]
  frontend/src/pages/DashboardPage.tsx → frontend/src/lib/charts/dashboard-options.ts
- `InitiativesDonut()` --calls--> `donutOption()`  [EXTRACTED]
  frontend/src/pages/DashboardPage.tsx → frontend/src/lib/charts/dashboard-options.ts
- `ActivityLineChart()` --calls--> `lineOption()`  [EXTRACTED]
  frontend/src/pages/DashboardPage.tsx → frontend/src/lib/charts/dashboard-options.ts

## Import Cycles
- None detected.

## Communities (168 total, 19 thin omitted)

### Community 0 - "P-Track — Original Oracle APEX App: Feature Reference"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "import.service.ts"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

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

### Community 6 - "ProjectProgressReportPage.tsx"
Cohesion: 0.18
Nodes (11): Chip(), calculatedProgress(), KpiReadingLike, KpiScoreInput, MilestoneProgressRow, PERIODS_PER_YEAR, plannedProgress(), riskScore() (+3 more)

### Community 7 - "seed-adports-demo.mjs"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "access-admin.controller.ts"
Cohesion: 0.15
Nodes (12): ApiBody, Body, Param, Patch, ReplaceGrantsDto, ApiProperty, IsArray, IsString (+4 more)

### Community 9 - "RequireCapability"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 10 - "resources.controller.ts"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "ProjectsController"
Cohesion: 0.11
Nodes (17): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, ProjectsController (+9 more)

### Community 12 - "LookupsService"
Cohesion: 0.11
Nodes (11): LookupsController, Body, Controller, Get, Param, Patch, Post, LookupsModule (+3 more)

### Community 13 - "ChatRequestDto"
Cohesion: 0.18
Nodes (11): ChatMessageDto, ChatRequestDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsString (+3 more)

### Community 14 - "ProjectDetailPage.tsx"
Cohesion: 0.06
Nodes (43): Props, AdjustWeightsDialog(), SaveTemplateDialog(), NavSection, Props, SectionNav(), AccessLevel, AccessLevelValue (+35 more)

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 16 - "dashboard.service.ts"
Cohesion: 0.20
Nodes (11): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, plannedProgress(), ChartPoint, CLOSED_PROJECT, DashboardData, DashboardService (+3 more)

### Community 17 - "CreateIssueDto"
Cohesion: 0.07
Nodes (25): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+17 more)

### Community 18 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "toHttpException"
Cohesion: 0.10
Nodes (7): toHttpException(), RegistryService, Injectable, SearchService, Injectable, SubmissionsRepository, Injectable

### Community 21 - "devDependencies"
Cohesion: 0.07
Nodes (27): eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-refresh, globals, jsdom, @testing-library/react (+19 more)

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
Cohesion: 0.16
Nodes (12): ApiConsumes, AttachmentsController, ApiBody, Controller, Delete, Get, Param, Post (+4 more)

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
Cohesion: 0.05
Nodes (59): AssistantChart(), summaryOf(), AssistantMarkdown(), components, EChart(), EChartHost, EChartProps, EChartHost() (+51 more)

### Community 32 - "UI Visual Audit & Staged Restyling Plan"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "RecordHistoryService"
Cohesion: 0.15
Nodes (10): RecordHistoryService, Injectable, Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, ATTACHMENTS_BUCKET (+2 more)

### Community 34 - "ProjectSectionsController"
Cohesion: 0.29
Nodes (5): ApiTags, ProjectSectionsController, Controller, Get, Param

### Community 35 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "updates.controller.ts"
Cohesion: 0.07
Nodes (24): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+16 more)

### Community 37 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "EditProjectDialog.tsx"
Cohesion: 0.13
Nodes (29): CategorySelect(), Props, FY_YEARS, SelectContent(), SelectItem(), SelectTrigger(), SelectValue(), categoriesApi (+21 more)

### Community 39 - "frontend/tsconfig.json"
Cohesion: 0.40
Nodes (4): compilerOptions, paths, files, references

### Community 40 - "dependencies"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "backend/package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "projects.repository.ts"
Cohesion: 0.08
Nodes (16): MilestoneProgressRow, HISTORY_SELECT, HistoryEntry, PROJECT_HISTORY_SELECT, ActionItem, ActionItemComment, ActionItemListItem, Project (+8 more)

### Community 43 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "search.controller.ts"
Cohesion: 0.10
Nodes (14): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+6 more)

### Community 45 - "AttachmentsRepository"
Cohesion: 0.11
Nodes (6): AttachmentsRepository, Injectable, AttachmentsService, parseParent(), safeName(), Injectable

### Community 46 - "reminders.service.ts"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 47 - "project-sections.module.ts"
Cohesion: 0.11
Nodes (18): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+10 more)

### Community 48 - "App.tsx"
Cohesion: 0.06
Nodes (45): App(), ExportCsvDialog(), Props, ProtectedRoute(), Props, SectionCard(), Button(), buttonVariants (+37 more)

### Community 49 - "AddMilestoneDialog"
Cohesion: 0.31
Nodes (9): AddMilestoneDialog(), doDelete(), reset(), resetFields(), submit(), emptyOwner(), ownerFromMilestone(), profileName() (+1 more)

### Community 50 - "ImportPage.tsx"
Cohesion: 0.21
Nodes (13): parseCsv(), FieldDef, ImportPage(), commit(), loadCsv(), onFile(), rowRecord(), MILESTONE_FIELDS (+5 more)

### Community 54 - "SubmissionsService"
Cohesion: 0.12
Nodes (16): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, CyclesController, ReportsController, SubmissionsController (+8 more)

### Community 55 - "workflow.ts"
Cohesion: 0.15
Nodes (12): Props, Cycle, cyclesApi, CycleStatusReport, CycleStatusRow, dashboardApi, DashboardChartPoint, DashboardData (+4 more)

### Community 56 - "MilestonesController"
Cohesion: 0.21
Nodes (8): MilestonesController, ApiBody, Body, Controller, Get, Param, Patch, Post

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
Nodes (30): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+22 more)

### Community 62 - "CreateTemplateDto"
Cohesion: 0.12
Nodes (18): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+10 more)

### Community 63 - "AuthUser"
Cohesion: 0.07
Nodes (18): AuthUser, Delete, Delete, Delete, Delete, Get, Param, Post (+10 more)

### Community 64 - "MilestonesService"
Cohesion: 0.18
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 65 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "index.ts"
Cohesion: 0.08
Nodes (37): FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES (+29 more)

### Community 67 - "app.controller.ts"
Cohesion: 0.24
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 68 - "DatabaseModule"
Cohesion: 0.67
Nodes (3): DatabaseModule, Global, Module

### Community 69 - "CreateProjectDto"
Cohesion: 0.12
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 70 - "ActionItemsController"
Cohesion: 0.27
Nodes (8): ActionItemsController, ApiBody, Body, Controller, Get, Param, Patch, Post

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
Cohesion: 0.27
Nodes (8): AppLayout(), NAV_ITEMS, signOut(), atLeastRole(), fetchMe(), listeners, RANK, useMe()

### Community 75 - "AddActionItemDialog.tsx"
Cohesion: 0.17
Nodes (30): STATUSES, FREQUENCIES, STATUSES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props (+22 more)

### Community 76 - "projects.service.ts"
Cohesion: 0.11
Nodes (7): NotificationsController, Controller, NotificationsRepository, Injectable, NotificationsService, Injectable, COLUMN_SPEC

### Community 78 - "Milestone"
Cohesion: 0.13
Nodes (21): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+13 more)

### Community 79 - "ProjectAccessService"
Cohesion: 0.14
Nodes (9): PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY, LEVEL_LABEL, ProjectAccessGuard, Injectable, ProjectAccessService, Injectable, ReportsService (+1 more)

### Community 80 - "FORMULAS.md — P-Track calculation registry"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "admin.ts"
Cohesion: 0.12
Nodes (16): accessApi, AdminLookupRow, adminLookupsApi, AdminLookupTable, AdminUser, CapabilityGrants, CapabilityInfo, DirectoryMembership (+8 more)

### Community 82 - "submissions.module.ts"
Cohesion: 0.18
Nodes (12): MilestonesModule, Module, NotificationsModule, Module, ProgramOutcomesModule, Module, ProjectsModule, Module (+4 more)

### Community 83 - "DatabaseService"
Cohesion: 0.08
Nodes (23): ProjectAccessRow, logger, DatabaseService, Injectable, Milestone, MilestoneListItem, AppNotification, ProgramOutcome (+15 more)

### Community 84 - "users.controller.ts"
Cohesion: 0.07
Nodes (22): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiProperty, IsString (+14 more)

### Community 85 - "access.logic.ts"
Cohesion: 0.13
Nodes (25): CAPABILITY_KEY, MIN_APP_ROLE_KEY, APP_ROLES, AppRole, atLeastRole(), CAPABILITIES, Capability, CAPABILITY_KEYS (+17 more)

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
Cohesion: 0.14
Nodes (15): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+7 more)

### Community 91 - "kpis.controller.ts"
Cohesion: 0.20
Nodes (14): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+6 more)

### Community 92 - "Findings for `main` from the exploratory refactor branch"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 93 - "links.service.ts"
Cohesion: 0.18
Nodes (12): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+4 more)

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

### Community 104 - "StatusReportsController"
Cohesion: 0.16
Nodes (8): StatusReportsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 105 - "status-reports.service.ts"
Cohesion: 0.13
Nodes (12): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsRepository (+4 more)

### Community 106 - "ProfilePage.tsx"
Cohesion: 0.15
Nodes (12): AppRole, lookupCache, MyMembership, MyWork, MyWorkItem, peopleApi, rolesApi, usersApi (+4 more)

### Community 107 - "KpisRepository"
Cohesion: 0.11
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 108 - "ExecuteActionDto"
Cohesion: 0.33
Nodes (5): ExecuteActionDto, ApiProperty, IsString, MaxLength, IsObject

### Community 109 - "risks.service.ts"
Cohesion: 0.09
Nodes (16): RISK_HIGH_THRESHOLD, riskScore(), CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional (+8 more)

### Community 111 - "project-sections.service.ts"
Cohesion: 0.11
Nodes (6): ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable, ProjectSectionsService, Injectable

### Community 115 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 118 - "CreateProjectWizard"
Cohesion: 0.33
Nodes (8): CreateProjectWizard(), buildPayload(), next(), submit(), validateStep1(), validateStep2(), validateStep3(), todayISO()

### Community 121 - "AccessAdminService"
Cohesion: 0.19
Nodes (5): AccessAdminController, Controller, Get, AccessAdminService, Injectable

### Community 123 - "AddRiskDialog"
Cohesion: 0.36
Nodes (5): AddRiskDialog(), remove(), reset(), submit(), emptyPerson()

### Community 124 - "program-outcomes.service.ts"
Cohesion: 0.11
Nodes (21): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+13 more)

### Community 125 - "cn"
Cohesion: 0.18
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 126 - "templates.service.ts"
Cohesion: 0.17
Nodes (9): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload, TemplatesService (+1 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "AddKpiDialog"
Cohesion: 0.43
Nodes (5): AddKpiDialog(), remove(), reset(), submit(), emptyPerson()

### Community 130 - "AdjustWeightsDto"
Cohesion: 0.15
Nodes (11): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+3 more)

### Community 131 - "ImportRowsDto"
Cohesion: 0.21
Nodes (10): ImportRowsDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, ImportController, ApiBody, Body (+2 more)

### Community 132 - "CreateKpiDto"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 133 - "UpdateProjectDto"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 134 - "CreateLookupValueDto"
Cohesion: 0.21
Nodes (11): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+3 more)

### Community 135 - "KpisPage.tsx"
Cohesion: 0.14
Nodes (13): Props, Kpi, KpiReading, kpisApi, kpiAchievement(), kpiDataQuality(), formatValue(), KpiDetail() (+5 more)

### Community 136 - "CreateAccountDialog.tsx"
Cohesion: 0.32
Nodes (9): CreateAccountDialog(), create(), Props, EMAIL_RE, inviteDraft(), isPocEmail(), POC_DOMAIN, pocEmail() (+1 more)

### Community 137 - "app.module.ts"
Cohesion: 0.11
Nodes (16): AppModule, Module, AccessAdminModule, Module, DashboardModule, Module, ImportModule, Module (+8 more)

### Community 138 - "LinksService"
Cohesion: 0.14
Nodes (6): Link, LinkListItem, LinksRepository, Injectable, LinksService, Injectable

### Community 139 - "CurrentUser"
Cohesion: 0.20
Nodes (8): AdminOnly(), MinAppRole(), ProjectAccess(), ProjectScoped(), AccessLevel, CurrentUser, ACTION_BODY, @nestjs/swagger

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

### Community 146 - ".update"
Cohesion: 0.22
Nodes (9): RisksController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 147 - "CommandPalette.tsx"
Cohesion: 0.18
Nodes (9): CommandPalette(), Entry, hitPath(), KIND_META, Props, SavedSearch, searchApi, SearchHit (+1 more)

### Community 148 - "LinksController"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 154 - "UpdateAttachmentDto"
Cohesion: 0.20
Nodes (8): Body, Patch, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, UpdateAttachmentDto

### Community 155 - "AddIssueDialog"
Cohesion: 0.53
Nodes (5): AddIssueDialog(), remove(), reset(), submit(), emptyPerson()

### Community 156 - "AddStatusReportDialog"
Cohesion: 0.70
Nodes (5): AddStatusReportDialog(), remove(), reset(), submit(), today()

### Community 157 - "NotificationBell.tsx"
Cohesion: 0.29
Nodes (8): NotificationBell(), markAll(), openItem(), refresh(), pathFor(), timeAgo(), AppNotification, notificationsApi

### Community 158 - "lookups.service.ts"
Cohesion: 0.22
Nodes (8): ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED, CacheSlot, EXTRA_COLUMNS, LookupRow, SELECTS

### Community 159 - "HomePage"
Cohesion: 0.25
Nodes (5): HomePage(), initials(), prefersReducedMotion(), relativeTime(), useEntranceFlag()

### Community 160 - "columnsFrom"
Cohesion: 0.50
Nodes (3): columnsFrom(), ColumnSpec, projectColumns()

### Community 161 - "DashboardController"
Cohesion: 0.40
Nodes (3): DashboardController, Controller, Get

### Community 162 - "kpis.repository.ts"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 163 - "refreshMe"
Cohesion: 0.50
Nodes (5): refreshMe(), IdentityCard(), save(), PasswordCard(), save()

### Community 164 - "status-reports.repository.ts"
Cohesion: 0.83
Nodes (3): StatusReport, StatusReportDetail, StatusReportListItem

### Community 165 - "AccessModule"
Cohesion: 0.67
Nodes (3): AccessModule, Global, Module

## Knowledge Gaps
- **560 isolated node(s):** `What this project is`, `Tech stack`, `Hard architectural rules (do not violate)`, `Repo & environment`, `Current state — Phase 1 complete (full CRUD)` (+555 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `import.service.ts`, `AdjustWeightsDto`, `ActionItemsRepository`, `LinksService`, `resources.controller.ts`, `LookupsService`, `dashboard.service.ts`, `CreateIssueDto`, `UpdateAttachmentDto`, `lookups.service.ts`, `RecordHistoryService`, `kpis.repository.ts`, `status-reports.repository.ts`, `updates.controller.ts`, `projects.repository.ts`, `search.controller.ts`, `AttachmentsRepository`, `MilestonesController`, `people.controller.ts`, `CreateTemplateDto`, `MilestonesService`, `projects.service.ts`, `ProjectAccessService`, `DatabaseService`, `users.controller.ts`, `access.logic.ts`, `StatusReportsController`, `status-reports.service.ts`, `KpisRepository`, `risks.service.ts`, `project-sections.service.ts`, `AccessAdminService`, `templates.service.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `ImportRowsDto`, `access-admin.controller.ts`, `RequireCapability`, `resources.controller.ts`, `CurrentUser`, `ProjectsController`, `CreateIssueDto`, `.update`, `LinksController`, `.add`, `action-items.service.ts`, `DashboardController`, `updates.controller.ts`, `search.controller.ts`, `SubmissionsService`, `MilestonesController`, `people.controller.ts`, `CreateTemplateDto`, `ActionItemsController`, `projects.service.ts`, `ProjectAccessService`, `users.controller.ts`, `access.logic.ts`, `kpis.controller.ts`, `links.service.ts`, `StatusReportsController`, `status-reports.service.ts`, `program-outcomes.service.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `CurrentUser` to `CreateLookupValueDto`, `access-admin.controller.ts`, `app.module.ts`, `resources.controller.ts`, `ProjectsController`, `CreateIssueDto`, `action-items.service.ts`, `updates.controller.ts`, `search.controller.ts`, `SubmissionsService`, `people.controller.ts`, `app.controller.ts`, `assistant.service.ts`, `users.controller.ts`, `milestones.service.ts`, `kpis.controller.ts`, `links.service.ts`, `nest-cli.json`, `status-reports.service.ts`, `ExecuteActionDto`, `risks.service.ts`, `program-outcomes.service.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `What this project is`, `Tech stack`, `Hard architectural rules (do not violate)` to the rest of the system?**
  _560 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `seed-demo-data.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `ActionItemsRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.1164021164021164 - nodes in this community are weakly interconnected._