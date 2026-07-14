# Graph Report - ptrack  (2026-07-14)

## Corpus Check
- 142 files · ~44,165 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1244 nodes · 2482 edges · 61 communities (51 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `34af6812`
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
- Community 43
- Community 44
- Community 45
- Community 47
- Community 48
- toHttpException
- Community 50
- auth-context.tsx
- CLAUDE.md — P-Track
- ActionItemDetailPage.tsx
- PeopleRepository
- StatusReportDetailPage.tsx
- .update
- SupabaseAuthGuard
- react-dom
- ActionItemDetailPage.tsx

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 72 edges
2. `cn()` - 34 edges
3. `@nestjs/swagger` - 33 edges
4. `DatabaseService` - 32 edges
5. `AuthUser` - 31 edges
6. `CurrentUser` - 31 edges
7. `Button()` - 24 edges
8. `compilerOptions` - 22 edges
9. `compilerOptions` - 20 edges
10. `ActionItemsRepository` - 18 edges

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

## Communities (61 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (21): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (27): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Delete, Get, Param (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (13): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (29): HistoryEntry, CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (23): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.21
Nodes (12): AddStatusReportDialog(), EDITABLE_OPTIONS, Props, today(), VIEWABLE_OPTIONS, StatusReport, StatusReportDetail, statusReportsApi (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (25): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsIn, IsOptional, IsString, IsUUID (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (25): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (13): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (23): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+15 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (30): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, initials(), Props, RecordHistory() (+22 more)

### Community 12 - "Community 12"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 13 - "Community 13"
Cohesion: 0.26
Nodes (13): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), SelectGroup() (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (30): AddAttachmentDialog(), Props, AddLinkDialog(), AddPersonDialog(), emptyPerson(), memberName(), Props, AddResourceDialog() (+22 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (26): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (9): ApiBody, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.39
Nodes (6): attachmentsApi, AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.21
Nodes (24): ACCESS_LEVELS, CategorySelect(), Props, ConfirmDeleteButton(), Props, Button(), buttonVariants, Dialog() (+16 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (21): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+13 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (19): hooks, PreToolUse, permissions, allow, defaultMode, deny, $schema, Bash(git add:*) (+11 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (19): @base-ui/react, class-variance-authority, clsx, dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react (+11 more)

### Community 25 - "Community 25"
Cohesion: 0.11
Nodes (19): dependencies, class-transformer, jose, @nestjs/common, @nestjs/core, @nestjs/mapped-types, @nestjs/platform-express, @nestjs/swagger (+11 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (8): AuthedRequest, DatabaseModule, Module, DatabaseService, Injectable, Update, UpdateListItem, Global

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Milestone (+2 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.05
Nodes (38): ArrayMaxSize, AuthUser, CurrentUser, HistoryInsert, ActionItemsController, ApiBody, Body, Controller (+30 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 34 - "Community 34"
Cohesion: 0.10
Nodes (27): Props, Props, Props, Props, Props, ActionItemOwner, apiDelete(), apiGet() (+19 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "CreateProjectDto"
Cohesion: 0.17
Nodes (14): App(), AddIssueDialog(), emptyPerson(), ProtectedRoute(), AuthContext, AuthContextValue, AuthProvider(), useAuth() (+6 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.21
Nodes (8): Controller, Get, UsersController, Module, UsersModule, Injectable, UsersService, Query

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (7): compilerOptions, baseUrl, paths, files, ./src/*, @/*, references

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (7): @nestjs/config, dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, react-router-dom, @supabase/supabase-js

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 49 - "toHttpException"
Cohesion: 0.06
Nodes (40): logger, toHttpException(), CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString (+32 more)

### Community 56 - "auth-context.tsx"
Cohesion: 0.14
Nodes (18): PersonAutocomplete(), Props, projectsApi, usersApi, UserSummary, Props, StepAccess(), StepConfirmation() (+10 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.18
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (26): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+18 more)

### Community 62 - "StatusReportDetailPage.tsx"
Cohesion: 0.09
Nodes (23): AppModule, Module, bootstrap(), ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule (+15 more)

### Community 67 - "ActionItemDetailPage.tsx"
Cohesion: 0.36
Nodes (9): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), Props, STATUSES, today() (+1 more)

## Knowledge Gaps
- **277 isolated node(s):** `$schema`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)`, `Bash(npm run build:*)` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `CreateActionItemDto`, `Community 1`, `Community 2`, `Community 3`, `Community 5`, `status-reports.repository.ts`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 27`, `PeopleRepository`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `CreateActionItemDto` to `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 16`, `toHttpException`, `PeopleRepository`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `CreateActionItemDto` to `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 16`, `toHttpException`, `PeopleRepository`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `$schema`, `defaultMode`, `Bash(npm run dev:*)` to the rest of the system?**
  _277 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05989110707803993 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._