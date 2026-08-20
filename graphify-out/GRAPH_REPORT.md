# Graph Report - ptrack  (2026-08-20)

## Corpus Check
- 352 files · ~165,183 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2779 nodes · 6538 edges · 159 communities (143 shown, 16 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 275 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7ce1c8ba`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- P-Track — Original Oracle APEX App: Feature Reference
- import.service.ts
- seed-demo-data.mjs
- FDD Alignment — P-Track ⇄ Project Tracker FDD
- devDependencies
- ActionItemsRepository
- cn
- seed-adports-demo.mjs
- AddActionItemDialog.tsx
- RequireCapability
- resources.controller.ts
- CreateProjectDto
- lookups.service.ts
- .chat
- ProjectDetailPage.tsx
- compilerOptions
- projects.service.ts
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
- MilestoneDetailPage.tsx
- jest
- scripts
- DashboardPage.tsx
- UI Visual Audit & Staged Restyling Plan
- SubmissionsRepository
- ProjectSectionsController
- frontend/package.json
- updates.controller.ts
- exclude
- EditProjectDialog.tsx
- frontend/tsconfig.json
- dependencies
- backend/package.json
- ProjectsRepository
- backend/README.md
- search.controller.ts
- RecordHistoryService
- reminders.service.ts
- project-sections.module.ts
- App.tsx
- AddMilestoneDialog
- ImportPage
- DatabaseService
- workflow.ts
- ActionItemsController
- CLAUDE.md — P-Track
- projects.ts
- app.controller.ts
- React + TypeScript + Vite
- people.controller.ts
- CreateTemplateDto
- AuthUser
- MilestonesService
- seed-generic-lookups.mjs
- ActionItemsPage.tsx
- submissions.module.ts
- CommandPalette.tsx
- RisksService
- MilestonesController
- P-Track progress summary
- ProjectProgressReportPage.tsx
- ProfilePage.tsx
- use-me.ts
- button.tsx
- access-admin.controller.ts
- dev.ps1
- ProjectOverviewCards.tsx
- .add
- FORMULAS.md — P-Track calculation registry
- admin.ts
- Milestone
- MilestonesRepository
- users.service.ts
- access.logic.ts
- react
- frappe-gantt.d.ts
- ResourcesController
- ImportRowsDto
- milestones.service.ts
- toHttpException
- Findings for `main` from the exploratory refactor branch
- @tailwindcss/vite
- ActionItemDetailPage.tsx
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- AddActionItemDialog
- tw-animate-css
- 2. Findings per surface
- @testing-library/react
- nest-cli.json
- action-items.service.ts
- TimelinePage.tsx
- status-reports.service.ts
- @types/node
- CreateKpiDto
- typescript-eslint
- @supabase/supabase-js
- WeightEntryDto
- .instantiate
- risks.controller.ts
- NotificationBell.tsx
- AppLayout.tsx
- RecordHistory.tsx
- vitest
- CreateProjectWizard
- templates.service.ts
- @nestjs/swagger
- NotificationsService
- links.service.ts
- AddRiskDialog
- program-outcomes.service.ts
- HomePage
- AccessModule
- index.ts
- toaster.tsx
- AddKpiDialog.tsx
- AddPersonDialog
- AssistantPage.tsx
- AddIssueDialog
- ProjectsController
- @eslint/js
- StatusReportsController
- AddPersonDialog.tsx
- app.module.ts
- LinksService
- AddStatusReportDialog
- A. Capabilities unlocked (ranked by project impact)
- AddAttachmentDialog
- AddLinkDialog
- AddResourceDialog
- AddUpdateDialog
- OutcomeDialog
- DatabaseModule
- toast.ts
- ValueRow
- prettier
- ts-jest
- ts-loader
- @types/node
- @types/supertest
- .add
- CreateResourceDto
- LoginPage
- project-sections.service.ts
- templates.module.ts

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 155 edges
2. `AuthUser` - 100 edges
3. `CurrentUser` - 96 edges
4. `DatabaseService` - 67 edges
5. `@nestjs/swagger` - 62 edges
6. `Button()` - 52 edges
7. `usePageTitle()` - 51 edges
8. `toast` - 39 edges
9. `cn()` - 36 edges
10. `RecordHistoryService` - 35 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `CreateProjectForm`  [EXTRACTED]
  frontend/src/pages/create-project/StepAccess.tsx → frontend/src/pages/CreateProjectWizard.tsx
- `AppLayout()` --calls--> `signOut()`  [EXTRACTED]
  frontend/src/components/AppLayout.tsx → frontend/src/lib/auth-context.tsx
- `WorkCard()` --calls--> `dueIn()`  [EXTRACTED]
  frontend/src/pages/ProfilePage.tsx → frontend/src/lib/format.ts
- `StatusReportsController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/status-reports/status-reports.controller.ts → backend/src/common/access/access.decorators.ts
- `PeopleController` --references--> `ProjectScoped()`  [EXTRACTED]
  backend/src/modules/people/people.controller.ts → backend/src/common/access/access.decorators.ts

## Import Cycles
- None detected.

## Communities (159 total, 16 thin omitted)

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
Cohesion: 0.11
Nodes (8): Patch, ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds(), ownersLabel(), Injectable, UpdateActionItemDto

### Community 6 - "cn"
Cohesion: 0.18
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 7 - "seed-adports-demo.mjs"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "AddActionItemDialog.tsx"
Cohesion: 0.13
Nodes (25): STATUSES, STATUSES, CategorySelect(), Props, Input(), SelectContent(), SelectItem(), SelectTrigger() (+17 more)

### Community 9 - "RequireCapability"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 10 - "resources.controller.ts"
Cohesion: 0.19
Nodes (5): UpdateResourceDto, ResourcesRepository, Injectable, ResourcesService, Injectable

### Community 11 - "CreateProjectDto"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 12 - "lookups.service.ts"
Cohesion: 0.06
Nodes (30): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+22 more)

