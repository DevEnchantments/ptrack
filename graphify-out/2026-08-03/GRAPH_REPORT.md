# Graph Report - ptrack  (2026-08-03)

## Corpus Check
- 193 files · ~78,623 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1548 nodes · 3282 edges · 85 communities (75 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e42a6e4c`
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
- CreateProjectDto
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
- AttachmentDetailPage.tsx
- @types/node
- .update
- reflect-metadata
- @types/node
- ActionItemDetailPage.tsx
- PeopleRepository
- AttachmentDetailPage.tsx
- auth-context.tsx
- PaginationQueryDto
- .update
- react-dom
- authHeader
- RecordHistoryService
- nest-cli.json
- StatusPill.tsx
- moduleFileExtensions
- @nestjs/config
- Link
- ProjectMemberDetail
- Resource
- tw-animate-css
- dev.ps1
- @types/node
- StatusPill.tsx
- ApiProperty
- Type
- auth-context.tsx
- Injectable
- react-dom

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 84 edges
2. `AuthUser` - 47 edges
3. `CurrentUser` - 47 edges
4. `@nestjs/swagger` - 40 edges
5. `DatabaseService` - 39 edges
6. `cn()` - 36 edges
7. `Button()` - 28 edges
8. `RecordHistoryService` - 26 edges
9. `ProjectDetailPage()` - 24 edges
10. `CreateProjectDto` - 22 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `Props` --references--> `ProjectMemberInput`  [EXTRACTED]
  frontend/src/components/PersonAutocomplete.tsx → frontend/src/pages/CreateProjectWizard.tsx
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/api.ts
- `AddActionItemDialog()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/auth-context.tsx
- `Props` --references--> `Attachment`  [EXTRACTED]
  frontend/src/components/AddAttachmentDialog.tsx → frontend/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (85 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (26): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (26): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+18 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (22): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (27): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+19 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (23): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (12): App(), ProtectedRoute(), attachmentsApi, AuthProvider(), usePageTitle(), AttachmentDetailPage(), formatSize(), longDate() (+4 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (28): Props, Props, Props, Props, Props, Props, ActionItemOwner, apiDelete() (+20 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (26): ACTION_ITEM_SEGMENTS, ActionItemsBreakdown(), ActivityHeatmap(), ActivityLineChart(), CATEGORY_SEGMENTS, CategoryDonut(), CompletionRadial(), FLOW_SERIES (+18 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (15): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.23
Nodes (6): ProjectsController, Controller, Delete, Get, Param, Query

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (34): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), calculatedProgress(), MilestoneProgressRow, plannedProgress(), riskScore() (+26 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (28): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+20 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.17
Nodes (18): CategorySelect(), Props, Lookup, lookupsApi, emptyMember(), Listener, toast, Props (+10 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.23
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (21): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+13 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (20): hooks, PreToolUse, includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema (+12 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (19): @base-ui/react, class-variance-authority, clsx, dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react (+11 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (21): dependencies, class-transformer, jose, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express, @nestjs/swagger (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.16
Nodes (7): UpdateRiskDto, Risk, RiskListItem, RisksRepository, Injectable, RisksService, Injectable

### Community 27 - "Community 27"
Cohesion: 0.09
Nodes (25): AddIssueDialog(), emptyPerson(), AddRiskDialog(), emptyPerson(), AppLayout(), NAV_ITEMS, ACTIONS, CommandPalette() (+17 more)

### Community 28 - "Community 28"
Cohesion: 0.17
Nodes (14): StatusPill(), TONE_CLASSES, toneFor(), auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel() (+6 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.11
Nodes (17): 1. Contrast report (measured 2026-07-29), 2. Findings per surface, 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M (+9 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.17
Nodes (9): AuthUser, CurrentUser, Delete, Delete, Delete, Delete, Delete, Delete (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (10): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+2 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "CreateProjectDto"
Cohesion: 0.16
Nodes (4): LinksRepository, Injectable, LinksService, Injectable

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.16
Nodes (4): Injectable, UpdatesRepository, Injectable, UpdatesService

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
Cohesion: 0.20
Nodes (9): RisksController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.23
Nodes (9): initials(), Props, RecordHistory(), relativeTime(), username(), Props, SectionCard(), Skeleton() (+1 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.06
Nodes (27): ArrayMaxSize, HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, ActionItemsRepository, Injectable (+19 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.21
Nodes (9): ApiBody, Body, Controller, Get, Param, Patch, Post, Query (+1 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.05
Nodes (40): ApiSecurity, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+32 more)

### Community 54 - "ProjectsController"
Cohesion: 0.14
Nodes (15): Props, AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItem, ActionItemComment (+7 more)

### Community 55 - "AttachmentDetailPage.tsx"
Cohesion: 0.29
Nodes (7): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type

### Community 56 - "@types/node"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 57 - ".update"
Cohesion: 0.21
Nodes (3): AuthedRequest, SupabaseAuthGuard, Injectable

### Community 58 - "reflect-metadata"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 59 - "@types/node"
Cohesion: 0.26
Nodes (15): EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, FieldError(), HelpDot(), Button(), buttonVariants (+7 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.13
Nodes (12): ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, UpdatePersonDto, PeopleModule, Module (+4 more)

### Community 62 - "AttachmentDetailPage.tsx"
Cohesion: 0.24
Nodes (10): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+2 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 65 - ".update"
Cohesion: 0.23
Nodes (8): PeopleController, ApiBody, Body, Controller, Delete, Param, Patch, Post

### Community 66 - "react-dom"
Cohesion: 0.18
Nodes (6): logger, toHttpException(), ProjectsRepository, Injectable, ProjectsService, Injectable

### Community 67 - "authHeader"
Cohesion: 0.15
Nodes (15): AddStatusReportDialog(), Props, today(), dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS (+7 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.15
Nodes (9): DatabaseModule, Module, DatabaseService, Injectable, RecordHistoryService, Injectable, Update, UpdateListItem (+1 more)

### Community 69 - "nest-cli.json"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), MilestoneDetail (+2 more)

### Community 70 - "StatusPill.tsx"
Cohesion: 0.18
Nodes (9): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+1 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.38
Nodes (6): KIND_CLASSES, TOAST_MS, Toaster(), ToastItem, subscribeToasts(), ToastKind

### Community 73 - "Link"
Cohesion: 0.20
Nodes (8): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength

### Community 74 - "ProjectMemberDetail"
Cohesion: 0.19
Nodes (12): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, PersonAutocomplete(), Props, peopleApi (+4 more)

### Community 75 - "Resource"
Cohesion: 0.33
Nodes (9): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), Milestone (+1 more)

### Community 76 - "tw-animate-css"
Cohesion: 0.10
Nodes (18): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+10 more)

### Community 78 - "@types/node"
Cohesion: 0.36
Nodes (6): calculatedProgress(), MilestoneProgressRow, plannedProgress(), Project, ProjectDetail, ProjectListStats

### Community 80 - "ApiProperty"
Cohesion: 0.29
Nodes (6): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), FORMULAS.md — P-Track calculation registry

### Community 81 - "Type"
Cohesion: 0.50
Nodes (3): NavSection, Props, SectionNav()

## Knowledge Gaps
- **351 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+346 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `react-dom` to `Community 1`, `Community 2`, `CreateProjectDto`, `Community 5`, `Community 6`, `Community 7`, `StatusPill.tsx`, `Link`, `Community 10`, `RecordHistoryService`, `Community 12`, `status-reports.repository.ts`, `nest-cli.json`, `@types/node`, `RecordHistoryService`, `auth-context.tsx`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `nest-cli.json` to `Community 1`, `Community 2`, `Community 34`, `.update`, `Community 26`, `Community 6`, `Community 7`, `Community 5`, `Community 10`, `CreateProjectDto`, `tw-animate-css`, `nest-cli.json`, `status-reports.repository.ts`, `Community 20`, `reflect-metadata`, `PeopleRepository`, `AttachmentDetailPage.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `nest-cli.json` to `Community 1`, `Community 2`, `Community 34`, `.update`, `Community 26`, `Community 6`, `Community 7`, `Community 5`, `Community 10`, `CreateProjectDto`, `tw-animate-css`, `nest-cli.json`, `status-reports.repository.ts`, `Community 20`, `reflect-metadata`, `PeopleRepository`, `AttachmentDetailPage.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _351 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06262626262626263 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07180851063829788 - nodes in this community are weakly interconnected._