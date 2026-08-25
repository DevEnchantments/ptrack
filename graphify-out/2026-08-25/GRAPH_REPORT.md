# Graph Report - ptrack  (2026-08-25)

## Corpus Check
- 353 files · ~166,741 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2795 nodes · 6566 edges · 153 communities (135 shown, 18 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 276 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d32c67d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- P-Track — Original Oracle APEX App: Feature Reference
- import.service.ts
- seed-demo-data.mjs
- FDD Alignment — P-Track ⇄ Project Tracker FDD
- devDependencies
- action-items.service.ts
- cn
- seed-adports-demo.mjs
- AccessAdminService
- KpisController
- project-sections.service.ts
- CreateProjectDto
- lookups.service.ts
- assistant.controller.ts
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
- attachments.controller.ts
- SupabaseAuthGuard
- MilestoneDetailPage.tsx
- jest
- scripts
- DashboardPage.tsx
- UI Visual Audit & Staged Restyling Plan
- toHttpException
- ProjectSectionsController
- frontend/package.json
- updates.controller.ts
- exclude
- CreateProjectWizard.tsx
- frontend/tsconfig.json
- dependencies
- backend/package.json
- UpdateProjectDto
- backend/README.md
- SearchService
- attachments.service.ts
- reminders.service.ts
- project-sections.module.ts
- App.tsx
- AddMilestoneDialog
- ImportPage.tsx
- kpis.repository.ts
- workflow.ts
- action-items.controller.ts
- CLAUDE.md — P-Track
- core.ts
- app.controller.ts
- React + TypeScript + Vite
- CreatePersonDto
- templates.controller.ts
- AuthUser
- MilestonesService
- seed-generic-lookups.mjs
- index.ts
- submissions.module.ts
- kpis.controller.ts
- RisksService
- MilestonesController
- P-Track progress summary
- KpisPage.tsx
- CreateKpiDto
- use-me.ts
- AddActionItemDialog.tsx
- .replaceGrants
- dev.ps1
- ProjectDashboardTab.tsx
- access.logic.spec.ts
- FORMULAS.md — P-Track calculation registry
- admin.ts
- projects.ts
- projects.service.ts
- users.controller.ts
- access.logic.ts
- react
- frappe-gantt.d.ts
- DashboardService
- RequireCapability
- milestones.service.ts
- ProjectAccessService
- Findings for `main` from the exploratory refactor branch
- @tailwindcss/vite
- InitialsAvatar.tsx
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- AddActionItemDialog
- tw-animate-css
- 2. Findings per surface
- @testing-library/react
- nest-cli.json
- columnsFrom
- TimelinePage.tsx
- status-reports.service.ts
- @types/node
- KpisRepository
- typescript-eslint
- @supabase/supabase-js
- WeightEntryDto
- templates.service.ts
- CreateRiskDto
- NotificationBell.tsx
- CreateProgramOutcomeDto
- RecordHistory.tsx
- vitest
- CreateProjectWizard
- format.ts
- @nestjs/swagger
- DatabaseService
- links.service.ts
- AddRiskDialog
- ProgramOutcomesService
- CapabilityService
- AppRoleService
- EditProjectDialog
- toaster.tsx
- AddKpiDialog
- AddPersonDialog
- RisksModule
- AddIssueDialog
- ProjectAccess
- @eslint/js
- CreateAccountDialog.tsx
- app.module.ts
- LinksService
- AddStatusReportDialog
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
- LinksController

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
- `ActionItemsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/action-items/action-items.controller.ts → backend/src/common/access/access.decorators.ts
- `AttachmentsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/attachments/attachments.controller.ts → backend/src/common/access/access.decorators.ts
- `IssuesController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/issues/issues.controller.ts → backend/src/common/access/access.decorators.ts
- `LinksController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/links/links.controller.ts → backend/src/common/access/access.decorators.ts

## Import Cycles
- None detected.

## Communities (153 total, 18 thin omitted)

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

### Community 5 - "action-items.service.ts"
Cohesion: 0.09
Nodes (13): HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, ActionItemsRepository, Injectable, ActionItemsService, COLUMN_SPEC (+5 more)

### Community 6 - "cn"
Cohesion: 0.18
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 7 - "seed-adports-demo.mjs"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "AccessAdminService"
Cohesion: 0.15
Nodes (7): AccessAdminController, Controller, Get, AccessAdminModule, Module, AccessAdminService, Injectable

### Community 9 - "KpisController"
Cohesion: 0.19
Nodes (5): KpisController, Body, Controller, Get, Patch

### Community 10 - "project-sections.service.ts"
Cohesion: 0.07
Nodes (24): ProjectSectionsService, Injectable, CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID (+16 more)

### Community 11 - "CreateProjectDto"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 12 - "lookups.service.ts"
Cohesion: 0.06
Nodes (30): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+22 more)

