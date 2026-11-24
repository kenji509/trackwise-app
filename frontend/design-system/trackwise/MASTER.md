# TrackWise Design System (Master): "Sunny Classroom"

> **Status: APPROVED and implemented (2026-11-24).** Tokens live in `src/index.css`; the Quizzes page follows every rule below.
> **LOGIC:** When building a page, first check `design-system/trackwise/pages/<page>.md`. If it exists, its rules override this file. Otherwise follow this file.
> Visual preview of everything below: `design-system/trackwise/preview.html`.

## 0. Decisions approved by the user

**2026-11-22 (still in force)**
1. **Status comes from the question count:** Draft means no questions, Published means at least one. The backend has no status field and **must not be changed** for this.
2. **Sample quizzes:** a "Show sample quizzes" switch, **off by default** and not remembered between visits. While it's on, a yellow notice is shown and create/edit/delete stay in the browser (no server calls). Data: `src/sampleData.js`.
3. **Light mode only.** No dark tokens (`color-scheme: light`).
4. **Data sources:** `/quiz/api`, `/user/api`, `/question/api` (question counts, topics, status) and `/topic/api` (topic filter list), all proxied in `vite.config.js`. Derived values are computed in `src/quizData.js` during render.

**2026-11-24 (this look)**
5. **Royal blue `#2563EB` is the primary color** (buttons, active menu, links, focus rings). **Sunny yellow `#FACC15` is the accent** (logo, Draft badge, the banner's main button, icon bubbles, highlighter).
6. **Yellow is never text on white** and never a meaningful mark on white (1.53:1). It is always a fill with dark ink `#1E293B` on top (9.55:1).
7. **Headings stay in Nunito** (the user chose it over Fredoka). Body stays DM Sans.
8. **Four card and topic colors** (Coral, Sunny, Mint, Grape) instead of six; blue is used for quizzes with no topics yet. `ACCENTS` in `src/quizData.js`.
9. **The banner's "New quiz" button is yellow** with dark text, because a blue button can't stand out on the blue banner. Every other primary button is blue.
10. **Structure was not changed:** same component tree, files and names. The redesign is CSS, plus the decorative SVG drawings in `Quizzes.jsx`, the stat tile color names in `main.jsx`, `ACCENTS`, `favicon.svg` and `theme-color`.
11. **Demo nav items:** Dashboard, Questions and Topics are listed under Teaching as **demo-only placeholders** (`demo: true` in `navSections`, `main.jsx`). They look like inactive items, are marked `aria-disabled="true"`, and a click or Enter does nothing (no URL change, no scroll, the mobile drawer stays open). Quizzes stays the only active, working item. No routing.
12. **Icon-only rail:** the collapsed sidebar and the tablet rail show nav icons only; the label stays in the link as its accessible name and appears as a `title` tooltip.

**Building blocks** (in `src/components/`): `TopicChips`, `StatusBadge`, `QuizMenu` (⋯ menu button), `SelectField` (label inside the pill), `ViewToggle`, `SampleSwitch`, `SampleNotice`, `QuizToolbar`, `QuizStats` (bento tiles), `QuizCard` (grid + list layouts). Reuse them on new pages.

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
| `--color-sunny` | `#FACC15` | logo tile, Draft badge, banner button, icon bubbles | `--color-on-sunny` `#1E293B` on it 9.55:1; edge on blue 3.38:1 |
| `--color-sunny-hover` | `#FDE047` | yellow hover, heading highlighter | ink 11.10:1 |
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

### Card and topic colors
Four accents plus blue. Each has **soft** (band/chip background), **ink** (text on soft or white), **solid** (`--accent`: dots next to text, 3:1+ on white) and **bright** (`--accent-bright`: decoration only).

| Name | soft | ink | solid | bright | ink on soft | ink on white | solid on white |
|---|---|---|---|---|---|---|---|
| Coral | `#FFE4E6` | `#9F1239` | `#E11D48` | `#FB7185` | 6.68:1 | 8.02:1 | 4.70:1 |
| Sunny | `#FEF9C3` | `#854D0E` | `#A16207` | `#FACC15` | 6.38:1 | 6.85:1 | 4.92:1 |
| Mint | `#DCFCE7` | `#166534` | `#16A34A` | `#4ADE80` | 6.49:1 | 7.13:1 | 3.30:1 |
| Grape | `#EDE9FE` | `#5B21B6` | `#7C3AED` | `#A78BFA` | 7.57:1 | 8.98:1 | 5.70:1 |
| Blue (no topics yet) | `#EAF1FF` | `#1E40AF` | `#2563EB` | `#60A5FA` | 7.69:1 | 8.72:1 | 5.17:1 |

- **Topic color = `ACCENTS[topicId % 4]`** with `ACCENTS = ['coral', 'sunny', 'mint', 'grape']`, so a topic keeps the same color on every page.
- **Card color =** the color of the quiz's most-used topic. A quiz with no questions uses blue.
- **Stat tiles:** Quizzes = Sunny (full yellow bubble, dark icon), Questions = blue, New this week = Mint, Most-used topic = that topic's color.
- **Bright shades are decoration only:** the dot grid on card bands, the banner drawing and the empty-state drawings. Never for text, never for marks that carry meaning.

### Status and feedback
| Meaning | Look | Contrast |
|---|---|---|
| Published | Mint soft + Mint ink + check icon + the word "Published" | 6.49:1 |
| Draft | Sunny yellow `#FACC15` + ink `#1E293B` + pencil icon + the word "Draft" | 9.55:1 |
| Danger | `#DC2626` solid (white 4.83:1); text `#B91C1C` (6.47:1 white, 5.91:1 on `#FEF2F2`); edges `#FECACA` | — |
| Sample notice | `#854D0E` on `#FEF9C3`, `#FACC15` edge | 6.38:1 |
| Success toast | Mint bubble | — |

Color never carries meaning on its own: status badges have text plus an icon, and topic chips show the topic name.

### Focus rings (3:1)
2px `--color-primary`, offset 2px: 5.17:1 on white, 4.82:1 on bg, 4.31–4.81:1 on card bands. On the blue banner the ring is **white** (5.17:1). Invalid fields use a red ring.

## 3. Typography
- **Headings:** Nunito 800 (h1–h3, stat numbers, brand name). Rounded terminals give a friendly feel.
- **Body/UI:** DM Sans 400 / 500 / 700. 16px base, line-height 1.5 (inputs stay 16px to prevent iOS zoom).
- Scale: 12 · 14 · 16 · 17 (list title) · 19 (card title) · 22 · 24 (section) · 26 (form title) · 28 · 32 (banner, phone) · 40 (banner) px. Nothing under 12px.
- Numbers (stats, counts, time) use `tabular-nums`. Headings use `text-wrap: balance`.
- **Highlighter:** the section heading ("All quizzes") and the form title get a yellow swipe behind the lower part of the text (`linear-gradient`, `--color-sunny-hover`, ink 11.10:1). Use it for at most one heading per view plus the dialog title.
- Google Fonts: `Nunito:wght@700;800` + `DM Sans:opsz,wght@9..40,400;9..40,500;9..40,700`

## 4. Shape, depth and spacing (playful but tidy)
- Radius: `--radius-sm 12px` (buttons, inputs) · `--radius-md 20px` (cards, tiles, menus) · `--radius-lg 28px` (banner, dialog, empty states) · `--radius-full` (chips, badges, search, toggles, avatars)
- Borders: 1px `--color-border` on cards. Controls use `--color-border-input`.
- Shadows (soft, blue-tinted, never inner):
  - `--shadow-sm: 0 1px 2px rgb(15 23 42 / .05), 0 2px 8px rgb(37 99 235 / .06)` resting cards
  - `--shadow-md: 0 14px 30px rgb(37 99 235 / .14)` card hover
  - `--shadow-lg: 0 20px 48px rgb(15 23 42 / .18)` menus, dialog, toast
- **Pressable lip:** filled buttons (`.btn-primary`, `.btn-light`) sit on a 3px solid shadow in a darker shade (`--lip`). On press they move down 2px and the lip shrinks to 1px (`--lip-pressed`), so layout never moves. Secondary buttons get a 2px `--color-border` lip. The selected view-toggle button gets a 2px blue lip.
- **Graph-paper dots:** grid card bands, the banner (right side only, masked away from text) and the form header use a faint `radial-gradient` dot grid (14–20px). The card date sits on a white pill so its text never touches the dots.
- Spacing: 4/8 grid: 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48
- Decorative drawings are `aria-hidden` and **must never sit behind text.** The banner drawing is hidden under 1024px; check for overlap at every breakpoint.

## 5. Motion (subtle; unchanged)
| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 150ms | color, border and lip changes |
| `--duration-base` | 220ms | card hover lift (`translateY(-3px)` + `--shadow-md`) |
| `--duration-enter` | 320ms | card entrance, menu open, dialog |
| `--duration-exit` | 180ms | menu close, exits (about 60% of enter) |
| `--ease-out` | `cubic-bezier(.2,0,0,1)` | default |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | button press, menu pop only |
- Grid cards fade/slide in with a **40ms stagger** (max 8 steps). There's no stagger in list view.
- `prefers-reduced-motion`: all of the above off; the final state shows immediately.

## 6. Layout (unchanged)
- Breakpoints **375 / 768 / 1024 / 1440**. Content max-width 1200px.
- **Sidebar:** white, 248px on desktop; 88px icon-only rail when collapsed and on tablet; drawer on mobile. Nav: Dashboard · Quizzes · Questions · Topics, where only Quizzes is built (the rest are demo placeholders, see decision 11). No "Soon" labels.
- Quiz grid: `repeat(auto-fill, minmax(min(100%, 300px), 1fr))`, gap 16–24px. The list view is one row per quiz.
- Every interactive target is at least 44×44px (smaller visible pills extend their hit area with `::after`). There's no horizontal scroll at 375px.

## 7. Component specs (Quizzes page)
- **Logo:** 34px yellow rounded tile with an ink trend line (`.logo rect` / `.logo path`); `public/favicon.svg` matches. In the sidebar it is 40px on a 3px `--color-sunny-lip` edge (`drop-shadow`).
- **Sidebar** (`SideBar.css`, `SideBtn.css`): logo area on a pale-blue panel with a dot grid (brand name 12.90:1, 10.71:1 on a dot); Nunito 20px brand name; collapse button turns into a white disc on hover. Section label ("TEACHING") in ink on a yellow highlighter swipe (11.10:1), expanded sidebar only. Nav items: inactive = muted text (7.58:1), transparent icon; hover = surface-2; **active** = primary-soft pill with a 3px `#C5D6FB` bottom edge, ink text (7.69:1), solid blue icon bubble with a 2px darker edge. Footer: rounded card (bg, border, `--shadow-sm`) with a 40px yellow avatar circle; in the rail only the avatar shows. Every nav item and the toggle are 44px or more.
- **Banner / welcome:** 28px-radius banner with the royal-blue gradient, dot grid on the right, greeting by time of day, one-line summary and the **yellow "New quiz" button** (`.btn-light`, white focus ring). At 1024px and up, the four `hero__blob` spans become a CSS drawing: a tilted quiz sheet with ticked boxes, a sun and a green "correct" check. Disabled (loading or server down), the button turns ghosted white instead of faded yellow.
- **Stats bento (4 tiles):** white 20px tiles; 48px round icon in the tile's soft/ink colors (the Sunny tile uses full yellow + ink). Numbers in Nunito 800.
- **Section heading:** "All quizzes" in Nunito 24px with the yellow highlighter.
- **Toolbar:** search pill · Teacher · Topic · Sort pills · Grid/List segmented toggle (selected = blue with lip). Active filters are blue-soft removable chips + "Clear all". The result count is a polite live region.
- **Quiz card (grid):** white 20px card; top band in the card's soft color with a graph-paper dot grid; date on a white pill (ink 6.85:1 or more); **⋯ menu button always visible** on a white disc (44px); status badge; Nunito 19px title; "by Teacher"; 2-line description; topic chips; footer with question count and time limit above a dashed line. Hover lifts 3px.
- **Quiz row (list):** accent dot (solid shade, 3:1+), title (17px) + teacher, topic chips (max 2 + "+n"), questions, time, status, date, ⋯ menu.
- **⋯ Menu:** `aria-haspopup="menu"`, `aria-expanded`; arrow keys move between items; Esc closes and returns focus; clicking outside closes it. Delete is red, separated from Edit, and still needs the inline confirmation.
- **Add/Edit form (dialog):** 28px radius; pale-blue header with a dot grid, a 48px **yellow clipboard tile** (CSS `::before`, decorative) and the title with the yellow highlighter; inputs 12px radius, 48px tall; focus = 2px blue ring + soft blue glow; invalid = red border, faint red fill, red ring and glow, error text with icon under the field. Bottom sheet on phones, main button on top.
- **Topic chip:** static label (not a button), pill, soft background, ink text, solid dot.
- **Empty states** (inline SVG in `Quizzes.jsx`, `aria-hidden`, 220×140):
  - *No quizzes yet:* quiz sheet with two ticked answers, a yellow pencil and a sparkle. "Let's make your first quiz" + Create a quiz.
  - *No matches:* magnifier with a question mark over two quiz cards. "No quizzes match" + Clear filters.
  - *Couldn't load:* sad cloud and an unplugged cable with a yellow spark. Server message + Try again / Show sample quizzes.
- **Sample data:** 6 realistic quizzes with questions and topics. Off by default; while on, the yellow notice is shown.

## 8. Accessibility rules (from `quick-reference.md` / `--domain ux`)
Contrast 4.5:1 for text, 3:1 for control edges and meaningful marks · visible 2px focus ring (blue; white on the banner) · 44px targets · `hover-vs-tap`: no hover-only actions · `color-not-only` · `chip-collection-reflow` · `submit-not-pre-disabled` · `unsaved-changes-guard` · `success-feedback` (toast, polite) · `persistent-errors` (inline, never toasts) · `dialog-focus` · `focus-not-obscured` · `reduced-motion` · `heading-hierarchy` · skip link · decorative drawings `aria-hidden`.

## 9. Anti-patterns (do not use)
Yellow text or yellow meaningful marks on white · bright accent shades for anything that carries meaning · drawings or dot grids behind text · toy-like thick outlines, double or inner shadows · children's fonts (Baloo, Comic Neue) · actions only visible on hover · color-only status · clipped chip rows · "Soon" labels, or placeholder nav links that aren't marked `aria-disabled` and don't cancel their click (see decision 11) · emoji used as icons · more than one primary action per screen · dark mode.
