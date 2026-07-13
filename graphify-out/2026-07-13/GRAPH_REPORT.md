# Graph Report - ptrack  (2026-07-13)

## Corpus Check
- 138 files · ~39,842 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1194 nodes · 2360 edges · 69 communities (60 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ade5837`
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
- CreateActionItemDto
- AuthUser
- Community 34
- Community 35
- CreateProjectDto
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- supabase-error.ts
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- AddMilestoneDialog.tsx
- Community 50
- Community 54
- StatusReportDetailPage.tsx
- auth-context.tsx
- CLAUDE.md — P-Track
- App.tsx
- ProjectsRepository
- ActionItemDetailPage.tsx
- AttachmentDetailPage.tsx
- StatusReportDetailPage.tsx
- AddActionItemDialog
- .update
- attachments.repository.ts
- EditProjectDialog.tsx
- ActionItemDetailPage.tsx
- links.repository.ts

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 64 edges
2. `cn()` - 34 edges
3. `@nestjs/swagger` - 33 edges
4. `DatabaseService` - 32 edges
5. `AuthUser` - 31 edges
6. `CurrentUser` - 31 edges
7. `Button()` - 23 edges
8. `compilerOptions` - 22 edges
9. `compilerOptions` - 20 edges
10. `AttachmentsRepository` - 17 edges

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

## Communities (69 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (21): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (26): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Delete, Get, Param (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (12): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (26): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsOptional (+18 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (19): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (26): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (29): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot, CreateIssueDto, ApiProperty (+21 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (22): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (21): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (20): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (11): auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName(), relativeTime(), STATUS_LABELS (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (15): STATUSES, CategorySelect(), Props, Input(), Label(), SelectContent(), SelectItem(), SelectTrigger() (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (21): AddAttachmentDialog(), Props, AddLinkDialog(), Props, AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS (+13 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (20): AddResourceDialog(), AddUpdateDialog(), ACTIONS, attachmentUploader(), EXT_STYLES, fileExt(), formatReportDate(), formatSize() (+12 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (26): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.31
Nodes (8): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, peopleApi, ProjectMemberDetail, rolesApi

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (4): ActionItemsRepository, Injectable, ActionItemsService, Injectable

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.16
Nodes (19): Props, Props, Props, Props, ActionItem, ActionItemOwner, apiDelete(), apiGet() (+11 more)

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
Cohesion: 0.23
Nodes (14): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), SelectGroup() (+6 more)

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (12): DatabaseModule, Module, DatabaseService, Injectable, Milestone, MilestoneListItem, Resource, ResourceListItem (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.19
Nodes (8): Controller, Get, UsersController, Module, UsersModule, Injectable, UsersService, Query

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$ (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.10
Nodes (18): ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength (+10 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.13
Nodes (16): ArrayMaxSize, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+8 more)

### Community 33 - "AuthUser"
Cohesion: 0.21
Nodes (11): AuthUser, CurrentUser, ActionItemsController, ApiBody, Body, Controller, Delete, Get (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (10): AddIssueDialog(), emptyPerson(), Props, PersonAutocomplete(), Props, Issue, issuesApi, usersApi (+2 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "CreateProjectDto"
Cohesion: 0.17
Nodes (14): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+6 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (7): compilerOptions, baseUrl, paths, files, ./src/*, @/*, references

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (7): @nestjs/config, dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, react-router-dom, @supabase/supabase-js

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "supabase-error.ts"
Cohesion: 0.21
Nodes (8): logger, ActionItem, ActionItemComment, ActionItemListItem, Issue, IssueListItem, Update, UpdateListItem

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 49 - "AddMilestoneDialog.tsx"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Milestone (+2 more)

### Community 54 - "Community 54"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 55 - "StatusReportDetailPage.tsx"
Cohesion: 0.25
Nodes (9): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, ACCESS_LABELS, authorName(), longDate() (+1 more)

### Community 56 - "auth-context.tsx"
Cohesion: 0.24
Nodes (7): App(), AuthContext, AuthContextValue, AuthProvider(), supabase, supabaseKey, supabaseUrl

### Community 57 - "CLAUDE.md — P-Track"
Cohesion: 0.18
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete, graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "App.tsx"
Cohesion: 0.36
Nodes (7): ProtectedRoute(), useAuth(), CreateProjectWizard(), todayISO(), HomePage(), initials(), LoginPage()

### Community 59 - "ProjectsRepository"
Cohesion: 0.19
Nodes (7): toHttpException(), Project, ProjectDetail, ProjectsRepository, Injectable, ProjectsService, Injectable

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "AttachmentDetailPage.tsx"
Cohesion: 0.48
Nodes (5): AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 62 - "StatusReportDetailPage.tsx"
Cohesion: 0.06
Nodes (30): ApiSecurity, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+22 more)

### Community 63 - "AddActionItemDialog"
Cohesion: 0.40
Nodes (6): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), today()

### Community 65 - "attachments.repository.ts"
Cohesion: 0.83
Nodes (3): Attachment, AttachmentDetail, AttachmentListItem

### Community 66 - "EditProjectDialog.tsx"
Cohesion: 0.16
Nodes (14): EditProjectDialog(), Props, Button(), buttonVariants, categoriesApi, Project, ProjectDetail, projectsApi (+6 more)

### Community 67 - "ActionItemDetailPage.tsx"
Cohesion: 0.24
Nodes (8): ActionItemComment, actionItemsApi, ActionItemDetailPage(), commentAuthor(), ownersLabel(), STATUS_LABELS, Tab, TABS

## Knowledge Gaps
- **270 isolated node(s):** `ActionItemComment`, `ALLOWED`, `$schema`, `defaultMode`, `Bash(npm run dev:*)` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `ProjectsRepository` to `attachments.repository.ts`, `Community 1`, `Community 2`, `links.repository.ts`, `Community 3`, `Community 6`, `Community 7`, `Community 8`, `Community 5`, `supabase-error.ts`, `Community 10`, `Community 9`, `Community 17`, `Community 27`, `Community 28`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `Community 7` to `CreateActionItemDto`, `Community 1`, `Community 3`, `CreateProjectDto`, `Community 5`, `Community 6`, `Community 8`, `Community 9`, `Community 10`, `StatusReportDetailPage.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `CreateActionItemDto`, `Community 1`, `Community 3`, `CreateProjectDto`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 31`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `ActionItemComment`, `ALLOWED`, `$schema` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05909090909090909 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12648221343873517 - nodes in this community are weakly interconnected._