### Community 13 - ".chat"
Cohesion: 0.07
Nodes (28): ApiOperation, ApiProduces, AssistantController, Body, Controller, Get, Post, AssistantModule (+20 more)

### Community 14 - "ProjectDetailPage.tsx"
Cohesion: 0.06
Nodes (37): Props, AdjustWeightsDialog(), SaveTemplateDialog(), NavSection, Props, SectionNav(), projectAccessLevel(), ProjectMemberDetail (+29 more)

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 16 - "projects.service.ts"
Cohesion: 0.10
Nodes (22): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), RISK_HIGH_THRESHOLD, ChartPoint, CLOSED_PROJECT (+14 more)

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

### Community 26 - ".add"
Cohesion: 0.10
Nodes (19): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+11 more)

### Community 27 - "SupabaseAuthGuard"
Cohesion: 0.18
Nodes (4): IS_PUBLIC_KEY, AuthedRequest, SupabaseAuthGuard, Injectable

### Community 28 - "MilestoneDetailPage.tsx"
Cohesion: 0.10
Nodes (26): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, actionItemsApi, statusReportsApi, cache (+18 more)

### Community 29 - "jest"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "DashboardPage.tsx"
Cohesion: 0.10
Nodes (27): dueIn(), formatDate(), initials(), PersonLike, personName(), relativeTime(), atOffset(), ActionItemsBreakdown() (+19 more)

### Community 32 - "UI Visual Audit & Staged Restyling Plan"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "SubmissionsRepository"
Cohesion: 0.15
Nodes (5): Cycle, Submission, SubmissionListItem, SubmissionsRepository, Injectable

### Community 34 - "ProjectSectionsController"
Cohesion: 0.29
Nodes (5): ApiTags, ProjectSectionsController, Controller, Get, Param

### Community 35 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "updates.controller.ts"
Cohesion: 0.07
Nodes (29): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+21 more)

