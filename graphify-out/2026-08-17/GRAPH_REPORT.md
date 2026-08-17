# Graph Report - ptrack  (2026-08-17)

## Corpus Check
- 321 files · ~142,549 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2422 nodes · 4958 edges · 148 communities (129 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3ea8657`
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
- CreateLinkDto
- RecordHistoryService
- WorkflowPanel.tsx
- 2. Core functional modules
- moduleFileExtensions
- @nestjs/config
- .add
- DatabaseService
- AddStatusReportDialog.tsx
- .add
- dev.ps1
- WorkflowPanel.tsx
- README.md
- ApiProperty
- lookups.service.ts
- 🚀 Quick start
- AddMilestoneDialog.tsx
- transform
- @nestjs/swagger
- AttachmentDetailPage.tsx
- @supabase/supabase-js
- AppModule
- status-reports.repository.ts
- PeopleController
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
- LookupsService
- 🚀 Quick start
- CreateRiskDto
- AddMilestoneDialog.tsx
- eslint-plugin-react-hooks
- frappe-gantt
- eslint-plugin-prettier
- ProjectsController
- RisksService
- app.module.ts
- submissions.module.ts
- ApiProperty
- StatusReportDetailPage.tsx
- vitest
- ActionItemsPage.tsx
- app.controller.ts
- AttachmentDetailPage.tsx
- action-items.repository.ts
- CreateTemplateDto
- SupabaseAuthGuard
- ProgramOutcomesService
- PaginationQueryDto
- AdjustWeightsDto
- attachments.repository.ts
- toaster.tsx
- CreateSavedSearchDto
- SubmissionActionDto
- seed-generic-lookups.mjs
- workflow.ts
- .update
- TimelinePage.tsx
- CreateCommentDto
- kpis.repository.ts
- csv.ts
- supabase.ts
- Attachment
- eslint
- eslint-plugin-prettier
- ts-jest
- ts-loader
- ts-node
- @types/supertest
- @eslint/js
- Global

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 124 edges
2. `@nestjs/swagger` - 56 edges
3. `DatabaseService` - 49 edges
4. `Button()` - 42 edges
5. `usePageTitle()` - 41 edges
6. `cn()` - 36 edges
7. `toast` - 35 edges
8. `Input()` - 30 edges
9. `ProjectScoped()` - 29 edges
10. `RecordHistoryService` - 28 edges

## Surprising Connections (you probably didn't know these)
- `ProjectGantt()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → backend/scripts/seed-generic-lookups.mjs
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `ProjectGantt()` --indirect_call--> `statusClass()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → frontend/src/pages/TimelinePage.tsx

## Import Cycles
- None detected.

## Communities (148 total, 19 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (12): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, PendingMembershipRow, planClaim() (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (10): 2. Functionality inventory (FDD FR-01…15 → status), 3. Use cases UC-01…18 — acceptance checklist, 4. Key validations / business rules (FDD 3.3.2), 5. Reports & notifications (defer until math lands), 6. Open questions for the supervisor (blockers marked ⛔), 7. Execution roadmap, 8. Security phase — access model (ASSUMED 2026-08-17; ENFORCED same day, Fares approved "as I see fit"), 9. Conventions carried forward (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (35): devDependencies, eslint-config-prettier, @eslint/eslintrc, @eslint/js, globals, jest, @nestjs/cli, @nestjs/schematics (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (6): ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds(), ownersLabel(), Injectable

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (6): KpisModule, Module, KpisRepository, Injectable, KpisService, Injectable

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (9): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload, TemplatesService (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (14): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, CurrentUser, Delete, Get (+6 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (26): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+18 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (18): ActionItemsBreakdown(), ActivityLineChart(), BudgetBar(), CategoryDonut(), ChartPoint, ChartSegment, CompletionRadial(), FlowLineChart() (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (24): AdminOnly(), ImportController, ApiBody, Body, Controller, CurrentUser, Post, LookupsController (+16 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (13): RegistryController, Controller, CurrentUser, Get, RegistryModule, Module, DirectoryMembership, DirectoryPerson (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (46): AppLayout(), NAV_ITEMS, AccessLevel, AccessLevelValue, MEMBERSHIP_LEVEL, projectAccessLevel(), atLeastRole(), fetchMe() (+38 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (13): DashboardController, Controller, CurrentUser, Get, DashboardModule, Module, ChartPoint, CLOSED_PROJECT (+5 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.06
Nodes (29): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+21 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.11
Nodes (31): CategorySelect(), Props, EditProjectDialog(), FY_YEARS, personFromProfile(), SelectContent(), SelectItem(), SelectTrigger() (+23 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (25): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+17 more)

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
Cohesion: 0.14
Nodes (5): toHttpException(), ProjectsRepository, Injectable, SubmissionsRepository, Injectable

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (26): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), AddIssueDialog() (+18 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.25
Nodes (5): ProjectAccess(), ProjectScoped(), AccessLevel, ACTION_BODY, @nestjs/swagger

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.14
Nodes (20): App(), Chip(), registryApi, reportsApi, AuthProvider(), usePageTitle(), CodeTablesPage(), labelFor() (+12 more)

### Community 34 - "Community 34"
Cohesion: 0.06
Nodes (44): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+36 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.22
Nodes (11): auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName(), relativeTime(), STATUS_LABELS (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.11
Nodes (19): APP_ROLES, AppRole, atLeastRole(), defaultLevelFor(), isAppRole(), MEMBERSHIP_LEVEL, ProjectAccessInput, resolveProjectLevel() (+11 more)

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (7): compilerOptions, baseUrl, paths, files, ./src/*, @/*, references

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "CreateProjectDto"
Cohesion: 0.21
Nodes (9): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), Project, ProjectDetail, ProjectListRow (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (18): SearchController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+10 more)

### Community 45 - "Community 45"
Cohesion: 0.10
Nodes (7): AttachmentsRepository, Injectable, AttachmentsService, PARENT_TYPES, parseParent(), safeName(), Injectable

### Community 46 - "nest-cli.json"
Cohesion: 0.14
Nodes (19): NavSection, Props, Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription() (+11 more)

### Community 47 - "Community 47"
Cohesion: 0.11
Nodes (12): CyclesController, ReportsController, SubmissionsController, ApiBody, Body, Controller, CurrentUser, Get (+4 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.18
Nodes (22): Props, Props, Props, Props, apiUpload(), apiDelete(), apiGet(), apiPatch() (+14 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.16
Nodes (15): AddKpiDialog(), emptyPerson(), FREQUENCIES, Props, Textarea(), personName(), STATUS_CHIP, WorkflowPanel() (+7 more)

### Community 50 - "Community 50"
Cohesion: 0.14
Nodes (15): COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray (+7 more)

### Community 54 - "ProjectsController"
Cohesion: 0.10
Nodes (9): AuthedRequest, SupabaseAuthGuard, Injectable, DatabaseModule, Global, Module, DatabaseService, Injectable (+1 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.20
Nodes (10): RisksController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+2 more)

### Community 56 - "@types/node"
Cohesion: 0.33
Nodes (5): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.10
Nodes (18): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+10 more)

### Community 59 - "@types/node"
Cohesion: 0.13
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (22): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+14 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.22
Nodes (10): MilestonesController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+2 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.18
Nodes (12): ImportModule, Module, MilestonesModule, Module, NotificationsModule, Module, ProgramOutcomesModule, Module (+4 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.13
Nodes (5): UpdateMilestoneDto, MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 65 - ".add"
Cohesion: 0.11
Nodes (11): RecordHistoryService, Injectable, UploadedFileLike, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString (+3 more)

### Community 66 - "react-dom"
Cohesion: 0.21
Nodes (10): ActionItemsController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+2 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.29
Nodes (5): ApiTags, ProjectSectionsController, Controller, Get, Param

### Community 68 - "RecordHistoryService"
Cohesion: 0.29
Nodes (8): atRiskSuggested(), calculatedProgress(), MilestoneProgressRow, plannedProgress(), riskScore(), riskSeverityTone(), MILESTONE_LABELS, ProjectProgressReportPage()

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.20
Nodes (10): StatusReportsController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+2 more)

### Community 70 - "2. Core functional modules"
Cohesion: 0.17
Nodes (12): colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItemComment, actionItemsApi, ActionItemDetailPage(), commentAuthor() (+4 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.22
Nodes (11): COLUMNS, ProjectsGrid(), Props, TreeRow, StatusPill(), TONE_CLASSES, toneFor(), ProjectListItem (+3 more)

### Community 72 - "@nestjs/config"
Cohesion: 0.14
Nodes (19): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, CreateAccountDialog(), Props, AppRole (+11 more)

### Community 73 - ".add"
Cohesion: 0.16
Nodes (10): PortfolioReportsController, Controller, CurrentUser, Get, Query, ReportsModule, Module, MONTH_LABELS (+2 more)

### Community 74 - "DatabaseService"
Cohesion: 0.50
Nodes (4): formatSize(), Props, TaskAttachments(), attachmentsApi

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.17
Nodes (20): AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, FieldError(), Props (+12 more)

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.14
Nodes (12): logger, ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED, CacheSlot, EXTRA_COLUMNS, LookupRow (+4 more)

### Community 79 - "README.md"
Cohesion: 0.20
Nodes (11): MinAppRole(), KpisController, ApiBody, Body, Controller, CurrentUser, Delete, Get (+3 more)

### Community 80 - "ApiProperty"
Cohesion: 0.25
Nodes (7): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (PROVISIONAL, adopted 2026-08-13), FORMULAS.md — P-Track calculation registry

### Community 81 - "lookups.service.ts"
Cohesion: 0.36
Nodes (6): formatDate(), initials(), PersonLike, personName(), relativeTime(), atOffset()

### Community 82 - "🚀 Quick start"
Cohesion: 0.15
Nodes (19): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+11 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.09
Nodes (15): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReport (+7 more)

### Community 84 - "transform"
Cohesion: 0.23
Nodes (12): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+4 more)

### Community 85 - "@nestjs/swagger"
Cohesion: 0.20
Nodes (10): LinksController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+2 more)

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "AppModule"
Cohesion: 0.20
Nodes (10): ProgramOutcomesController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+2 more)

### Community 89 - "status-reports.repository.ts"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 90 - "PeopleController"
Cohesion: 0.22
Nodes (9): PeopleController, ApiBody, Body, Controller, CurrentUser, Delete, Param, Patch (+1 more)

### Community 91 - "DatabaseModule"
Cohesion: 0.11
Nodes (21): CommandPalette(), Entry, hitPath(), KIND_META, Props, AdminLookupRow, adminLookupsApi, AdminLookupTable (+13 more)

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 94 - "AuthUser"
Cohesion: 0.30
Nodes (7): AuthUser, CurrentUser, NotificationsController, Controller, Get, Param, Post

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.25
Nodes (5): 🏗 Architecture, 📚 More docs, 🧪 Quality, 🗺 Roadmap, ✨ What's inside

### Community 98 - "CreateLookupValueDto"
Cohesion: 0.20
Nodes (11): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+3 more)

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 104 - "🚀 Quick start"
Cohesion: 0.40
Nodes (5): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🚀 Quick start

### Community 105 - "CreateRiskDto"
Cohesion: 0.18
Nodes (10): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+2 more)

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.06
Nodes (28): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+20 more)

### Community 110 - "ProjectsController"
Cohesion: 0.15
Nodes (14): ActionItemsModule, Module, AttachmentsModule, Module, LinksModule, Module, ProjectSectionsModule, Module (+6 more)

### Community 111 - "RisksService"
Cohesion: 0.16
Nodes (6): Risk, RiskListItem, RisksRepository, Injectable, RisksService, Injectable

### Community 112 - "app.module.ts"
Cohesion: 0.31
Nodes (6): AppModule, Module, AccessModule, Module, bootstrap(), Global

### Community 113 - "submissions.module.ts"
Cohesion: 0.23
Nodes (10): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Project, ProjectDetail (+2 more)

### Community 114 - "ApiProperty"
Cohesion: 0.20
Nodes (9): TemplatesController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+1 more)

### Community 115 - "StatusReportDetailPage.tsx"
Cohesion: 0.23
Nodes (10): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, statusReportsApi, ACCESS_LABELS, authorName() (+2 more)

### Community 118 - "ActionItemsPage.tsx"
Cohesion: 0.20
Nodes (11): Props, TagChips(), GlobalActionItem, GlobalMilestone, ActionItemsPage(), isOverdue(), ownerNames(), STATUS_LABELS (+3 more)

### Community 119 - "app.controller.ts"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 120 - "AttachmentDetailPage.tsx"
Cohesion: 0.26
Nodes (7): Props, Skeleton(), AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 121 - "action-items.repository.ts"
Cohesion: 0.27
Nodes (7): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 122 - "CreateTemplateDto"
Cohesion: 0.29
Nodes (10): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+2 more)

### Community 123 - "SupabaseAuthGuard"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 124 - "ProgramOutcomesService"
Cohesion: 0.09
Nodes (18): columnsFrom(), ColumnSpec, CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional (+10 more)

### Community 125 - "PaginationQueryDto"
Cohesion: 0.25
Nodes (7): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type

### Community 126 - "AdjustWeightsDto"
Cohesion: 0.18
Nodes (11): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+3 more)

### Community 127 - "attachments.repository.ts"
Cohesion: 0.38
Nodes (6): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, PARENT_TABLES

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "CreateSavedSearchDto"
Cohesion: 0.33
Nodes (5): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength

### Community 130 - "SubmissionActionDto"
Cohesion: 0.33
Nodes (5): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength

### Community 131 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 132 - "workflow.ts"
Cohesion: 0.12
Nodes (16): NotificationBell(), timeAgo(), Props, AppNotification, Cycle, cyclesApi, CycleStatusReport, CycleStatusRow (+8 more)

### Community 133 - ".update"
Cohesion: 0.10
Nodes (16): ProjectsController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+8 more)

### Community 134 - "TimelinePage.tsx"
Cohesion: 0.60
Nodes (5): addDays(), iso(), statusClass(), TimelinePage(), VIEW_MODES

### Community 135 - "CreateCommentDto"
Cohesion: 0.40
Nodes (4): CreateCommentDto, ApiProperty, IsString, MinLength

### Community 136 - "kpis.repository.ts"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 137 - "csv.ts"
Cohesion: 0.50
Nodes (3): buildCsv(), escapeCell(), parseCsv()

### Community 138 - "supabase.ts"
Cohesion: 0.50
Nodes (3): supabase, supabaseKey, supabaseUrl

### Community 139 - "Attachment"
Cohesion: 0.67
Nodes (3): Props, Attachment, AttachmentDetail

## Knowledge Gaps
- **491 isolated node(s):** `base`, `MEMBERSHIP_LEVEL`, `LEVEL_LABEL`, `ProjectAccessRow`, `ChartPoint` (+486 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/swagger` connect `AddMilestoneDialog.tsx` to `CreateSavedSearchDto`, `SubmissionActionDto`, `Community 1`, `CreateCommentDto`, `Community 10`, `CreateProjectDto`, `Community 34`, `status-reports.repository.ts`, `Community 44`, `Community 50`, `@types/node`, `@nestjs/swagger`, `@types/node`, `PeopleRepository`, `.add`, `README.md`, `AddMilestoneDialog.tsx`, `transform`, `CreateLookupValueDto`, `nest-cli.json`, `CreateRiskDto`, `eslint-plugin-react-hooks`, `app.module.ts`, `app.controller.ts`, `CreateTemplateDto`, `ProgramOutcomesService`, `PaginationQueryDto`, `AdjustWeightsDto`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `Community 26` to `Community 1`, `Community 5`, `Community 6`, `Community 7`, `kpis.repository.ts`, `Community 8`, `Community 10`, `CreateProjectDto`, `Community 34`, `CreateProjectDto`, `Community 45`, `ProjectsController`, `@nestjs/swagger`, `PeopleRepository`, `PaginationQueryDto`, `WorkflowPanel.tsx`, `AddMilestoneDialog.tsx`, `LookupsService`, `eslint-plugin-react-hooks`, `action-items.repository.ts`, `ProgramOutcomesService`, `attachments.repository.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `ProjectScoped()` connect `AddMilestoneDialog.tsx` to `react-dom`, `CreateLinkDto`, `.update`, `WorkflowPanel.tsx`, `Community 9`, `Community 10`, `eslint-plugin-react-hooks`, `Community 47`, `CreateProjectDto`, `@nestjs/swagger`, `action-items.repository.ts`, `AppModule`, `PeopleController`, `CreateMilestoneDto`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `base`, `MEMBERSHIP_LEVEL`, `LEVEL_LABEL` to the rest of the system?**
  _491 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._