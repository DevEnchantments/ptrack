# Graph Report - ptrack  (2026-07-13)

## Corpus Check
- 137 files · ~36,033 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1118 nodes · 2249 edges · 65 communities (56 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3bb9ba6e`
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

## Communities (65 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (15): ArrayMaxSize, ActionItemsService, Injectable, CreateActionItemDto, IsArray, IsDateString, IsIn, IsOptional (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (21): AttachmentsController, Body, Controller, Delete, Get, Param, Patch, Post (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (10): IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength, UpdateProjectDto (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (20): CreateMilestoneDto, IsArray, IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUUID (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (19): CreateStatusReportDto, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController, Body (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (23): CreatePersonDto, IsIn, IsOptional, IsString, IsUUID, MaxLength, IsIn, IsOptional (+15 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (21): CreateIssueDto, IsArray, IsIn, IsOptional, IsString, IsUUID, MaxLength, UpdateIssueDto (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (18): CreateLinkDto, IsArray, IsBoolean, IsOptional, IsString, MaxLength, UpdateLinkDto, LinksController (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (19): CreateUpdateDto, IsArray, IsBoolean, IsOptional, IsString, IsUUID, UpdateUpdateDto, Body (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (19): CreateResourceDto, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto, ResourcesController, Body (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (11): auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName(), relativeTime(), STATUS_LABELS (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (20): CategorySelect(), Props, SelectContent(), SelectItem(), SelectTrigger(), SelectValue(), Lookup, lookupsApi (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.28
Nodes (13): STATUSES, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, Button(), buttonVariants, Dialog(), DialogContent(), DialogFooter() (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (33): Props, AddAttachmentDialog(), AddIssueDialog(), emptyPerson(), Props, AddLinkDialog(), Props, AddResourceDialog() (+25 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (26): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (10): App(), ProtectedRoute(), AuthContext, AuthContextValue, AuthProvider(), useAuth(), supabase, supabaseKey (+2 more)

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
Cohesion: 0.11
Nodes (26): Props, Props, Props, Props, ActionItemOwner, apiDelete(), apiGet(), apiPatch() (+18 more)

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
Cohesion: 0.22
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (8): DatabaseModule, Module, DatabaseService, Injectable, Attachment, AttachmentDetail, AttachmentListItem, Global

### Community 28 - "Community 28"
Cohesion: 0.23
Nodes (6): Controller, Get, UsersController, Injectable, UsersService, Query

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$ (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.07
Nodes (29): AppController, Controller, Get, AppModule, Module, AppService, Injectable, Public() (+21 more)

### Community 32 - "Community 32"
Cohesion: 0.19
Nodes (13): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, PersonAutocomplete(), Props, peopleApi (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.11
Nodes (16): AuthUser, CurrentUser, Body, Patch, Post, Body, Get, Param (+8 more)

### Community 34 - "Community 34"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Milestone (+2 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.40
Nodes (6): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), today()

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

### Community 55 - "projects.controller.ts"
Cohesion: 0.17
Nodes (7): ProjectsController, Controller, Delete, Get, Param, ProjectsService, Injectable

### Community 56 - "CreateProjectDto"
Cohesion: 0.21
Nodes (12): CreateProjectDto, ProjectMemberDto, IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID (+4 more)

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.18
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete, graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "toHttpException"
Cohesion: 0.31
Nodes (7): logger, toHttpException(), ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.24
Nodes (8): ActionItemComment, actionItemsApi, ActionItemDetailPage(), commentAuthor(), ownersLabel(), STATUS_LABELS, Tab, TABS

### Community 61 - "ActionItemsController"
Cohesion: 0.36
Nodes (5): ActionItemsController, Controller, Delete, Get, Param

### Community 62 - "StatusReportDetailPage.tsx"
Cohesion: 0.31
Nodes (8): Props, StatusReport, StatusReportDetail, statusReportsApi, ACCESS_LABELS, authorName(), longDate(), StatusReportDetailPage()

### Community 63 - "MiniCalendar.tsx"
Cohesion: 0.40
Nodes (5): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS

### Community 64 - ".update"
Cohesion: 0.40
Nodes (3): Body, Patch, Post

## Knowledge Gaps
- **238 isolated node(s):** `$schema`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)`, `Bash(npm run build:*)` (+233 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `toHttpException` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `ProjectsRepository`, `Community 10`, `Community 43`, `Community 9`, `Community 17`, `projects.controller.ts`, `Community 27`, `Community 28`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 33` to `Community 0`, `Community 1`, `.update`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `projects.controller.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 33` to `Community 0`, `Community 1`, `.update`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `projects.controller.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `$schema`, `defaultMode`, `Bash(npm run dev:*)` to the rest of the system?**
  _238 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06901960784313725 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08130081300813008 - nodes in this community are weakly interconnected._