# Nine Coals Recreation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate all nine public pages of the supplied Nine Coals restaurant prototype in Svelte, with faithful visual styling, GSAP motion and working local-demo interactions.

**Architecture:** A SvelteKit application uses shared navigation, footer, design tokens and a per-layout basket context. Static, typed content supplies the reference menu and photographs; small pure modules own basket arithmetic, persistence validation and Johannesburg service dates. Route-specific components own the hero, carousel, sticky timeline, gallery and form flows; GSAP lifecycle cleanup keeps client navigation safe.

**Tech Stack:** SvelteKit, Svelte 5, TypeScript, Vite, plain CSS, GSAP/ScrollTrigger, Leaflet/OpenStreetMap, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-02-nine-coals-design.md`

## Global Constraints

- User steering after approval: use Bun for dependency management and every command; npm run commands below mean bun run, and npx means bunx. The official svelte-code-writer, svelte-core-bestpractices and svelte-mcp-feedback skills are to be installed globally and used where applicable.
- Current stable SvelteKit 3 uses Vite plugin configuration, $app/tsconfig and #lib imports; these replace the plan's older configuration-file assumptions. Use typed createContext and a per-layout rune class for shared basket state per the requested Svelte best-practices skill.

- Svelte is required.
- GSAP is requested; other libraries may be used as needed.
- Match the supplied reference rather than introduce a different brand direction.
- This is a front-end recreation with no restaurant backend, payment processing, email delivery or live reservation integration.
- ENERGY 3 / RHYTHM 3 / MOTION 3; near-black `#0d0c0b`, charcoal `#181513`, ash `#e8e6e3`, ink `#141110`, ember orange `#ff4d1a` and flame amber `#ffb347`.
- Clash Display, General Sans and Instrument Serif italic reproduce the reference typography.
- Minimum 44px interactive target sizes, visible focus rings, no page-level horizontal overflow, no inaccessible low-contrast small text.
- Test at 360, 390, 768, 1024 and 1440px.
- `prefers-reduced-motion` disables scrubbed/pinned choreography and animated transitions while keeping all content and interactions.
- Contact, booking and order actions prominently disclose local/demo-only behavior before submission and in their confirmation.
- Preserve the reference's sample-brand disclosure and photographic attribution. No invented testimonials, claims or generated visual assets.
- Initial implementation scope excluded deployment, external account creation, real checkout, backend provisioning and live email sending. The user later separately authorized public GitHub publication. No hosting deployment is authorized.
- Because work began without Git history, task checkpoints used this plan and test evidence. The completed tree was later published as the initial commit of `edengilbertus/nine-coals-svelte`.

## Review Focus

1. Corrupt or blocked browser storage must not crash the basket or accept unknown dishes, negative/fractional/non-finite quantities or stale malformed values (Task 2 tests).
2. Rapid carousel input and navigation away during animation must never desynchronize the dish, price, basket action or GSAP listeners (Tasks 3 and 6 tests).
3. Johannesburg midnight boundaries, month/year transitions and Mondays must not produce invalid booking dates; backward/forward steps must preserve valid choices (Tasks 2 and 4 tests).
4. Touch drag versus click, Escape/focus restoration, reduced motion and 200% text scaling must leave all gallery/form content usable (Tasks 5 and 6 tests).
5. Offline/failed images or map loading and invalid form submissions must show usable recovery information without falsely reporting that a restaurant received anything (Tasks 4, 5 and 6 tests).

## File Map

- Project configuration: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `playwright.config.ts`, `.gitignore`, `src/app.html`, `src/app.d.ts`.
- Shared shell: `src/routes/+layout.svelte`, `src/routes/+error.svelte`, `src/app.css`, `src/lib/components/Nav.svelte`, `Footer.svelte`, `FireStatus.svelte`, `Toast.svelte`, `Image.svelte`.
- Content and logic: `src/lib/data/menu.ts`, `src/lib/data/content.ts`, `src/lib/cart.ts`, `src/lib/booking.ts`, `src/lib/motion.ts`.
- Visual components: `src/lib/components/Hero.svelte`, `DishShowcase.svelte`, `DayStack.svelte`, `BedRows.svelte`, `GalleryDome.svelte`, `PhotoDialog.svelte`, `Map.svelte`.
- Public routes: `src/routes/+page.svelte`, `menu/+page.svelte`, `story/+page.svelte`, `gallery/+page.svelte`, `events/+page.svelte`, `contact/+page.svelte`, `reservations/+page.svelte`, `order/+page.svelte`, `credits/+page.svelte`.
- Assets: `static/media/*`, `static/cutouts/*`, `static/fonts/*`, `static/favicon.ico`, `scripts/fetch-assets.mjs`, `ASSET-LICENSES.md`.
- Tests: `src/lib/cart.test.ts`, `src/lib/booking.test.ts`, `src/lib/data/menu.test.ts`, `tests/shell.spec.ts`, `tests/menu.spec.ts`, `tests/flows.spec.ts`, `tests/gallery.spec.ts`, `tests/responsive.spec.ts`.
- Documentation: `DESIGN.md`, `README.md`, `docs/verification.md`.

