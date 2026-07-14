# Graph Report - ptrack  (2026-07-14)

## Corpus Check
- 142 files · ~43,003 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1235 nodes · 2381 edges · 69 communities (60 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b865d502`
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
- @base-ui/react
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- people.controller.ts
- Community 50
- Community 54
- CreatePersonDto
- auth-context.tsx
- CLAUDE.md — P-Track
- @nestjs/swagger
- ProjectsRepository
- ActionItemDetailPage.tsx
- PeopleRepository
- StatusReportDetailPage.tsx
- MiniCalendar.tsx
- .update
- supabase.ts
- react-dom
- ActionItemDetailPage.tsx
- @eslint/js

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 53 edges
2. `cn()` - 34 edges
3. `@nestjs/swagger` - 33 edges
4. `DatabaseService` - 28 edges
5. `AuthUser` - 24 edges
6. `CurrentUser` - 24 edges
7. `compilerOptions` - 22 edges
8. `Button()` - 22 edges
9. `compilerOptions` - 20 edges
10. `ActionItemsRepository` - 17 edges

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

## Communities (69 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (21): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (27): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Delete, Get, Param (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (12): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (16): MilestonesController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (23): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (12): ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, UpdatePersonDto, ApiBody, Body (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (25): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsIn, IsOptional, IsString, IsUUID (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (25): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (15): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (23): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+15 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (37): App(), ProtectedRoute(), initials(), Props, RecordHistory(), relativeTime(), username(), ActionItemComment (+29 more)

### Community 12 - "Community 12"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (17): Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (32): AddAttachmentDialog(), AddIssueDialog(), emptyPerson(), AddLinkDialog(), AddPersonDialog(), emptyPerson(), memberName(), Props (+24 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (26): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (8): logger, toHttpException(), Project, ProjectDetail, ProjectsRepository, Injectable, ProjectsService, Injectable

### Community 17 - "CreateProjectDto"
Cohesion: 0.19
Nodes (14): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.11
Nodes (26): Props, Props, Props, Props, Props, ActionItemOwner, apiDelete(), apiGet() (+18 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (21): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node (+13 more)

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
Nodes (19): dependencies, class-transformer, class-validator, @nestjs/common, @nestjs/core, @nestjs/mapped-types, @nestjs/platform-express, @nestjs/swagger (+11 more)

### Community 26 - "Community 26"
Cohesion: 0.27
Nodes (20): ACCESS_LEVELS, CategorySelect(), Props, ConfirmDeleteButton(), Props, Dialog(), DialogContent(), DialogFooter() (+12 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (7): SupabaseAuthGuard, Injectable, DatabaseModule, Module, DatabaseService, Injectable, Global

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (12): ArrayMaxSize, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+4 more)

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$ (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Milestone (+2 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.08
Nodes (18): HistoryEntry, ActionItemsController, ApiBody, Body, Controller, CurrentUser, Delete, Get (+10 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 34 - "Community 34"
Cohesion: 0.20
Nodes (9): ApiBody, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "CreateProjectDto"
Cohesion: 0.26
Nodes (9): AddStatusReportDialog(), EDITABLE_OPTIONS, Props, today(), VIEWABLE_OPTIONS, StatusReport, StatusReportDetail, statusReportsApi (+1 more)

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

### Community 42 - "@base-ui/react"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsOptional (+4 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 46 - "Community 46"
Cohesion: 0.20
Nodes (9): ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength (+1 more)

### Community 49 - "people.controller.ts"
Cohesion: 0.36
Nodes (4): PeopleController, Controller, PeopleService, Injectable

### Community 54 - "Community 54"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 55 - "CreatePersonDto"
Cohesion: 0.20
Nodes (8): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength

### Community 56 - "auth-context.tsx"
Cohesion: 0.11
Nodes (24): PersonAutocomplete(), Props, projectsApi, usersApi, UserSummary, AuthContext, AuthContextValue, useAuth() (+16 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.18
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.25
Nodes (6): CreateCommentDto, ApiProperty, IsString, UpdateMilestoneDto, MinLength, @nestjs/swagger

### Community 59 - "ProjectsRepository"
Cohesion: 0.18
Nodes (11): AuthUser, CurrentUser, ProjectsController, ApiBody, Body, Controller, Delete, Get (+3 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 62 - "StatusReportDetailPage.tsx"
Cohesion: 0.09
Nodes (23): AppModule, Module, bootstrap(), ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule (+15 more)

### Community 63 - "MiniCalendar.tsx"
Cohesion: 0.40
Nodes (5): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS

### Community 65 - "supabase.ts"
Cohesion: 0.50
Nodes (3): supabase, supabaseKey, supabaseUrl

### Community 67 - "ActionItemDetailPage.tsx"
Cohesion: 0.36
Nodes (9): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), Props, STATUSES, today() (+1 more)

## Knowledge Gaps
- **274 isolated node(s):** `ActionItemComment`, `ActionItemOwner`, `STATUS_LABELS`, `TABS`, `Tab` (+269 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `CreateActionItemDto`, `nest-cli.json`, `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 12`, `Community 46`, `people.controller.ts`, `CreateProjectDto`, `ProjectsRepository`, `Community 28`, `StatusReportDetailPage.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `Community 16` to `Community 1`, `Community 2`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `status-reports.repository.ts`, `CreatePersonDto`, `PeopleRepository`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `CreateMilestoneDto` connect `@base-ui/react` to `@nestjs/swagger`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `ActionItemComment`, `ActionItemOwner`, `STATUS_LABELS` to the rest of the system?**
  _274 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05989110707803993 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._