# Graph Report - ptrack  (2026-07-20)

## Corpus Check
- 152 files · ~51,038 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1294 nodes · 2523 edges · 79 communities (62 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35b470af`
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
- SupabaseAuthGuard
- react-dom
- toHttpException
- RecordHistory.tsx
- nest-cli.json
- CreateUpdateDto
- MiniCalendar.tsx
- ApiPropertyOptional
- IsArray
- IsIn
- IsOptional
- IsString
- IsUUID
- MaxLength

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 60 edges
2. `AuthUser` - 39 edges
3. `CurrentUser` - 39 edges
4. `@nestjs/swagger` - 34 edges
5. `cn()` - 34 edges
6. `DatabaseService` - 31 edges
7. `compilerOptions` - 22 edges
8. `Button()` - 21 edges
9. `compilerOptions` - 19 edges
10. `ActionItemsRepository` - 18 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/dialog.tsx → frontend/src/lib/utils.ts
- `DialogDescription()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/dialog.tsx → frontend/src/lib/utils.ts
- `Props` --references--> `ProjectDetail`  [EXTRACTED]
  frontend/src/components/EditProjectDialog.tsx → frontend/src/lib/api.ts
- `Props` --references--> `MilestoneDetail`  [EXTRACTED]
  frontend/src/components/AddMilestoneDialog.tsx → frontend/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (79 total, 17 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (21): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (26): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (13): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (8): MilestonesModule, Module, Milestone, MilestoneListItem, MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (22): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (14): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), Input() (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (16): ApiProperty, ApiPropertyOptional, CreateIssueDto, UpdateIssueDto, Issue, IssueListItem, IssuesRepository, Injectable (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (24): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (31): PaginationQueryDto, ApiPropertyOptional, IsOptional, Type, CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray (+23 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.24
Nodes (10): ProtectedRoute(), Toaster(), ToastItem, useAuth(), subscribeToasts(), CreateProjectWizard(), todayISO(), HomePage() (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.19
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (25): AddIssueDialog(), emptyPerson(), Props, AddResourceDialog(), AddUpdateDialog(), Issue, issuesApi, ACTIONS (+17 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (11): auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName(), relativeTime(), STATUS_LABELS (+3 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.13
Nodes (13): AuthUser, CurrentUser, Delete, Delete, Delete, ApiBody, Body, Delete (+5 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.11
Nodes (24): AddAttachmentDialog(), Props, AddLinkDialog(), Props, AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS (+16 more)

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
Cohesion: 0.18
Nodes (10): 1 · Database — Supabase SQL editor, 2 · Backend — `:3000`, 3 · Frontend — `:5173`, 4 · Explore, 🏗 Architecture, 📚 More docs, 🧪 Quality, 🚀 Quick start (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (5): AuthedRequest, DatabaseService, Injectable, RecordHistoryService, Injectable

### Community 28 - "Community 28"
Cohesion: 0.36
Nodes (9): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), Props, STATUSES, today() (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.18
Nodes (15): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), PersonAutocomplete() (+7 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.05
Nodes (38): ArrayMaxSize, HistoryEntry, HistoryInsert, logger, toHttpException(), ActionItemsController, ApiBody, Body (+30 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.23
Nodes (8): IssuesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 34 - "Community 34"
Cohesion: 0.48
Nodes (4): MilestonesController, Controller, Get, Param

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
Cohesion: 0.14
Nodes (14): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsOptional (+6 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 49 - "toHttpException"
Cohesion: 0.05
Nodes (39): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+31 more)

### Community 54 - "ProjectsController"
Cohesion: 0.24
Nodes (7): App(), AuthContext, AuthContextValue, AuthProvider(), supabase, supabaseKey, supabaseUrl

### Community 55 - "transform"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 56 - "auth-context.tsx"
Cohesion: 0.27
Nodes (8): Button(), buttonVariants, projectsApi, StepAccess(), StepDetails(), StepProject(), emptyMember(), STEP_LABELS

### Community 57 - "AddPersonDialog.tsx"
Cohesion: 0.20
Nodes (21): CategorySelect(), Props, EditProjectDialog(), Props, Label(), SelectContent(), SelectItem(), SelectTrigger() (+13 more)

### Community 58 - "reflect-metadata"
Cohesion: 0.09
Nodes (22): AppModule, Module, DatabaseModule, Module, bootstrap(), ActionItemsModule, Module, AttachmentsModule (+14 more)

### Community 59 - "@types/node"
Cohesion: 0.31
Nodes (8): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, peopleApi, ProjectMemberDetail, rolesApi

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+20 more)

### Community 62 - "MilestonesController"
Cohesion: 0.48
Nodes (5): AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 63 - "CreateProjectDto"
Cohesion: 0.60
Nodes (4): ACCESS_LABELS, authorName(), longDate(), StatusReportDetailPage()

### Community 69 - "RecordHistory.tsx"
Cohesion: 0.39
Nodes (6): initials(), Props, RecordHistory(), relativeTime(), username(), HistoryEntry

### Community 70 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 71 - "CreateUpdateDto"
Cohesion: 0.17
Nodes (18): Props, Props, Props, ActionItemOwner, apiDelete(), apiGet(), apiPatch(), apiPost() (+10 more)

### Community 73 - "MiniCalendar.tsx"
Cohesion: 0.16
Nodes (13): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, ActionItemComment, actionItemsApi, ActionItemDetailPage() (+5 more)

## Knowledge Gaps
- **289 isolated node(s):** `What this project is`, `Tech stack`, `Hard architectural rules (do not violate)`, `Repo & environment`, `Current state — Phase 1 complete (full CRUD)` (+284 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `CreateActionItemDto` to `Community 1`, `Community 2`, `Community 5`, `Community 8`, `Community 9`, `Community 10`, `Community 12`, `toHttpException`, `PeopleRepository`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `CreateProjectDto` to `CreateActionItemDto`, `Community 1`, `nest-cli.json`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `RecordHistory.tsx`, `Community 10`, `toHttpException`, `PeopleRepository`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `CreateProjectDto` to `CreateActionItemDto`, `Community 1`, `nest-cli.json`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `RecordHistory.tsx`, `Community 10`, `toHttpException`, `PeopleRepository`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `What this project is`, `Tech stack`, `Hard architectural rules (do not violate)` to the rest of the system?**
  _289 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06168831168831169 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._