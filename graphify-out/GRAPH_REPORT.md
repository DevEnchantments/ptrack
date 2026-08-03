# Graph Report - ptrack  (2026-08-03)

## Corpus Check
- 187 files · ~74,296 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1526 nodes · 3122 edges · 80 communities (69 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `609ff169`
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
- RecordHistoryService
- nest-cli.json
- StatusPill.tsx
- moduleFileExtensions
- @nestjs/config
- react-dom
- links.repository.ts
- tw-animate-css
- dev.ps1
- @types/node
- StatusPill.tsx
- IsOptional

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 74 edges
2. `AuthUser` - 47 edges
3. `CurrentUser` - 47 edges
4. `@nestjs/swagger` - 40 edges
5. `DatabaseService` - 37 edges
6. `cn()` - 36 edges
7. `RecordHistoryService` - 26 edges
8. `Button()` - 26 edges
9. `CreateProjectDto` - 22 edges
10. `compilerOptions` - 22 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `Props` --references--> `ProjectDetail`  [EXTRACTED]
  frontend/src/components/EditProjectDialog.tsx → frontend/src/lib/api.ts
- `Props` --references--> `MilestoneDetail`  [EXTRACTED]
  frontend/src/components/AddMilestoneDialog.tsx → frontend/src/lib/api.ts
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/api.ts
- `Props` --references--> `StatusReport`  [EXTRACTED]
  frontend/src/components/AddStatusReportDialog.tsx → frontend/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (80 total, 11 thin omitted)

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
Nodes (26): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (23): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (4): LinksRepository, Injectable, LinksService, Injectable

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (34): Props, Props, Props, Props, Props, Props, Props, ActionItemOwner (+26 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.07
Nodes (38): initials(), Props, RecordHistory(), relativeTime(), username(), KIND_CLASSES, TOAST_MS, Toaster() (+30 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (13): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (10): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (29): EditProjectDialog(), Props, categoriesApi, ProjectDetail, ACTIONS, attachmentUploader(), collapsePrefsKey(), EXT_STYLES (+21 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (22): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), Props, STATUSES, today() (+14 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.21
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (9): AuthUser, CurrentUser, Delete, Delete, Delete, Delete, Delete, Delete (+1 more)

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
Cohesion: 0.08
Nodes (24): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+16 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (15): PersonAutocomplete(), Props, usersApi, UserSummary, emptyMember(), Props, StepAccess(), StepConfirmation() (+7 more)

### Community 28 - "Community 28"
Cohesion: 0.08
Nodes (31): Props, StatusPill(), TONE_CLASSES, toneFor(), Skeleton(), attachmentsApi, milestonesApi, usePageTitle() (+23 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.13
Nodes (19): ApiProperty, CreateProjectDto, ProjectMemberDto, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.11
Nodes (17): 1. Contrast report (measured 2026-07-29), 2. Findings per surface, 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M (+9 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.21
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.26
Nodes (3): toHttpException(), ActionItemsRepository, Injectable

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "CreateProjectDto"
Cohesion: 0.19
Nodes (8): HistoryEntry, HistoryInsert, logger, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.14
Nodes (19): NavSection, Props, Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription() (+11 more)

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
Nodes (5): ActionItemsService, Owners, ownersLabel(), Injectable, UpdateActionItemDto

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.23
Nodes (10): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+2 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.18
Nodes (11): ArrayMaxSize, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+3 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.21
Nodes (12): AddStatusReportDialog(), EDITABLE_OPTIONS, Props, today(), VIEWABLE_OPTIONS, StatusReport, StatusReportDetail, statusReportsApi (+4 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.06
Nodes (35): ApiSecurity, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+27 more)

### Community 54 - "ProjectsController"
Cohesion: 0.09
Nodes (24): App(), AddIssueDialog(), emptyPerson(), AddRiskDialog(), emptyPerson(), AppLayout(), NAV_ITEMS, ACTIONS (+16 more)

### Community 55 - "AttachmentDetailPage.tsx"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 56 - "@types/node"
Cohesion: 0.24
Nodes (11): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Milestone (+3 more)

### Community 57 - ".update"
Cohesion: 0.20
Nodes (8): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID

### Community 58 - "reflect-metadata"
Cohesion: 0.47
Nodes (4): colorOf(), InitialsAvatar(), initialsOf(), PALETTE

### Community 59 - "@types/node"
Cohesion: 0.19
Nodes (26): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), CategorySelect(), Props, ConfirmDeleteButton(), Props (+18 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+20 more)

### Community 62 - "StepDetails.tsx"
Cohesion: 0.40
Nodes (4): CreateCommentDto, ApiProperty, IsString, MinLength

### Community 63 - "auth-context.tsx"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 66 - "react-dom"
Cohesion: 0.19
Nodes (4): ProjectsRepository, Injectable, ProjectsService, Injectable

### Community 68 - "RecordHistoryService"
Cohesion: 0.14
Nodes (9): DatabaseModule, Module, DatabaseService, Injectable, RecordHistoryService, Injectable, Link, LinkListItem (+1 more)

### Community 69 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 71 - "moduleFileExtensions"
Cohesion: 0.21
Nodes (9): ApiBody, Body, Controller, Get, Param, Patch, Post, Query (+1 more)

### Community 75 - "links.repository.ts"
Cohesion: 0.16
Nodes (8): UpdateUpdateDto, Injectable, Update, UpdateListItem, UpdatesRepository, Injectable, UpdatesService, @nestjs/swagger

### Community 76 - "tw-animate-css"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 78 - "@types/node"
Cohesion: 0.31
Nodes (3): Project, ProjectDetail, ProjectListStats

### Community 80 - "IsOptional"
Cohesion: 0.29
Nodes (7): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type

## Knowledge Gaps
- **343 isolated node(s):** `1.1 Project → `projects` (EXTEND)`, `1.2 Milestone → `milestones` (mostly HAVE — big head start)`, `1.3 Task / Work Activity → `action_items` (EXTEND)`, `1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe)`, `1.5 Issue → `issues` (EXTEND)` (+338 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthUser` connect `Community 20` to `nest-cli.json`, `Community 2`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `moduleFileExtensions`, `CreateProjectDto`, `Community 10`, `links.repository.ts`, `Community 45`, `Community 13`, `AttachmentDetailPage.tsx`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 20` to `nest-cli.json`, `Community 2`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `moduleFileExtensions`, `CreateProjectDto`, `Community 10`, `links.repository.ts`, `Community 45`, `Community 13`, `AttachmentDetailPage.tsx`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `Community 34` to `Community 1`, `Community 2`, `CreateProjectDto`, `RecordHistoryService`, `Community 6`, `Community 7`, `Community 8`, `Community 5`, `Community 10`, `links.repository.ts`, `Community 12`, `CreateProjectDto`, `.update`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `1.1 Project → `projects` (EXTEND)`, `1.2 Milestone → `milestones` (mostly HAVE — big head start)`, `1.3 Task / Work Activity → `action_items` (EXTEND)` to the rest of the system?**
  _343 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06168831168831169 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07180851063829788 - nodes in this community are weakly interconnected._