### Community 37 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "EditProjectDialog.tsx"
Cohesion: 0.09
Nodes (27): EditProjectDialog(), FY_YEARS, personFromProfile(), PersonAutocomplete(), Props, AppRole, categoriesApi, lookupCache (+19 more)

### Community 39 - "frontend/tsconfig.json"
Cohesion: 0.40
Nodes (4): compilerOptions, paths, files, references

### Community 40 - "dependencies"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "backend/package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "ProjectsRepository"
Cohesion: 0.06
Nodes (19): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+11 more)

### Community 43 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "search.controller.ts"
Cohesion: 0.11
Nodes (14): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+6 more)

### Community 45 - "RecordHistoryService"
Cohesion: 0.06
Nodes (18): RecordHistoryService, Injectable, Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, ATTACHMENTS_BUCKET (+10 more)

### Community 46 - "reminders.service.ts"
Cohesion: 0.20
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 47 - "project-sections.module.ts"
Cohesion: 0.11
Nodes (18): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+10 more)

### Community 48 - "App.tsx"
Cohesion: 0.11
Nodes (21): Props, SectionCard(), Skeleton(), reportsApi, usePageTitle(), CodeTablesPage(), labelFor(), UsersRolesPage() (+13 more)

### Community 49 - "AddMilestoneDialog"
Cohesion: 0.31
Nodes (9): AddMilestoneDialog(), doDelete(), reset(), resetFields(), submit(), emptyOwner(), ownerFromMilestone(), profileName() (+1 more)

### Community 50 - "ImportPage"
Cohesion: 0.28
Nodes (9): parseCsv(), ImportPage(), commit(), loadCsv(), onFile(), rowRecord(), normalize(), validDate() (+1 more)

### Community 54 - "DatabaseService"
Cohesion: 0.09
Nodes (20): logger, DatabaseService, Injectable, Kpi, KpiActionPlan, KpiListItem, KpiReading, Link (+12 more)

### Community 55 - "workflow.ts"
Cohesion: 0.15
Nodes (12): Props, Cycle, cyclesApi, CycleStatusReport, CycleStatusRow, dashboardApi, DashboardChartPoint, DashboardData (+4 more)

### Community 56 - "ActionItemsController"
Cohesion: 0.20
Nodes (11): ActionItemsController, ApiBody, Body, Controller, Get, Param, Post, CreateCommentDto (+3 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "projects.ts"
Cohesion: 0.14
Nodes (29): Props, Props, Props, Props, Props, apiUpload(), Attachment, AttachmentDetail (+21 more)

### Community 59 - "app.controller.ts"
Cohesion: 0.24
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 60 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "people.controller.ts"
Cohesion: 0.06
Nodes (32): ProjectAccess(), CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString (+24 more)

### Community 62 - "CreateTemplateDto"
Cohesion: 0.29
Nodes (10): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+2 more)

### Community 63 - "AuthUser"
Cohesion: 0.05
Nodes (37): AuthUser, CurrentUser, Delete, Delete, DashboardController, Controller, Get, Delete (+29 more)

### Community 64 - "MilestonesService"
Cohesion: 0.14
Nodes (8): AdjustWeightsDto, ApiProperty, IsArray, Type, ValidateNested, UpdateMilestoneDto, MilestonesService, Injectable

### Community 65 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "ActionItemsPage.tsx"
Cohesion: 0.16
Nodes (19): ExportCsvDialog(), StatusPill(), TONE_CLASSES, toneFor(), Props, TagChips(), registryApi, buildCsv() (+11 more)

### Community 67 - "submissions.module.ts"
Cohesion: 0.22
Nodes (10): ImportModule, Module, MilestonesModule, Module, NotificationsModule, Module, ProjectsModule, Module (+2 more)

### Community 68 - "CommandPalette.tsx"
Cohesion: 0.18
Nodes (9): CommandPalette(), Entry, hitPath(), KIND_META, Props, SavedSearch, searchApi, SearchHit (+1 more)

