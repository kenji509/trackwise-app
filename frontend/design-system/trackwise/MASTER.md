# TrackWise Design System (Master): "Sunny Classroom"

> **Status: APPROVED and implemented (2026-11-24), updated 2026-11-26 after the Impeccable review (decision 15).** Tokens live in `src/index.css`; every page follows the rules below.
> **LOGIC:** When building a page, first check `design-system/trackwise/pages/<page>.md`. If it exists, its rules override this file. Otherwise follow this file.
> Visual preview of everything below: `design-system/trackwise/preview.html`.

## 0. Decisions approved by the user

**2026-11-22 (still in force)**
1. **Status comes from the question count:** Draft means no questions, Published means at least one. The backend has no status field and **must not be changed** for this.
2. **Sample quizzes:** a "Show sample quizzes" switch, **off by default** and not remembered between visits. While it's on, a yellow notice is shown and create/edit/delete stay in the browser (no server calls). Data: `src/sampleData.js`.
3. **Light mode only.** No dark tokens (`color-scheme: light`).
4. **Data sources:** `/quiz/api`, `/user/api`, `/question/api` (question counts, topics, status) and `/topic/api` (topic filter list), all proxied in `vite.config.js`. Derived values are computed in `src/quizData.js` during render.

**2026-11-24 (this look)**
5. **Royal blue `#2563EB` is the primary color** (buttons, active menu, links, focus rings). **Sunny yellow `#FACC15` is the accent** (logo, the Draft card edge, the banner's main button, icon bubbles, the page-title highlighter).
6. **Yellow is never text on white** and never a meaningful mark on white (1.53:1). It is always a fill with dark ink `#1E293B` on top (9.55:1).
7. **Headings stay in Nunito** (the user chose it over Fredoka). Body stays DM Sans.
8. ~~Four card and topic colors (Coral, Sunny, Mint, Grape)~~ **Replaced by decision 15:** topics use Grape, Cyan, Fuchsia and Slate (`ACCENTS` in `src/quizData.js`); quiz cards have no color of their own.
9. **The banner's "New quiz" button is yellow** with dark text, because a blue button can't stand out on the blue banner. Every other primary button is blue.
10. **Structure was not changed:** same component tree, files and names. The redesign is CSS, plus the decorative SVG drawings in `Quizzes.jsx`, the stat tile color names in `main.jsx`, `ACCENTS`, `favicon.svg` and `theme-color`.
11. **Demo nav items:** Dashboard, Questions and Topics are listed under Teaching as **demo-only placeholders** (`demo: true` in `navSections`, `main.jsx`). Since 2026-11-26 each carries a small **"Soon" tag** (`.side-btn__soon`, muted text on surface-2, 12px; hidden visually in the rail but kept in the accessible name, "Dashboard Soon"; tooltip "Dashboard (soon)"). They are marked `aria-disabled="true"`, have no hover change, and a click or Enter does nothing (no URL change, no scroll, the mobile drawer stays open). Quizzes stays the only active, working item. No routing.
12. **Icon-only rail:** the collapsed sidebar and the tablet rail show nav icons only; the label stays in the link as its accessible name and appears as a `title` tooltip.

**2026-11-26 (page backdrop)**
13. **`PageBackdrop` is the one exception to "no drawings behind text".** A fixed, `aria-hidden`, `pointer-events: none` layer at `z-index: -1` on the Quizzes, Available Quizzes, login/register and Results screens: soft blobs in `--color-primary-soft`, `--sunny-soft` and `--mint-soft`, white graph-paper dots, and ten outline doodles in the bright accent shades at 6–10% opacity, drawn *under* the blobs so the two never stack. Quiz-taking uses `<PageBackdrop calm />` (blobs only, no motion). Doodles drop to six under 1024px and are hidden under 768px; the blob drift is off for reduced motion. **Limit:** no backdrop pixel may be darker than luminance 0.864 (keeps blue text on the page background at 4.5:1 or more; measured darkest 0.867). Re-check this when changing any backdrop color or opacity. `.auth` and `.quiz-layout` have no background of their own so the layer shows through.

**2026-11-26 (fewer template patterns)**
14. **Removed the "generated-looking" patterns.**
   - **Topic labels:** an 8px square swatch (2px corners) in the topic color beside the name in normal text color, with no pill background (`TopicChips.css`; the Results "Score by topic" names use the same square). Quiz cards show topic names only (decision 15).
   - **Teacher stats:** one light strip of four cells split by hairlines, with no icon bubbles and no shadows (`QuizStats`). *Since decision 15, each cell has one small outlined symbol at its top right.*
   - **My Progress:** leads with `ProgressSummary`: Average score in a large ring (same style as the Results ring), then Quizzes taken, Strongest topic and Needs practice as a short list. Strongest topic only names a topic that is Strong, otherwise a muted "None yet".
   - **Levels:** the Strong / Needs practice / Weak badge appears once per topic, in Accuracy per topic. Its bars carry tick marks at the level thresholds (from `LEVELS` in `progressData.js`), labeled "50%" and "80%" once above the first bar, instead of a legend.
   - **Headers:** the banner with its drawing is only on each role's main page (teacher Quizzes, student Available Quizzes). Other pages use the plain `page-head` title (`<MainContent plain>`).
   - **Wording:** no " · " separators in UI text (tab titles use "–"), no captions that explain the UI, and back buttons name the page they return to.

**2026-11-26 (Impeccable review, approved items)**
15. **Status colors mean status only; quiz cards are plain.**
   - **Color meaning:** mint, sunny and coral mean status (Strong / Needs practice / Weak, Published / Draft). Topics use Grape, Cyan, Fuchsia and Slate. Dates and time limits are muted text, never colored.
   - **Teacher quiz card:** plain white card with a **4px left edge**, mint (`--mint-bright`) for Published and sunny (`--color-sunny`) for Draft. The status is a word in the top-left (mint ink / sunny ink). Top right: a **"Manage" text button** that opens the same Edit / Manage questions / Delete menu. No band, no dot grid, no date pill, no icons, no topic squares. Footer: "5 questions" and "10 min" as text with a 24px gap. The list row follows the same rules (left edge, status word, Manage, muted date). *The one-sided edge is normally on Impeccable's "refuse" list; it is used here because the brief asked for it, and only for quiz status.*
   - **Student quiz card:** the same plain card without an edge (students only see published quizzes). Topic names, then "5 questions" and "10 min", then **"Last score 60%"** (the newest attempt) or **"Not taken yet"**, then **Start quiz**, the only action. The line is left out while past attempts load or if they fail.
   - **One name, "Needs practice":** the summary fact, the practice card title and the 50–79% level all use it. The card lists the two weakest topics that are not Strong, and is hidden when none are left.
   - **Level badge icons:** tick (Strong), half-filled circle (Needs practice; the old dash read as "minus 60%"), exclamation mark (Weak).
   - **Layout:** content max-width **1100px**. My Progress shows "Take 1 more quiz to see your trend" as one muted line under the summary instead of an empty chart card. Recent quizzes shows 3 rows. Attempt rows put the score and badge right after the title (title column up to 16rem), with View at the far end. The summary puts each value next to its label.
   - **Less repetition:** no "Pick a quiz to start" heading and no "Newest first" label on Quiz History (the list is still newest first).
   - **Highlighter:** page titles only (`.page-head__title`, the login/register title, and "Your results" on Results, which is that screen's visible title). Removed from the sidebar label, "All quizzes", "Question 1 of 5" and the dialog title.
   - **Results:** Score by topic bars use the level color and the same 50/80 marks as My Progress (`LevelBar`).
   - **Demo greeting:** the demo teacher account (id 11) is named "Ana Reyes" in the database, so the banner says "Good morning, Ana". No code change.
   - **Banner drawing, animated (teacher Quizzes and student Available Quizzes, one shared CSS):** both banners use the same quiz-sheet drawing (sheet, sun, green check) with the same short entrance (`<MainContent art="drawing">`, the default; `.hero--drawing` in `MainContent.css`). The teacher banner always shows it. The student banner shows it only when at least one quiz is ready; while loading, offline or with 0 quizzes it has no art (`art="none"`). It shows at 1024px and up and is hidden on smaller screens. All of it is `aria-hidden`. **Motion, transform and opacity only:**
     1. The three answer lines (`.hero__line`, separate spans so each can move) draw in from the left, one after another: `scaleX(0)` + `opacity: 0` to rest, 300ms each, starting at 0, 150 and 300ms (done at 0.6s), `--ease-out`.
     2. The green check pops in after the lines: starts at 600ms, 450ms, `scale(0.4)` → `1.12` → `1` with opacity 0 → 1 (a small bounce from keyframes, not an overshoot curve).
     3. The sun bobs 4px up and down, 4s per cycle, `ease-in-out`, looping.

     The resting styles are the final state; `prefers-reduced-motion` sets `animation: none`, so the drawing shows complete and still. The entrance plays when the banner appears (page load, or coming back from the question manager). No other page gets a decoration. The yellow "ready" badge tried earlier the same day was removed.
   - **Stat strip symbols (teacher Quizzes only; replaces decision 14's "no icons" for this strip):** each of the four cells has one symbol at its top right, on the label's line: a **20px rounded square** (6px corners) with a **1.5px colored outline** and a **13px glyph** in the same color (2.4 stroke), no fill, `aria-hidden` (the label names the cell). Quizzes: clipboard, blue `--color-primary` (5.17:1). Questions: question mark, darkened sunny `--sunny` `#A16207` (4.92:1). New this week: sparkle, darkened mint `--mint` `#16A34A` (3.30:1). Most-used topic: bar chart, grape `--grape` (5.70:1); the topic's own square swatch stays beside the topic name. The label's lines are 20px tall, so the symbol lines up with the first line; on phones "Most-used topic" wraps under its symbol. Set per cell with `symbol` + `tone` in `statTiles` (`main.jsx`); glyphs in `QuizStats.jsx`. **Exception to the color rule above:** sunny and mint appear here as symbol colors, not as status, and only in this strip. No symbols anywhere else.
   - **"New quiz" hover lift (teacher banner, `.hero__action`):** on hover it rises 2px (`translateY(-2px)`) and gains a soft shadow under its yellow lip (`0 8px 16px rgb(15 23 42 / 0.24)`), along with the existing lighter yellow. The lift is skipped while the button is pressed, so the press-down stays as it was (down 2px, lip 3px → 1px). Disabled (loading, server down): no lift. Reduced motion: no lift, only the deeper shadow.

**Building blocks** (in `src/components/`): `TopicChips` (`plain` for the quiz cards), `StatusBadge` (status word), `QuizMenu` ("Manage" menu button), `SelectField` (label inside the pill), `ViewToggle`, `SampleSwitch`, `SampleNotice`, `QuizToolbar`, `QuizStats` (summary strip), `QuizCard` (grid + list layouts), `StudentQuizCard`, `ProgressSummary` (ring + facts), `LevelBadge` (level word with icon), `LevelBar` + `LevelScale` (level-colored bar with threshold marks and their labels), `AttemptList`. Reuse them on new pages.

**Product:** TrackWise: quizzes and per-topic progress tracking for teachers and students. Web app, React 19 + Vite, **plain CSS** (no Tailwind, no UI libraries).
**Direction:** educational and happy, like a friendly learning app for students, while still professional for teachers. Playful but tidy.
**Dials:** Variance 5 · Motion 4 · Density 5
**Replaces:** "Bright Classroom" (indigo `#4F46E5` + violet gradient + six accents), 2026-11-22.

## 1. Sources and how they were used

| Source | Used | Changed or rejected, and why |
|---|---|---|
| User brief (2026-11-24) | Royal blue primary, sunny yellow accent, 3–4 soft card colors, rounded fonts, soft shadows, small icons, empty-state drawings, no emoji, light only | — |
| UI UX Pro Max `--domain color` "education blue yellow" | **Kids Learning (ABC & Math)** palette: primary `#2563EB`, learning blue + play yellow, light blue background. Confirms the brief's pairing | Its amber `#F59E0B` secondary and pink accent replaced by the brief's `#FACC15` and the four soft card colors |
| UI UX Pro Max `--design-system` "education learning app friendly blue yellow" | Claymorphism traits kept in a **softened** form: rounded 12–28px corners, a pressable 3px "lip" on filled buttons, stagger-list motion, "avoid dark mode" | Thick 3–4px outlines and double/inner shadows rejected (toy-like). **Baloo 2 / Comic Neue rejected** (children's fonts). Indigo + orange palette replaced by the brief's colors. "Feature-Rich Showcase" pattern rejected (marketing pages) |
| UI UX Pro Max `--domain typography` | **Nunito + DM Sans** (Claymorphism/education pairing) kept from the previous system | Fredoka was proposed; the user chose to keep Nunito. Varela Round / Nunito Sans rejected (children's and pet apps) |
| UI UX Pro Max `--domain ux` "empty state" | `Empty States`: helpful message plus action, never a blank area | — |
| Previous system (2026-11-22) | Bento stats, ⋯ menu, segmented view toggle, filter chips, inline delete confirmation, 44px targets, reduced motion | Colors, radius, shadows and decorative details replaced |
| Impeccable audit + critique (2026-11-26) | Audit 14/20, critique 26/40. Approved fixes: decision 15 | Not done (user's scope choice): spring easing beyond its two uses (detector `bounce-easing`), hiding the toolbar on the teacher empty state, 44px Grid/List buttons on phones, quieter "Save quiz" when all is saved, Score by topic card height, `text-wrap: pretty` on question text |

## 2. Color tokens (light mode; every pair checked with the WCAG luminance formula)

### Brand
| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--color-primary` | `#2563EB` | buttons, links, active states, focus ring | white on it 5.17:1; as text on white 5.17:1, on bg 4.82:1 |
| `--color-primary-hover` | `#1D4ED8` | hover, banner gradient middle | white 6.70:1 |
| `--color-primary-active` | `#1E40AF` | pressed state, button lip, banner gradient end | white 8.72:1 |
| `--color-primary-soft` | `#EAF1FF` | active nav, filter chips, form header | — |
| `--color-primary-ink` | `#1E40AF` | text on primary-soft | 7.69:1 |
| `--gradient-hero` | `#2563EB → #1D4ED8 → #1E40AF` | welcome banner | white 5.17:1 at the lightest end; `#EFF6FF` greeting 4.75:1 |
| `--color-sunny` | `#FACC15` | logo tile, Draft card edge, banner button, icon bubbles | `--color-on-sunny` `#1E293B` on it 9.55:1; edge on blue 3.38:1 |
| `--color-sunny-hover` | `#FDE047` | yellow hover, page-title highlighter | ink 11.10:1 |
| `--color-sunny-lip` | `#CA8A04` | lip under yellow buttons/tiles | decorative |
| — | `#FACC15` on white | **never used** | 1.53:1 |

### Neutrals (cool slate, tinted toward the blue)
| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--color-bg` | `#F4F7FE` | page background | text 13.64:1 |
| `--color-surface` | `#FFFFFF` | cards, panels, inputs | text 14.63:1 |
| `--color-surface-2` | `#EEF2FA` | quiet fills, hover, skeletons | muted 6.75:1 |
| `--color-surface-hover` | `#E4EAF6` | hover on quiet fills | — |
| `--color-text` | `#1E293B` | body text, all text on yellow | — |
| `--color-text-muted` | `#475569` | secondary text, hints | 7.58:1 white, 7.07:1 bg, 6.68:1 primary-soft |
| `--color-border` | `#E2E8F0` | decorative dividers, card edges | decorative |
| `--color-border-strong` | `#CBD5E1` | dashed empty-state edge, drawing lines | decorative |
| `--color-border-input` | `#7C8BA1` | inputs, selects, toggles | 3.46:1 white, 3.23:1 bg (WCAG 1.4.11) |

### Status and topic colors
Each accent has **soft** (track/badge background), **ink** (text on soft or white), **solid** (`--accent`: swatches and bar fills, 3:1+ on white except Mint) and **bright** (`--accent-bright`: decoration and the card edge only). Set them on an element with `.accent-<name>` (`index.css`).

**Status colors** (mean Strong / Needs practice / Weak and Published / Draft; never used for topics, dates or times):

| Name | soft | ink | solid | bright | ink on soft | ink on white | solid on white |
|---|---|---|---|---|---|---|---|
| Coral (Weak) | `#FFE4E6` | `#9F1239` | `#E11D48` | `#FB7185` | 6.68:1 | 8.02:1 | 4.70:1 |
| Sunny (Needs practice, Draft) | `#FEF9C3` | `#854D0E` | `#A16207` | `#FACC15` | 6.38:1 | 6.85:1 | 4.92:1 |
| Mint (Strong, Published) | `#DCFCE7` | `#166534` | `#16A34A` | `#4ADE80` | 6.49:1 | 7.13:1 | 3.30:1 |

**Topic colors** (the 8px square beside a topic name):

| Name | soft | ink | solid | bright | solid on white |
|---|---|---|---|---|---|
| Grape | `#EDE9FE` | `#5B21B6` | `#7C3AED` | `#A78BFA` | 5.70:1 |
| Cyan | `#CFFAFE` | `#155E75` | `#0891B2` | `#22D3EE` | 3.68:1 |
| Fuchsia | `#FAE8FF` | `#86198F` | `#C026D3` | `#E879F9` | 4.71:1 |
| Slate | `#F1F5F9` | `#334155` | `#64748B` | `#94A3B8` | 4.76:1 |

- **Topic color = `ACCENTS[topicId % 4]`** with `ACCENTS = ['grape', 'cyan', 'fuchsia', 'slate']`, so a topic keeps the same color on every page.
- **Quiz cards have no color of their own;** only the status edge (decision 15).
- **Stats strip:** values in ink; the only color per cell is its small outlined symbol (blue, darkened sunny, darkened mint, grape; decision 15). The Most-used topic shows that topic's square swatch.
- **Bright shades are decoration only:** the card status edge (the word carries the status), the banner drawing, the backdrop doodles and the empty-state drawings. Never for text.
- `.accent-primary` (blue) remains for the backdrop doodles only.

### Status and feedback
| Meaning | Look | Contrast |
|---|---|---|
| Published | the word "Published" in Mint ink + a 4px `#4ADE80` left card edge | 7.13:1 on white |
| Draft | the word "Draft" in Sunny ink + a 4px `#FACC15` left card edge | 6.85:1 on white |
| Levels | `LevelBadge`: soft pill, ink text, icon (tick / half-filled circle / exclamation mark) + percent or level word | 6.38:1 or more |
| Danger | `#DC2626` solid (white 4.83:1); text `#B91C1C` (6.47:1 white, 5.91:1 on `#FEF2F2`); edges `#FECACA` | — |
| Sample notice | `#854D0E` on `#FEF9C3`, `#FACC15` edge | 6.38:1 |
| Success toast | Mint bubble | — |

Color never carries meaning on its own: the card status is a word (the edge only repeats it), level badges have text plus an icon, and topic labels show the topic name.

### Focus rings (3:1)
2px `--color-primary`, offset 2px: 5.17:1 on white, 4.82:1 on bg. On the blue banner the ring is **white** (5.17:1). Invalid fields use a red ring.

## 3. Typography
- **Headings:** Nunito 800 (h1–h3, stat numbers, brand name). Rounded terminals give a friendly feel.
- **Body/UI:** DM Sans 400 / 500 / 700. 16px base, line-height 1.5 (inputs stay 16px to prevent iOS zoom).
- Scale: 12 · 14 · 16 · 17 (list title) · 19 (card title) · 22 · 24 (section) · 26 (form title) · 28 · 32 (banner, phone) · 40 (banner) px. Nothing under 12px.
- Numbers (stats, counts, time) use `tabular-nums`. Headings use `text-wrap: balance`.
- **Highlighter:** **page titles only**: a yellow swipe behind the lower part of the text (`linear-gradient`, `--color-sunny-hover`, ink 11.10:1) on `.page-head__title`, the login/register title and "Your results" (with its loading/error twin) on Results. Never on section headings, card headings, the sidebar label or dialog titles.
- Google Fonts: `Nunito:wght@700;800` + `DM Sans:opsz,wght@9..40,400;9..40,500;9..40,700`

## 4. Shape, depth and spacing (playful but tidy)
- Radius: `--radius-sm 12px` (buttons, inputs) · `--radius-md 20px` (cards, tiles, menus) · `--radius-lg 28px` (banner, dialog, empty states) · `--radius-full` (chips, badges, search, toggles, avatars)
- Borders: 1px `--color-border` on cards. Controls use `--color-border-input`.
- Shadows (soft, blue-tinted, never inner):
  - `--shadow-sm: 0 1px 2px rgb(15 23 42 / .05), 0 2px 8px rgb(37 99 235 / .06)` resting cards
  - `--shadow-md: 0 14px 30px rgb(37 99 235 / .14)` card hover
  - `--shadow-lg: 0 20px 48px rgb(15 23 42 / .18)` menus, dialog, toast
- **Pressable lip:** filled buttons (`.btn-primary`, `.btn-light`) sit on a 3px solid shadow in a darker shade (`--lip`). On press they move down 2px and the lip shrinks to 1px (`--lip-pressed`), so layout never moves. Only the banner's "New quiz" button also lifts 2px on hover (decision 15). Secondary buttons get a 2px `--color-border` lip. The selected view-toggle button gets a 2px blue lip.
- **Graph-paper dots:** the banner (right side only, masked away from text), the sidebar logo panel and the form header use a faint `radial-gradient` dot grid (14–20px). Quiz cards have none.
- Spacing: 4/8 grid: 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48
- Decorative drawings are `aria-hidden` and **must never sit behind text** (only exception: the faint `PageBackdrop` layer, decision 13). The banner drawing is hidden under 1024px; check for overlap at every breakpoint.

## 5. Motion (subtle; unchanged)
| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 150ms | color, border and lip changes |
| `--duration-base` | 220ms | card hover lift (`translateY(-3px)` + `--shadow-md`) |
| `--duration-enter` | 320ms | card entrance, menu open, dialog |
| `--duration-exit` | 180ms | menu close, exits (about 60% of enter) |
| `--ease-out` | `cubic-bezier(.2,0,0,1)` | default |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | button press, menu pop only. *Known drift, not fixed yet:* also used by Toast, ChoiceFields, ChoiceList and SampleSwitch (Impeccable `bounce-easing`, advisory) |
- Grid cards fade/slide in with a **40ms stagger** (max 8 steps). There's no stagger in list view.
- `prefers-reduced-motion`: all of the above off; the final state shows immediately.

## 6. Layout
- Breakpoints **375 / 768 / 1024 / 1440**. Content max-width **1100px** (`.main` and `.quiz-layout__body`).
- **Sidebar:** white, 248px on desktop; 88px icon-only rail when collapsed and on tablet; drawer on mobile. Nav: Dashboard, Quizzes, Questions, Topics, where only Quizzes is built; the rest carry a "Soon" tag (decision 11).
- Quiz grid: `repeat(auto-fill, minmax(min(100%, 300px), 1fr))`, gap 16–24px. The list view is one row per quiz.
- Every interactive target is at least 44×44px (smaller visible pills extend their hit area with `::after`). There's no horizontal scroll at 375px.

## 7. Component specs (Quizzes page)
- **Logo:** 34px yellow rounded tile with an ink trend line (`.logo rect` / `.logo path`); `public/favicon.svg` matches. In the sidebar it is 40px on a 3px `--color-sunny-lip` edge (`drop-shadow`).
- **Sidebar** (`SideBar.css`, `SideBtn.css`): logo area on a pale-blue panel with a dot grid (brand name 12.90:1, 10.71:1 on a dot); Nunito 20px brand name; collapse button turns into a white disc on hover. Section label ("TEACHING") in small muted caps (7.58:1), no highlighter, expanded sidebar only. Nav items: inactive = muted text (7.58:1), transparent icon; hover = surface-2; **active** = primary-soft pill with a 3px `#C5D6FB` bottom edge, ink text (7.69:1), solid blue icon bubble with a 2px darker edge. Footer: rounded card (bg, border, `--shadow-sm`) with a 40px yellow avatar circle; in the rail only the avatar shows. Every nav item and the toggle are 44px or more.
- **Banner / welcome:** 28px-radius banner with the royal-blue gradient, dot grid on the right, greeting by time of day with the person's first name, a summary line only when it adds something the page doesn't already show (loading, server down, quizzes ready to take) and the **yellow "New quiz" button** (`.btn-light`, white focus ring). At 1024px and up, the `hero__blob` spans (and the three `.hero__line` spans on the sheet) become a CSS drawing: a tilted quiz sheet with ticked boxes, a sun and a green "correct" check, with a short entrance on both banners (`art="drawing"`; the student banner only when a quiz is ready; decision 15). The "New quiz" button lifts 2px on hover. Disabled (loading or server down), the button turns ghosted white instead of faded yellow.
- **Stats strip (4 cells):** one white 20px-radius strip with a 1px border, cells split by hairlines (2 × 2 under 1100px), label in muted text with a 20px outlined symbol at the cell's top right (decision 15), value in Nunito 800 at 22px, optional helper line. No shadow.
- **Section heading:** "All quizzes" in Nunito 24px, no highlighter.
- **Toolbar:** search pill, Teacher, Topic and Sort pills, Grid/List segmented toggle (selected = blue with lip). Above 1100px the select values are capped at 9.5rem so everything fits one row in the 1100px content (a long chosen name ends in "…"; the open list shows it in full). Active filters are blue-soft removable chips + "Clear all". The result count is a polite live region.
- **Quiz card (grid):** plain white 20px card, 1px border, **4px left edge** in the status color (Published `--mint-bright`, Draft `--color-sunny`). Top row: status word (14px bold, mint or sunny ink) and the **"Manage" text button** (primary blue, 44px tall, soft blue pill while open). Then the Nunito 19px title, "by Teacher", 2-line description, topic names as plain muted text ("Linear Equations, Factoring"; max 4 + "+n"), and the footer "5 questions" and "10 min" in muted text with a 24px gap. No band, no dots, no date, no icons, no topic squares. Hover lifts 3px.
- **Quiz row (list):** same 4px status edge; title (17px) + teacher, topic names (max 2 + "+n"), questions, time, date (muted), status word, Manage. Tablet: title / status / Manage, then topics, then details. Phone: title + Manage, status, topics, details + date.
- **Manage menu (`QuizMenu`):** a text button "Manage" whose accessible name is "Manage <quiz title>"; `aria-haspopup="menu"`, `aria-expanded`; arrow keys move between items; Esc closes and returns focus; clicking outside closes it. Items: Edit, Manage questions, Delete (red, separated, still needs the inline confirmation).
- **Student quiz card (`StudentQuizCard`):** plain white 20px card, no edge. Title (h2, Nunito 19px), "by Teacher", 2-line description, topic names, "5 questions" and "10 min", then "Last score **60%**" or "Not taken yet" (muted label, ink value), then the full-width blue **Start quiz** button.
- **Add/Edit form (dialog):** 28px radius; pale-blue header with a dot grid, a 48px **yellow clipboard tile** (CSS `::before`, decorative) and the title (no highlighter); inputs 12px radius, 48px tall; focus = 2px blue ring + soft blue glow; invalid = red border, faint red fill, red ring and glow, error text with icon under the field. Bottom sheet on phones, main button on top.
- **Topic label (`.topic-chip`):** static label (not a button). An 8px square swatch with 2px corners in the topic's solid shade (Grape, Cyan, Fuchsia or Slate), then the name in normal text color. No pill, no background. Labels in a row are 12px apart. **`plain` variant** (quiz cards only): muted 14px names separated by commas, no squares.
- **Plain page header (`.page-head`):** for every page that is not a role's main page: the title in Nunito 32px (28px on phones) with the yellow highlighter, no banner, no greeting, no summary line.
- **My Progress summary (`ProgressSummary`):** one card. Average score in a 160px ring (136px on phones), primary blue on a surface-2 track, with the percentage inside. Next to it (below it on phones) a short list: Quizzes taken, Strongest topic, Needs practice. On desktop each value sits right after its label (11rem label column); on phones the value is on the right. "None yet" and "Nothing right now" are muted 16px DM Sans, not a big value.
- **Trend note:** with fewer than 2 graded quizzes, one muted 14px line under the summary ("Take 1 more quiz to see your trend") instead of the Score trend card.
- **Level bars (`LevelBar`, used by Accuracy per topic and Results Score by topic):** 12px bar in the level's solid shade on its soft track, with 2px muted tick marks at 50% and 80% (white 1px outline so they read on both). `LevelScale` labels the marks "50%" and "80%" (12px muted) once, above the first bar. In Accuracy per topic the level badge sits once beside each topic, and screen readers get one sentence naming the marks.
- **Attempt rows (`AttemptList`, Quiz History and Recent quizzes):** title + date, then the score ("3 / 5") and its level badge right after the title (title column up to 16rem, so scores line up), then View at the far end. Phones: title row, then score, badge and View. Recent quizzes shows 3 rows; Quiz History shows all, newest first, with no order label.
- **Needs practice card (`ReviewCard`):** the two weakest topics that are not Strong (topic swatch, percent, "x of y answers correct in Quiz"), then "Practice in Available Quizzes". Hidden when every topic is Strong.
- **Empty states** (inline SVG in `Quizzes.jsx`, `aria-hidden`, 220×140):
  - *No quizzes yet:* quiz sheet with two ticked answers, a yellow pencil and a sparkle. "Let's make your first quiz" + Create a quiz.
  - *No matches:* magnifier with a question mark over two quiz cards. "No quizzes match" + Clear filters.
  - *Couldn't load:* sad cloud and an unplugged cable with a yellow spark. Server message + Try again / Show sample quizzes.
- **Sample data:** 6 realistic quizzes with questions and topics. Off by default; while on, the yellow notice is shown.

## 8. Accessibility rules (from `quick-reference.md` / `--domain ux`)
Contrast 4.5:1 for text, 3:1 for control edges and meaningful marks · visible 2px focus ring (blue; white on the banner) · 44px targets · `hover-vs-tap`: no hover-only actions · `color-not-only` · `chip-collection-reflow` · `submit-not-pre-disabled` · `unsaved-changes-guard` · `success-feedback` (toast, polite) · `persistent-errors` (inline, never toasts) · `dialog-focus` · `focus-not-obscured` · `reduced-motion` · `heading-hierarchy` · skip link · decorative drawings `aria-hidden`.

## 9. Anti-patterns (do not use)
Yellow text or yellow meaningful marks on white · bright accent shades as the only carrier of meaning · drawings or dot grids behind text (except the `PageBackdrop` layer within its luminance limit, decision 13) · toy-like thick outlines, double or inner shadows · children's fonts (Baloo, Comic Neue) · actions only visible on hover · color-only status · clipped chip rows · placeholder nav links without the "Soon" tag, `aria-disabled` and a cancelled click (decision 11) · emoji used as icons · more than one primary action per screen · dark mode · " · " separators in UI text · dot + label topic pills · rows of identical icon-in-circle tiles · mint, sunny or coral for topics, dates, times or other plain facts (they mean status) · icons, bands, pills or ⋯ circles on quiz cards · a one-sided colored edge anywhere except the quiz card status edge · the highlighter on anything but a page title · the Strong / Weak words outside the level badges ("Needs practice" is also the name of the practice list) · several names for one idea · captions that explain the UI · the banner drawing on secondary pages (see decision 14).
