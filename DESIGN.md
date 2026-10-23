# DESIGN.md — Design Operating Rules for Codex

Read this file before writing any UI. These rules are binding for every web app and page in this repo.
Structure: **Core** (always applies) → **Theme module** (pick one, A–I) → **Signature lever** (pick one, 1–7) → **Template** (if the page type has one) → **Concept switches** C1–C7 (on/off) → **Gate** (must pass before done).

---

## 0. Before coding — write an 8-line brief (mandatory)

Write this 8-line brief at the top of your plan and do not start code until it exists:

1. Subject: what the product is, in one sentence.
2. User: who uses it and in what situation (desk, shop floor, phone, night shift).
3. Primary job: the one thing the screen must make easy.
4. Theme module: one of section 4.
5. Signature lever: one of section 5.
6. Vernacular: 3 real materials, objects, or documents from the subject's world (e.g. "P&ID drawing, shift log, torque tag"). Visual decisions come from these, not from trends.
7. Boldness: quiet, standard, or loud (see section 4).
8. Concepts: which switches C1–C7 are on (see section 9). Unlisted switches use their default.

Then ask: "Would I produce this same plan for any other app?" If yes, revise the part that is generic and state what changed.

---

## 1. Banned defaults (the "AI look")

Do not use any of these unless the brief explicitly asks for it:

- Purple/indigo/blue gradients, gradient text, gradient blobs, mesh backgrounds.
- Glassmorphism, neon glow, soft grey shadow under every card.
- Centered hero with big headline + subtitle + two buttons + screenshot.
- Three identical feature cards with an icon on top.
- One border-radius on everything (e.g. rounded-2xl everywhere).
- ALL-CAPS tracked-out eyebrow labels above every heading.
- One highlighted word in a headline (italic, colored, or underlined).
- Middle-dot meta strings (A · B · C), "→" appended to every link, 01/02/03 numbering on non-sequential content.
- Emoji or a generic icon next to every heading.
- Fade-and-slide-up on every section; hover lift on every card.
- Cream background + serif + terracotta accent; black background + acid-green accent.
- Marketing filler: "Unlock", "Seamless", "Supercharge", "Elevate", "Powerful", fake testimonials, fake logo bars, fake stats.
- Lorem ipsum. Use realistic content from the subject.

---

## 2. Core system (always applies — modular tokens)

All values live in CSS custom properties on `:root`. Components use tokens only — **no hardcoded colors, sizes, or fonts in components.**

### 2.1 Color
- 5–6 named tokens max: `--paper`, `--ink`, `--ink-2` (secondary text), `--line`, `--accent`, `--signal` (status/alert).
- One accent only. Accent is used for action and meaning, never decoration.
- Dark mode: redefine the same tokens under `@media (prefers-color-scheme: dark)`. Never invert blindly; re-pick values.
- Contrast: text ≥ 4.5:1, large text and UI parts ≥ 3:1.
- **Color grammar (switch C1):** every color has exactly one job, written as a legend in the code comments and in the design notes (e.g. "rust = late, nothing else"). No color is used as decoration.
- Reserve one **celebration color** for a single moment (completion, agreement). It appears nowhere else, so it keeps its meaning.
- Status is always written in words too, never colour alone; people and owners are named, not just shown as dots.

