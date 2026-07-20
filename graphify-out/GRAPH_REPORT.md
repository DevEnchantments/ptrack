# Graph Report - ptrack  (2026-07-20)

## Corpus Check
- 162 files · ~57,960 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1349 nodes · 2740 edges · 77 communities (68 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d71cc625`
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
- RecordHistory.tsx
- Community 43
- Community 44
- Community 45
- MiniCalendar.tsx
- Community 47
- Community 48
- toHttpException
- Community 50
- ProjectsController
- transform
- CreateResourceDto
- .update
- reflect-metadata
- @types/node
- ActionItemDetailPage.tsx
- PeopleRepository
- MilestonesController
- AttachmentDetailPage.tsx
- AddPersonDialog.tsx
- SupabaseAuthGuard
- react-dom
- RecordHistory.tsx
- .createCategory
- InitialsAvatar.tsx
- transform
- CreateUpdateDto
- @nestjs/config
- @nestjs/swagger
- milestones.repository.ts
- tw-animate-css

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 72 edges
2. `AuthUser` - 39 edges
3. `CurrentUser` - 39 edges
4. `cn()` - 36 edges
5. `DatabaseService` - 35 edges
6. `@nestjs/swagger` - 34 edges
7. `Button()` - 25 edges
8. `RecordHistoryService` - 22 edges
9. `compilerOptions` - 22 edges
10. `ActionItemsRepository` - 19 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/api.ts
- `AddActionItemDialog()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/auth-context.tsx
- `AddIssueDialog()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AddIssueDialog.tsx → frontend/src/lib/auth-context.tsx
- `Props` --references--> `MilestoneDetail`  [EXTRACTED]
  frontend/src/components/AddMilestoneDialog.tsx → frontend/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (77 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (26): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (13): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (22): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.16
Nodes (5): UpdateMilestoneDto, MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (24): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsIn, IsOptional, IsString, IsUUID (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (24): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (13): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (27): ACTION_ITEM_SEGMENTS, ActionItemsBreakdown(), ActivityHeatmap(), ActivityLineChart(), CATEGORY_SEGMENTS, CategoryDonut(), CompletionRadial(), DashboardPage() (+19 more)

### Community 12 - "Community 12"
Cohesion: 0.21
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (4): Injectable, UpdatesRepository, Injectable, UpdatesService

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (31): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, StatusPill(), TONE_CLASSES, toneFor() (+23 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (10): Props, ActionItem, ActionItemComment, actionItemsApi, ActionItemDetailPage(), commentAuthor(), ownersLabel(), STATUS_LABELS (+2 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.27
Nodes (8): ActionItemsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.16
Nodes (18): Props, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+10 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (21): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node (+13 more)

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
Cohesion: 0.13
Nodes (29): STATUSES, CategorySelect(), Props, Props, SelectContent(), SelectItem(), SelectTrigger(), SelectValue() (+21 more)

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (5): AuthedRequest, SupabaseAuthGuard, Injectable, DatabaseService, Injectable

### Community 28 - "Community 28"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsOptional (+4 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.05
Nodes (39): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+31 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.23
Nodes (8): MilestonesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 33 - "nest-cli.json"
Cohesion: 0.16
Nodes (5): toHttpException(), ActionItemsRepository, Injectable, ActionItemsService, Injectable

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (11): auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName(), relativeTime(), STATUS_LABELS (+3 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "CreateProjectDto"
Cohesion: 0.15
Nodes (10): AuthUser, CurrentUser, Delete, Delete, Delete, Delete, Delete, Delete (+2 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.25
Nodes (7): PaginationQueryDto, ApiPropertyOptional, IsOptional, Type, IsInt, Max, Min

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (7): compilerOptions, baseUrl, paths, files, ./src/*, @/*, references

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "RecordHistory.tsx"
Cohesion: 0.18
Nodes (5): DatabaseModule, Module, RecordHistoryService, Injectable, Global

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (8): statusReportsApi, usePageTitle(), HomePage(), initials(), ACCESS_LABELS, authorName(), longDate(), StatusReportDetailPage()

### Community 46 - "MiniCalendar.tsx"
Cohesion: 0.12
Nodes (19): ArrayMaxSize, Owners, ownersLabel(), CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString (+11 more)

### Community 48 - "Community 48"
Cohesion: 0.29
Nodes (5): AuthContext, AuthContextValue, supabase, supabaseKey, supabaseUrl

### Community 49 - "toHttpException"
Cohesion: 0.22
Nodes (7): ApiBody, Body, Get, Param, Patch, Post, Query

### Community 54 - "ProjectsController"
Cohesion: 0.20
Nodes (10): AppLayout(), NAV_ITEMS, ProtectedRoute(), Toaster(), ToastItem, useAuth(), subscribeToasts(), CreateProjectWizard() (+2 more)

### Community 55 - "transform"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Milestone (+2 more)

### Community 56 - "CreateResourceDto"
Cohesion: 0.27
Nodes (7): AddIssueDialog(), emptyPerson(), Props, PersonAutocomplete(), Props, Issue, issuesApi

### Community 57 - ".update"
Cohesion: 0.40
Nodes (6): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), today()

### Community 58 - "reflect-metadata"
Cohesion: 0.09
Nodes (23): AppModule, Module, bootstrap(), ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule (+15 more)

### Community 59 - "@types/node"
Cohesion: 0.16
Nodes (19): Props, AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS, Props, ConfirmDeleteButton(), Props (+11 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.08
Nodes (26): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+18 more)

### Community 62 - "MilestonesController"
Cohesion: 0.31
Nodes (8): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, peopleApi, ProjectMemberDetail, rolesApi

### Community 63 - "AttachmentDetailPage.tsx"
Cohesion: 0.39
Nodes (6): attachmentsApi, AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 64 - "AddPersonDialog.tsx"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 65 - "SupabaseAuthGuard"
Cohesion: 0.40
Nodes (5): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS

### Community 67 - "RecordHistory.tsx"
Cohesion: 0.39
Nodes (6): initials(), Props, RecordHistory(), relativeTime(), username(), HistoryEntry

### Community 68 - ".createCategory"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 71 - "CreateUpdateDto"
Cohesion: 0.13
Nodes (23): Props, Props, Props, ActionItemOwner, apiDelete(), apiGet(), apiPatch(), apiPost() (+15 more)

### Community 74 - "milestones.repository.ts"
Cohesion: 0.23
Nodes (8): HistoryEntry, HistoryInsert, logger, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

## Knowledge Gaps
- **313 isolated node(s):** `NAV_ITEMS`, `PALETTE`, `Props`, `TONE_CLASSES`, `SERIES` (+308 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `nest-cli.json` to `Community 1`, `Community 2`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `milestones.repository.ts`, `Community 10`, `Community 12`, `Community 13`, `PeopleRepository`, `AddMilestoneDialog.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `CreateProjectDto` to `CreateActionItemDto`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `MiniCalendar.tsx`, `CreateProjectDto`, `toHttpException`, `PeopleRepository`, `AddMilestoneDialog.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `CreateProjectDto` to `CreateActionItemDto`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `MiniCalendar.tsx`, `CreateProjectDto`, `toHttpException`, `PeopleRepository`, `AddMilestoneDialog.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `NAV_ITEMS`, `PALETTE`, `Props` to the rest of the system?**
  _313 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06168831168831169 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._