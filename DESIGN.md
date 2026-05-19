# VANTA — Design System

> Dark luxe streetwear. Brutalist silhouettes, technical fabrics, neon punctuation.
> Always dark. High contrast. Mono-typed micro-copy. One acid-green accent.

---

## 1. Brand Direction

| Axis | Direction |
|---|---|
| Mood | After-dark, technical, slightly brutalist |
| Aesthetic | Editorial fashion × techwear × Berlin nightlife |
| Contrast | Extreme — near-black canvas, near-white type, single neon |
| Density | Generous negative space in hero, dense product grids |
| Voice | Short, uppercase, mono. "DROP 04 — LIVE NOW" |

Never use: rounded soft cards, purple gradients, generic SaaS blue, serif body type, drop shadows on text, multi-color palettes.

---

## 2. Color System

All colors are defined as CSS custom properties in `src/styles.css` using **OKLCH**. Components must use the semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-neon`, etc.) — never hardcoded hex.

### Semantic tokens

| Token | OKLCH | Role |
|---|---|---|
| `--background` | `oklch(0.14 0.005 260)` | App canvas (near-black, slight cool tint) |
| `--foreground` | `oklch(0.97 0.005 260)` | Primary text |
| `--card` | `oklch(0.18 0.006 260)` | Elevated surface |
| `--popover` | `oklch(0.16 0.006 260)` | Floating surface |
| `--primary` | `oklch(0.97 0.005 260)` | Inverted button (white on dark) |
| `--primary-foreground` | `oklch(0.14 0.005 260)` | Text on primary |
| `--secondary` | `oklch(0.24 0.008 260)` | Secondary surface |
| `--muted` | `oklch(0.22 0.006 260)` | Subtle surface |
| `--muted-foreground` | `oklch(0.65 0.012 260)` | Secondary/meta text |
| `--accent` | `oklch(0.28 0.01 260)` | Hover surface |
| `--destructive` | `oklch(0.62 0.22 27)` | Errors |
| `--border` | `oklch(1 0 0 / 8%)` | Hairlines |
| `--input` | `oklch(1 0 0 / 12%)` | Input outlines |
| `--ring` | `oklch(0.85 0.18 145)` | Focus ring (neon) |
| `--neon` | `oklch(0.85 0.22 145)` | **Signature accent** (acid green) |
| `--neon-foreground` | `oklch(0.14 0.005 260)` | Text on neon |

### Neon usage rules

The acid-green `--neon` is the **only** accent. Reserve for:
- Primary CTAs (`bg-neon text-neon-foreground`)
- Live indicators / status dots
- Hover states on links (`hover:text-neon`)
- Logo slash `VANTA/`
- Marquee strip background
- Selected/active states

Never use neon for large body fills or as a gradient base. One neon element per viewport is ideal.

---

## 3. Typography

Loaded from Google Fonts via `__root.tsx` `<head>`:

```
Space Grotesk : 400 / 500 / 600 / 700
Inter         : 400 / 500 / 600
JetBrains Mono: 400 / 500 / 700
```

### Font families

| Token | Stack | Use |
|---|---|---|
| `font-display` | Space Grotesk | All headings, logo, hero numerals |
| `font-sans` | Inter | Body copy, paragraphs, form inputs |
| `font-mono` | JetBrains Mono | Eyebrows, labels, meta, CTAs, prices, badges |

### Type scale & treatment

| Element | Recipe |
|---|---|
| Hero H1 | `font-display text-[clamp(3rem,9vw,8rem)] font-black leading-[0.85] tracking-tighter` |
| Section H2 | `font-display text-4xl md:text-5xl font-black tracking-tight` |
| Card title | `font-display text-xl font-bold` |
| Eyebrow / meta | `font-mono text-[10px] uppercase tracking-widest text-muted-foreground` |
| Body | `text-base text-muted-foreground` (or `text-foreground` for emphasis) |
| CTA label | `font-mono text-xs font-bold uppercase tracking-widest` |
| 404 numeral | `font-display text-8xl font-black tracking-tighter` |

### Rules

- Headings → **always** `tracking-tighter` or `tracking-tight`, weight `font-black` (900) or `font-bold` (700).
- Mono → **always** uppercase + `tracking-widest`, never sentence case.
- Body → never uppercase, never tracked.
- Italic is reserved for a single accent word inside a hero (`<span className="italic text-neon">after</span>dark`).

---

## 4. Spacing, Radius, Layout

| Token | Value |
|---|---|
| `--radius` | `0.25rem` (4px) — almost-square, brutalist |
| `--radius-sm` | 0 |
| `--radius-md` | 2px |
| `--radius-lg` | 4px |
| `--radius-xl` | 8px |

Cards and product tiles use **square corners** or 4px max. No `rounded-2xl`, no pills (except the cart count badge and live dot, which use `rounded-full`).

### Container & grid

- Max content width: `max-w-7xl` (1280px), centered.
- Page padding: `px-4 md:px-8`.
- Section rhythm: `py-20` between sections, `mt-32` before footer.
- Product grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, `gap-x-4 gap-y-10`.
- Hero: 12-column split (`lg:grid-cols-12` → 6/6), `min-h-[88vh]`.

### Borders

- Hairlines only: `border-border` (white @ 8% alpha).
- Use borders, not shadows, to define cards (`border border-border p-6`).
- Hover: swap border to neon (`hover:border-neon`).

---

## 5. Shadows, Glow & Gradients

```css
--shadow-glow:     0 0 40px -10px color-mix(in oklab, var(--neon) 60%, transparent);
--shadow-card:     0 20px 60px -30px oklch(0 0 0 / 0.8);
--gradient-radial: radial-gradient(circle at 30% 20%,
                     color-mix(in oklab, var(--neon) 15%, transparent), transparent 60%);