### Community 69 - "RisksService"
Cohesion: 0.16
Nodes (5): riskScore(), RisksRepository, Injectable, RisksService, Injectable

### Community 70 - "MilestonesController"
Cohesion: 0.21
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 71 - "P-Track progress summary"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "ProjectProgressReportPage.tsx"
Cohesion: 0.15
Nodes (15): Chip(), calculatedProgress(), kpiAchievement(), kpiDataQuality(), KpiReadingLike, KpiScoreInput, MilestoneProgressRow, PERIODS_PER_YEAR (+7 more)

### Community 73 - "ProfilePage.tsx"
Cohesion: 0.14
Nodes (13): ProtectedRoute(), AuthContext, AuthContextValue, useAuth(), supabase, supabaseKey, supabaseUrl, BARS (+5 more)

### Community 74 - "use-me.ts"
Cohesion: 0.25
Nodes (10): fetchMe(), hasCapability(), listeners, RANK, refreshMe(), useMe(), IdentityCard(), save() (+2 more)

### Community 75 - "button.tsx"
Cohesion: 0.22
Nodes (20): EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, Props, FieldError(), Props, HelpDot() (+12 more)

### Community 76 - "access-admin.controller.ts"
Cohesion: 0.11
Nodes (15): AccessAdminController, ApiBody, Body, Controller, Get, Param, Patch, ReplaceGrantsDto (+7 more)

### Community 78 - "ProjectOverviewCards.tsx"
Cohesion: 0.14
Nodes (15): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, AccessLevel, AccessLevelValue (+7 more)

### Community 79 - ".add"
Cohesion: 0.28
Nodes (6): ApiBody, Body, Get, Param, Patch, Post

### Community 80 - "FORMULAS.md — P-Track calculation registry"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "admin.ts"
Cohesion: 0.11
Nodes (17): accessApi, AdminLookupRow, adminLookupsApi, AdminLookupTable, AdminUser, CapabilityGrants, CapabilityInfo, DirectoryMembership (+9 more)

### Community 82 - "Milestone"
Cohesion: 0.13
Nodes (21): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+13 more)

### Community 83 - "MilestonesRepository"
Cohesion: 0.14
Nodes (11): HISTORY_SELECT, HistoryEntry, HistoryInsert, PROJECT_HISTORY_SELECT, ActionItem, ActionItemComment, ActionItemListItem, Milestone (+3 more)

### Community 84 - "users.service.ts"
Cohesion: 0.13
Nodes (10): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, PendingMembershipRow, planClaim() (+2 more)

### Community 85 - "access.logic.ts"
Cohesion: 0.10
Nodes (28): AccessLevel, APP_ROLES, AppRole, atLeastRole(), CAPABILITIES, Capability, CAPABILITY_KEYS, DEFAULT_GRANTS (+20 more)

### Community 87 - "frappe-gantt.d.ts"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "ResourcesController"
Cohesion: 0.23
Nodes (8): ResourcesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 89 - "ImportRowsDto"
Cohesion: 0.21
Nodes (10): ImportRowsDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, ImportController, ApiBody, Body (+2 more)

### Community 90 - "milestones.service.ts"
Cohesion: 0.14
Nodes (14): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+6 more)

### Community 91 - "toHttpException"
Cohesion: 0.09
Nodes (13): ProjectAccessGuard, Injectable, ProjectAccessService, Injectable, toHttpException(), RegistryService, Injectable, ChildRow (+5 more)

### Community 92 - "Findings for `main` from the exploratory refactor branch"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 94 - "ActionItemDetailPage.tsx"
Cohesion: 0.13
Nodes (13): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, formatSize(), TaskAttachments(), ActionItemDetailPage() (+5 more)

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

### Community 103 - "action-items.service.ts"
Cohesion: 0.12
Nodes (16): columnsFrom(), ColumnSpec, COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional (+8 more)

