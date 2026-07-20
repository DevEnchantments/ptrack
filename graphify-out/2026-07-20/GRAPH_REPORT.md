# Graph Report - ptrack  (2026-07-20)

## Corpus Check
- 154 files · ~51,931 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1301 nodes · 2229 edges · 86 communities (67 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ed2e078`
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
- auth-context.tsx
- AddPersonDialog.tsx
- reflect-metadata
- @types/node
- ActionItemDetailPage.tsx
- PeopleRepository
- MilestonesController
- CreateProjectDto
- class-validator
- SupabaseAuthGuard
- react-dom
- CreateIssueDto
- AddMilestoneDialog.tsx
- RecordHistory.tsx
- nest-cli.json
- CreateUpdateDto
- .add
- @nestjs/swagger
- AddIssueDialog.tsx
- ApiBody
- Body
- Controller
- Delete
- Get
- Param
- Patch
- Post
- Query
- Injectable
- resources.repository.ts

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 60 edges
2. `AuthUser` - 36 edges
3. `CurrentUser` - 36 edges
4. `@nestjs/swagger` - 34 edges
5. `DatabaseService` - 33 edges
6. `cn()` - 32 edges
7. `Button()` - 22 edges
8. `compilerOptions` - 22 edges
9. `RecordHistoryService` - 19 edges
10. `compilerOptions` - 19 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `Props` --references--> `ProjectMemberInput`  [EXTRACTED]
  frontend/src/components/PersonAutocomplete.tsx → frontend/src/pages/CreateProjectWizard.tsx
- `Props` --references--> `CreateProjectForm`  [EXTRACTED]
  frontend/src/pages/create-project/StepAccess.tsx → frontend/src/pages/CreateProjectWizard.tsx
- `Props` --references--> `CreateProjectForm`  [EXTRACTED]
  frontend/src/pages/create-project/StepDetails.tsx → frontend/src/pages/CreateProjectWizard.tsx
- `Props` --references--> `CreateProjectForm`  [EXTRACTED]
  frontend/src/pages/create-project/StepProject.tsx → frontend/src/pages/CreateProjectWizard.tsx

## Import Cycles
- None detected.

## Communities (86 total, 19 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (16): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (13): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (19): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (13): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsOptional (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (23): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsIn, IsOptional, IsString, IsUUID (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (24): RecordHistoryService, Injectable, CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (29): PaginationQueryDto, ApiPropertyOptional, IsOptional, Type, CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray (+21 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (20): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (16): App(), ProtectedRoute(), Toaster(), ToastItem, projectsApi, AuthContext, AuthContextValue, AuthProvider() (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.19
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

### Community 13 - "Community 13"
Cohesion: 0.19
Nodes (14): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (24): attachmentsApi, ProjectMemberDetail, Resource, resourcesApi, Update, updatesApi, ACTIONS, attachmentUploader() (+16 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (12): milestonesApi, auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName(), relativeTime() (+4 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.22
Nodes (7): AuthUser, CurrentUser, Delete, Delete, Delete, Delete, Delete

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (37): CategorySelect(), Props, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+29 more)

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
Cohesion: 0.22
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (9): DatabaseModule, Module, DatabaseService, Injectable, Issue, IssueListItem, Link, LinkListItem (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (9): ActionItem, ActionItemComment, actionItemsApi, ActionItemDetailPage(), commentAuthor(), ownersLabel(), STATUS_LABELS, Tab (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.31
Nodes (3): toHttpException(), ProjectsRepository, Injectable

### Community 32 - "CreateActionItemDto"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 33 - "nest-cli.json"
Cohesion: 0.07
Nodes (18): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+10 more)

### Community 34 - "Community 34"
Cohesion: 0.21
Nodes (3): AuthedRequest, SupabaseAuthGuard, Injectable

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

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
Cohesion: 0.20
Nodes (12): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, StatusReport, StatusReportDetail, statusReportsApi (+4 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 46 - "MiniCalendar.tsx"
Cohesion: 0.13
Nodes (17): ArrayMaxSize, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+9 more)

### Community 49 - "toHttpException"
Cohesion: 0.16
Nodes (8): ProjectsController, ProjectsService, Controller, Delete, Get, Injectable, Param, Query

### Community 54 - "ProjectsController"
Cohesion: 0.31
Nodes (6): logger, StatusReport, StatusReportDetail, StatusReportListItem, Update, UpdateListItem

### Community 55 - "transform"
Cohesion: 0.29
Nodes (7): UploadedFileLike, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, UpdateAttachmentDto

### Community 56 - "auth-context.tsx"
Cohesion: 0.23
Nodes (13): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, PersonAutocomplete(), Props, emptyMember() (+5 more)

### Community 57 - "AddPersonDialog.tsx"
Cohesion: 0.39
Nodes (8): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), Props, STATUSES, today()

### Community 58 - "reflect-metadata"
Cohesion: 0.11
Nodes (21): AppModule, Module, bootstrap(), ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule (+13 more)

### Community 59 - "@types/node"
Cohesion: 0.47
Nodes (4): HistoryEntry, HistoryInsert, Milestone, MilestoneListItem

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+20 more)

### Community 62 - "MilestonesController"
Cohesion: 0.13
Nodes (8): Props, Props, Props, Props, Props, Props, Button(), buttonVariants

### Community 63 - "CreateProjectDto"
Cohesion: 0.33
Nodes (5): AddStatusReportDialog(), EDITABLE_OPTIONS, Props, today(), VIEWABLE_OPTIONS

### Community 65 - "SupabaseAuthGuard"
Cohesion: 0.20
Nodes (9): ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength (+1 more)

### Community 67 - "CreateIssueDto"
Cohesion: 0.32
Nodes (5): ApiBody, Body, CurrentUser, Patch, Post

### Community 68 - "AddMilestoneDialog.tsx"
Cohesion: 0.39
Nodes (7): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today()

### Community 69 - "RecordHistory.tsx"
Cohesion: 0.39
Nodes (6): initials(), Props, RecordHistory(), relativeTime(), username(), HistoryEntry

### Community 70 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 71 - "CreateUpdateDto"
Cohesion: 0.12
Nodes (24): ActionItemOwner, apiDelete(), apiGet(), apiPatch(), apiPost(), apiUpload(), Attachment, AttachmentDetail (+16 more)

### Community 72 - ".add"
Cohesion: 0.48
Nodes (5): AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 73 - "@nestjs/swagger"
Cohesion: 0.43
Nodes (5): Attachment, AttachmentDetail, AttachmentListItem, Project, ProjectDetail

### Community 74 - "AddIssueDialog.tsx"
Cohesion: 0.50
Nodes (3): AddIssueDialog(), emptyPerson(), Props

## Knowledge Gaps
- **305 isolated node(s):** `What this project is`, `Tech stack`, `Hard architectural rules (do not violate)`, `Repo & environment`, `Current state — Phase 1 complete (full CRUD)` (+300 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/swagger` connect `MiniCalendar.tsx` to `CreateActionItemDto`, `SupabaseAuthGuard`, `Community 5`, `nest-cli.json`, `Community 7`, `Community 8`, `Community 9`, `Community 6`, `Community 10`, `Community 13`, `transform`, `reflect-metadata`, `PeopleRepository`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `CreateProjectDto` to `nest-cli.json`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `MiniCalendar.tsx`, `transform`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `CreateProjectDto` to `nest-cli.json`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `MiniCalendar.tsx`, `transform`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `What this project is`, `Tech stack`, `Hard architectural rules (do not violate)` to the rest of the system?**
  _305 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07439024390243902 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._