### Community 13 - "assistant.controller.ts"
Cohesion: 0.05
Nodes (37): ApiOperation, ApiProduces, AssistantController, Body, Controller, Get, Post, AssistantModule (+29 more)

### Community 14 - "ProjectDetailPage.tsx"
Cohesion: 0.05
Nodes (45): AdjustWeightsDialog(), SaveTemplateDialog(), NavSection, Props, SectionNav(), AccessLevel, AccessLevelValue, MEMBERSHIP_LEVEL (+37 more)

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 16 - "dashboard.service.ts"
Cohesion: 0.11
Nodes (19): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, plannedProgress(), RISK_HIGH_THRESHOLD, ChartPoint, CLOSED_PROJECT, DashboardData (+11 more)

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
Cohesion: 0.11
Nodes (17): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, CyclesController, ReportsController (+9 more)

### Community 21 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+17 more)

### Community 22 - "allow"
Cohesion: 0.11
Nodes (18): includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema, Bash(git add:*), Bash(git diff:*) (+10 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "dependencies"
Cohesion: 0.08
Nodes (25): @base-ui/react, class-variance-authority, clsx, dhtmlx-gantt, @fontsource-variable/inter, frappe-gantt, dependencies, @base-ui/react (+17 more)

### Community 25 - "dependencies"
Cohesion: 0.07
Nodes (29): @anthropic-ai/sdk, dependencies, @anthropic-ai/sdk, class-transformer, class-validator, jose, @nestjs/common, @nestjs/config (+21 more)

### Community 26 - "attachments.controller.ts"
Cohesion: 0.10
Nodes (20): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Delete, Get, Param (+12 more)

### Community 27 - "SupabaseAuthGuard"
Cohesion: 0.18
Nodes (4): IS_PUBLIC_KEY, AuthedRequest, SupabaseAuthGuard, Injectable

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
Cohesion: 0.15
Nodes (19): ActionItemsBreakdown(), ActivityLineChart(), BudgetBar(), CategoryDonut(), ChartPoint, ChartSegment, CompletionRadial(), DashboardPage() (+11 more)

### Community 32 - "UI Visual Audit & Staged Restyling Plan"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "toHttpException"
Cohesion: 0.12
Nodes (5): toHttpException(), ProjectsRepository, Injectable, SubmissionsRepository, Injectable

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

### Community 38 - "CreateProjectWizard.tsx"
Cohesion: 0.18
Nodes (13): emptyMember(), NEW_SECTOR, Props, StepAccess(), updateMember(), StepConfirmation(), Props, StepDetails() (+5 more)

### Community 39 - "frontend/tsconfig.json"
Cohesion: 0.40
Nodes (4): compilerOptions, paths, files, references

### Community 40 - "dependencies"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "backend/package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "UpdateProjectDto"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 43 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "SearchService"
Cohesion: 0.09
Nodes (18): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+10 more)

### Community 45 - "attachments.service.ts"
Cohesion: 0.08
Nodes (14): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, ATTACHMENTS_BUCKET, AttachmentsRepository, PARENT_TABLES (+6 more)

### Community 46 - "reminders.service.ts"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 47 - "project-sections.module.ts"
Cohesion: 0.11
Nodes (18): ActionItemsModule, Module, AttachmentsModule, Module, LinksModule, Module, ProgramOutcomesModule, Module (+10 more)

