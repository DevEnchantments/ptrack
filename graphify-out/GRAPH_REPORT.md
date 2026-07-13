# Graph Report - .  (2026-07-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1107 nodes · 2239 edges · 55 communities (47 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `61c582c4`
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
- Community 17
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
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 54

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 64 edges
2. `cn()` - 34 edges
3. `DatabaseService` - 32 edges
4. `AuthUser` - 31 edges
5. `CurrentUser` - 31 edges
6. `Button()` - 23 edges
7. `compilerOptions` - 22 edges
8. `compilerOptions` - 20 edges
9. `AttachmentsRepository` - 17 edges
10. `Input()` - 17 edges

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

## Communities (55 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (37): ArrayMaxSize, AuthUser, CurrentUser, logger, toHttpException(), ActionItemsController, Body, Controller (+29 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (24): AttachmentsController, Body, Controller, Delete, Get, Param, Patch, Post (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (31): CreateProjectDto, ProjectMemberDto, IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID (+23 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (25): CreateMilestoneDto, IsArray, IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUUID (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (22): CreateStatusReportDto, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController, Body (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (24): CreatePersonDto, IsIn, IsOptional, IsString, IsUUID, MaxLength, IsIn, IsOptional (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (23): CreateIssueDto, IsArray, IsIn, IsOptional, IsString, IsUUID, MaxLength, UpdateIssueDto (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (23): CreateLinkDto, IsArray, IsBoolean, IsOptional, IsString, MaxLength, UpdateLinkDto, LinksController (+15 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (22): CreateUpdateDto, IsArray, IsBoolean, IsOptional, IsString, IsUUID, UpdateUpdateDto, Body (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (21): CreateResourceDto, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto, ResourcesController, Body (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.07
Nodes (32): Props, dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, ActionItemComment, actionItemsApi (+24 more)

### Community 12 - "Community 12"
Cohesion: 0.23
Nodes (20): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), CategorySelect(), Props, Input(), Label() (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (21): AddAttachmentDialog(), Props, AddLinkDialog(), Props, AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS (+13 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (25): Props, AddResourceDialog(), Props, AddUpdateDialog(), EditProjectDialog(), ProjectMemberDetail, Resource, ACTIONS (+17 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (26): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (18): App(), ProtectedRoute(), projectsApi, AuthContext, AuthContextValue, AuthProvider(), useAuth(), StepAccess() (+10 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (12): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (20): Props, Props, ActionItemOwner, apiDelete(), apiGet(), apiPatch(), apiPost(), apiUpload() (+12 more)

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
Cohesion: 0.12
Nodes (17): dependencies, class-transformer, class-validator, @nestjs/common, @nestjs/core, @nestjs/mapped-types, @nestjs/platform-express, reflect-metadata (+9 more)

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (13): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), SelectGroup() (+5 more)

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (5): DatabaseModule, Module, DatabaseService, Injectable, Global

### Community 28 - "Community 28"
Cohesion: 0.21
Nodes (8): Controller, Get, UsersController, Module, UsersModule, Injectable, UsersService, Query

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$ (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.26
Nodes (6): AppController, Controller, Get, AppService, Injectable, Public()

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (10): AddIssueDialog(), emptyPerson(), Props, PersonAutocomplete(), Props, Issue, issuesApi, usersApi (+2 more)

### Community 33 - "Community 33"
Cohesion: 0.21
Nodes (9): AppModule, Module, bootstrap(), AttachmentsModule, Module, MilestonesModule, Module, ProjectsModule (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Milestone (+2 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.36
Nodes (9): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), Props, STATUSES, today() (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "Community 38"
Cohesion: 0.39
Nodes (6): attachmentsApi, AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (7): compilerOptions, baseUrl, paths, files, ./src/*, @/*, references

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (7): @nestjs/config, dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, react-router-dom, @supabase/supabase-js

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "Community 42"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 54 - "Community 54"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

## Knowledge Gaps
- **229 isolated node(s):** `$schema`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)`, `Bash(npm run build:*)` (+224 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 17`, `Community 28`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `$schema`, `defaultMode`, `Bash(npm run dev:*)` to the rest of the system?**
  _229 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05627545353572751 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06464646464646465 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06531986531986532 - nodes in this community are weakly interconnected._