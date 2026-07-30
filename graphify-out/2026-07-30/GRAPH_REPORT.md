# Graph Report - ptrack  (2026-07-30)

## Corpus Check
- 171 files · ~68,511 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1416 nodes · 2942 edges · 79 communities (70 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `47c0883b`
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
- StepDetails.tsx
- auth-context.tsx
- PaginationQueryDto
- .update
- react-dom
- authHeader
- InitialsAvatar.tsx
- PaginationQueryDto
- StatusPill.tsx
- moduleFileExtensions
- @nestjs/config
- react-dom
- @eslint/js
- @types/node
- tw-animate-css
- dev.ps1
- StatusPill.tsx

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 73 edges
2. `AuthUser` - 39 edges
3. `CurrentUser` - 39 edges
4. `cn()` - 36 edges
5. `DatabaseService` - 35 edges
6. `@nestjs/swagger` - 34 edges
7. `Button()` - 27 edges
8. `RecordHistoryService` - 22 edges
9. `compilerOptions` - 22 edges
10. `CreateProjectDto` - 21 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/dialog.tsx → frontend/src/lib/utils.ts
- `DialogDescription()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/dialog.tsx → frontend/src/lib/utils.ts
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/api.ts
- `AddActionItemDialog()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/auth-context.tsx

## Import Cycles
- None detected.

## Communities (79 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (23): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (25): RecordHistoryService, Injectable, CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (19): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (25): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (13): ArrayMaxSize, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (22): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (21): ACTIONS, CommandPalette(), Entry, Props, Props, ActionItemOwner, apiDelete(), apiGet() (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (20): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (26): ACTION_ITEM_SEGMENTS, ActionItemsBreakdown(), ActivityHeatmap(), ActivityLineChart(), CATEGORY_SEGMENTS, CategoryDonut(), CompletionRadial(), FLOW_SERIES (+18 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (13): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.23
Nodes (6): ProjectsController, Controller, Delete, Get, Param, Query

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (32): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), EditProjectDialog(), NavSection, Props, SectionNav() (+24 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.16
Nodes (13): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, ActionItemComment, actionItemsApi, ActionItemDetailPage() (+5 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.11
Nodes (17): ApiSecurity, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+9 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (13): AuthUser, CurrentUser, ApiBody, Body, Patch, Post, Delete, Delete (+5 more)

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
Cohesion: 0.19
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

### Community 27 - "Community 27"
Cohesion: 0.30
Nodes (7): logger, toHttpException(), Attachment, AttachmentDetail, AttachmentListItem, Issue, IssueListItem

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
Cohesion: 0.14
Nodes (18): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+10 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.11
Nodes (17): 1. Contrast report (measured 2026-07-29), 2. Findings per surface, 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M (+9 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.36
Nodes (5): ActionItemsController, Controller, Delete, Get, Param

### Community 34 - "Community 34"
Cohesion: 0.17
Nodes (17): Props, STATUSES, AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES (+9 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "CreateProjectDto"
Cohesion: 0.14
Nodes (7): Project, ProjectDetail, ProjectListStats, ProjectsRepository, Injectable, ProjectsService, Injectable

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.20
Nodes (17): Props, CategorySelect(), Props, SelectContent(), SelectItem(), SelectTrigger(), SelectValue(), Lookup (+9 more)

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
Cohesion: 0.18
Nodes (8): DatabaseService, Injectable, Link, LinkListItem, Resource, ResourceListItem, Update, UpdateListItem

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.21
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), Label() (+7 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.12
Nodes (5): ActionItemsRepository, Injectable, ActionItemsService, ownersLabel(), Injectable

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.22
Nodes (7): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 49 - "RecordHistoryService"
Cohesion: 0.15
Nodes (13): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 54 - "ProjectsController"
Cohesion: 0.16
Nodes (14): App(), AddIssueDialog(), emptyPerson(), AppLayout(), NAV_ITEMS, ProtectedRoute(), AuthContext, AuthContextValue (+6 more)

### Community 55 - "AttachmentDetailPage.tsx"
Cohesion: 0.23
Nodes (9): initials(), Props, RecordHistory(), relativeTime(), username(), Props, SectionCard(), Skeleton() (+1 more)

### Community 56 - "@types/node"
Cohesion: 0.22
Nodes (13): Props, emptyMember(), Props, StepAccess(), Props, StepDetails(), Props, StepProject() (+5 more)

### Community 57 - ".update"
Cohesion: 0.07
Nodes (29): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Min, Type, CreateUpdateDto, ApiProperty (+21 more)

### Community 58 - "reflect-metadata"
Cohesion: 0.11
Nodes (16): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+8 more)

### Community 59 - "@types/node"
Cohesion: 0.14
Nodes (24): Props, Props, Props, Props, ConfirmDeleteButton(), Props, FieldError(), HelpDot() (+16 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.06
Nodes (33): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot, CreatePersonDto, ApiProperty (+25 more)

### Community 62 - "StepDetails.tsx"
Cohesion: 0.16
Nodes (13): AddStatusReportDialog(), EDITABLE_OPTIONS, Props, today(), VIEWABLE_OPTIONS, DialogContent(), StatusReport, StatusReportDetail (+5 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.40
Nodes (4): CreateCommentDto, ApiProperty, IsString, MinLength

### Community 64 - "PaginationQueryDto"
Cohesion: 0.21
Nodes (11): attachmentsApi, usePageTitle(), AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName(), DashboardPage() (+3 more)

### Community 65 - ".update"
Cohesion: 0.40
Nodes (4): ApiBody, Body, Patch, Post

### Community 66 - "react-dom"
Cohesion: 0.31
Nodes (8): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, peopleApi, ProjectMemberDetail, rolesApi

### Community 67 - "authHeader"
Cohesion: 0.38
Nodes (6): KIND_CLASSES, TOAST_MS, Toaster(), ToastItem, subscribeToasts(), ToastKind

### Community 68 - "InitialsAvatar.tsx"
Cohesion: 0.40
Nodes (6): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), today()

### Community 69 - "PaginationQueryDto"
Cohesion: 0.47
Nodes (5): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE

### Community 70 - "StatusPill.tsx"
Cohesion: 0.21
Nodes (3): AuthedRequest, SupabaseAuthGuard, Injectable

### Community 71 - "moduleFileExtensions"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 74 - "@eslint/js"
Cohesion: 0.83
Nodes (3): StatusReport, StatusReportDetail, StatusReportListItem

## Knowledge Gaps
- **342 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+337 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `Community 27` to `Community 1`, `Community 2`, `CreateProjectDto`, `Community 5`, `Community 6`, `Community 8`, `CreateProjectDto`, `Community 10`, `Community 12`, `@eslint/js`, `nest-cli.json`, `status-reports.repository.ts`, `.update`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 20` to `nest-cli.json`, `Community 2`, `Community 1`, `.update`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 10`, `.update`, `reflect-metadata`, `PeopleRepository`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 20` to `nest-cli.json`, `Community 2`, `Community 1`, `.update`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 10`, `.update`, `reflect-metadata`, `PeopleRepository`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _342 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06914893617021277 - nodes in this community are weakly interconnected._