### Community 48 - "App.tsx"
Cohesion: 0.05
Nodes (53): App(), AppLayout(), NAV_ITEMS, ProtectedRoute(), Props, SectionCard(), Button(), buttonVariants (+45 more)

### Community 49 - "AddMilestoneDialog"
Cohesion: 0.31
Nodes (9): AddMilestoneDialog(), doDelete(), reset(), resetFields(), submit(), emptyOwner(), ownerFromMilestone(), profileName() (+1 more)

### Community 50 - "ImportPage.tsx"
Cohesion: 0.21
Nodes (13): parseCsv(), FieldDef, ImportPage(), commit(), loadCsv(), onFile(), rowRecord(), MILESTONE_FIELDS (+5 more)

### Community 54 - "kpis.repository.ts"
Cohesion: 0.29
Nodes (6): KpisModule, Module, Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 55 - "workflow.ts"
Cohesion: 0.18
Nodes (10): Cycle, cyclesApi, CycleStatusReport, CycleStatusRow, dashboardApi, DashboardChartPoint, DashboardData, InitiativeProgressRow (+2 more)

### Community 56 - "action-items.controller.ts"
Cohesion: 0.09
Nodes (25): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+17 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "core.ts"
Cohesion: 0.23
Nodes (17): Props, Props, apiUpload(), Attachment, AttachmentDetail, API_URL, apiDelete(), apiGet() (+9 more)

### Community 59 - "app.controller.ts"
Cohesion: 0.24
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

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
Cohesion: 0.08
Nodes (24): AuthUser, CurrentUser, Get, Delete, Delete, Delete, NotificationsController, Controller (+16 more)

### Community 64 - "MilestonesService"
Cohesion: 0.10
Nodes (8): AdjustWeightsDto, IsArray, Type, ValidateNested, MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 65 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "index.ts"
Cohesion: 0.07
Nodes (42): ExportCsvDialog(), Props, FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow (+34 more)

### Community 67 - "submissions.module.ts"
Cohesion: 0.33
Nodes (6): MilestonesModule, Module, NotificationsModule, Module, ProjectsModule, Module

### Community 68 - "kpis.controller.ts"
Cohesion: 0.26
Nodes (12): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+4 more)

### Community 69 - "RisksService"
Cohesion: 0.15
Nodes (5): riskScore(), RisksRepository, Injectable, RisksService, Injectable

### Community 70 - "MilestonesController"
Cohesion: 0.27
Nodes (8): MilestonesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 71 - "P-Track progress summary"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "KpisPage.tsx"
Cohesion: 0.09
Nodes (22): Props, Kpi, kpisApi, calculatedProgress(), kpiAchievement(), kpiDataQuality(), KpiReadingLike, KpiScoreInput (+14 more)

### Community 73 - "CreateKpiDto"
Cohesion: 0.13
Nodes (14): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 74 - "use-me.ts"
Cohesion: 0.12
Nodes (20): AssistantAction, assistantApi, AssistantEvent, ChatMessage, Me, fetchMe(), listeners, RANK (+12 more)

### Community 75 - "AddActionItemDialog.tsx"
Cohesion: 0.16
Nodes (39): STATUSES, FREQUENCIES, STATUSES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, CategorySelect(), Props (+31 more)

### Community 76 - ".replaceGrants"
Cohesion: 0.16
Nodes (12): ApiBody, Body, Param, Patch, ReplaceGrantsDto, ApiProperty, IsArray, IsString (+4 more)

### Community 78 - "ProjectDashboardTab.tsx"
Cohesion: 0.24
Nodes (9): formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab(), addDays(), ProjectGantt(), todayIso(), useLocalStorage() (+1 more)

### Community 79 - "access.logic.spec.ts"
Cohesion: 0.20
Nodes (7): atLeastRole(), defaultLevelFor(), ProjectAccessInput, resolveProjectLevel(), base, ProjectAccessGuard, Injectable

### Community 80 - "FORMULAS.md — P-Track calculation registry"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "admin.ts"
Cohesion: 0.07
Nodes (27): CommandPalette(), Entry, hitPath(), KIND_META, Props, accessApi, AdminLookupRow, adminLookupsApi (+19 more)

