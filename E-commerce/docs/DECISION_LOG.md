# AromaCo + Databin Analytics — Decision Log (Living)

Purpose
- One source of truth for strategic decisions, targets, and open items across both businesses. Update on each major change; append to Change Log.

Current Positioning (v1)
- Tagline: Stack once, sell twice.
- AromaCo: Premium, refillable passive car/home diffusers (eco, minimalist, Drift‑inspired; subscription‑first refills).
- Databin Analytics: Self‑hosted analytics stack + services for small e‑commerce brands (Airflow → Postgres → Superset), moving to SaaS.
- ICP focus: Design‑led commuters (primary), boutique wholesale (secondary).
- Differentiator: Data‑guided scents and lifecycle (visible proof points on site).

Business Model Picks
- Subscription‑first refills (AromaDrops) with Starter Pack entry.
- Dual track revenue: Products (AromaCo) + Services/SaaS (Databin).
- Content/UGC + light paid; wholesale pilots for credibility and volume.

Product Decisions (AromaCo)
- Hero hardware: Magnetic wood pod/clip; reusable 10 ml glass refills.
- Core SKUs: AromaPods (car), AromaDrops (refills), 3‑Pack Gift; Phase‑2 AromaHome.
- Decor expansion (feasibility approved): AromaStone (gypsum), Wood Block + felt; Ceramic Arc after pack/ship testing.
- Unit economics targets: DTC gross margin ≥ 60–65%; unit COGS ≤ $5.50 hero; decor COGS ≤ 35% of MSRP.
- QC gates: Leak rate < 2%; fill ±0.2 ml; label adhesion pass; decor breakage < 2%.
- Go/No‑Go for decor: noticeable throw ≥ 3 hours/8–10 drops; pack time ≤ 3 min/unit.

Tech & Analytics (Shared Stack)
- Stack: Next.js (store) → FastAPI (backend) → PostgreSQL; Airflow DAGs (orders/cohorts/churn/inventory) → Superset dashboards.
- Data model: orders, order_items, customers, ad_spend_daily, experiments, inventory, subscriptions.
- Personalization: simple recommender from preference tags; "Most‑Loved This Month" site module.
- Env templates added: infra/.env.example, backend/.env.example, frontend/.env.example.

Databin Strategy
- Services: Analytics Stack Setup ($2k–$4k), managed insights ($499–$999/mo), case‑study marketing based on AromaCo.
- SaaS (working name: RetailFlow) in Phase 3 (months 7–12), white‑label ready.

Phased Plan & Gates
- Phase 1 (0–3 mo): Validate hardware/scents; 100–200 units; 3–5 analytics clients; dashboards live on our store.
- Phase 2 (4–6 mo): Productize; wholesale pilots; 7‑Day Setup package; publish case study; subs MVP.
- Phase 3 (7–12 mo): Scale subs, add AromaHome, launch RetailFlow; 3PL readiness.
- Gates: CVR ≥ 2.0%; AOV ≥ $30; CAC ≤ $15; MER ≥ 2.0; D30 repeat ≥ 15%; defect < 2%.

KPIs (North Star)
- Subscriptions: 500 @ ~$15/mo EOY.
- MER, CAC, CVR, AOV, churn, repeat rate, defect/breakage, OTS (on‑time ship ≥ 95%).

Risks & Mitigations
- High CAC → UGC + targeting via dashboards; bundle AOV.
- Quality/leaks → strict AQL; dual suppliers; hold lots > 2% defects.
- Fragility (decor) → foam inserts, ISTA‑style drop tests, staged rollout.

Artifacts & References
- Brand deck: docs/branding/DriftStyle_Brand_Deck.md
- One‑pager: docs/onepagers/AromaCo_Databin_OnePager.md
- SKU spec: docs/aromaco/SKU_Packaging_Spec_Template.md
- Refund/subscription policy: docs/aromaco/Refund_Subscription_Policy_Template.md
- Suppliers list: docs/aromaco/Suppliers_Costs.csv

Next Actions (rolling)
- Order diffuser and decor samples; run leak/absorption/drop tests.
- Lock 3 scents; produce 100–150 units; photo/UGC assets.
- Soft launch with subs MVP; seed 20 creators; wholesale outreach (2 POs).

Change Log
- v1.0 (init): Decision log created; decor expansion approved (AromaStone, Wood Block), Ceramic Arc pending pack/ship test.