---

### Task 1: Runnable Svelte shell and reference assets

**Files:** Project configuration, `src/app.css`, `src/routes/+layout.svelte`, `src/routes/+error.svelte`, shared shell components, `scripts/fetch-assets.mjs`, `static/*`, `ASSET-LICENSES.md`, `DESIGN.md`, `tests/shell.spec.ts`.

**Interfaces:** Produce design tokens `--smoke`, `--char`, `--ash`, `--ink`, `--muted`, `--ember`, `--flame`, `--font-display`, `--font-body`, `--font-accent`, `--margin`, `--section-gap`; `Nav` and `Footer` have no required props; `Image` accepts `src: string`, `alt: string`, `class?: string`, `eager?: boolean`; `FireStatus` supplies readable Johannesburg-time status. Expose scripts `dev`, `build`, `preview`, `check`, `test:unit`, `test:e2e`.

- [x] **Step 1: Create only the toolchain configuration and write failing shell tests.** Assert the home link has accessible name `Nine Coals, home`; primary links target `/menu`, `/story`, `/gallery`, `/events`, `/contact`, `/order`, `/reservations`; at 390px an `Open menu` button opens navigation, Escape closes it and restores focus; an unknown path shows a home-return link.
- [x] **Step 2: Run `npm run test:e2e -- tests/shell.spec.ts` and verify the missing shell assertions fail.** Record dependency/setup failures separately from assertion failures.
- [x] **Step 3: Implement the shared shell and design tokens.** Use the spec's exact palette, type scale and spacing. Keep native anchor navigation, active-route styles, a skip link, keyboard focus, a mobile menu with visible `Menu` text and truthful prototype-information dialogs for footer legal controls. Reuse the source wordmark text, not an invented logo.
- [x] **Step 4: Retrieve source assets and font styles without copying the source application.** The fetch script may write binary assets and a generated asset manifest, never rewrite source/CSS. Fetch the reference's observed `/media/*` and `/cutouts/*` paths; use ordinary browser carousel interaction to enumerate remaining cutouts. Store local font files and preserve their applicable license information plus source photo credits. Provide image failure fallback text through `Image`.
- [x] **Step 5: Run `npm run check`, `npm run build` and the shell test; verify all pass.** Record the runnable shell checkpoint here.

### Task 2: Menu data, basket state and service-date rules

**Files:** `src/lib/data/menu.ts`, `src/lib/data/content.ts`, `src/lib/cart.ts`, `src/lib/booking.ts` and their unit tests; connect basket context in `src/routes/+layout.svelte`.

**Interfaces:**
- `Bed = { id: string; name: string; temperature: string; description: string; color: string; ink: string }`.
- `Dish = { id: string; name: string; bedId: string; price: number; description: string; image?: string; signature?: boolean }`.
- Export `beds: Bed[]`, `dishes: Dish[]`, `signatures: Dish[]` and `formatPrice(value: number): string` from `menu.ts`.
- `CartLine = { dishId: string; quantity: number }`; `parseCart(raw: string | null): CartLine[]`; `cartTotal(lines: CartLine[]): number`; `createCart()` returns a Svelte store with `subscribe`, `add(dishId: string)`, `setQuantity(dishId: string, quantity: number)`, `remove(dishId: string)`, `clear()`, `restore(storage?: Storage)` and storage-error feedback. Store each layout instance in context under an exported `CART_KEY`.
- `ServiceDate = { value: string; label: string }`; `serviceDates(now: Date): ServiceDate[]`; `serviceTimes: string[]`; `validateBookingStep(step: number, values: BookingValues, now: Date): string | null`; `BookingValues = { date: string; guests: number; time: string; name: string; phone: string }`.

- [x] **Step 1: Write failing unit tests.** Assert nine beds, seventeen dishes, eleven signatures, unique IDs and valid bed references; `cartTotal([{dishId:'tomahawk',quantity:2}]) === 1780`; invalid/unknown/fractional/NaN/negative quantities are rejected, quantities are capped at 99, corrupt storage returns an empty basket, blocked storage leaves memory updates usable. Assert Mondays are absent, dates fall within thirty days of Johannesburg's current date, year-end and UTC/Johannesburg midnight cases are correct, guest count is 1..8 and times range from `17:30` to `21:00` in thirty-minute increments.
- [x] **Step 2: Run `npm run test:unit`; verify failures point to missing data/functions.**
- [x] **Step 3: Implement the exact reference menu, prices, descriptions and content.** Use integer rand arithmetic, stable dish IDs and a per-layout store to avoid SSR cross-user state. Decode storage defensively and persist only basket IDs/quantities, never form personal information. Use date-only ISO values and explicit `Africa/Johannesburg` formatting rather than the host timezone. Require a name and plausible phone number only at the details step.
- [x] **Step 4: Run unit tests, `npm run check` and `npm run build`; verify pass.** Record this state/data checkpoint.

