# Graph Report - ptrack  (2026-07-15)

## Corpus Check
- 149 files · ~46,574 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1274 nodes · 2613 edges · 66 communities (55 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d34a682`
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
- @eslint/js
- transform
- auth-context.tsx
- CLAUDE.md — P-Track
- reflect-metadata
- @types/node
- ActionItemDetailPage.tsx
- PeopleRepository
- StatusReportDetailPage.tsx
- .update
- SupabaseAuthGuard
- react-dom

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 72 edges
2. `AuthUser` - 39 edges
3. `CurrentUser` - 39 edges
4. `DatabaseService` - 35 edges
5. `@nestjs/swagger` - 34 edges
6. `cn()` - 34 edges
7. `Button()` - 24 edges
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
- `Props` --references--> `Attachment`  [EXTRACTED]
  frontend/src/components/AddAttachmentDialog.tsx → frontend/src/lib/api.ts
- `AddIssueDialog()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AddIssueDialog.tsx → frontend/src/lib/auth-context.tsx

## Import Cycles
- None detected.

## Communities (66 total, 11 thin omitted)

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
Cohesion: 0.07
Nodes (28): HistoryEntry, CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+20 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (22): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.21
Nodes (4): logger, toHttpException(), ActionItemsRepository, Injectable

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (24): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsIn, IsOptional, IsString, IsUUID (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (24): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (31): PaginationQueryDto, ApiPropertyOptional, IsOptional, Type, CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray (+23 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (24): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+16 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (22): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, initials(), Props, RecordHistory() (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (29): AddAttachmentDialog(), AddIssueDialog(), emptyPerson(), Props, AddLinkDialog(), Props, AddResourceDialog(), AddUpdateDialog() (+21 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (20): App(), ProtectedRoute(), Toaster(), ToastItem, attachmentsApi, projectsApi, AuthContext, AuthContextValue (+12 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.17
Nodes (9): AuthUser, CurrentUser, Delete, Delete, Delete, Delete, Delete, Delete (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.25
Nodes (14): EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, Button(), buttonVariants, Dialog(), DialogContent() (+6 more)

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
Nodes (19): dependencies, class-transformer, class-validator, jose, @nestjs/common, @nestjs/core, @nestjs/mapped-types, @nestjs/platform-express (+11 more)

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (8): Owners, ownersLabel(), CreateCommentDto, ApiProperty, IsString, UpdateActionItemDto, MinLength, @nestjs/swagger

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (3): AuthedRequest, DatabaseService, Injectable

### Community 28 - "Community 28"
Cohesion: 0.16
Nodes (17): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), Props, STATUSES, today() (+9 more)

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transformIgnorePatterns (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.18
Nodes (14): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Props (+6 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.23
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.18
Nodes (11): ArrayMaxSize, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.08
Nodes (35): Props, Props, AddStatusReportDialog(), Props, today(), Props, ActionItemOwner, apiDelete() (+27 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "CreateProjectDto"
Cohesion: 0.24
Nodes (5): DatabaseModule, Module, RecordHistoryService, Injectable, Global

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.21
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

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

### Community 46 - "MiniCalendar.tsx"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 49 - "toHttpException"
Cohesion: 0.05
Nodes (39): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+31 more)

### Community 54 - "@eslint/js"
Cohesion: 0.47
Nodes (4): HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem

### Community 55 - "transform"
Cohesion: 0.67
Nodes (3): transform, ^.+\\.(t|j)s$, ts-jest

### Community 56 - "auth-context.tsx"
Cohesion: 0.13
Nodes (32): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, CategorySelect(), Props, Props (+24 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.18
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+20 more)

### Community 62 - "StatusReportDetailPage.tsx"
Cohesion: 0.10
Nodes (19): AppModule, Module, bootstrap(), ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule (+11 more)

## Knowledge Gaps
- **279 isolated node(s):** `$schema`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)`, `Bash(npm run build:*)` (+274 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `Community 6` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `status-reports.repository.ts`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `toHttpException`, `@eslint/js`, `PeopleRepository`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `CreateProjectDto` to `CreateActionItemDto`, `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `toHttpException`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `CreateProjectDto` to `CreateActionItemDto`, `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `toHttpException`, `Community 26`, `PeopleRepository`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `$schema`, `defaultMode`, `Bash(npm run dev:*)` to the rest of the system?**
  _279 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06168831168831169 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._