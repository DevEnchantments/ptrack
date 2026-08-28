# Graph Report - ptrack  (2026-08-28)

## Corpus Check
- 362 files · ~211,276 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2846 nodes · 6668 edges · 153 communities (133 shown, 20 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 277 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d028149`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- P-Track — Original Oracle APEX App: Feature Reference
- import.service.ts
- seed-demo-data.mjs
- FDD Alignment — P-Track ⇄ Project Tracker FDD
- devDependencies
- ActionItemsRepository
- index.ts
- seed-adports-demo.mjs
- access-admin.controller.ts
- PaginationQueryDto
- resources.controller.ts
- ProjectAccess
- lookups.service.ts
- assistant.service.ts
- ProjectDetailPage.tsx
- compilerOptions
- supabase-error.ts
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
- attachments.service.ts
- ProjectSectionsController
- frontend/package.json
- updates.controller.ts
- exclude
- CreateProjectWizard.tsx
- frontend/tsconfig.json
- dependencies
- backend/package.json
- projects.service.ts
- backend/README.md
- search.service.ts
- AttachmentsRepository
- reminders.service.ts
- project-sections.module.ts
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
- templates.controller.ts
- AuthUser
- MilestonesService
- seed-generic-lookups.mjs
- ActionItemsPage.tsx
- app.controller.ts
- TemplatesService
- PortfolioReportsController
- ActionItemsController
- P-Track progress summary
- ProjectOverviewCards.tsx
- action-items.repository.ts
- use-me.ts
- AddActionItemDialog.tsx
- project-sections.service.ts
- dev.ps1
- Milestone
- ProjectAccessService
- FORMULAS.md — P-Track calculation registry
- admin.ts
- submissions.module.ts
- DatabaseService
- users.controller.ts
- access.logic.ts
- templates.module.ts
- frappe-gantt.d.ts
- .chat
- assistant.chart.ts
- CreateMilestoneDto
- SectionNav.tsx
- Findings for `main` from the exploratory refactor branch
- AuthProvider
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
- StatusReportsService
- columnsFrom
- ValueRow
- RequireCapability
- ExecuteActionDto
- risks.service.ts
- react
- ProgramOutcomesService
- lucide-react
- tailwindcss
- @tailwindcss/vite
- RecordHistory.tsx
- tw-animate-css
- CreateProjectWizard
- @testing-library/jest-dom
- vite
- Injectable
- AssistantService
- AddRiskDialog
- CreateProgramOutcomeDto
- cn
- templates.service.ts
- EditProjectDialog
- toaster.tsx
- WeightEntryDto
- UpdateProjectDto
- KpisPage.tsx
- CreateAccountDialog.tsx
- app.module.ts
- links.service.ts
- milestones.service.ts
- A. Capabilities unlocked (ranked by project impact)
- AddAttachmentDialog
- AddLinkDialog
- AddResourceDialog
- AddUpdateDialog
- OutcomeDialog
- CommandPalette.tsx
- prettier
- ts-jest
- ts-loader
- @types/node
- @types/supertest
- NotificationBell.tsx
- HomePage
- RecordHistoryService
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
- `WorkCard()` --calls--> `dueIn()`  [EXTRACTED]
  frontend/src/pages/ProfilePage.tsx → frontend/src/lib/format.ts
- `AppLayout()` --calls--> `signOut()`  [EXTRACTED]
  frontend/src/components/AppLayout.tsx → frontend/src/lib/auth-context.tsx
- `ResourcesController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/resources/resources.controller.ts → backend/src/common/access/access.decorators.ts
- `StatusReportsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/status-reports/status-reports.controller.ts → backend/src/common/access/access.decorators.ts

## Import Cycles
- None detected.

## Communities (153 total, 20 thin omitted)

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

### Community 5 - "ActionItemsRepository"
Cohesion: 0.14
Nodes (7): HistoryInsert, ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds(), ownersLabel(), Injectable

### Community 6 - "index.ts"
Cohesion: 0.12
Nodes (18): FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES (+10 more)

### Community 7 - "seed-adports-demo.mjs"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "access-admin.controller.ts"
Cohesion: 0.11
Nodes (15): AccessAdminController, ApiBody, Body, Controller, Get, Param, Patch, ReplaceGrantsDto (+7 more)

### Community 9 - "PaginationQueryDto"
Cohesion: 0.12
Nodes (16): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, ApiBody (+8 more)

### Community 10 - "resources.controller.ts"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "ProjectAccess"
Cohesion: 0.11
Nodes (17): ProjectAccess(), ApiBody, Body, Delete, Param, Patch, Post, ProjectsController (+9 more)

### Community 12 - "lookups.service.ts"
Cohesion: 0.06
Nodes (30): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+22 more)

### Community 13 - "assistant.service.ts"
Cohesion: 0.18
Nodes (12): AssistantEvent, ChatMessageDto, ChatRequestDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, IsIn (+4 more)

### Community 14 - "ProjectDetailPage.tsx"
Cohesion: 0.06
Nodes (46): AdjustWeightsDialog(), SaveTemplateDialog(), SectionCard(), projectAccessLevel(), calculatedProgress(), kpiAchievement(), kpiDataQuality(), KpiReadingLike (+38 more)

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 16 - "supabase-error.ts"
Cohesion: 0.09
Nodes (23): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), RISK_HIGH_THRESHOLD, logger, DashboardController (+15 more)

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
Cohesion: 0.09
Nodes (7): toHttpException(), RegistryService, Injectable, SubmissionsRepository, Injectable, SubmissionsService, Injectable

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
Cohesion: 0.10
Nodes (17): ApiConsumes, ApiBody, Body, Get, Param, Patch, Post, Query (+9 more)

### Community 27 - "action-items.service.ts"
Cohesion: 0.12
Nodes (19): COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray (+11 more)

### Community 28 - "MilestoneDetailPage.tsx"
Cohesion: 0.07
Nodes (33): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, formatSize(), Props, TaskAttachments() (+25 more)

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

### Community 33 - "attachments.service.ts"
Cohesion: 0.26
Nodes (8): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, ATTACHMENTS_BUCKET, PARENT_TABLES, PARENT_TYPES

### Community 34 - "ProjectSectionsController"
Cohesion: 0.29
Nodes (5): ApiTags, ProjectSectionsController, Controller, Get, Param

### Community 35 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "updates.controller.ts"
Cohesion: 0.11
Nodes (15): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+7 more)

### Community 37 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "CreateProjectWizard.tsx"
Cohesion: 0.10
Nodes (25): Props, AppRole, categoriesApi, lookupCache, MyWork, MyWorkItem, peopleApi, rolesApi (+17 more)

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
Cohesion: 0.09
Nodes (16): HISTORY_SELECT, HistoryEntry, PROJECT_HISTORY_SELECT, Milestone, MilestoneListItem, Project, ProjectDetail, ProjectListRow (+8 more)

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

### Community 47 - "project-sections.module.ts"
Cohesion: 0.13
Nodes (16): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+8 more)

### Community 48 - "App.tsx"
Cohesion: 0.06
Nodes (48): App(), ProtectedRoute(), Props, Button(), buttonVariants, Skeleton(), MyMembership, reportsApi (+40 more)

### Community 49 - "AddMilestoneDialog"
Cohesion: 0.31
Nodes (9): AddMilestoneDialog(), doDelete(), reset(), resetFields(), submit(), emptyOwner(), ownerFromMilestone(), profileName() (+1 more)

### Community 50 - "ImportPage.tsx"
Cohesion: 0.21
Nodes (13): parseCsv(), FieldDef, ImportPage(), commit(), loadCsv(), onFile(), rowRecord(), MILESTONE_FIELDS (+5 more)

### Community 54 - "SubmissionActionDto"
Cohesion: 0.16
Nodes (14): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, CyclesController, ReportsController, SubmissionsController (+6 more)

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
Cohesion: 0.13
Nodes (31): Props, Props, Props, Props, Props, Props, apiUpload(), Attachment (+23 more)

### Community 59 - "SupabaseAuthGuard"
Cohesion: 0.18
Nodes (4): IS_PUBLIC_KEY, AuthedRequest, SupabaseAuthGuard, Injectable

### Community 60 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "CreatePersonDto"
Cohesion: 0.07
Nodes (22): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+14 more)

### Community 62 - "templates.controller.ts"
Cohesion: 0.16
Nodes (16): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+8 more)

### Community 63 - "AuthUser"
Cohesion: 0.06
Nodes (31): AdminOnly(), MinAppRole(), ProjectScoped(), AuthUser, CurrentUser, Delete, AttachmentsController, Controller (+23 more)

### Community 64 - "MilestonesService"
Cohesion: 0.16
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 65 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "ActionItemsPage.tsx"
Cohesion: 0.13
Nodes (24): ExportCsvDialog(), Props, Props, TagChips(), GlobalMilestone, registryApi, buildCsv(), downloadCsv() (+16 more)

### Community 67 - "app.controller.ts"
Cohesion: 0.24
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 68 - "TemplatesService"
Cohesion: 0.20
Nodes (4): Delete, Param, TemplatesService, Injectable

### Community 69 - "PortfolioReportsController"
Cohesion: 0.29
Nodes (4): PortfolioReportsController, Controller, Get, Query

### Community 70 - "ActionItemsController"
Cohesion: 0.17
Nodes (8): ActionItemsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 71 - "P-Track progress summary"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "ProjectOverviewCards.tsx"
Cohesion: 0.14
Nodes (15): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, AccessLevel, AccessLevelValue (+7 more)

### Community 73 - "action-items.repository.ts"
Cohesion: 0.40
Nodes (3): ActionItem, ActionItemComment, ActionItemListItem

### Community 74 - "use-me.ts"
Cohesion: 0.21
Nodes (12): AppLayout(), NAV_ITEMS, atLeastRole(), fetchMe(), listeners, RANK, refreshMe(), useMe() (+4 more)

### Community 75 - "AddActionItemDialog.tsx"
Cohesion: 0.16
Nodes (36): STATUSES, FREQUENCIES, STATUSES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, CategorySelect(), Props (+28 more)

### Community 76 - "project-sections.service.ts"
Cohesion: 0.08
Nodes (10): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable, ProjectSectionsService, Injectable, Cycle (+2 more)

### Community 78 - "Milestone"
Cohesion: 0.13
Nodes (21): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+13 more)

### Community 79 - "ProjectAccessService"
Cohesion: 0.20
Nodes (8): PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY, defaultLevelFor(), LEVEL_LABEL, ProjectAccessGuard, Injectable, ProjectAccessService, Injectable

### Community 80 - "FORMULAS.md — P-Track calculation registry"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "admin.ts"
Cohesion: 0.11
Nodes (17): accessApi, AdminLookupRow, adminLookupsApi, AdminLookupTable, AdminUser, CapabilityGrants, CapabilityInfo, DirectoryMembership (+9 more)

### Community 82 - "submissions.module.ts"
Cohesion: 0.22
Nodes (10): ImportModule, Module, MilestonesModule, Module, NotificationsModule, Module, ProjectsModule, Module (+2 more)

### Community 83 - "DatabaseService"
Cohesion: 0.10
Nodes (13): DatabaseService, Injectable, Kpi, KpiActionPlan, KpiListItem, KpiReading, RegistryModule, Module (+5 more)

### Community 84 - "users.controller.ts"
Cohesion: 0.07
Nodes (22): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiProperty, IsString (+14 more)

### Community 85 - "access.logic.ts"
Cohesion: 0.09
Nodes (29): CAPABILITY_KEY, MIN_APP_ROLE_KEY, APP_ROLES, AppRole, atLeastRole(), CAPABILITIES, Capability, CAPABILITY_KEYS (+21 more)

### Community 86 - "templates.module.ts"
Cohesion: 0.40
Nodes (4): ProgramOutcomesModule, Module, TemplatesModule, Module

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

### Community 91 - "SectionNav.tsx"
Cohesion: 0.50
Nodes (3): NavSection, Props, SectionNav()

### Community 92 - "Findings for `main` from the exploratory refactor branch"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 93 - "AuthProvider"
Cohesion: 0.50
Nodes (4): AuthProvider(), signIn(), signOut(), handleSubmit()

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

### Community 104 - "StatusReportsService"
Cohesion: 0.10
Nodes (13): StatusReportsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+5 more)

### Community 105 - "columnsFrom"
Cohesion: 0.15
Nodes (12): columnsFrom(), ColumnSpec, COLUMN_SPEC, CREATE_DEFAULTS, CreateStatusReportDto, ApiProperty, IsDateString, IsIn (+4 more)

### Community 106 - "ValueRow"
Cohesion: 1.00
Nodes (3): ValueRow(), patch(), saveName()

### Community 107 - "RequireCapability"
Cohesion: 0.05
Nodes (39): RequireCapability(), CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber (+31 more)

### Community 108 - "ExecuteActionDto"
Cohesion: 0.33
Nodes (5): ExecuteActionDto, ApiProperty, IsString, MaxLength, IsObject

### Community 109 - "risks.service.ts"
Cohesion: 0.07
Nodes (27): AccessLevel, ProjectAccessRow, riskScore(), CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn (+19 more)

### Community 111 - "ProgramOutcomesService"
Cohesion: 0.15
Nodes (4): ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable

### Community 115 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 118 - "CreateProjectWizard"
Cohesion: 0.33
Nodes (8): CreateProjectWizard(), buildPayload(), next(), submit(), validateStep1(), validateStep2(), validateStep3(), todayISO()

### Community 123 - "AddRiskDialog"
Cohesion: 0.11
Nodes (22): AddIssueDialog(), remove(), reset(), submit(), emptyPerson(), AddPersonDialog(), doRemove(), reset() (+14 more)

### Community 124 - "CreateProgramOutcomeDto"
Cohesion: 0.11
Nodes (16): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+8 more)

### Community 125 - "cn"
Cohesion: 0.20
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 126 - "templates.service.ts"
Cohesion: 0.29
Nodes (7): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 130 - "WeightEntryDto"
Cohesion: 0.29
Nodes (7): ApiProperty, ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 133 - "UpdateProjectDto"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 135 - "KpisPage.tsx"
Cohesion: 0.11
Nodes (15): AddKpiDialog(), remove(), reset(), submit(), emptyPerson(), Props, Kpi, kpisApi (+7 more)

### Community 136 - "CreateAccountDialog.tsx"
Cohesion: 0.32
Nodes (9): CreateAccountDialog(), create(), Props, EMAIL_RE, inviteDraft(), isPocEmail(), POC_DOMAIN, pocEmail() (+1 more)

### Community 137 - "app.module.ts"
Cohesion: 0.11
Nodes (15): AppModule, Module, DatabaseModule, Global, Module, AccessAdminModule, Module, AssistantModule (+7 more)

### Community 138 - "links.service.ts"
Cohesion: 0.07
Nodes (26): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+18 more)

### Community 139 - "milestones.service.ts"
Cohesion: 0.29
Nodes (7): AdjustWeightsDto, IsArray, Type, ValidateNested, UpdateMilestoneDto, COLUMN_SPEC, CREATE_DEFAULTS

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

### Community 147 - "CommandPalette.tsx"
Cohesion: 0.18
Nodes (9): CommandPalette(), Entry, hitPath(), KIND_META, Props, SavedSearch, searchApi, SearchHit (+1 more)

### Community 157 - "NotificationBell.tsx"
Cohesion: 0.29
Nodes (8): NotificationBell(), markAll(), openItem(), refresh(), pathFor(), timeAgo(), AppNotification, notificationsApi

### Community 159 - "HomePage"
Cohesion: 0.25
Nodes (5): HomePage(), initials(), prefersReducedMotion(), relativeTime(), useEntranceFlag()

### Community 164 - "RecordHistoryService"
Cohesion: 0.15
Nodes (6): RecordHistoryService, Injectable, ProgramOutcome, StatusReport, StatusReportDetail, StatusReportListItem

## Knowledge Gaps
- **560 isolated node(s):** `ImportRowResult`, `ImportSummary`, `AssistantAction`, `AssistantTool`, `AssistantWriteTool` (+555 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthUser` connect `AuthUser` to `import.service.ts`, `access-admin.controller.ts`, `PaginationQueryDto`, `links.service.ts`, `milestones.service.ts`, `ProjectAccess`, `resources.controller.ts`, `CreateIssueDto`, `.add`, `action-items.service.ts`, `updates.controller.ts`, `search.service.ts`, `SubmissionActionDto`, `MilestonesController`, `templates.controller.ts`, `PortfolioReportsController`, `ActionItemsController`, `ProjectAccessService`, `users.controller.ts`, `access.logic.ts`, `StatusReportsService`, `RequireCapability`, `risks.service.ts`, `CreateProgramOutcomeDto`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `toHttpException` to `import.service.ts`, `ActionItemsRepository`, `access-admin.controller.ts`, `links.service.ts`, `resources.controller.ts`, `lookups.service.ts`, `supabase-error.ts`, `CreateIssueDto`, `.add`, `attachments.service.ts`, `RecordHistoryService`, `updates.controller.ts`, `projects.service.ts`, `search.service.ts`, `AttachmentsRepository`, `MilestonesController`, `CreatePersonDto`, `MilestonesService`, `TemplatesService`, `PortfolioReportsController`, `ActionItemsController`, `action-items.repository.ts`, `project-sections.service.ts`, `ProjectAccessService`, `DatabaseService`, `users.controller.ts`, `access.logic.ts`, `StatusReportsService`, `columnsFrom`, `RequireCapability`, `risks.service.ts`, `ProgramOutcomesService`, `templates.service.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AuthUser` to `import.service.ts`, `access-admin.controller.ts`, `PaginationQueryDto`, `links.service.ts`, `milestones.service.ts`, `ProjectAccess`, `resources.controller.ts`, `CreateIssueDto`, `.add`, `action-items.service.ts`, `updates.controller.ts`, `search.service.ts`, `SubmissionActionDto`, `MilestonesController`, `templates.controller.ts`, `PortfolioReportsController`, `ActionItemsController`, `users.controller.ts`, `StatusReportsService`, `RequireCapability`, `risks.service.ts`, `CreateProgramOutcomeDto`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `ImportRowResult`, `ImportSummary`, `AssistantAction` to the rest of the system?**
  _560 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `import.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061952861952861954 - nodes in this community are weakly interconnected._
- **Should `seed-demo-data.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._