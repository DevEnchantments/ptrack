# Graph Report - ptrack  (2026-07-13)

## Corpus Check
- 138 files · ~38,028 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1163 nodes · 2300 edges · 65 communities (55 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `22fcf997`
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
- projects.controller.ts
- CreateProjectDto
- CLAUDE.md — P-Track
- toHttpException
- ProjectsRepository
- ActionItemDetailPage.tsx
- ActionItemsController
- StatusReportDetailPage.tsx
- MiniCalendar.tsx
- .update

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
- `SelectGroup()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/select.tsx → frontend/src/lib/utils.ts
- `SelectLabel()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/select.tsx → frontend/src/lib/utils.ts
- `SelectSeparator()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/select.tsx → frontend/src/lib/utils.ts
- `SelectScrollUpButton()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/select.tsx → frontend/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (65 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (21): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (26): ApiBody, ApiConsumes, AttachmentsController, Body, Controller, Delete, Get, Param (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (8): IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength, UpdateProjectDto

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (24): CreateMilestoneDto, IsArray, IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUUID (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (19): CreateStatusReportDto, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController, Body (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (21): CreatePersonDto, IsIn, IsOptional, IsString, IsUUID, MaxLength, IsIn, IsOptional (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (16): CreateIssueDto, IsArray, IsIn, IsOptional, IsString, IsUUID, MaxLength, UpdateIssueDto (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (21): CreateLinkDto, IsArray, IsBoolean, IsOptional, IsString, MaxLength, UpdateLinkDto, LinksController (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (15): CreateUpdateDto, IsArray, IsBoolean, IsOptional, IsString, IsUUID, UpdateUpdateDto, Controller (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (14): CreateResourceDto, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto, ResourcesController, Controller (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (30): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), today(), dateParts(), MiniCalendar() (+22 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (36): AddResourceDialog(), AddUpdateDialog(), CategorySelect(), Props, EditProjectDialog(), Props, Label(), SelectContent() (+28 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (26): AddAttachmentDialog(), AddLinkDialog(), Props, AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS, Button() (+18 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (22): Props, Props, Resource, Update, ACTIONS, attachmentUploader(), EXT_STYLES, fileExt() (+14 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (26): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (12): App(), ProtectedRoute(), AuthContext, AuthContextValue, AuthProvider(), useAuth(), supabase, supabaseKey (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.05
Nodes (34): ArrayMaxSize, logger, toHttpException(), ActionItem, ActionItemComment, ActionItemListItem, ActionItemsRepository, Injectable (+26 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (22): Props, Props, ActionItemOwner, apiDelete(), apiGet(), apiPatch(), apiPost(), apiUpload() (+14 more)

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
Cohesion: 0.12
Nodes (17): dependencies, class-transformer, class-validator, @nestjs/common, @nestjs/core, @nestjs/mapped-types, @nestjs/platform-express, @nestjs/swagger (+9 more)

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (12): Props, STATUSES, AddIssueDialog(), emptyPerson(), Props, PersonAutocomplete(), Props, Dialog() (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.20
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
Cohesion: 0.09
Nodes (23): AppModule, Module, bootstrap(), ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule (+15 more)

### Community 32 - "Community 32"
Cohesion: 0.31
Nodes (8): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, peopleApi, ProjectMemberDetail, rolesApi

### Community 33 - "Community 33"
Cohesion: 0.12
Nodes (15): AuthUser, CurrentUser, Body, Get, Param, Patch, Post, Patch (+7 more)

### Community 34 - "Community 34"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Milestone (+2 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.21
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

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
Cohesion: 0.25
Nodes (7): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot, @nestjs/swagger

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 49 - "Community 49"
Cohesion: 0.29
Nodes (5): Body, Get, Param, Patch, Post

### Community 54 - "Community 54"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 55 - "projects.controller.ts"
Cohesion: 0.19
Nodes (8): ProjectsController, Body, Controller, Delete, Get, Param, Patch, Post

### Community 56 - "CreateProjectDto"
Cohesion: 0.21
Nodes (12): CreateProjectDto, ProjectMemberDto, IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID (+4 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.18
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete, graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 59 - "ProjectsRepository"
Cohesion: 0.16
Nodes (6): Project, ProjectDetail, ProjectsRepository, Injectable, ProjectsService, Injectable

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "ActionItemsController"
Cohesion: 0.22
Nodes (8): ActionItemsController, Body, Controller, Delete, Get, Param, Patch, Post

## Knowledge Gaps
- **270 isolated node(s):** `$schema`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)`, `Bash(npm run build:*)` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `Community 17` to `Community 1`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `ProjectsRepository`, `Community 28`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 33` to `Community 1`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 17`, `Community 49`, `projects.controller.ts`, `ActionItemsController`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 33` to `Community 1`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 17`, `Community 49`, `projects.controller.ts`, `ActionItemsController`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `$schema`, `defaultMode`, `Bash(npm run dev:*)` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06140350877192982 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.0726950354609929 - nodes in this community are weakly interconnected._