--gradient-fade:   linear-gradient(180deg, transparent, var(--background) 90%);
```

- `.glow` utility for neon halo on hero CTAs or featured tiles.
- `--gradient-radial` overlays the hero image for a subtle neon wash.
- Drop shadows on UI chrome are **forbidden** — depth comes from borders + glow only.

---

## 6. Texture & Motion

### Grain overlay (`.grain`)

SVG fractal-noise overlay at `opacity: 0.06`, `mix-blend-mode: overlay`. Apply over hero imagery and large media to add filmic grit.

### Marquee (`.marquee-track`)

40s infinite horizontal scroll. Wrap content 3–4× and set `w-max` on the track. Used for the neon promo strip under the hero.

### Fade-up (`.fade-up`)

`0.6s cubic-bezier(0.16, 1, 0.3, 1)` entry. Apply once per hero block, not to every element.

### Interaction motion

- Links / nav: `transition-colors` to neon on hover.
- Cards: `hover:border-neon` + optional `hover:bg-card`.
- CTAs: `hover:opacity-90`, `group-hover:translate-x-1` on trailing arrow icons.
- Keep durations ≤ 300ms; no springy bounces.

---

## 7. Component Patterns

### Primary CTA

```tsx
<Link to="/shop"
  className="group inline-flex items-center gap-2 bg-neon px-6 py-4
             font-mono text-xs font-bold uppercase tracking-widest
             text-neon-foreground hover:opacity-90 transition">
  Shop the drop <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
</Link>
```

### Secondary CTA

```tsx
<Link className="inline-flex items-center gap-2 border border-border px-6 py-4
                 font-mono text-xs font-bold uppercase tracking-widest
                 hover:border-neon hover:text-neon transition">…</Link>
```

### Eyebrow label

```tsx
<p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
  Drop 04 — Live now
</p>
```

### Live dot

```tsx
<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
```

### Header

`sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl`
Logo uses neon slash: `VANTA<span className="text-neon">/</span>`

### Cart badge

Tiny `rounded-full bg-neon` pill with `font-mono text-[10px] font-bold`.

---

## 8. Iconography

- **Library:** `lucide-react` only.
- Standard size: `h-5 w-5` (nav), `h-4 w-4` (inline with text), `h-6 w-6` (feature tiles), `h-3 w-3` / `h-3.5 w-3.5` (micro).
- Stroke weight: default lucide (1.5px). Never fill.
- Color: inherits from text; use `text-neon` on feature tiles for emphasis.

---

## 9. Imagery

- All product/hero imagery is dark, moody, high-contrast (see `src/assets/hero.jpg`, `p1.jpg`–`p12.jpg`).
- Object-fit: `object-cover`, full-bleed in hero, square aspect in product cards.
- Always pair full-bleed images with `.grain` overlay.
- Alt text required, descriptive (e.g. "Model in dark luxe streetwear under neon green light").

---

## 10. Forms & Inputs

- Built on shadcn/ui (`new-york` style, slate base, `cssVariables: true`).
- Input background inherits from `--input` (white @ 12% alpha) — translucent on dark.
- Focus ring: `--ring` (neon).
- Labels: `font-mono uppercase tracking-widest text-[10px]`.

---

## 11. Selection & Scrollbar

```css
::selection { background: var(--neon); color: var(--neon-foreground); }

::-webkit-scrollbar       { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--muted-foreground); }
```

---

## 12. Accessibility

- All interactive elements ship with `aria-label` when icon-only (see `SiteHeader`).
- Focus visible via `--ring` (neon) — never remove outlines without replacement.
- Contrast: foreground/background ≈ 18:1; neon-foreground/neon ≈ 13:1 — both AAA.
- `prefers-reduced-motion`: marquee + fade-up should be wrapped if added (current implementation is non-essential decoration).

---

## 13. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use semantic tokens (`bg-card`, `text-neon`) | Hardcode hex / `bg-black` / `text-white` |
| One neon element per viewport | Paint multiple sections neon |
| Square or 4px-radius surfaces | `rounded-2xl`, pill buttons |
| Borders for separation | Box shadows on cards |
| Uppercase mono for labels | Title-case sans-serif labels |
| Tight tracking on display type | Loose tracking on headings |
| Inter for body | Serif body, Poppins, default system |
| Grain over hero imagery | Clean unfiltered stock photos |

---

## 14. File Map

| Concern | Location |
|---|---|
| Tokens, base, utilities | `src/styles.css` |
| Tailwind theme bridge | `@theme inline` block in `src/styles.css` |
| Font loading | `<head>` in `src/routes/__root.tsx` |
| shadcn config | `components.json` (style: `new-york`, base: `slate`) |
| Header / Footer | `src/components/site-header.tsx`, `src/routes/__root.tsx` |
| Product card | `src/components/product-card.tsx` |
| Hero reference | `src/routes/index.tsx` |