### Community 104 - "TimelinePage.tsx"
Cohesion: 0.19
Nodes (10): ProjectTree(), Props, TreeRow, GlobalMilestone, ProjectListItem, addDays(), iso(), statusClass() (+2 more)

### Community 105 - "status-reports.service.ts"
Cohesion: 0.11
Nodes (15): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReport (+7 more)

### Community 107 - "CreateKpiDto"
Cohesion: 0.06
Nodes (31): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+23 more)

### Community 110 - "WeightEntryDto"
Cohesion: 0.33
Nodes (6): ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 111 - ".instantiate"
Cohesion: 0.14
Nodes (10): TemplatesController, ApiBody, Body, Controller, Delete, Get, Param, Post (+2 more)

### Community 112 - "risks.controller.ts"
Cohesion: 0.11
Nodes (19): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+11 more)

### Community 113 - "NotificationBell.tsx"
Cohesion: 0.29
Nodes (8): NotificationBell(), markAll(), openItem(), refresh(), pathFor(), timeAgo(), AppNotification, notificationsApi

### Community 114 - "AppLayout.tsx"
Cohesion: 0.50
Nodes (3): AppLayout(), NAV_ITEMS, atLeastRole()

### Community 115 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 118 - "CreateProjectWizard"
Cohesion: 0.33
Nodes (8): CreateProjectWizard(), buildPayload(), next(), submit(), validateStep1(), validateStep2(), validateStep3(), todayISO()

### Community 119 - "templates.service.ts"
Cohesion: 0.29
Nodes (7): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload

### Community 120 - "@nestjs/swagger"
Cohesion: 0.14
Nodes (12): AdminOnly(), CAPABILITY_KEY, MIN_APP_ROLE_KEY, MinAppRole(), PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY, ProjectScoped(), LinksController (+4 more)

### Community 121 - "NotificationsService"
Cohesion: 0.15
Nodes (4): NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 122 - "links.service.ts"
Cohesion: 0.15
Nodes (12): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+4 more)

### Community 123 - "AddRiskDialog"
Cohesion: 0.36
Nodes (5): AddRiskDialog(), remove(), reset(), submit(), emptyPerson()

### Community 124 - "program-outcomes.service.ts"
Cohesion: 0.09
Nodes (16): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+8 more)

### Community 125 - "HomePage"
Cohesion: 0.33
Nodes (3): HomePage(), initials(), relativeTime()

### Community 126 - "AccessModule"
Cohesion: 0.67
Nodes (3): AccessModule, Global, Module

