# UI Visual Audit & Staged Restyling Plan

**Status:** living checklist. Produced 2026-07-29 from a full sweep of the frontend
(apple-design + emil-design-eng skill lenses; contrast ratios computed, not estimated).
Work the stages top to bottom, one stage = one commit. Tick items as they ship and
update the ratio tables if any token value changes.

**Ground rules for every stage (from Fares, restated so future sessions obey them):**

- Pure visual pass. No logic, handlers, hooks, state, data flow, `lib/api.ts`,
  backend files, or routes.
- Form field sets are FROZEN (mapped from demo screenshots): no adding, removing,
  renaming, or reordering fields. Validation rules and error semantics unchanged.
- No new dependencies, no charting library (Phase 2 decision stays open).
- Colors only via the shadcn tokens in `frontend/src/index.css`; no hardcoded hexes
  in components. Any token change must hold AA and show before/after ratios here.
- ~~Layout mirrors the demo by design.~~ **LIFTED 2026-07-29 by Fares: the demo no
  longer constrains the design.** Diverge where it produces a better result. Every
  `⚠ DEMO-PARITY` marker in section 2 is superseded; section 6 records the resolved
  calls. Field sets remain frozen regardless: that is a spec matter, not a demo one.
- Respect `prefers-reduced-motion`. Lint stays blocking at 0 errors.

---

## 1. Contrast report (measured 2026-07-29)

Core Palette C text pairs all pass AA in both themes: foreground/background 14.71,
foreground/card 15.76, muted-fg/card 5.41, primary-fg/primary 5.17, primary-as-text
on card 5.17, secondary-fg/secondary 13.55, sidebar-fg/sidebar 8.62; dark theme
15.05 / 13.73 / 6.47 / 7.04 / 6.52 / 9.02. Failures live in raw Tailwind palette
classes that bypass the tokens:

| Where | Pair | Ratio | Verdict |
|---|---|---|---|
| Updates avatar (ProjectDetailPage ~L1077) | white on `teal-400` | 1.86:1 | FAIL, worst in app |
| Gold labels, light (links/updates/attachments) | `amber-600` on white | 3.19:1 | FAIL for text-xs |
| Sidebar Phase-2 stubs | `sidebar-foreground/40` on navy | 2.39:1 | disabled-exempt, but weak |
| Error text on gray canvas, light | destructive on `#f6f7f9` | 4.45:1 | marginal fail |
| Priority star fill, light | `amber-400` on white | 1.67:1 | tolerable: always paired with text |
| Input hairlines | `#e2e6ec` on white | 1.25:1 | inputs identified by fill + label; nudge only |

### Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing

| Token | Before | After | Ratio before → after |
|---|---|---|---|
| `--destructive` (light) | `oklch(0.577 0.245 27.325)` | `oklch(0.55 0.245 27.325)` (≈#dd0000) | 4.45 → 4.81 on canvas; 4.77 → 5.15 on card |
| Stub opacity (class in AppLayout, not a token) | `text-sidebar-foreground/40` | `/60` | 2.39 → 3.87 |
| `--input` + `--border` (light) | `#e2e6ec` | `#c2ccd8` | 1.25 → 1.63 on card (full 3:1 needs ≈#8b96a5: too heavy for hairlines, not recommended) |
| NEW `--success` (+ border shade) | raw `emerald-700/600/300…` in toaster | `#047857` light / `#6ee7b7` dark | 5.12 light, 11.92 dark, PASS |
| NEW `--gold` (light) | raw `amber-600` | `#b45309` (amber-700) | 3.19 → 5.02 |
| Update avatar (class swap) | `bg-teal-400` + `text-white` | `bg-primary` + `text-primary-foreground` | 1.86 → 5.17 |
| NEW `--destructive-foreground` (Stage 2) | raw `text-white` in ConfirmDeleteButton | `#ffffff` light / `#450a0a` dark | 5.15 light, 5.59 dark, PASS |

Dark-mode ambers/emeralds already pass (9.93 to 11.92), so only light values move.
Other measured references: red-600 overdue on card 4.83 PASS; white on red-600 brand
strip 4.83 PASS; StatusPill pairs (emerald 5.21, amber 4.84, red 5.91, blue 6.16) all
PASS but bypass tokens; `--chart-1..3` trio previously validated CVD-safe, untouched.

**Post-Stage-1 measured state (all PASS):** destructive 4.81 canvas / 5.15 card;
stubs 3.87; success 5.48 light / 10.88 dark; gold 5.02 light / 9.93 dark; status
pills 4.84-6.16 light / 8.15-10.39 dark; hairlines 1.63 (deliberate, see table).
Still open (fixed by later stages, not tokens): teal-avatar 1.86 and raw amber-600
gold labels 3.19, both swept in Stage 3 onto the new tokens.

---

## 2. Findings per surface

### A. Tokens + `components/ui` primitives — severity HIGH, effort M

| Before | After | Why |
|---|---|---|
| Button `transition-all` (button.tsx:7) | `transition-[color,background-color,border-color,box-shadow,transform] duration-150` | never `all`; it also makes the 1px press-dip mushy |
| No easing tokens; overlays run on CSS `ease`, controls on Tailwind default | `--ease-out: cubic-bezier(0.23,1,0.32,1)` (+ `--ease-in-out`) wired into motion classes and overlay animations | built-in easings are weak; one house curve = cohesion |
| Toast exits by unmounting instantly (toaster.tsx:33) | exit fade/slide ~150ms before removal | enter/exit same path; abrupt vanish reads broken |
| Toast success = raw `emerald-*` (toaster.tsx:19-23) | `--success` tokens | only token bypass inside primitives |
| Toast surface `bg-background` | `bg-popover` | floating surfaces are popover; on gray canvas, background is not elevated |
| Dialog overlay `bg-black/10` (dialog.tsx:32) | scrim token (`--overlay`), heavier in dark | hardcoded color; near-invisible scrim in dark mode |
| DialogContent has ring but no shadow, while Select = `shadow-md`, toast = `shadow-lg` | one elevation scale: dialog ≥ toast > popover > card | biggest surface currently reads flattest |
| Select chevron static (select.tsx:50) | rotate 180° on open, 150ms transform | cheap state indication |
| Only press feedback anywhere = 1px translate | `active:scale-[0.98]` on Button (transform-only) | buttons must visibly respond to press |
| Reduced-motion nukes everything to 0.01ms (index.css:215) | keep blanket, exempt opacity-only fades | reduced motion = gentler, not zero (LOW priority) |

Also: no `@media (hover: hover)` gating anywhere; radios have `hover:scale-110` but
checkboxes none (drop the scale rather than spread it: hover effects seen tens of
times per day should shrink).

### B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M

- Two footer architectures: split (`sm:justify-between`, delete far left: ActionItem,
  Milestone, Person, EditProject) vs left-cluster where Delete sits NEXT TO Cancel
  (Issue, Update, Resource, StatusReport, Attachment, Link). Standardize on split.
- Two delete flows, three copy variants: `ConfirmDeleteButton` (6 dialogs, spinner)
  vs hand-rolled inline (4 dialogs, no spinner); prompts `Delete?` / `Remove?` /
  `Delete this project?`; dismiss `No` vs `Cancel` (EditProject's armed "Cancel"
  collides with footer Cancel). Unify copy + placement now; swapping the component
  itself touches handlers, defer.
- Four content widths for comparable forms: `sm:max-w-lg` (Resource) / `sm:max-w-2xl`
  no-scroll (Person) / `max-h-[85vh] overflow-y-auto sm:max-w-2xl` (six) /
  `max-h-[90vh] sm:max-w-3xl` (EditProject). AddPerson can outgrow the viewport.
- Required-asterisk truth-drift: Status validated in 4 dialogs, asterisked in 2
  (Milestone yes, EditProject yes, ActionItem no, Issue no). AddUpdate's required
  body Textarea has no Label at all (demo-parity check first). AddStatusReport
  asterisks a readOnly field and stamps `*` on every RadioRow unconditionally.
- Error rendering, three styles: `FieldError` (text-xs, hint-in) vs form-level
  `<p class="text-sm text-destructive">` (unanimated) vs AddLink rendering BOTH for
  the URL field (L178-179). One style for one semantic.
- AddLink is the only dialog with no busy spinner (no Loader2 import).
- Five placeholder idioms: `- Select -` / `- Select Type -` / `- No Role -` /
  `- None -` / no placeholder. ⚠ DEMO-PARITY: unify only where screenshots don't
  dictate the string.
- Duplication: HelpDot component (Issue) copy-pasted inline in Update, Attachment,
  Link; gold-checkbox block 3 copies (one `pt-1`, two without); `GOLD_HELP` string
  3 copies; `text-[10px]` type-scale outliers.
- `aria-invalid` on Inputs but never on invalid Selects (Resource Type, Person Role,
  EditProject Status) nor PersonAutocomplete.
- ConfirmDeleteButton armed state: raw `text-white` + solid fill matching neither
  its idle state nor the `destructive` button variant.
- PersonAutocomplete pending chip: raw amber scale (passes AA light 4.84 / dark
  10.39) → move to `--gold`/warning tokens for consistency.

### C. Detail pages — severity HIGH, effort M-L

- Loading: Home + ProjectDetail have skeletons; Milestone, ActionItem, StatusReport,
  Attachment show a bare `Loading…` paragraph. Biggest perceived-quality gap.
- Empty states, five treatments: dashed box centered (Home) / dashed box + action
  button (SectionCard) / solid box (Milestone `No Data Found.`, Title Case outlier) /
  bare paragraph (comments, recent reports, open issues, description) / inline `-`
  vs `—` placeholder. One recipe everywhere; sentence case.
- Raw palette concentration: ProjectDetailPage 26 sites (file-type chip map
  L121-134, overdue `red-600` L762/L848, gold ambers L921/L1090/L1210 + dots,
  teal avatar L1077, `text-white` L1192), StatusReport brand strip `bg-red-600`
  L137 (⚠ demo-parity: keep look, tokenize value), StepDetails/StepConfirmation
  ambers, StatusPill emerald/amber/red/blue. Sweep onto `--gold`, `--success`,
  `--status-*`; overdue = destructive.
- Layout drift: container `max-w-2xl/3xl/5xl/6xl`, rail `240/260/280px`, aside
  `gap-4` vs `gap-6`, card radii `rounded-md/lg/xl` split across pages.
- `Field` empty behavior: renders `-` (Milestone, Attachment) vs silently drops the
  row (ProjectDetail, ActionItem). Same name, opposite behavior; pick one.
- Milestone page uses literal `+` and `›` text glyphs as buttons; siblings use
  lucide. `Lock` at 3.5 and 5, `Pencil` at 4 and 3.5: normalize icon sizes.
- Status shown as StatusPill on Home/ProjectDetail but plain muted text on
  Milestone; H1 is the record name on ProjectDetail but a static noun elsewhere
  (⚠ demo-parity question).

### D. AppLayout + CommandPalette — severity MED, effort S

- CommandPalette entrance animation (`animate-in fade-in-0 zoom-in-95 duration-100`)
  on a Ctrl+K keyboard surface: REMOVE ENTIRELY (Emil: never animate
  keyboard-initiated actions; Raycast precedent).
- Sidebar collapse: `transition-all` on width → `transition-[width]`, fade labels.
- Scroll-top button: enters `toast-in`, exits instantly → symmetric fade-out.
- Nav links have no hover transition while header buttons do.
- Stubs get `/60` (Stage 1 table). Header stays opaque (demo-parity; translucent
  option flagged in section 6).

### E. HomePage — severity LOW, effort S

Strongest page. Card hover `transition-all duration-200` → transform/shadow only;
error state gets the outline recovery button the detail pages have; card `h2
text-base` vs section `text-lg` elsewhere.

### F. Dashboard preview — severity LOW, effort S

Cards `rounded-xl` vs Home `rounded-lg`: unify via card recipe. Chart titles are
`<p>`, should be headings. 650-900ms draw-ins acceptable as one-time decorative
reveals. Chart/heat tokens already correct; mostly leave alone.

### G. Login + Wizard — severity LOW, effort S

Login h1 (`text-xl`) smaller than the card title below it (`text-2xl`); page `p-4`
vs app `p-6`. Wizard steps float with no card container unlike the rest of the app.
StepConfirmation: `gap-4`/`px-4`/`—` where siblings use `gap-6`/`px-1`/`-`.

---

## 3. Staged plan (one stage = one commit; tick when shipped)

- [x] **Stage 1 — Foundation (tokens + primitives).** SHIPPED 2026-07-29, visually
  confirmed by Fares. index.css: `--ease-out`/`--ease-in-out` (plain `@theme` block,
  also upgrades the `ease-out` utility app-wide), `--success`, `--gold`, `--overlay`,
  `--status-*`; destructive + input/border nudges; stub opacity `/60`; `toast-out`
  keyframes. ui/: button explicit transition list + `active:scale-[0.98]`, toaster
  exit animation (closing flag + 150ms delay) + success tokens + `bg-popover`,
  dialog `bg-overlay` scrim + `shadow-lg`, select chevron rotates via
  `group-data-popup-open/trigger`. Ratios re-verified (see section 1).
- [x] **Stage 2 — Dialog consistency.** SHIPPED 2026-07-29, visually confirmed by
  Fares. One size recipe (`max-h-[85vh] overflow-y-auto sm:max-w-2xl`; EditProject
  keeps `3xl` for its 3-col rows); split footer in all 10 (delete far left); one
  delete copy set (`Delete?` + `Confirm`/`No`; Person keeps the verb Remove);
  spinner in AddLink + single URL-error slot; form-level errors get
  `hint-in font-medium`; asterisk-truth pass (Status in ActionItem/Issue, Update
  body labeled, readOnly + RadioRow asterisks removed); prompt placeholders → 
  `- Select -` (sentinel values untouched); shared `HelpDot` + `lib/help-text.ts`
  GOLD_HELP; `aria-invalid` on invalid Selects (Resource Type, Person Role,
  EditProject Status); ConfirmDeleteButton armed state tokenized via new
  `--destructive-foreground` (see section 1 table); radio hover-scale removed.
- [x] **Stage 3 — Detail pages.** SHIPPED 2026-07-29, visually confirmed by Fares.
  Layout-mirroring skeletons on Milestone/ActionItem/StatusReport/Attachment (+
  RecordHistory); dashed empty-state recipe everywhere (incl. "No Data Found." →
  "No action items yet."); `Field`/`Row` drop empty rows on all pages;
  eyebrow-kicker + record-name H1 on all five detail pages (section 6 ruling 2);
  containers `max-w-5xl` + rail `260px` + aside `gap-4` (Attachment keeps its
  centered 3xl hero); Milestone text-glyph buttons → lucide Plus/ChevronRight;
  Lock/Pencil at `h-4 w-4`; StatusPill on Milestone rows; raw palette swept onto
  tokens: StatusPill + file-type chips + PersonAutocomplete pending chip → 
  `--status-*` pill trios (chips restyled from solid squares to tinted pills for
  dark-mode AA), overdue → `text-destructive`, gold ambers → `--gold`, teal
  avatar → `bg-primary`, brand strip → new `--brand`/`--brand-foreground`
  (#dc2626 / #ffffff, 4.83 PASS, same both themes); em-dash placeholders → `-`.
  **Known remaining exception:** `InitialsAvatar`'s 8-hue identity-hashing array
  still uses raw `*-100`/`*-700` palette pairs (deliberate variety; tokenizing
  needs 16 more tokens). Revisit only if asked. AppLayout's brand `text-white`
  lands in Stage 4.
- [x] **Stage 4 — Shell + Home.** SHIPPED 2026-07-29, visually confirmed by Fares.
  CommandPalette: entrance animation DELETED (keyboard surface), overlay → 
  `bg-overlay` token, footer kbd-hint strip added. AppLayout: sidebar
  `transition-[width] duration-200 ease-in-out` with always-mounted fading labels
  (icons center when collapsed), nav/collapse `transition-colors`, brand text → 
  `text-sidebar-accent-foreground`, scroll-top button always mounted with
  symmetric opacity+translate fade (aria-hidden + tabIndex=-1 while hidden).
  Home: cards `transition-[translate,box-shadow]`, checkbox hover-scale removed,
  error state gains a Reload button (full page reload; loader is inline to its
  effect). review-animations verdict: Approve; accepted exceptions on record:
  sidebar animates `width` (content must reflow), card hover animates
  `box-shadow` (paint-only, cheap). Known app-wide gap, still open: hover motion
  not gated behind `@media (hover: hover)`.
  NOTE 2026-07-29: Fares lifted the section 6 taste rulings ("go all out; judge by
  the audit and what's good for the site"). Hard rules unchanged (visual-only
  Stages 1-5, frozen fields, no deps, tokens, AA, reduced-motion, lint 0).
  Translucent header re-evaluated on merit and still skipped: the header sits
  OUTSIDE the scroll container (content never passes beneath it), so blur would
  have nothing to show; restructuring the scroll shell is not worth it.
- [x] **Stage 5 — Dashboard + Login + Wizard polish.** SHIPPED 2026-07-29,
  visually confirmed by Fares. Dashboard's nine chart cards + Home cards on the
  house card recipe (`rounded-lg` + `shadow-xs`); chart titles `<p>` → `<h2>`
  (semantic only); Login hierarchy fixed (brand `text-2xl` > card title
  `text-xl`) + `p-6`; wizard steps wrapped in a card container (approved
  judgment call under the lifted rulings) + stepper pills off `transition-all`
  to explicit properties at 200ms; StepConfirmation outer gap matches sibling
  steps. Dashboard draw-in durations (650-900ms) deliberately kept: one-time
  decorative reveals.
- [x] **Stage 6 — Accessibility (behavior; separate commit).** SHIPPED 2026-07-29,
  confirmed by Fares. ProjectDetailPage's `useEntranceFlag` gains the
  `prefersReducedMotion()` guard (mirrors DashboardPage's verbatim: starts
  entered, no movement); Milestone's clickable action-item rows gain
  `role="link"` + `tabIndex={0}` + Enter navigation + the standard
  `focus-visible:outline-2 focus-visible:outline-ring` ring (mirrors
  ProjectDetailPage's own rows). All six stages complete: the audit is DONE.
  Open leftovers if anyone resumes styling work later: hover motion not gated
  behind `@media (hover: hover)` app-wide; `InitialsAvatar` raw-palette hue
  hashing (documented exception, Stage 3 note); toast hover-pause (deferred,
  section 6 item 7).

**Recommended order rationale:** Stage 1 first because every later stage consumes
its tokens/recipes; Stages 2-5 then become class-swaps instead of local decisions.

---

## 3b. Post-audit work on `experiment/ui-ux-pro-max` (2026-08-03)

**Status: throwaway branch.** Everything below lives on `experiment/ui-ux-pro-max`
and is NOT destined for main. Recorded here so the six-stage audit above is not
read as the current state of those files. If any of it is ever promoted, re-run
the contrast table in section 1 first.

- **Project page, stages A-D.** Shared `lib/format.ts` (`formatDate` = the house
  `07-JUL-2026`, `relativeTime`, `initials`) and every absolute date on the page
  moved onto it; unique aria-labels per row (record name interpolated); row icon
  buttons 16px → 36px (**deliberate deviation: not the 44px spec floor, which
  would inflate every `py-3` row**); dead `enabledActions` branch removed;
  `Field` stacks below `sm`; create actions reachable below `lg` via an "Add"
  dialog in the sticky nav (Dialog primitive, not a dropdown — no dropdown-menu
  component exists and adding one means a Radix dep in a Base UI codebase);
  section-nav chip strip gained a scroll fade; `scroll-mt` now tracks the sticky
  bar's real height via `--nav-h`; 25-row caps per section with "Show all N";
  issue counts follow the filter (needed `ownEmptyState` on SectionCard, or
  filtering to zero hides the checkbox that emptied the list); filter state
  persisted (storage key `ptrack:collapsed:<id>` → `ptrack:prefs:<id>`, with a
  fallback read so saved collapse state survives); milestone pencil shows a
  pending spinner; outcome groups became real `<h3>` + nested `<ul>` instead of
  an `<li>` masquerading as a header; section hash deep-linking with
  `replaceState`; `motion-safe:scroll-smooth` on the app scroll container.
- **Rows are now real links.** Milestone, action-item, status-report and
  attachment rows use `<Link>` (aliased `RouterLink` — `Link` is taken by the
  lib/api record type), so middle-click and open-in-new-tab work. This closes
  the `role="link"` + Enter-only pattern that section 6 item 6 introduced.
- **Dashboard motion pass.** New `--ease-spring` token; entrances moved from
  mount to in-view (previously a third of the page's animation played below the
  fold to nobody); card stagger + 3D tilt entrance; comet tracers; odometer stat
  tiles; donut segment explode; radial heatmap bloom; pointer spotlight;
  scroll-linked line drawing behind `@supports (animation-timeline: view())`;
  bars/columns moved off `width`/`height` onto transforms. The two indefinite
  animations (drifting gradient, Overdue pulse) are gated on continuous
  visibility so they stop repainting off-screen.
- **Card alignment.** Chart rows dropped `items-start`; cards are flex columns
  with `flex-1` bodies, so a row shares one height without leaving gaps.

**Closed from the "open leftovers" list above:**

- ~~hover motion not gated behind `@media (hover: hover)` app-wide~~ — **stale
  finding, no change needed.** Tailwind v4 already emits every `hover:` and
  `group-hover:` utility inside `@media (hover: hover)`; verified in the built
  CSS. The only hand-written `:hover` in `index.css` is the chart-card spotlight,
  which is already inside a `(hover: hover) and (pointer: fine)` block.
- ~~`InitialsAvatar` raw-palette hue hashing~~ — **closed.** Six
  `--avatar-N-bg`/`--avatar-N-fg` token pairs in `index.css` (12 tokens, not the
  24 utilities the Stage 3 note feared) applied as inline custom properties. The
  component also now shares `initials()` from `lib/format.ts`.

**Still open:** toast hover-pause (section 6 item 7). `relativeTime` still has
private copies in HomePage, MilestoneDetailPage, AttachmentDetailPage and
RecordHistory that should fold onto `lib/format.ts`.

**Not a styling matter but landed alongside:** route-level code splitting
(entry chunk 813 kB → 622 kB), `CORS_ORIGINS` env-driven and refused-if-unset in
production, deprecated `baseUrl` dropped from the root tsconfig, and a frontend
test suite (vitest + Testing Library + jsdom, 15 tests over `lib/format.ts`,
wired into CI).

---

## 4. House recipes (decide once in Stage 1, reuse forever)

- **Card:** `rounded-lg border bg-card` + `shadow-xs`; hover-lift only on clickable
  cards (`hover:-translate-y-0.5 hover:shadow-md`, transform/shadow transition).
- **Panel/list (detail pages):** `rounded-md border` + `divide-y`; rows `px-4 py-3
  hover:bg-accent` when clickable.
- **Empty state:** dashed box `rounded-md border border-dashed px-4 py-5 text-sm
  text-muted-foreground`, optional outline `+` action button, sentence case copy
  `No <things> yet.`
- **Loading:** skeleton mirroring the layout (never bare `Loading…` text; spinner
  only inside buttons).
- **Elevation scale:** card `shadow-xs` < popover/select `shadow-md` < toast
  `shadow-lg` ≤ dialog (`shadow-lg` + ring).
- **Motion:** enter 150-250ms `--ease-out`, exits faster than enters, keyboard
  surfaces never animate, stagger 30-50ms, everything transform/opacity only.

---

## 5. Cross-session evidence pointers

Full per-file evidence (exact class strings + line numbers) was gathered 2026-07-29;
line numbers will drift as stages land — re-grep the class strings rather than
trusting stale numbers. Highest-value grep targets: `transition-all`, `text-white`,
`amber-`, `emerald-`, `teal-`, `red-600`, `slate-`, `text-[10px]`, `Loading…`,
`border-dashed`, `animate-in`.

---

## 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted)

| # | Ruling | Lands in |
|---|---|---|
| 1 | Placeholders: unify **prompts only** (see below). Sentinel labels untouched. | Stage 2 |
| 2 | Detail-page H1 = **the record's name** on all detail pages, matching ProjectDetail. Static nouns move to an eyebrow/kicker above the H1 or are dropped. | Stage 3 |
| 3 | AddUpdate body Textarea **gets a real `Label`** like every other required field. | Stage 2 |
| 4 | Translucent/blur header: **NOT doing it.** Now purely a taste call, and an opaque header on a navy sidebar is cleaner than a blurred one. Revisit only if asked. | none |
| 5 | Reduced-motion guard in `useEntranceFlag`: **do it.** | Stage 6 |
| 6 | Keyboard focus (`tabIndex`/`role`) on Milestone rows: **do it.** | Stage 6 |
| 7 | Toast hover-pause: **deferred.** Genuine nicety, real logic, no accessibility argument. | none |

### Item 1 detail: the two categories must not be collapsed

Nine distinct strings exist, in two semantically different groups. Unifying across the
groups would turn a chosen value into a "nothing picked yet" prompt: a meaning change,
not a restyle.

- **Prompts** (placeholder only, no matching `SelectItem`): `- Select -`,
  `- Select Role -`, `- Select Level -`, `- Select Type -`, `- Select Category -`.
  → **Unify all five to `- Select -`.** The `Label` already names the field.
- **Sentinel values** (appear in the `items` array AND as a `SelectItem`, bound to
  `NONE` / `NO_ROLE` / `NO_TYPE` / `NO_MILESTONE`): `- None -`, `- No Role -`,
  `- No Type -`, `- No Milestone -`. → **Leave exactly as they are.** These are
  data-bearing option labels, and `- No Milestone -` reads better than a generic
  `- None -` anyway.

### Items 5-6 scope note

Both cross the visual-only line, which is why they were fenced. They ship as their own
commit (Stage 6), never folded into a visual stage, so the behavior change is reviewable
on its own. Both are accessibility defects, not polish: the entrance animation currently
ignores `prefers-reduced-motion`, and Milestone's clickable rows cannot be reached by
keyboard at all.
