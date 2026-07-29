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
- Layout mirrors the demo by design: flag divergences (section 6), never make them
  unprompted.
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

### Proposed token changes (Stage 1), before → after, all computed

| Token | Before | After | Ratio before → after |
|---|---|---|---|
| `--destructive` (light) | `oklch(0.577 0.245 27.325)` | `oklch(0.55 0.245 27.325)` (≈#dd0000) | 4.45 → 4.81 on canvas; 4.77 → 5.15 on card |
| Stub opacity (class in AppLayout, not a token) | `text-sidebar-foreground/40` | `/60` | 2.39 → 3.87 |
| `--input` + `--border` (light) | `#e2e6ec` | `#c2ccd8` | 1.25 → 1.63 on card (full 3:1 needs ≈#8b96a5: too heavy for hairlines, not recommended) |
| NEW `--success` (+ border shade) | raw `emerald-700/600/300…` in toaster | `#047857` light / `#6ee7b7` dark | 5.12 light, 11.92 dark, PASS |
| NEW `--gold` (light) | raw `amber-600` | `#b45309` (amber-700) | 3.19 → 5.02 |
| Update avatar (class swap) | `bg-teal-400` + `text-white` | `bg-primary` + `text-primary-foreground` | 1.86 → 5.17 |

Dark-mode ambers/emeralds already pass (9.93 to 11.92), so only light values move.
Other measured references: red-600 overdue on card 4.83 PASS; white on red-600 brand
strip 4.83 PASS; StatusPill pairs (emerald 5.21, amber 4.84, red 5.91, blue 6.16) all
PASS but bypass tokens; `--chart-1..3` trio previously validated CVD-safe, untouched.

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

- [ ] **Stage 1 — Foundation (tokens + primitives).** index.css: `--ease-out`/
  `--ease-in-out`, `--success`, `--gold`, `--overlay`, `--status-*`; destructive +
  input/border nudges per section 1 table; stub opacity. ui/: button transition +
  `active:scale-[0.98]`, toast exit + tokens + `bg-popover`, dialog scrim +
  elevation, select chevron rotation. Acceptance test = section 1 ratios re-verified.
- [ ] **Stage 2 — Dialog consistency.** One width recipe; split footer everywhere;
  one delete copy set (`Delete` → `Delete?` + `Confirm`/`No`); spinner in AddLink;
  one error style; asterisk-truth pass; shared HelpDot; `aria-invalid` on Selects;
  ConfirmDeleteButton state continuity.
- [ ] **Stage 3 — Detail pages.** Skeletons on the four text-loading pages; one
  empty-state recipe; unified `Field`; container/rail widths; icon normalization;
  raw palette → Stage 1 tokens (incl. teal avatar, gold ambers, file-type chips,
  StatusPill, brand strip).
- [ ] **Stage 4 — Shell + Home.** Palette animation removal; sidebar width
  transition; scroll-top exit; nav hover transition; Home card transition + error
  recovery button.
- [ ] **Stage 5 — Dashboard + Login + Wizard polish.** Card recipe adoption; chart
  heading semantics; Login hierarchy + padding; StepConfirmation alignment.

**Recommended order rationale:** Stage 1 first because every later stage consumes
its tokens/recipes; Stages 2-5 then become class-swaps instead of local decisions.

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

## 6. Flagged: needs Fares's call before touching (do NOT fold into stages)

1. Placeholder-string unification (`- Select -` vs `- No X -` vs `- None -`):
   confirm against demo screenshots first.
2. Detail-page H1: static noun vs record name: demo question.
3. AddUpdate body field label: demo may deliberately show placeholder-only.
4. Translucent/backdrop-blur header bar: diverges from demo.
5. Reduced-motion guard in ProjectDetailPage's `useEntranceFlag`: touches a hook.
6. Keyboard focus (`tabIndex`/`role`) on Milestone clickable rows: markup behavior.
7. Toast hover-pause of the dismiss timer: logic.