### Community 127 - "index.ts"
Cohesion: 0.22
Nodes (10): FromTemplateDialog(), COLUMNS, ProjectsGrid(), GridSort, GridSortKey, gridSortValue(), prefersReducedMotion(), ROWS_OPTIONS (+2 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "AddKpiDialog.tsx"
Cohesion: 0.12
Nodes (15): AddKpiDialog(), remove(), reset(), submit(), emptyPerson(), FREQUENCIES, Props, Kpi (+7 more)

### Community 130 - "AddPersonDialog"
Cohesion: 0.48
Nodes (7): AddPersonDialog(), doRemove(), reset(), resetFields(), submit(), emptyPerson(), memberName()

### Community 131 - "AssistantPage.tsx"
Cohesion: 0.25
Nodes (7): assistantApi, AssistantEvent, ChatMessage, AssistantPage(), SUGGESTIONS, TOOL_LABELS, Turn

### Community 132 - "AddIssueDialog"
Cohesion: 0.53
Nodes (5): AddIssueDialog(), remove(), reset(), submit(), emptyPerson()

### Community 133 - "ProjectsController"
Cohesion: 0.21
Nodes (9): ProjectsController, ApiBody, Body, Controller, Get, Param, Patch, Post (+1 more)

### Community 135 - "StatusReportsController"
Cohesion: 0.19
Nodes (8): StatusReportsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 136 - "AddPersonDialog.tsx"
Cohesion: 0.27
Nodes (10): ACCESS_LEVELS, CreateAccountDialog(), create(), Props, EMAIL_RE, inviteDraft(), isPocEmail(), POC_DOMAIN (+2 more)

### Community 137 - "app.module.ts"
Cohesion: 0.12
Nodes (14): AppModule, Module, AccessAdminModule, Module, DashboardModule, Module, RegistryModule, Module (+6 more)

### Community 138 - "LinksService"
Cohesion: 0.18
Nodes (4): LinksRepository, Injectable, LinksService, Injectable

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

### Community 146 - "DatabaseModule"
Cohesion: 0.67
Nodes (3): DatabaseModule, Global, Module

### Community 147 - "toast.ts"
Cohesion: 0.19
Nodes (8): Props, personName(), STATUS_CHIP, WorkflowPanel(), attachmentsApi, Listener, toast, StepConfirmation()

### Community 148 - "ValueRow"
Cohesion: 1.00
Nodes (3): ValueRow(), patch(), saveName()

### Community 154 - ".add"
Cohesion: 0.28
Nodes (6): ApiBody, Body, Get, Param, Patch, Post

### Community 155 - "CreateResourceDto"
Cohesion: 0.22
Nodes (7): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength

### Community 156 - "LoginPage"
Cohesion: 0.25
Nodes (6): App(), AuthProvider(), signIn(), signOut(), LoginPage(), handleSubmit()

### Community 158 - "templates.module.ts"
Cohesion: 0.40
Nodes (4): ProgramOutcomesModule, Module, TemplatesModule, Module

## Knowledge Gaps
- **546 isolated node(s):** `What this project is`, `Tech stack`, `Hard architectural rules (do not violate)`, `Repo & environment`, `Current state — Phase 1 complete (full CRUD)` (+541 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `import.service.ts`, `ActionItemsRepository`, `StatusReportsController`, `LinksService`, `resources.controller.ts`, `lookups.service.ts`, `projects.service.ts`, `CreateIssueDto`, `SubmissionsService`, `.add`, `CreateResourceDto`, `SubmissionsRepository`, `updates.controller.ts`, `ProjectsRepository`, `RecordHistoryService`, `DatabaseService`, `people.controller.ts`, `AuthUser`, `MilestonesService`, `RisksService`, `access-admin.controller.ts`, `MilestonesRepository`, `users.service.ts`, `access.logic.ts`, `status-reports.service.ts`, `CreateKpiDto`, `.instantiate`, `templates.service.ts`, `NotificationsService`, `links.service.ts`, `program-outcomes.service.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `ActionItemsRepository`, `ProjectsController`, `StatusReportsController`, `RequireCapability`, `resources.controller.ts`, `CreateIssueDto`, `SubmissionsService`, `.add`, `.add`, `updates.controller.ts`, `search.controller.ts`, `ActionItemsController`, `people.controller.ts`, `MilestonesController`, `access-admin.controller.ts`, `.add`, `users.service.ts`, `access.logic.ts`, `ResourcesController`, `ImportRowsDto`, `status-reports.service.ts`, `CreateKpiDto`, `.instantiate`, `risks.controller.ts`, `@nestjs/swagger`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AuthUser` to `ActionItemsRepository`, `ProjectsController`, `StatusReportsController`, `RequireCapability`, `resources.controller.ts`, `CreateIssueDto`, `SubmissionsService`, `.add`, `.add`, `updates.controller.ts`, `search.controller.ts`, `ActionItemsController`, `people.controller.ts`, `MilestonesController`, `access-admin.controller.ts`, `.add`, `access.logic.ts`, `ResourcesController`, `ImportRowsDto`, `status-reports.service.ts`, `CreateKpiDto`, `.instantiate`, `risks.controller.ts`, `@nestjs/swagger`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `What this project is`, `Tech stack`, `Hard architectural rules (do not violate)` to the rest of the system?**
  _546 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `seed-demo-data.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `ActionItemsRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.11330049261083744 - nodes in this community are weakly interconnected._