### Task 3: Animated home and complete menu

**Files:** `src/lib/motion.ts`, `Hero.svelte`, `DishShowcase.svelte`, `DayStack.svelte`, `BedRows.svelte`, `src/routes/+page.svelte`, `src/routes/menu/+page.svelte`, `tests/menu.spec.ts`.

**Interfaces:** Consume Task 2 exports and `CART_KEY`; `DishShowcase` accepts `heading: string = 'Signatures'`; `motion` exports a reduced-motion-aware lifecycle helper returning `destroy(): void`; home components need no additional props.

- [x] **Step 1: Write failing browser tests.** Assert the hero's accessible heading, book/menu CTA destinations, five timeline times, nine coal-bed links, all seventeen menu dishes and prices, and category anchor scrolling. Next/previous, ArrowLeft/ArrowRight and swipe must change the active signature coherently; adding Tomahawk updates the basket to R 890. Dispatch rapid navigation inputs and assert the active heading, image, description, price and add action still refer to one dish.
- [x] **Step 2: Run `npm run test:e2e -- tests/menu.spec.ts`; verify the new assertions fail.**
- [x] **Step 3: Implement the source hero composition and GSAP choreography.** Match the 1440x1000 and 390x844 reference captures, including original smoke/tomahawk imagery, giant stacked type, ember gradient and responsive CTA placement. Use one intro timeline, scroll-linked ribbon/story emphasis, a five-photo sticky day stack and reference-style bed rows. Reduced motion renders content immediately and removes scroll pinning/continuous decoration.
- [x] **Step 4: Implement the eleven-dish showcase and menu.** Keep a single active signature state, bounded/wrapped navigation, serialized/cancelled transitions, keyboard/touch controls, state-color contrast and add feedback. Buttons remain usable if GSAP fails. Reuse the same showcase on home/menu; category anchors have scroll margins below navigation.
- [x] **Step 5: Run menu tests, unit tests, checks and build; capture desktop/mobile screenshots.** Fix visual differences against source screenshots before recording the home/menu checkpoint.

### Task 4: Local pickup and booking flows

**Files:** `src/routes/order/+page.svelte`, `src/routes/reservations/+page.svelte`, `src/lib/components/Toast.svelte`, `tests/flows.spec.ts`.

**Interfaces:** Consume `createCart` via `CART_KEY`, reference menu exports and Task 2 booking types/validation. Forms stay client-only; no outbound submit request is allowed. The visible confirmation explicitly says `Demo only` and names the chosen basket or reservation details.

- [x] **Step 1: Write failing flow tests.** Verify empty basket CTA, add/update/remove and reload persistence, totals, required pickup/contact validation and local confirmation; ensure no POST occurs. Booking must block empty date selection, select an allowed date, clamp guests to 1..8, choose a valid time, reject invalid name/phone details and confirm a local demo. Back/next and completed-step jumps retain values; Monday/past/tampered dates cannot confirm. Block local storage and ensure ordering still works in memory.
- [x] **Step 2: Run `npm run test:e2e -- tests/flows.spec.ts`; verify missing-flow failures.**
- [x] **Step 3: Build the source-style basket and four-step booking UI.** Include progress/step navigation, source title/copy, demo-availability disclosure, readable validation, disabled/busy submission feedback, accessible live confirmations and a clear restart action. Show processing states without simulating a live restaurant response. Offer no payment fields; store no entered personal data. Use a click/keyboard-operable booking action rather than a drag-only confirmation.
- [x] **Step 4: Run flow and unit tests, checks and build; verify no outbound form submissions in browser network evidence.** Record this transaction-demo checkpoint.

### Task 5: Story, events, gallery, contact and credits

**Files:** Remaining route files, `GalleryDome.svelte`, `PhotoDialog.svelte`, `Map.svelte`, `tests/gallery.spec.ts`, extend `tests/flows.spec.ts`.

**Interfaces:** Consume source photo/content data; `GalleryDome` accepts `photos: { src: string; alt: string }[]`; `PhotoDialog` accepts the selected photo and `onclose: () => void`; `Map` supplies the reference coordinate `[-26.2044, 28.0593]`, attribution and directions fallback. Keep map code client-only and lazy loaded.

