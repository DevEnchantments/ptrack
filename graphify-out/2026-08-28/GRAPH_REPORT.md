# Graph Report - ptrack  (2026-08-28)

## Corpus Check
- 358 files · ~188,151 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2827 nodes · 6619 edges · 146 communities (126 shown, 20 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 277 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `004e6e95`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- P-Track — Original Oracle APEX App: Feature Reference
- CreateProjectDto
- seed-demo-data.mjs
- FDD Alignment — P-Track ⇄ Project Tracker FDD
- devDependencies
- action-items.service.ts
- AssistantPage.tsx
- seed-adports-demo.mjs
- access-admin.controller.ts
- RequireCapability
- project-sections.service.ts
- import.service.ts
- lookups.service.ts
- assistant.service.ts
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
- SupabaseAuthGuard
- index.ts
- jest
- scripts
- DashboardPage.tsx
- UI Visual Audit & Staged Restyling Plan
- toHttpException
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
- search.controller.ts
- AttachmentsRepository
- reminders.service.ts
- project-sections.module.ts
- App.tsx
- AddMilestoneDialog
- ImportPage.tsx
- SubmissionsController
- workflow.ts
- CreateProjectWizard.tsx
- CLAUDE.md — P-Track
- core.ts
- app.controller.ts
- React + TypeScript + Vite
- people.controller.ts
- templates.controller.ts
- AuthUser
- MilestonesService
- seed-generic-lookups.mjs
- HomePage.tsx
- NotificationsService
- import.controller.ts
- RecordHistoryService
- MilestonesController
- P-Track progress summary
- lib/formulas.ts
- submissions.module.ts
- ProfilePage.tsx
- AddActionItemDialog.tsx
- risks.service.ts
- dev.ps1
- projects.ts
- access.decorators.ts
- FORMULAS.md — P-Track calculation registry
- admin.ts
- ProjectAccessService
- action-items.repository.ts
- users.controller.ts
- database.service.ts
- UpdateAttachmentDto
- frappe-gantt.d.ts
- .chat
- assistant.chart.ts
- @nestjs/swagger
- AccessModule
- Findings for `main` from the exploratory refactor branch
- IssuesController
- InitialsAvatar.tsx
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- AddActionItemDialog
- ResourcesController
- 2. Findings per surface
- assistant.tools.ts
- nest-cli.json
- NotificationBell.tsx
- format.ts
- status-reports.service.ts
- clsx
- CreateKpiDto
- ExecuteActionDto
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- templates.service.ts
- lucide-react
- react
- @tailwindcss/vite
- RecordHistory.tsx
- tw-animate-css
- CreateProjectWizard
- tailwindcss
- @types/node
- DatabaseService
- AssistantService
- AddRiskDialog
- program-outcomes.service.ts
- vite
- EditProjectDialog
- toaster.tsx
- AddKpiDialog
- ProjectsController
- AddPersonDialog
- app.module.ts
- links.service.ts
- A. Capabilities unlocked (ranked by project impact)
- AddAttachmentDialog
- AddLinkDialog
- AddResourceDialog
- AddUpdateDialog
- OutcomeDialog
- WorkflowPanel
- ValueRow
- prettier
- ts-jest
- ts-loader
- @types/node
- @types/supertest

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
- `AccessAdminController` --references--> `RequireCapability()`  [EXTRACTED]
  backend/src/modules/access-admin/access-admin.controller.ts → backend/src/common/access/access.decorators.ts
- `ImportController` --references--> `RequireCapability()`  [EXTRACTED]
  backend/src/modules/import/import.controller.ts → backend/src/common/access/access.decorators.ts
- `ActionItemsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/action-items/action-items.controller.ts → backend/src/common/access/access.decorators.ts
- `AttachmentsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/attachments/attachments.controller.ts → backend/src/common/access/access.decorators.ts
- `IssuesController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/issues/issues.controller.ts → backend/src/common/access/access.decorators.ts

## Import Cycles
- None detected.

## Communities (146 total, 20 thin omitted)

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

### Community 5 - "action-items.service.ts"
Cohesion: 0.05
Nodes (35): HistoryInsert, ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param (+27 more)

### Community 6 - "AssistantPage.tsx"
Cohesion: 0.14
Nodes (20): AssistantChart(), AssistantEChart, AssistantEChart(), buildOption(), compact(), fmt, themeColors(), withUnit() (+12 more)

### Community 7 - "seed-adports-demo.mjs"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "access-admin.controller.ts"
Cohesion: 0.11
Nodes (15): AccessAdminController, ApiBody, Body, Controller, Get, Param, Patch, ReplaceGrantsDto (+7 more)

### Community 9 - "RequireCapability"
Cohesion: 0.18
Nodes (12): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+4 more)

### Community 10 - "project-sections.service.ts"
Cohesion: 0.11
Nodes (14): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+6 more)

### Community 11 - "import.service.ts"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

### Community 12 - "lookups.service.ts"
Cohesion: 0.06
Nodes (30): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+22 more)

### Community 13 - "assistant.service.ts"
Cohesion: 0.18
Nodes (12): AssistantEvent, ChatMessageDto, ChatRequestDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, IsIn (+4 more)

### Community 14 - "ProjectDetailPage.tsx"
Cohesion: 0.06
Nodes (46): AdjustWeightsDialog(), SaveTemplateDialog(), SectionCard(), NavSection, Props, SectionNav(), AccessLevel, AccessLevelValue (+38 more)

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 16 - "dashboard.service.ts"
Cohesion: 0.11
Nodes (18): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, plannedProgress(), DashboardController, Controller, DashboardModule, Module (+10 more)

### Community 17 - "CreateIssueDto"
Cohesion: 0.10
Nodes (17): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+9 more)

### Community 18 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "SubmissionsService"
Cohesion: 0.09
Nodes (12): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, Cycle, Submission, SubmissionListItem (+4 more)

### Community 21 - "devDependencies"
Cohesion: 0.07
Nodes (27): devDependencies, eslint, @eslint/js, globals, jsdom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event (+19 more)

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
Cohesion: 0.14
Nodes (14): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Delete, Get, Param (+6 more)

### Community 28 - "index.ts"
Cohesion: 0.05
Nodes (52): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, Props, formatSize(), Props (+44 more)

### Community 29 - "jest"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "DashboardPage.tsx"
Cohesion: 0.16
Nodes (18): ActionItemsBreakdown(), ActivityLineChart(), BudgetBar(), CategoryDonut(), ChartPoint, ChartSegment, CompletionRadial(), FlowLineChart() (+10 more)

### Community 32 - "UI Visual Audit & Staged Restyling Plan"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "toHttpException"
Cohesion: 0.17
Nodes (3): toHttpException(), ProjectsRepository, Injectable

### Community 34 - "ProjectScoped"
Cohesion: 0.15
Nodes (8): ApiTags, ProjectScoped(), ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

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
Cohesion: 0.09
Nodes (26): columnsFrom(), ColumnSpec, MilestoneProgressRow, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+18 more)

### Community 43 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "search.controller.ts"
Cohesion: 0.09
Nodes (18): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+10 more)

### Community 45 - "AttachmentsRepository"
Cohesion: 0.11
Nodes (6): AttachmentsRepository, Injectable, AttachmentsService, parseParent(), safeName(), Injectable

### Community 46 - "reminders.service.ts"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 47 - "project-sections.module.ts"
Cohesion: 0.10
Nodes (20): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+12 more)

### Community 48 - "App.tsx"
Cohesion: 0.06
Nodes (50): App(), ExportCsvDialog(), Props, ProtectedRoute(), Props, TagChips(), DirectoryPerson, GlobalActionItem (+42 more)

### Community 49 - "AddMilestoneDialog"
Cohesion: 0.31
Nodes (9): AddMilestoneDialog(), doDelete(), reset(), resetFields(), submit(), emptyOwner(), ownerFromMilestone(), profileName() (+1 more)

### Community 50 - "ImportPage.tsx"
Cohesion: 0.17
Nodes (15): importApi, ImportSummary, parseCsv(), FieldDef, ImportPage(), commit(), loadCsv(), onFile() (+7 more)

### Community 54 - "SubmissionsController"
Cohesion: 0.23
Nodes (9): CyclesController, ReportsController, SubmissionsController, ApiBody, Body, Controller, Get, Param (+1 more)

### Community 55 - "workflow.ts"
Cohesion: 0.20
Nodes (9): Cycle, CycleStatusReport, CycleStatusRow, dashboardApi, DashboardChartPoint, DashboardData, InitiativeProgressRow, MonthlyPerformanceMonth (+1 more)

### Community 56 - "CreateProjectWizard.tsx"
Cohesion: 0.18
Nodes (13): emptyMember(), NEW_SECTOR, Props, StepAccess(), updateMember(), StepConfirmation(), Props, StepDetails() (+5 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "core.ts"
Cohesion: 0.17
Nodes (22): Props, Props, apiUpload(), Attachment, AttachmentDetail, API_URL, apiDelete(), apiGet() (+14 more)

### Community 59 - "app.controller.ts"
Cohesion: 0.18
Nodes (9): ApiSecurity, AppController, Controller, Get, AppService, Injectable, IS_PUBLIC_KEY, Public() (+1 more)

### Community 60 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "people.controller.ts"
Cohesion: 0.07
Nodes (31): ProjectAccess(), CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString (+23 more)

### Community 62 - "templates.controller.ts"
Cohesion: 0.12
Nodes (18): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+10 more)

### Community 63 - "AuthUser"
Cohesion: 0.08
Nodes (23): AuthUser, CurrentUser, Get, Delete, NotificationsController, Controller, Get, Param (+15 more)

### Community 64 - "MilestonesService"
Cohesion: 0.13
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 65 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "HomePage.tsx"
Cohesion: 0.11
Nodes (21): FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES (+13 more)

### Community 67 - "NotificationsService"
Cohesion: 0.13
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 68 - "import.controller.ts"
Cohesion: 0.19
Nodes (10): ImportRowsDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, ImportController, ApiBody, Body (+2 more)

### Community 69 - "RecordHistoryService"
Cohesion: 0.12
Nodes (10): RecordHistoryService, Injectable, Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, ATTACHMENTS_BUCKET (+2 more)

### Community 70 - "MilestonesController"
Cohesion: 0.21
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 71 - "P-Track progress summary"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "lib/formulas.ts"
Cohesion: 0.11
Nodes (15): fmtAed(), ProjectOverviewCards(), atRiskSuggested(), kpiAchievement(), kpiDataQuality(), KpiReadingLike, KpiScoreInput, MilestoneProgressRow (+7 more)

### Community 73 - "submissions.module.ts"
Cohesion: 0.25
Nodes (8): MilestonesModule, Module, NotificationsModule, Module, ProgramOutcomesModule, Module, ProjectsModule, Module

### Community 74 - "ProfilePage.tsx"
Cohesion: 0.06
Nodes (38): AppLayout(), NAV_ITEMS, CommandPalette(), Entry, hitPath(), KIND_META, Props, SavedSearch (+30 more)

### Community 75 - "AddActionItemDialog.tsx"
Cohesion: 0.16
Nodes (39): STATUSES, FREQUENCIES, STATUSES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, CategorySelect(), Props (+31 more)

### Community 76 - "risks.service.ts"
Cohesion: 0.07
Nodes (26): RISK_HIGH_THRESHOLD, riskScore(), CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional (+18 more)

### Community 78 - "projects.ts"
Cohesion: 0.08
Nodes (40): Props, Props, Props, Props, Props, Props, Props, Props (+32 more)

### Community 79 - "access.decorators.ts"
Cohesion: 0.16
Nodes (17): AdminOnly(), CAPABILITY_KEY, MIN_APP_ROLE_KEY, MinAppRole(), PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY, AccessLevel, APP_ROLES (+9 more)

### Community 80 - "FORMULAS.md — P-Track calculation registry"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "admin.ts"
Cohesion: 0.07
Nodes (26): Props, accessApi, AdminLookupRow, adminLookupsApi, AdminLookupTable, AdminUser, CapabilityGrants, CapabilityInfo (+18 more)

### Community 82 - "ProjectAccessService"
Cohesion: 0.24
Nodes (4): ProjectAccessGuard, Injectable, ProjectAccessService, Injectable

### Community 83 - "action-items.repository.ts"
Cohesion: 0.23
Nodes (8): HISTORY_SELECT, HistoryEntry, PROJECT_HISTORY_SELECT, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 84 - "users.controller.ts"
Cohesion: 0.07
Nodes (21): CAPABILITY_KEYS, ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiProperty (+13 more)

### Community 85 - "database.service.ts"
Cohesion: 0.15
Nodes (16): AppRole, CAPABILITIES, Capability, GRANTABLE_ROLES, GrantableRole, isAppRole(), isCapability(), AppRoleGuard (+8 more)

### Community 86 - "UpdateAttachmentDto"
Cohesion: 0.29
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

### Community 90 - "@nestjs/swagger"
Cohesion: 0.09
Nodes (27): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+19 more)

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

### Community 99 - "ResourcesController"
Cohesion: 0.23
Nodes (8): ResourcesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 101 - "assistant.tools.ts"
Cohesion: 0.20
Nodes (7): AssistantAction, AssistantTool, AssistantWriteTool, NO_INPUT, PROJECT_ID, READ_TOOLS, WRITE_TOOLS

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "NotificationBell.tsx"
Cohesion: 0.29
Nodes (8): NotificationBell(), markAll(), openItem(), refresh(), pathFor(), timeAgo(), AppNotification, notificationsApi

### Community 104 - "format.ts"
Cohesion: 0.36
Nodes (6): formatDate(), initials(), PersonLike, personName(), relativeTime(), atOffset()

### Community 105 - "status-reports.service.ts"
Cohesion: 0.07
Nodes (24): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+16 more)

### Community 107 - "CreateKpiDto"
Cohesion: 0.05
Nodes (35): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+27 more)

### Community 108 - "ExecuteActionDto"
Cohesion: 0.33
Nodes (5): ExecuteActionDto, ApiProperty, IsString, MaxLength, IsObject

### Community 111 - "templates.service.ts"
Cohesion: 0.17
Nodes (9): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload, TemplatesService (+1 more)

### Community 115 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 118 - "CreateProjectWizard"
Cohesion: 0.33
Nodes (8): CreateProjectWizard(), buildPayload(), next(), submit(), validateStep1(), validateStep2(), validateStep3(), todayISO()

### Community 121 - "DatabaseService"
Cohesion: 0.07
Nodes (13): logger, DatabaseService, Injectable, ProgramOutcome, DirectoryMembership, DirectoryPerson, GlobalActionItem, GlobalMilestone (+5 more)

### Community 123 - "AddRiskDialog"
Cohesion: 0.15
Nodes (15): AddIssueDialog(), remove(), reset(), submit(), emptyPerson(), AddRiskDialog(), remove(), reset() (+7 more)

### Community 124 - "program-outcomes.service.ts"
Cohesion: 0.07
Nodes (24): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+16 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "AddKpiDialog"
Cohesion: 0.43
Nodes (5): AddKpiDialog(), remove(), reset(), submit(), emptyPerson()

### Community 133 - "ProjectsController"
Cohesion: 0.18
Nodes (10): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+2 more)

### Community 136 - "AddPersonDialog"
Cohesion: 0.19
Nodes (14): AddPersonDialog(), doRemove(), reset(), resetFields(), submit(), emptyPerson(), memberName(), CreateAccountDialog() (+6 more)

### Community 137 - "app.module.ts"
Cohesion: 0.09
Nodes (19): AppModule, Module, DatabaseModule, Global, Module, AccessAdminModule, Module, AssistantModule (+11 more)

### Community 138 - "links.service.ts"
Cohesion: 0.07
Nodes (27): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+19 more)

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

## Knowledge Gaps
- **558 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+553 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `action-items.service.ts`, `access-admin.controller.ts`, `links.service.ts`, `import.service.ts`, `lookups.service.ts`, `project-sections.service.ts`, `dashboard.service.ts`, `CreateIssueDto`, `SubmissionsService`, `updates.controller.ts`, `projects.service.ts`, `search.controller.ts`, `AttachmentsRepository`, `people.controller.ts`, `templates.controller.ts`, `MilestonesService`, `NotificationsService`, `RecordHistoryService`, `risks.service.ts`, `access.decorators.ts`, `ProjectAccessService`, `action-items.repository.ts`, `users.controller.ts`, `database.service.ts`, `status-reports.service.ts`, `CreateKpiDto`, `templates.service.ts`, `DatabaseService`, `program-outcomes.service.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `action-items.service.ts`, `ProjectsController`, `access-admin.controller.ts`, `RequireCapability`, `links.service.ts`, `project-sections.service.ts`, `dashboard.service.ts`, `CreateIssueDto`, `.add`, `updates.controller.ts`, `projects.service.ts`, `search.controller.ts`, `SubmissionsController`, `people.controller.ts`, `templates.controller.ts`, `import.controller.ts`, `MilestonesController`, `risks.service.ts`, `access.decorators.ts`, `users.controller.ts`, `database.service.ts`, `@nestjs/swagger`, `IssuesController`, `ResourcesController`, `status-reports.service.ts`, `CreateKpiDto`, `program-outcomes.service.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AuthUser` to `action-items.service.ts`, `ProjectsController`, `access-admin.controller.ts`, `RequireCapability`, `links.service.ts`, `project-sections.service.ts`, `dashboard.service.ts`, `CreateIssueDto`, `.add`, `updates.controller.ts`, `projects.service.ts`, `search.controller.ts`, `SubmissionsController`, `people.controller.ts`, `templates.controller.ts`, `import.controller.ts`, `MilestonesController`, `risks.service.ts`, `users.controller.ts`, `@nestjs/swagger`, `IssuesController`, `ResourcesController`, `status-reports.service.ts`, `CreateKpiDto`, `program-outcomes.service.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _558 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CreateProjectDto` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `seed-demo-data.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._