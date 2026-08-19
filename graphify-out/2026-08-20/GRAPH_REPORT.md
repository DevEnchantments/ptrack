# Graph Report - ptrack  (2026-08-20)

## Corpus Check
- 385 files · ~185,504 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2761 nodes · 6671 edges · 150 communities (128 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cd725fa3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- CreateProjectDto
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- AddMilestoneDialog.tsx
- CreateActionItemDto
- nest-cli.json
- Community 34
- Community 35
- ProjectsRepository
- Community 37
- status-reports.repository.ts
- Community 39
- Community 40
- Community 41
- CreateProjectDto
- Community 43
- Community 44
- Community 45
- nest-cli.json
- Community 47
- status-reports.repository.ts
- RecordHistoryService
- Community 50
- ProjectsController
- action-items.repository.ts
- @types/node
- .update
- @nestjs/swagger
- @types/node
- ActionItemDetailPage.tsx
- PeopleRepository
- CreateMilestoneDto
- auth-context.tsx
- PaginationQueryDto
- .add
- react-dom
- links.service.ts
- RecordHistoryService
- WorkflowPanel.tsx
- 2. Core functional modules
- moduleFileExtensions
- @nestjs/config
- .add
- status-reports.service.ts
- AddStatusReportDialog.tsx
- .add
- dev.ps1
- WorkflowPanel.tsx
- README.md
- ApiProperty
- lookups.service.ts
- AccessModule
- AddMilestoneDialog.tsx
- users.service.ts
- globals
- AttachmentDetailPage.tsx
- @supabase/supabase-js
- templates.service.ts
- ActionItemsController
- StatusReportsController
- DatabaseModule
- PeoplePage.tsx
- users.module.ts
- AuthUser
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- CreateLookupValueDto
- ProjectsGrid.tsx
- 2. Findings per surface
- ProjectProgressReportPage.tsx
- nest-cli.json
- vite
- 🚀 Quick start
- ResourcesService
- AddMilestoneDialog.tsx
- eslint-plugin-react-hooks
- frappe-gantt
- eslint-plugin-prettier
- action-items.repository.ts
- @nestjs/swagger
- app.module.ts
- ts-loader
- CreateLookupValueDto
- CreateMilestoneDto
- vitest
- CreateKpiDto
- project-sections.service.ts
- eslint
- .me
- UpdateAttachmentDto
- ProjectSectionsController
- UpdateMeDto
- milestones.service.ts
- AccessModule
- ImportPage.tsx
- toaster.tsx
- status-reports.repository.ts
- CreateKpiActionPlanDto
- milestones.service.ts
- TemplatesService
- .update
- AdjustWeightsDto
- attachments.repository.ts
- CreateLinkDto
- @supabase/supabase-js
- UpdatePersonDto
- ProjectSectionsController
- Follow-ups register
- CreateRiskDto
- UpdateAttachmentDto
- SectionNav.tsx
- eslint
- SubmissionsModule
- submissions.service.spec.ts
- KpisModule
- UsersModule

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 159 edges
2. `AuthUser` - 102 edges
3. `CurrentUser` - 98 edges
4. `DatabaseService` - 67 edges
5. `@nestjs/swagger` - 60 edges
6. `Button()` - 51 edges
7. `usePageTitle()` - 51 edges
8. `toast` - 39 edges
9. `RecordHistoryService` - 38 edges
10. `columnsFrom()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `ProjectGantt()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → backend/scripts/seed-generic-lookups.mjs
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `ProjectGantt()` --indirect_call--> `statusClass()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → frontend/src/pages/TimelinePage.tsx

## Import Cycles
- None detected.

## Communities (150 total, 22 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (10): 2. Functionality inventory (FDD FR-01…15 → status), 3. Use cases UC-01…18 — acceptance checklist, 4. Key validations / business rules (FDD 3.3.2), 5. Reports & notifications (defer until math lands), 6. Open questions for the supervisor (blockers marked ⛔), 7. Execution roadmap, 8. Security phase — access model (ASSUMED 2026-08-17; ENFORCED same day, Fares approved "as I see fit"), 9. Conventions carried forward (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (35): devDependencies, eslint-config-prettier, @eslint/eslintrc, @eslint/js, jest, @nestjs/cli, @nestjs/schematics, @nestjs/testing (+27 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (26): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (46): App(), ExportCsvDialog(), ProtectedRoute(), GlobalMilestone, registryApi, usersApi, milestonesApi, reportsApi (+38 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (23): AppLayout(), NAV_ITEMS, CommandPalette(), Entry, hitPath(), KIND_META, Props, NotificationBell() (+15 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (16): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+8 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (9): LookupsController, Body, Controller, Get, Param, Patch, Post, LookupsService (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (20): FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES (+12 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (46): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), AdjustWeightsDialog(), OutcomeDialog(), SaveTemplateDialog(), SectionCard() (+38 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (16): PortfolioReportsController, Controller, ReportsModule, Module, MilestoneDateRow, MilestoneProgressRow, Person, ReportProjectRow (+8 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.19
Nodes (11): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (18): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, PARENT_TABLES, AttachmentsService, COLUMN_SPEC (+10 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (25): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+17 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (20): hooks, PreToolUse, includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema (+12 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.08
Nodes (25): @base-ui/react, class-variance-authority, clsx, dhtmlx-gantt, @fontsource-variable/inter, frappe-gantt, dependencies, @base-ui/react (+17 more)

### Community 25 - "Community 25"
Cohesion: 0.07
Nodes (27): dependencies, class-transformer, class-validator, jose, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express (+19 more)

### Community 26 - "Community 26"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 28 - "Community 28"
Cohesion: 0.05
Nodes (54): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), AddMilestoneDialog() (+46 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.10
Nodes (28): TasksCard(), dueIn(), formatDate(), initials(), PersonLike, personName(), relativeTime(), atOffset() (+20 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.17
Nodes (11): GateMilestone, GateProject, MANDATORY, submissionGateFailures(), Cycle, Submission, SubmissionListItem, NotificationContext (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.10
Nodes (15): CAPABILITY_KEYS, ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiProperty (+7 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.16
Nodes (14): AccessLevel, atLeastRole(), DEFAULT_GRANTS, defaultLevelFor(), MEMBERSHIP_LEVEL, ProjectAccessInput, resolveProjectLevel(), base (+6 more)

### Community 39 - "Community 39"
Cohesion: 0.29
Nodes (6): compilerOptions, paths, files, ./src/*, @/*, references

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "CreateProjectDto"
Cohesion: 0.13
Nodes (17): CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray, IsDateString, IsIn, IsOptional (+9 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.08
Nodes (41): CategorySelect(), Props, Props, Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+33 more)

### Community 45 - "Community 45"
Cohesion: 0.07
Nodes (27): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+19 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.12
Nodes (15): AdminOnly(), MinAppRole(), ProjectAccess(), PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.26
Nodes (8): ImportModule, Module, MilestonesModule, Module, NotificationsModule, Module, ProjectsModule, Module

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.17
Nodes (33): AddIssueDialog(), emptyPerson(), FREQUENCIES, ACCESS_LEVELS, AddRiskDialog(), emptyPerson(), EDITABLE_OPTIONS, VIEWABLE_OPTIONS (+25 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.12
Nodes (5): HistoryEntry, MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 50 - "Community 50"
Cohesion: 0.13
Nodes (15): RegistryController, Controller, Get, RegistryModule, Module, RegistryRepository, Injectable, groupIntoDirectory() (+7 more)

### Community 54 - "ProjectsController"
Cohesion: 0.28
Nodes (8): AddPersonDialog(), emptyPerson(), memberName(), CreateAccountDialog(), inviteDraft(), isPocEmail(), pocEmail(), tempPassword()

### Community 55 - "action-items.repository.ts"
Cohesion: 0.06
Nodes (30): 1. Baseline, measured 2026-08-18 on this branch, 2026-08-19 — B1, public surface per module, 2026-08-19 — B2 + B3, the rule and the last reach-in, 2026-08-19 — B4, contract conformance. **Phase B complete.**, 2026-08-19 — Clearing the register before Phase 1 (APPROVED BEHAVIOUR CHANGES), 2026-08-19 — Gate review, then one APPROVED BEHAVIOUR CHANGE, 2026-08-19 — Phase 0, `access-admin` (seam first, then net), 2026-08-19 — Phase 0, `kpis`. **The three high-value modules are done.** (+22 more)

### Community 56 - "@types/node"
Cohesion: 0.21
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.07
Nodes (18): HistoryInsert, ActionItemsController, ApiBody, Body, Controller, Get, Param, Patch (+10 more)

### Community 59 - "@types/node"
Cohesion: 0.13
Nodes (12): logger, toHttpException(), LookupsRepository, Injectable, ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED (+4 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.22
Nodes (8): ApiBody, Body, Param, Patch, ApiProperty, IsIn, UpdateRoleDto, Put

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.29
Nodes (10): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+2 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.06
Nodes (28): AuthUser, CurrentUser, Delete, Delete, Get, Delete, NotificationsController, Controller (+20 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.10
Nodes (10): APP_ROLES, isAppRole(), AccessAdminController, Controller, Get, AccessAdminRepository, ProfileRow, Injectable (+2 more)

### Community 65 - ".add"
Cohesion: 0.16
Nodes (5): describeProjectScopedContract(), Mocks, ProjectScopedContract, RecordHistoryService, Injectable

### Community 66 - "react-dom"
Cohesion: 0.20
Nodes (9): IssuesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 67 - "links.service.ts"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.14
Nodes (14): db, ensure(), env, PROGRAMS, root, rows(), STANDARD, initials() (+6 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.23
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 70 - "2. Core functional modules"
Cohesion: 0.10
Nodes (37): Props, Props, Props, Props, Props, Props, apiUpload(), Attachment (+29 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "@nestjs/config"
Cohesion: 0.17
Nodes (11): Props, Cycle, CycleStatusReport, CycleStatusRow, dashboardApi, DashboardChartPoint, DashboardData, InitiativeProgressRow (+3 more)

### Community 74 - "status-reports.service.ts"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.14
Nodes (15): Props, Skeleton(), Chip(), personName(), STATUS_CHIP, WorkflowPanel(), projectsApi, cyclesApi (+7 more)

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.20
Nodes (12): AppRole, CAPABILITIES, Capability, GRANTABLE_ROLES, GrantableRole, isCapability(), AppRoleGuard, Injectable (+4 more)

### Community 79 - "README.md"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 80 - "ApiProperty"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "lookups.service.ts"
Cohesion: 0.16
Nodes (8): ApiTags, ProjectScoped(), ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

### Community 82 - "AccessModule"
Cohesion: 0.20
Nodes (13): calculatedProgress(), kpiAchievement(), kpiDataQuality(), KpiReadingLike, KpiScoreInput, MilestoneProgressRow, PERIODS_PER_YEAR, plannedProgress() (+5 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.11
Nodes (5): AttachmentsRepository, Injectable, PARENT_TYPES, parseParent(), parseUploadBody()

### Community 84 - "users.service.ts"
Cohesion: 0.11
Nodes (13): columnsFrom(), ColumnSpec, COLUMN_SPEC, CREATE_DEFAULTS, Owners, Issue, IssueListItem, IssuesRepository (+5 more)

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "templates.service.ts"
Cohesion: 0.17
Nodes (5): riskScore(), RisksRepository, Injectable, RisksService, Injectable

### Community 89 - "ActionItemsController"
Cohesion: 0.07
Nodes (25): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+17 more)

### Community 90 - "StatusReportsController"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 91 - "DatabaseModule"
Cohesion: 0.11
Nodes (18): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+10 more)

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 94 - "AuthUser"
Cohesion: 0.10
Nodes (6): AuthedRequest, SupabaseAuthGuard, Injectable, DatabaseService, Injectable, ProfileRoleRow

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.15
Nodes (10): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🏗 Architecture, 📚 More docs, 🧪 Quality, 🚀 Quick start (+2 more)

### Community 98 - "CreateLookupValueDto"
Cohesion: 0.21
Nodes (11): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+3 more)

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "vite"
Cohesion: 0.23
Nodes (8): StatusReportsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 105 - "ResourcesService"
Cohesion: 0.36
Nodes (5): ImportController, ApiBody, Body, Controller, Post

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.26
Nodes (10): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), ChartPoint, CLOSED_PROJECT, DashboardData (+2 more)

### Community 110 - "action-items.repository.ts"
Cohesion: 0.29
Nodes (7): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload

### Community 112 - "app.module.ts"
Cohesion: 0.15
Nodes (19): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+11 more)

### Community 113 - "ts-loader"
Cohesion: 0.07
Nodes (31): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+23 more)

### Community 114 - "CreateLookupValueDto"
Cohesion: 0.18
Nodes (11): AppModule, Module, bootstrap(), AccessAdminModule, Module, KpisModule, Module, LookupsModule (+3 more)

### Community 115 - "CreateMilestoneDto"
Cohesion: 0.14
Nodes (12): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+4 more)

### Community 118 - "CreateKpiDto"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 119 - "project-sections.service.ts"
Cohesion: 0.11
Nodes (15): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReport (+7 more)

### Community 120 - "eslint"
Cohesion: 0.23
Nodes (8): ResourcesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 121 - ".me"
Cohesion: 0.12
Nodes (13): DashboardController, Controller, DashboardModule, Module, DashboardActionItemRow, DashboardMilestoneRow, DashboardProjectRow, DashboardRepository (+5 more)

### Community 122 - "UpdateAttachmentDto"
Cohesion: 0.43
Nodes (5): FieldErrors, milestoneFormErrors(), milestoneFormPayload(), MilestoneFormValues, parseTags()

### Community 123 - "ProjectSectionsController"
Cohesion: 0.07
Nodes (26): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+18 more)

### Community 124 - "UpdateMeDto"
Cohesion: 0.24
Nodes (9): Project, ProjectDetail, ProjectListRow, ProjectListStats, COLUMN_SPEC, projectColumns(), ProjectsService, Injectable (+1 more)

### Community 125 - "milestones.service.ts"
Cohesion: 0.33
Nodes (5): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray

### Community 126 - "AccessModule"
Cohesion: 0.67
Nodes (3): DatabaseModule, Global, Module

### Community 127 - "ImportPage.tsx"
Cohesion: 0.20
Nodes (10): importApi, ImportSummary, parseCsv(), FieldDef, ImportPage(), MILESTONE_FIELDS, PROJECT_FIELDS, RowCheck (+2 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "status-reports.repository.ts"
Cohesion: 0.07
Nodes (28): AddKpiDialog(), emptyPerson(), Props, accessApi, AdminLookupRow, adminLookupsApi, AdminLookupTable, AdminUser (+20 more)

### Community 130 - "CreateKpiActionPlanDto"
Cohesion: 0.20
Nodes (14): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+6 more)

### Community 132 - "TemplatesService"
Cohesion: 0.14
Nodes (10): TemplatesController, ApiBody, Body, Controller, Delete, Get, Param, Post (+2 more)

### Community 133 - ".update"
Cohesion: 0.15
Nodes (10): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+2 more)

### Community 134 - "AdjustWeightsDto"
Cohesion: 0.16
Nodes (14): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+6 more)

### Community 136 - "CreateLinkDto"
Cohesion: 0.40
Nodes (4): ProgramOutcomesModule, Module, TemplatesModule, Module

### Community 139 - "UpdatePersonDto"
Cohesion: 0.47
Nodes (5): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE

### Community 140 - "ProjectSectionsController"
Cohesion: 0.14
Nodes (15): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, CyclesController, ReportsController, SubmissionsController (+7 more)

### Community 141 - "Follow-ups register"
Cohesion: 0.33
Nodes (5): 1. Defects and gaps, 2. Limits of the checks we have built, 3. Closed, 4. Dismissed after investigation, Follow-ups register

### Community 142 - "CreateRiskDto"
Cohesion: 0.19
Nodes (12): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+4 more)

### Community 143 - "UpdateAttachmentDto"
Cohesion: 0.67
Nodes (3): AccessModule, Global, Module

### Community 148 - "KpisModule"
Cohesion: 0.22
Nodes (11): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Project, ProjectDetail (+3 more)

### Community 151 - "UsersModule"
Cohesion: 0.23
Nodes (8): RisksController, ApiBody, Body, Controller, Get, Param, Patch, Post

## Knowledge Gaps
- **582 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+577 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `fetchMe()` connect `Community 9` to `auth-context.tsx`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `auth-context.tsx` to `CreateKpiActionPlanDto`, `TemplatesService`, `.update`, `AdjustWeightsDto`, `attachments.repository.ts`, `Community 6`, `Community 10`, `ProjectSectionsController`, `CreateRiskDto`, `Community 16`, `CreateProjectDto`, `Community 20`, `UsersModule`, `ProjectsRepository`, `status-reports.repository.ts`, `CreateProjectDto`, `Community 45`, `nest-cli.json`, `Community 50`, `@nestjs/swagger`, `PeopleRepository`, `CreateMilestoneDto`, `react-dom`, `links.service.ts`, `WorkflowPanel.tsx`, `WorkflowPanel.tsx`, `ActionItemsController`, `vite`, `ResourcesService`, `ts-loader`, `CreateMilestoneDto`, `project-sections.service.ts`, `eslint`, `.me`, `ProjectSectionsController`, `milestones.service.ts`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `@types/node` to `Community 1`, `milestones.service.ts`, `TemplatesService`, `.update`, `Community 5`, `attachments.repository.ts`, `Community 6`, `Community 10`, `Community 11`, `Community 16`, `Community 20`, `Community 27`, `nest-cli.json`, `ProjectsRepository`, `status-reports.repository.ts`, `Community 45`, `RecordHistoryService`, `Community 50`, `@nestjs/swagger`, `auth-context.tsx`, `PaginationQueryDto`, `.add`, `AddMilestoneDialog.tsx`, `users.service.ts`, `globals`, `templates.service.ts`, `ActionItemsController`, `StatusReportsController`, `AuthUser`, `action-items.repository.ts`, `ts-loader`, `CreateMilestoneDto`, `project-sections.service.ts`, `.me`, `ProjectSectionsController`, `UpdateMeDto`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _582 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.06938020351526364 - nodes in this community are weakly interconnected._