- [x] **Step 1: Write failing browser tests.** Assert ONE FIRE. opening, original story/event copy and booking links, credits/source links, address/hours and exact directions/tel/mailto targets. Gallery supports drag without opening a photo, click-to-open, explicit rotation controls, flat photo-list access, previous/next photo, Escape and restored focus. Contact rejects empty/invalid details, then displays a local-only message confirmation and sends no request. Abort map tiles and an image request; readable fallback/directions and the rest of the page remain available.
- [x] **Step 2: Run gallery and extended flow tests; verify the new assertions fail.**
- [x] **Step 3: Reproduce source editorial pages.** Use ash background and oversized story type, the source founder quote as clearly fictional prototype content, three wood/coal/steak panels and source fire values. Build the four source events with photographs and reservation links. Preserve all applicable photographic source/license credits.
- [x] **Step 4: Implement the domed gallery.** Prefer CSS 3D transforms with pointer capture, click/drag threshold and GSAP settling rather than adding a WebGL stack. Keep back-facing tiles non-interactive, provide real labeled rotation controls, a flat accessible photo list and a native modal lightbox with focus restoration. Turn off inertial motion for reduced-motion users.
- [x] **Step 5: Implement contact/map and message demo.** Match the source two-column composition, OpenStreetMap attribution, map controls, business-detail placeholders from the prototype and source links. Always retain address/directions outside the map. Provide clear image/map loading and error states; do not falsely claim a message was sent.
- [x] **Step 6: Run route/flow/gallery tests, unit tests, checks and build.** Capture each route at desktop and phone widths; record this complete-route checkpoint.

### Task 6: Full reference comparison, accessibility and delivery

**Files:** `tests/responsive.spec.ts`, fixes in their owning components, `README.md`, `docs/verification.md`, updates to this plan and spec tracker.

**Interfaces:** Existing production app and test scripts. Produce a concise README and evidence-backed interaction/delivery-gate report, not a claim of backend readiness.

- [x] **Step 1: Add failing regression cases for any discovered defect.** Test all nine routes at 360/390/768/1024/1440px for document overflow, working images and console exceptions; test reduced motion, keyboard-only menu/carousel/gallery/forms, 200% text scaling, focus restoration and fast repeated route changes during animation. Check exact rendered color pairs with the contrast formula/checker; test image scrims at the lightest relevant background.
- [x] **Step 2: Run `npm run test:e2e -- tests/responsive.spec.ts`; verify newly discovered regressions fail before fixing them.**
- [x] **Step 3: Fix only evidence-backed layout, accessibility, animation or interaction defects in their owning files.** Recompare source and local screenshots at the same viewport and settled animation state. Ensure every shared and route-specific control has a recorded action; code inspection covers protocol links without initiating calls/email.
- [x] **Step 4: Run `npm run check`, `npm run test:unit`, `npm run test:e2e` and `npm run build`.** All must pass. Also run the production preview and smoke-test direct routes and browser navigation; record command outputs and browser console/network findings.
- [x] **Step 5: Complete `docs/verification.md` and `README.md`.** Record one result per control family plus antislop Hard Gate, Purpose-Gate, Liveliness and Craftsmanship/Quality Locks, with concrete evidence. Explain startup, demo-only actions, local storage, assets/licenses, external map dependency and verification commands. Link screenshots and state any environmental limitation honestly.
- [x] **Step 6: Request a whole-project review if subagent access is available, otherwise perform the same review inline and disclose the limitation.** Resolve material findings with regression tests, rerun final verification, mark the plan/spec complete and deliver the local run command/URL. No deployment was performed. Public GitHub publication was separately authorized afterward.

## Plan Self-Review

- [x] Spec coverage: every route, static asset, demo flow, typography/color decision, GSAP behavior, responsive requirement, licensing requirement and acceptance criterion has an owning task.
- [x] Step scan: steps specify concrete assertions, files, signatures, implementation boundaries or verification commands; no application bodies are prewritten.
- [x] Type consistency: cart and booking signatures are defined in Task 2 and reused consistently by later tasks.
- [x] Review Focus: all five failure classes are assigned explicit unit/browser assertions in their owning tasks.
- [x] Proportion: six independently reviewable tasks cover one integrated front-end, without splitting into unrelated projects or inventing a backend.

## Execution Status

Plan approved; user selected native execution. All six tasks are implemented and verified. Final evidence: type checks 0 errors/warnings, 16/16 unit tests, production build exit 0, 42/42 production browser tests, 18/18 final screenshot captures, complete Svelte autofixer zero issues, and 42/42 rendered image-text contrast regions. The project was published as the public MIT-licensed repository `edengilbertus/nine-coals-svelte`; there is no hosting deployment, backend, payment or live email. See `docs/verification.md` for evidence and deferred review minors.