### 2.2 Type — device-safe stacks only
Use system font stacks so text renders correctly on Windows, macOS, iOS, Android, and Linux without downloads:

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif;
--font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
--font-arabic: "Geeza Pro", "Noto Naskh Arabic", "Segoe UI", Tahoma, sans-serif;
```

- If a web font is used, it must be optional, loaded with `font-display: swap`, and end in one of the stacks above.
- Max two families per project, clearly different in role.
- Type scale: one ratio (1.2 for dense apps, 1.333 for pages). Define `--step--1` to `--step-5`.
- Body line length 45–75 characters. Serif body gets +0.1 line-height vs sans.
- Sentence case everywhere. Headlines are treated as design elements (size, weight, spacing, placement), not just text.

### 2.3 Space, shape, depth
- Spacing scale on a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Radius reflects hierarchy, not habit: e.g. inputs 4px, panels 0–2px, pills only for tags. Define `--radius-s/m/l` and justify each.
- Depth by borders, tone shifts, and spacing first. Shadows only for things that truly float (menus, dialogs).

### 2.4 Layout
- Left-aligned by default. Center only for genuinely singular moments.
- Use an asymmetric grid (e.g. 12 columns, content on 7–8, margin notes on 3–4). Break the grid once, on purpose.
- Vary section rhythm: not every section the same height, padding, or structure.
- Mobile first; test at 360px, 768px, 1280px. No horizontal page scroll; wide tables scroll inside their own container.

### 2.5 Bilingual / RTL
- Use logical properties (`margin-inline-start`, `padding-block`, `inset-inline-end`) — never left/right.
- Support `dir="rtl"`; mirror directional icons; keep numbers and code LTR.

### 2.6 Components (modular contract)
Every component ships with: default, hover, focus-visible, active, disabled, loading, empty, and error states. One file per component; props documented at the top; tokens only.

### 2.7 Motion
- One orchestrated moment per page at most (a load sequence or one reveal).
- Motion that responds to user action (open, expand, confirm) is welcome when it shows what changed.
- Durations 120–240ms; respect `prefers-reduced-motion`.
- **Motion grammar (switch C2):** motion means the system is working; stillness means a human must decide. A loading or processing state may move; anything waiting on the user is still and labelled ("Needs your approval"). One celebration animation only, tied to the celebration colour.
- With reduced motion on, moving states become still borders or labels — the meaning must survive without animation.

### 2.8 Copy
- Plain verbs, active voice, specific nouns and numbers from the subject.
- Buttons say exactly what happens ("Save changes", not "Submit"); the same word carries through the flow ("Publish" → "Published").
- Errors state what happened and how to fix it. Empty states invite the next action.
- **Honest copy (switch C3):** product and pricing pages include a short "What you're not getting" section: limits, platform requirements, what's beta, what's a draft. Candour builds trust and reads unmistakably human.
- Never invent stats, logos, testimonials, or counters. Missing facts become visible placeholders like [YOUR PRICE].

---

## 3. Structure is information
Borders, dividers, numbering, labels, and outlines must encode real meaning (grouping, sequence, status). If a device carries no information, remove it.

---

## 4. Theme modules (pick ONE per project, then adapt to the brief)

These are starting points, not skins. Tune every value to the subject.

**A. Blueprint / Engineering**
For tools, dashboards, technical systems. Cool paper tone, technical ink, single signal color for status. Dimension-line details, grid as a visible measuring device, tabular numerals for data. Labels read like drawing annotations.

**B. Gallery / Editorial**
For portfolios, art, writing, photography. Generous white space, a serif for reading, images given full bleed and silence. One strong typographic hero. Captions as a quiet second voice.

**C. Desert Modern**
For Gulf-context brands and bilingual products. Warm mineral neutrals (sand, stone, shade) with one deep accent (date-palm green, indigo dye, or copper). Arabic and Latin set with equal dignity. Pattern used structurally (dividers, rhythm), never as wallpaper.

**D. Control Room**
For operational apps used under pressure. Low-glare dark or neutral surface, color reserved strictly for state (normal / warning / alarm), large hit targets, dense but ordered data, no decoration at all.

**E. Field Notebook**
For personal, family, education, or creative tools. Paper-like warmth, handwritten-feel accents used once, margin notes, checklists as a visual device. Human, tactile, unhurried.

### Bold industrial family (F–I)
Built for turnaround, maintenance, and plant tools. Default boldness: **loud**. Each is drawn from a real object on site.

**F. Shutdown Tag**
The hanging inventory tag on every turnaround part. Safety-tag yellow fields (#F2C230), graphite (#2A2D2B), zinc (#C4C9C2), white tags, oxide rust (#A8321C) only for late. Tall condensed display face (e.g. Big Shoulders) over a plain sans (e.g. IBM Plex Sans). Tags with clipped corners, eyelets and wire, slightly tilted. Tag colour = status.

**G. Temper Colors**
The colours steel shows as it heats. Temper blue ground (#23408E), straw (#E6C36A), bronze (#B9733A), purple (#6E3F86), deep ink (#14182B), warm white (#F3EBDD). Extra-wide heavy display (e.g. Archivo at 125% width). A giant countdown number as the hero; timelines drawn as solid temper-colour bands sized by duration.

**H. T-Card Board**
The planning board in the shutdown office. Black frame (#1E1E1E, #3A3A38), board white (#F4F4EF), cards in fixed meaning colours: white = awaiting, blue (#4C86E0) = on time, orange (#F08A24) = late, pink (#E8578A) = additional need, green (#3FA86E) = on site. Condensed bold display (e.g. Barlow Condensed). Content lives in columns of cards; columns are workflow stages.

**I. Stencil Yard**
Stencilled lettering on crates and equipment in the laydown yard. Concrete ground (#B4B5AF), black (#161616), safety orange (#FF6B1A) used as solid plates, never as thin text. Stencil display (e.g. Stardos Stencil) with a system sans body. Hazard stripes allowed only as a structural divider, once per page.

Rules for F–I: web display fonts are optional and must fall back to the device-safe stacks in 2.2; status colours always carry a text label too; one colour = one meaning across the whole app.

### Boldness dial (set one in the brief, line 7)
- **Quiet:** one accent, generous space, type does the work. For dense apps and admin screens.
- **Standard:** one colour field per page, display type at 2–3× body size.
- **Loud:** full-bleed colour fields, display type at 6–10× body size, one physical object (tag, card, plate) as the hero. For landing pages, launches, and anything that must be remembered.

---

## 5. Signature levers (pick ONE, or one tight pair — spend boldness in one place only)

A pair is allowed only when both levers serve the same idea (e.g. material reference + one meaningful interaction, where the interaction moves the material object). Never more than two.

1. **Typographic hero** — the headline is the image (scale, cropping, tight setting).
2. **Data as texture** — real data forms a background or border (e.g. a sparkline rule, a timeline spine).
3. **Marginalia** — side notes, definitions, or annotations alongside main content.
4. **Material reference** — a detail drawn from the vernacular list (a tag, a stamp, a ruler edge, a map grid).
5. **Unexpected navigation** — an index, a table of contents, a timeline, or a dial instead of a standard navbar.
6. **One meaningful interaction** — a single interactive moment that demonstrates the product's core job.
7. **Device metaphor (switch C4)** — the whole interface behaves like one object the user already operates (an HMI faceplate, a permit book, a contact sheet and loupe, a planning board). Borrow the object's controls and vocabulary, never another site's styling. Rules: full keyboard navigation (arrow keys and Enter at minimum), plain text labels always visible, and the metaphor never hides how to do the task.

Everything else stays quiet and disciplined. Before finishing, remove one decorative element.

---

## 6. Page templates

### 6.1 Case study / project page (switch C5)
Use for portfolio and project pages, in this order:
1. **Facts block:** Type, Year, Scope, Challenge (one sentence each).
2. **What we did:** two or three sentences, then real screens.
3. **Functions:** what the product actually does, with captioned screenshots.
4. **Outcome:** a measurable or observable result. No result yet? Say so.
5. **Stack:** technologies used.
6. **Emotion:** one word the design was built to make people feel (e.g. Clarity, Confidence, Calm).
7. **Next project** link.

### 6.2 Product page
Hero (the signature lever) → what it does → how it works (real sequence only) → what's included → What you're not getting → price → request or buy.

---

## 7. Agent-ready layer (switch C6)
Make the site readable by AI assistants as well as people:
- `/llms.txt`: a plain summary of the site, its pages, and what the owner offers.
- `AGENTS.md` (public): a short brief an assistant can read to contact or book on a visitor's behalf; if a booking API exists, document it here.
- Structured data (JSON-LD) for Person or Organization, Product, and Article.
- Clean semantic HTML, so the content makes sense without CSS or JavaScript.
Keep this layer invisible in the visual design unless it is the point of the page.

---

## 8. Quality gate (must pass before marking done)

- [ ] 8-line brief written and reviewed for genericness.
- [ ] Zero items from section 1 present.
- [ ] All colors, fonts, spacing, and radii come from tokens.
- [ ] Only device-safe font stacks (or optional web font with safe fallback).
- [ ] Renders correctly at 360px, 768px, 1280px; no sideways scroll.
- [ ] Light and dark modes both defined and checked.
- [ ] RTL works where content may be Arabic.
- [ ] Visible keyboard focus; contrast meets 4.5:1.
- [ ] `prefers-reduced-motion` respected.
- [ ] All component states implemented (incl. empty and error).
- [ ] Copy uses real, specific content; no filler words.
- [ ] One signature lever (or one tight pair), clearly identifiable; one decoration removed.
- [ ] No invented stats, logos, or testimonials.
- [ ] Every switch that is ON passes its own check in section 9; every switch that is OFF leaves no trace.
- [ ] Append a 3-line note to `DESIGN-LOG.md`: theme used, lever used, what to try differently next time (prevents repeating the same look across projects).

---

## 9. Concept switches (apply independently)

Each concept is an add-on borrowed from a site we studied. Switch any of them on or off in brief line 8. They work with any theme (A–I) and any lever. The source site is for reference only: borrow the idea, never the styling.

| ID | Concept | Source | Default | Rules |
|---|---|---|---|---|
| C1 | Color grammar | Two-Do | ON | 2.1 |
| C2 | Motion grammar | Two-Do | ON | 2.7 |
| C3 | Honest copy | Charmling | ON for product and pricing pages; OFF elsewhere | 2.8 |
| C4 | Device metaphor | Arc (arcmarumo.com) | OFF | Lever 7 |
| C5 | Case-study facts | Emotion Agency | OFF; ON for project pages | 6.1 |
| C6 | Agent-ready layer | Ruben Marcus | OFF; recommended ON for products and portfolios | Section 7 |
| C7 | Physical object | Charmling, Theme F | OFF | Lever 4, plus: the object responds to touch (pull, swing, flip) and its state carries meaning |

**What each switch must show when ON (gate checks):**
- **C1:** a written colour legend; each colour has one job; one celebration colour used exactly once; status always in words.
- **C2:** moving = system working, still = waiting on a human, with a label; one celebration animation; meaning survives reduced motion.
- **C3:** a "What you're not getting" section with only true limits; missing facts as [PLACEHOLDERS].
- **C4:** the UI uses one device's vocabulary end to end (e.g. HMI: alarm bar, acknowledge, faceplate); keyboard operable; plain labels always visible.
- **C5:** a facts block (Type, Version or Year, Scope, Challenge, Emotion) near the top.
- **C6:** `/llms.txt`, a public AGENTS.md, and JSON-LD structured data shipped with the build.
- **C7:** one physical object from the subject's world that the user can manipulate, whose state changes with the data.

**When OFF:** the concept leaves no trace (no unused sections, colours, or animations).

**Prompt example for Codex:**
`Follow DESIGN.md. Theme F, levers 6+4, loud. Concepts: C1 C2 C3 C7 on, C4 off, C5 off, C6 on.`