### Community 82 - "projects.ts"
Cohesion: 0.09
Nodes (34): Props, Props, Props, Props, Props, Props, Props, Props (+26 more)

### Community 83 - "projects.service.ts"
Cohesion: 0.13
Nodes (15): MilestoneProgressRow, HISTORY_SELECT, HistoryEntry, PROJECT_HISTORY_SELECT, Milestone, MilestoneListItem, Project, ProjectDetail (+7 more)

### Community 84 - "users.controller.ts"
Cohesion: 0.07
Nodes (22): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiProperty, IsString (+14 more)

### Community 85 - "access.logic.ts"
Cohesion: 0.23
Nodes (12): CAPABILITY_KEY, MIN_APP_ROLE_KEY, APP_ROLES, AppRole, CAPABILITIES, CAPABILITY_KEYS, DEFAULT_GRANTS, GRANTABLE_ROLES (+4 more)

### Community 87 - "frappe-gantt.d.ts"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "DashboardService"
Cohesion: 0.25
Nodes (6): DashboardController, Controller, DashboardModule, Module, DashboardService, Injectable

### Community 89 - "RequireCapability"
Cohesion: 0.13
Nodes (14): RequireCapability(), ImportRowsDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, ImportController, ApiBody (+6 more)

### Community 90 - "milestones.service.ts"
Cohesion: 0.15
Nodes (15): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+7 more)

### Community 91 - "ProjectAccessService"
Cohesion: 0.14
Nodes (9): ProjectAccessService, Injectable, DirectoryMembership, DirectoryPerson, GlobalActionItem, GlobalMilestone, MemberRow, RegistryService (+1 more)

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

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "columnsFrom"
Cohesion: 0.26
Nodes (5): columnsFrom(), ColumnSpec, UpdateProgramOutcomeDto, COLUMN_SPEC, CREATE_DEFAULTS

### Community 104 - "TimelinePage.tsx"
Cohesion: 0.48
Nodes (5): addDays(), iso(), statusClass(), TimelinePage(), VIEW_MODES

### Community 105 - "status-reports.service.ts"
Cohesion: 0.08
Nodes (23): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+15 more)

### Community 107 - "KpisRepository"
Cohesion: 0.14
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 110 - "WeightEntryDto"
Cohesion: 0.29
Nodes (7): ApiProperty, ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 111 - "templates.service.ts"
Cohesion: 0.13
Nodes (11): Delete, Param, dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome (+3 more)

### Community 112 - "CreateRiskDto"
Cohesion: 0.11
Nodes (18): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+10 more)

### Community 113 - "NotificationBell.tsx"
Cohesion: 0.29
Nodes (8): NotificationBell(), markAll(), openItem(), refresh(), pathFor(), timeAgo(), AppNotification, notificationsApi

### Community 114 - "CreateProgramOutcomeDto"
Cohesion: 0.22
Nodes (9): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+1 more)

### Community 115 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 118 - "CreateProjectWizard"
Cohesion: 0.33
Nodes (8): CreateProjectWizard(), buildPayload(), next(), submit(), validateStep1(), validateStep2(), validateStep3(), todayISO()

### Community 119 - "format.ts"
Cohesion: 0.36
Nodes (6): formatDate(), initials(), PersonLike, personName(), relativeTime(), atOffset()

### Community 120 - "@nestjs/swagger"
Cohesion: 0.15
Nodes (11): AdminOnly(), MinAppRole(), PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY, ProjectScoped(), AccessLevel, LEVEL_LABEL, ProgramOutcomesController (+3 more)

### Community 121 - "DatabaseService"
Cohesion: 0.07
Nodes (20): ProjectAccessRow, logger, DatabaseService, Injectable, RecordHistoryService, Injectable, AppNotification, NotificationsRepository (+12 more)

### Community 122 - "links.service.ts"
Cohesion: 0.18
Nodes (12): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+4 more)

### Community 123 - "AddRiskDialog"
Cohesion: 0.36
Nodes (5): AddRiskDialog(), remove(), reset(), submit(), emptyPerson()

