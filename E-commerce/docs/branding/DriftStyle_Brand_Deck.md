# AromaCo — Drift‑Style Brand Deck (v0.1)

Status: Draft for internal use | Owner: Brand | Last updated: __
Scope: 3 pages you can brief directly to design/content.

---

## Page 1 — Brand Essence & Positioning

Brand Idea
- Designed by data, crafted by nature.
- Premium, minimalist scent experiences for car and home, guided by real preference data.

Brand Pillars
- Subscription convenience: Set‑and‑forget freshness; predictable recurring value.
- Minimalist aesthetic: Clean, calm, considered. Apple‑like restraint.
- Eco materials: Wood, glass, refillable; reduced plastics and waste.
- Data‑driven decisions: Preferences, cohorts, and trends inform scents and drops.
- Ritual, not utility: A daily reset; calm your commute.
- Community: UGC, drops, and seasonal profiles.

Audience Snapshots
- The Commuter: Wants calm/focus; values design and ease.
- The Minimalist: Cares about materials, packaging, and form.^
- The Gift‑Giver: Wants a premium, safe, pleasing present.
- The Pro: Realtors/detailers/car washes seeking classy, branded gifts.

Positioning Statement
- For design‑led commuters and homebodies, AromaCo delivers premium eco car + home scents, crafted by nature and guided by data—so every month feels tuned to you.

Tagline Options (test 2–3)
- The world’s first data‑driven scent experience.
- Designed by data. Inspired by nature.
- Bring calm into motion.
- Smart scent for life in motion.

Value Props (site bullets)
- Eco materials: wood + glass, refillable capsules.
- Data‑guided scents selected by season and preference.
- Subscription made simple; skip anytime.
- One scent language: your car to your couch.

Proof Points
- Live “Most‑Loved This Month” metric.
- Transparent ingredients + IFRA compliance.
- Refill timeline tuned by reorder data.

Brand Guardrails
- Do: Calm, confident, sensory, useful.
- Don’t: Hype, clutter, chemical jargon, neon plastics.

---

## Page 2 — Visual System (Minimalist, Natural, Premium)

Palette (hex)
- Cream (background): `#F6F3EE`
- Warm Sand: `#E8DFD3`
- Forest (primary): `#24503A`
- Charcoal (text): `#222222`
- Warm Gray (secondary text): `#6B6B6B`
- Copper (accent): `#B46A3F`
- White: `#FFFFFF`

Typography
- Primary Sans: Inter (weights 300, 400, 600)
- Accent Serif: Fraunces or Playfair (headlines only, sparingly)
- Numerals: Tabular in charts (Inter)

Type Scale (desktop)
- H1 56/64, H2 36/44, H3 24/32, Body 16/26, Small 13/20, Button 14/18 (600)

Layout & Components
- Grid: 12‑col, 80/24/80 gutters, 1200 max.
- Cards: 8px radius, 1px hairline `#EAE7E1`, soft shadows only on hover.
- Buttons: Solid Forest with white text; Ghost with Forest border; Copper only for promos.
- Icons: Simple line icons, 2px; avoid skeuomorphism.

Imagery
- Macro material shots (wood grain, amber glass, oil movement).
- Calm lifestyle scenes (dashboards, desks, shelves). Diffused light.
- Negative space; 1–2 objects per frame.

Packaging
- Kraft matte box with embossed wordmark; black ink; minimal copy.
- Inside: story/safety card; QR to “How your scent is optimized.”

Accessibility
- Body contrast ≥ 4.5:1; button contrast ≥ 7:1.
- Motion‑reduce: fade > slide; respect prefers‑reduced‑motion.

Brand Do/Don’t
- Do: whitespace, soft neutrals, tactile textures, real materials.
- Don’t: busy gradients, harsh drop shadows, glossy plastic renders.

CSS Tokens (starter)
```css
:root{
  --color-bg:#F6F3EE; --color-ink:#222222; --color-ink-2:#6B6B6B;
  --color-forest:#24503A; --color-copper:#B46A3F; --color-sand:#E8DFD3;
  --radius:8px; --space:8px; --space-2:16px; --space-3:24px; --maxw:1200px;
}
```

---

## Page 3 — Messaging System & Launch Framework

Product Architecture
- AromaPods™ (car): magnetic/wood diffuser pod (hero SKU).
- AromaDrops™ (refills): monthly capsules; subscription default.
- AromaHome™ (home): plug‑in using same capsules; one scent language.
- AromaCo+ (subscription): 1 scent/mo; choose seasonal or personalized picks.

Headline Formulas
- Hero: Calm your commute. Designed by data.
- PDP: A smarter scent ritual—eco, refillable, and tuned to you.
- Subscription: Fresh scent every month, no effort required.

Voice & Tone
- Calm, sensory, confident. Use concrete sensory verbs: breathe, unwind, reset.
- Avoid marketing buzzwords; show proof via small data notes.

Sample Copy Blocks
- Hero: “AromaPods™ bring designer scent to your drive—crafted by nature, guided by data. Start with our Starter Pack, then get refills on your terms.”
- Subscription: “We predict what you’ll love next. Choose a vibe, skip anytime.”
- Proof footer: “Most‑Loved This Month: Cedar Mist · 4.7/5 (2,184 ratings)”

CTAs
- Primary: Start Your Ritual
- Secondary: See How It Works
- Tertiary: Explore Scents

Naming & Scent Families
- Citrus (Bright), Woody (Grounded), Fresh (Clean), Floral (Soft), Gourmand (Warm)
- Example anchors: Coastal Breeze (Fresh), Fresh Cedar (Woody), Midnight Amber (Gourmand)

Unboxing Flow
- Pull‑tab kraft → wooden diffuser reveal → scent card → QR.
- Data fact on card: “Ranked #1 for calm this month by commuters.”

Launch Creative System
- Shot list: macro oil pour; cap soak; diffuser on dash; desk scene; box emboss.
- UGC prompts: “Reset your drive in 5 seconds.” “Pick my next scent with me.”
- 15‑sec ad storyboard: 1) Cluttered commute → 2) Pod click → 3) Deep breath → 4) Title: Designed by data.

Site Skeleton (for design/dev brief)
- Home: Hero (AromaPods), “How it works,” Scents carousel, Subscription explainer, Social proof, Footer with data note.
- PDP: Macro media, Scent notes, Materials, What’s included, Refill cadence, Reviews, FAQ.
- Subscription LP: Selector (seasonal/personalized), Skip controls, What’s in the box, Guarantee, FAQ.

KPI‑Backed A/B Tests
- Price anchor $14.99 vs $16.99; “Save X%” vs “Free refill” bundles.
- Hero copy variants: Data‑forward vs Sensory‑forward.
- UGC first frame: box reveal vs pod magnet snap.

Sign‑off Checklist
- Contrast + motion checks; alt text on images.
- Proof points present on every key page.
- UTM‑tagged links; consistent voice; no extra typefaces.

---

Hand‑off Notes
- This deck feeds design (Figma) and site copy. Keep it to one palette, two typefaces, and the three‑product architecture (Pods, Drops, Home). Add the “Most‑Loved This Month” metric wherever it earns trust without clutter.