### Community 124 - "ProgramOutcomesService"
Cohesion: 0.15
Nodes (5): ProgramOutcome, ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable

### Community 125 - "CapabilityService"
Cohesion: 0.60
Nodes (4): Capability, GrantableRole, CapabilityService, Injectable

### Community 126 - "AppRoleService"
Cohesion: 0.17
Nodes (7): AccessModule, Global, Module, AppRoleGuard, Injectable, AppRoleService, Injectable

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "AddKpiDialog"
Cohesion: 0.43
Nodes (5): AddKpiDialog(), remove(), reset(), submit(), emptyPerson()

### Community 130 - "AddPersonDialog"
Cohesion: 0.48
Nodes (7): AddPersonDialog(), doRemove(), reset(), resetFields(), submit(), emptyPerson(), memberName()

### Community 132 - "AddIssueDialog"
Cohesion: 0.53
Nodes (5): AddIssueDialog(), remove(), reset(), submit(), emptyPerson()

### Community 133 - "ProjectAccess"
Cohesion: 0.11
Nodes (19): ProjectAccess(), PeopleController, ApiBody, Body, Controller, Delete, Param, Patch (+11 more)

### Community 136 - "CreateAccountDialog.tsx"
Cohesion: 0.13
Nodes (19): CreateAccountDialog(), create(), Props, AppRole, categoriesApi, lookupCache, MyMembership, MyWorkItem (+11 more)

### Community 137 - "app.module.ts"
Cohesion: 0.12
Nodes (15): AppModule, Module, DatabaseModule, Global, Module, ImportModule, Module, IssuesModule (+7 more)

### Community 138 - "LinksService"
Cohesion: 0.14
Nodes (6): Link, LinkListItem, LinksRepository, Injectable, LinksService, Injectable

### Community 139 - "AddStatusReportDialog"
Cohesion: 0.70
Nodes (5): AddStatusReportDialog(), remove(), reset(), submit(), today()

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

### Community 154 - "LinksController"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

## Knowledge Gaps
- **550 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+545 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `import.service.ts`, `action-items.service.ts`, `AccessAdminService`, `KpisController`, `LinksService`, `project-sections.service.ts`, `lookups.service.ts`, `dashboard.service.ts`, `CreateIssueDto`, `SubmissionsService`, `updates.controller.ts`, `SearchService`, `attachments.service.ts`, `kpis.repository.ts`, `CreatePersonDto`, `MilestonesService`, `RisksService`, `projects.service.ts`, `users.controller.ts`, `access.logic.ts`, `ProjectAccessService`, `columnsFrom`, `status-reports.service.ts`, `KpisRepository`, `templates.service.ts`, `DatabaseService`, `ProgramOutcomesService`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `ProjectAccess`, `KpisController`, `project-sections.service.ts`, `dashboard.service.ts`, `CreateIssueDto`, `SubmissionsService`, `attachments.controller.ts`, `LinksController`, `updates.controller.ts`, `SearchService`, `action-items.controller.ts`, `templates.controller.ts`, `kpis.controller.ts`, `MilestonesController`, `CreateKpiDto`, `.replaceGrants`, `users.controller.ts`, `access.logic.ts`, `RequireCapability`, `milestones.service.ts`, `status-reports.service.ts`, `CreateRiskDto`, `@nestjs/swagger`, `links.service.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AuthUser` to `ProjectAccess`, `KpisController`, `project-sections.service.ts`, `dashboard.service.ts`, `CreateIssueDto`, `SubmissionsService`, `attachments.controller.ts`, `LinksController`, `updates.controller.ts`, `SearchService`, `action-items.controller.ts`, `templates.controller.ts`, `kpis.controller.ts`, `MilestonesController`, `CreateKpiDto`, `.replaceGrants`, `users.controller.ts`, `RequireCapability`, `milestones.service.ts`, `status-reports.service.ts`, `CreateRiskDto`, `@nestjs/swagger`, `links.service.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _550 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `seed-demo-data.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `action-items.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0858974358974359 - nodes in this community are weakly interconnected._