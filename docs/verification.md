# Nine Coals verification

Status: complete for local delivery. This report concerns a front-end prototype, not a live restaurant service.

## Environment and commands

- Bun 1.3.14; Svelte 5.57.3; SvelteKit 3.1.1; GSAP 3.15.0.
- Development URL: `http://127.0.0.1:5179`.
- Production preview: `bun run preview --port 4179 --strictPort` at `http://127.0.0.1:4179`.
- Browser executable: existing Chromium headless shell revision 1228. Playwright's current installer rejects this machine's macOS 13, so tests use `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

```sh
bun install --frozen-lockfile
bun run check
bun run test:unit
bun run build
TEST_BASE_URL=http://127.0.0.1:4179 PLAYWRIGHT_CHROMIUM_EXECUTABLE=/absolute/path/to/chromium bun run test:e2e
bun run check:svelte
BASE_URL=http://127.0.0.1:4179 PLAYWRIGHT_CHROMIUM_EXECUTABLE=/absolute/path/to/chromium bun run screenshots
```

The production suite is deliberately separate from the development server. Port 5173 belongs to another project and was not stopped or changed. The CPU-heavy Svelte autofixer runs separately from browser tests.

## Results

| Check | Final result |
| --- | --- |
| Frozen Bun install | PASS: 81 installs, 106 packages, no changes |
| Svelte/TypeScript | PASS: 0 errors, 0 warnings |
| Unit suite | PASS: 16/16 |
| Production build | PASS: exit 0 |
| Production browser suite | PASS: 42/42 in 3.0 minutes against the strict production preview after the font-delivery change |
| Fontshare integration | PASS: Clash Display and General Sans load from Fontshare's hosted CSS and CDN; no Fontshare font binaries are present in the build |
| Official Svelte autofixer | PASS: 24 files, zero issues; optional suggestions only |
| Desktop/phone screenshots | PASS: 18 final production captures after the font change, zero response/image/overflow failures and zero page exceptions |
| Whole-project review | Complete: no Critical; three Important fixed with RED→GREEN regressions; five Minor deferred |

The earlier 34-test run had four test-harness failures: the image assertion counted deliberately aborted external map tiles as application assets. The assertion now checks same-origin images, while separate tests check map recovery. Those earlier failures are not presented as a passing full run.

The first production run passed 38/39. Its only failure was the 1440px test waiting five seconds for gallery bitmap decoding during parallel accessibility checks. Image responses succeeded, and the same complete breakpoint test passed unchanged in isolation. Gallery readiness now has an explicit 15-second asset-loading allowance; assertions about layout, images and interactions are unchanged.

An intermediate run passed 39/41. Its two failures were test timing, not application failures: the menu inventory queried the new route before client navigation rendered it, and the 768px route loop allowed only five seconds for hydration during parallel image work. The inventory now awaits the menu URL and heading, and explicit hydration readiness allows 15 seconds. A targeted production rerun passed before the complete 42/42 run.

## Interaction inventory

The browser tests use actual page controls and assert their resulting state. Protocol/external links are inspected without initiating a telephone call, email, real booking or payment.

| Control family | Action and expected result | Evidence |
| --- | --- | --- |
| Brand and main navigation | Brand returns home; menu/story/gallery/events/contact/order/reservations target real routes | `tests/shell.spec.ts` |
| Mobile navigation | Open labeled Menu; Escape closes and returns focus | `tests/shell.spec.ts` |
| Footer destinations/history | Follow every internal footer destination; browser Back/Forward restores routes | `tests/inventory.spec.ts` |
| Prototype-information dialogs | Privacy, Terms and Cookies open with keyboard; Escape and Close dismiss; opener regains focus | `tests/responsive.spec.ts`, `tests/inventory.spec.ts` |
| Missing route | Unknown URL displays a real home-return link | `tests/shell.spec.ts` |
| Home calls to action | Book targets reservations; menu targets menu | `tests/menu.spec.ts` |
| Fire narrative | All five timeline times and nine bed destinations exist | `tests/menu.spec.ts` |
| Full menu/categories | Seventeen dishes, source prices, category anchor scroll below navigation | `tests/menu.spec.ts` |
| Signature carousel | All eleven dishes/prices; next/previous, side previews, keyboard and touch swipe change one coherent dish state | `tests/menu.spec.ts`, `tests/inventory.spec.ts` |
| Add feedback | Each signature and full-menu Add updates basket; View order navigates; Dismiss closes notification | `tests/inventory.spec.ts` |
| Basket | Empty CTA; quantity increase/decrease, reload persistence, removal, clear, exact totals and add-more navigation | `tests/flows.spec.ts`, `tests/inventory.spec.ts` |
| Storage failure | Blocked browser storage leaves an in-memory basket and visible warning | `tests/flows.spec.ts` |
| Pickup form | Empty fields reject; valid local details and time show explicit demo confirmation; no POST | `tests/flows.spec.ts` |
| Booking dates | Empty selection rejects; more/fewer dates toggle; selection survives step navigation; an open tab refreshes across Johannesburg midnight and clears a stale day | `tests/flows.spec.ts`, `tests/inventory.spec.ts`, `tests/responsive.spec.ts` |
| Booking guest/time controls | Guest bounds 1..8; all eight times select; completed steps remain usable; one guest uses singular wording | `tests/inventory.spec.ts` |
| Booking details | Invalid phone rejects; valid local details show explicit demo confirmation and restart; no POST | `tests/flows.spec.ts` |
| Story/events | Source story content and images; all four event booking links point to reservations | `tests/gallery.spec.ts` |
| Dome rotation/drag | Both rotation buttons change yaw; pointer drag changes yaw without opening a photograph; a press released above the dome cannot rotate it on later hover | `tests/gallery.spec.ts`, `tests/inventory.spec.ts` |
| Dome keyboard | Arrow key moves roving focus; Enter opens; Escape closes and restores focus | `tests/responsive.spec.ts` |
| Photo list/lightbox | Show/Hide list; every photo opens its matching image; previous/next, Close and Escape work | `tests/gallery.spec.ts`, `tests/inventory.spec.ts` |
| Directions/telephone/email | Exact directions and telephone targets; email uses `mailto:fire@ninecoals.co.za` | `tests/gallery.spec.ts`, source inspection |
| Map controls | Zoom changes tile zoom; marker opens prototype popup; popup closes; failed tiles show Retry and retain directions | `tests/gallery.spec.ts`, `tests/inventory.spec.ts` |
| Contact form | Empty details reject; valid details produce explicit not-sent confirmation; reset clears fields; no POST | `tests/flows.spec.ts`, `tests/inventory.spec.ts` |
| Credits | Original photographic credits/source links and additional font/map licenses remain available | `tests/gallery.spec.ts`, `ASSET-LICENSES.md` |
| Failed photographs | A failed food image displays readable fallback text, including an error before hydration | `tests/gallery.spec.ts` |

## Responsive, motion and accessibility coverage

- All nine routes at 360, 390, 768, 1024 and 1440px: HTTP response, page exceptions, application image failures, horizontal overflow and footer reachability.
- Axe automated WCAG 2 A/AA and WCAG 2.1 AA checks on all nine initial route states.
- Phone layout with 200% root text scaling on home, menu, story, reservations and order.
- Reduced motion: no hero transform choreography, non-sticky timeline cards, repeated route navigation and carousel actions.
- Keyboard: mobile menu, carousel, dome/photo viewer and footer dialogs; native controls supply ordinary form keyboard operation.
- Regression history includes observed failures before fixes for basket row stability, enlarged-text overflow, singular guest summary, stale booking dates across midnight and gallery drag after an outside release.

Automated accessibility checks do not establish complete WCAG conformance. Safari, Firefox, physical touch devices, screen readers and real on-screen keyboards have not been verified here.

## Visual and contrast evidence

Direction: [DESIGN.md](../DESIGN.md), ENERGY 3 / RHYTHM 3 / MOTION 3. The supplied reference, not a new design direction, determines typography, photographs, fire colors and asymmetric composition. [Screenshots](screenshots/) use 1440×1000 and 390×844 viewports with reduced motion for stable inspection; [results.json](screenshots/results.json) records route/image/overflow results.

Computed with WCAG relative luminance, not visual estimates:

| Foreground/background | Ratio |
| --- | --- |
| Ash `#e8e6e3` / smoke `#0d0c0b` | 15.69:1 |
| Muted `#b2a89e` / smoke | 8.36:1 |
| Muted / charcoal `#181513` | 7.78:1 |
| Ink `#141110` / ember `#ff4d1a` | 5.66:1 |
| Ink / flame `#ffb347` | 10.55:1 |
| Light muted `#625a52` / ash | 5.43:1 |
| Input boundary `#8d8074` / charcoal | 4.74:1 |
| Inactive progress `#736871` / booking card `#1f1d22` | 3.14:1 |
| Date boundary `#8b7c70` / booking card | 4.15:1 |
| Ash `#ece9e4` / green bed `#3d4a33` | 7.79:1 |
| Ink / ash bed `#9a948c` | 6.25:1 |

The complete pixel-level results, including raw photograph and outline ratios for all 42 regions, are in [contrast-results.json](screenshots/contrast-results.json). The audit was repeated after moving Clash Display and General Sans to Fontshare's hosted CSS and still passes all 42 regions. The refreshed home and gallery captures were compared with the reference at matching viewports. Home title, food placement and CTA composition remain close to the source. The CSS 3D gallery reproduces the domed treatment with a different tile arrangement, plus explicit controls and a phone photo-list fallback; it is not a pixel-identical WebGL implementation.

A separate pixel audit captured glyph masks and text-free backgrounds after font/image decoding and paint barriers. It checked 42 text regions across the desktop/phone hero and all five timeline captions. Initially 41 passed; the desktop COALS title crossed the pale steak bone at 1.00:1 without a halo. A narrow 3px smoke outline now preserves that overlap while separating the lettering, with an ash/outline pair of 15.69:1. The rebuilt production rendering passes all 42 regions. Raw background ratios and outline ratios are retained separately, not conflated.

## Delivery gate

Overall status: PASS for the local Chromium-delivered prototype. The following is the delivery checklist, not an assertion of universal browser or accessibility conformance.

### Hard gate

| Rule | Result and evidence |
| --- | --- |
| R-02, punctuation | PASS: no em dash found in application source; documentation uses ordinary punctuation. |
| R-03, responsive layout | PASS for tested layouts: all nine routes reflow at five widths; 1440px also passed in isolation after the loading-wait failure. |
| R-17, numbers | PASS: menu prices, fire values and schedules come from the supplied sample-brand reference; they are not business claims. |
| R-18, testimonials | PASS: no fabricated reviews or testimonial avatars. |
| R-23, assets | PASS: only requested reference photos, cutouts and text wordmark are bundled. Instrument Serif is bundled under the OFL; Clash Display and General Sans load from Fontshare because their license prohibits repository redistribution. Source/license attribution is retained. |
| R-24, navigation | PASS: shared links, footer destinations, deep routes and missing-route recovery exercised in the browser inventory. |
| R-25, contrast | PASS: all 42 audited photo/gradient text regions meet their size threshold; desktop COALS has a 15.69:1 outline against the ash lettering while retaining the 1.00:1 raw photograph overlap as recorded data. |
| R-26, controls | PASS: browser inventory records carousel, gallery, basket, forms, map, dialogs and link actions. External protocol targets are inspected rather than invoked. |
| R-27, states | PASS: basket loading/empty/storage failure, photo fallback, gallery loading, map loading/retry, form validation and explicit local confirmations are implemented and exercised where applicable. Static local content has no invented network-loading states. |
| R-28, FAQ | PASS: no generic FAQ section. |
| R-32, keyboard | PASS in tested Chromium paths: named controls, visible focus, native dialog trapping, keyboard navigation and Escape/focus restoration. |
| R-33, source edits | PASS: UI lives in source components; the asset script only downloads binary/source-license assets. No external string-replacement feature patches. |
| R-34, themes | PASS: one intentional dark identity with authored light editorial sections; no incomplete theme toggle. |
| R-35, run and click through | PASS: production build, type checks, unit tests, 42 browser tests, 18 screenshot captures and the control-by-control inventory above. |
| R-36, claims | PASS: no invented security, compliance, customer or performance claims. Demo confirmations explicitly say nothing was submitted. |
| R-37, direction | PASS: supplied reference and approved design spec establish the visual direction and dials. |
| R-38, content honesty | PASS: fictional restaurant/story/event/location details are labeled prototype content; no live availability is implied. |

### Purpose gate

| Rule | Result and purpose |
| --- | --- |
| R-01, gradient | PASS: localized ember gradient reproduces the reference's fire atmosphere; no unrelated default palette. |
| R-04, icons | PASS: chevrons navigate/rotate, plus/minus changes quantity, and a labeled menu icon exposes navigation. |
| R-06, typography | PASS: Clash Display, General Sans and Instrument Serif match source hierarchy and character. |
| R-07, background | PASS: original smoke/cooking photographs, not an unrelated technical grid. |
| R-08, arrows | PASS: arrows are directional controls, not decoration attached to every CTA. |
| R-09, badges | PASS: basket count and fire-status dot express actual local application/time state; no marketing badge above the title. |
| R-10, glass | PASS: blur is confined to the fixed navigation; forms and dialogs use solid surfaces. |
| R-12, shadow | PASS: selective layering on the food cutout, timeline and transient basket notification; reasons recorded in DESIGN.md. |
| R-13, glow | PASS: no component-wide glowing borders, pulsing dots or repeated glow decorations. |
| R-14, cards | PASS: source-driven editorial panels, menu rows and task-specific forms instead of generic feature cards. |
| R-19, motion | PASS: hero introduction, chronological scroll emphasis and dish/gallery transitions have explicit purposes and reduced-motion alternatives. |
| R-22, illustration | PASS: source food/room/fire photographs relate directly to the prototype subject; no generic illustrations. |

### Liveliness

| Item | Result and evidence |
| --- | --- |
| Explicit dials | PASS: ENERGY 3 / RHYTHM 3 / MOTION 3 in DESIGN.md and the approved spec. |
| Dials reflected | PASS: monumental type, asymmetric light/dark editorial sections, layered food and scroll choreography. |
| Focal point | PASS: hero title/food, current dish, current gallery/photo or current form step dominates each composition. |
| Structural whitespace | PASS: broad editorial spacing compresses on phones; forms use tighter task-focused spacing. |
| Deliberate accent | PASS: ember/flame identity is tied to primary actions and fire content; per-bed colors identify the selected cooking state. |
| Identity motif | PASS: monumental sans type paired with warm italic serif and actual fire imagery. |
| Design read | PASS: audience, visual language and all three dials recorded before implementation in the approved spec. |

### Craftsmanship and quality locks

| Item | Result and evidence |
| --- | --- |
| C-1, intentionality | PASS: major color, type, spacing, motion, radius, icon and elevation reasons are recorded in DESIGN.md. |
| C-2, completeness | PASS: real controls have recorded local actions or real inspected link targets. |
| C-3, composition | PASS: sections follow the supplied restaurant narrative, not an added SaaS template. |
| C-4, resilience | PASS: empty/error/loading, five widths, reduced motion, keyboard paths and all review regressions are covered by the final suite. |
| C-5, evidence | PASS: source assets/content are attributed; prototype boundaries and verification limits are explicit. |
| R-05, structure | PASS: source hero, light editorial, stacked timeline, carousel, bed rows and gallery visibly vary. |
| R-11, radius | PASS: pill actions differ from small fields, rounded photographs and square editorial sections. |
| R-15, CTA | PASS: Book a table, See the menu, Add to order and other task-specific action labels. |
| R-16, copy | PASS: source-specific restaurant copy and factual demo notices, not generic AI-product claims. |
| R-20, identity | PASS: fire imagery, monumental type and cooking-bed states remain distinctive without the brand name. |
| R-21, fixed theme | PASS: smoke/ember and contrasting ash sections are reference identity, not an arbitrary tech-dark default. |
| R-29, palette | PASS: smoke/ash neutrals and ember/flame accents; secondary colors are selected-bed semantics. |
| R-30, reference use | PASS: this recreation was expressly requested; no unrelated product clone was introduced. |
| R-31, reasons | PASS: one-line reasons and the design read are preserved in DESIGN.md. |

## Review and regression fixes

One read-only fresh-context reviewer examined the whole workspace. It found no Critical issues and two Important issues; the touch-target item below was re-graded to Important:

- Reservation dates were initialized once, so a tab open across Johannesburg midnight could display a stale day and omit the new 30th day. The page now refreshes each minute and on visibility/focus, clears an invalid selection, returns to the date step and explains the change. A Playwright clock test reproduces midnight and asserts the updated date and recovery message.
- A gallery mouse press released outside the dome could leave drag active, causing later hover movement. Drag now ends on window pointer release/cancel/blur, ignores zero-button pointer moves and guards pointer capture. A real mouse regression test reproduces release above the dome and asserts later hover cannot change yaw.

Both tests failed against the prior implementation before the source changes and pass afterward. A third regression test measured the header home link at 29px, below the project's 44px minimum; the link now measures at least 44px at phone width. The final production browser suite passes all 42 tests.

## Deferred review minors

- Booking step changes and lightbox image changes are not separately announced to screen readers.
- Late-Sunday fire status does not name Tuesday as the next lit day.
- Inline email links could use a persistent visual affordance beyond their link semantics.
- Desktop Order and Book links do not expose `aria-current` on their own routes.
- Set-item quota failure, 200% scaling on gallery/contact, and route departure during an active animation have no dedicated tests.

The header wordmark was initially Minor but re-graded to Important because its 29px hit area violated the project's hard 44px touch-target requirement. It now has a 44px minimum target, verified at phone width.

These are recorded as non-blocking polish items, not silently treated as fixed.

## Publication and licensing

The source code and original documentation are released under the MIT License. The public repository is [edengilbertus/nine-coals-svelte](https://github.com/edengilbertus/nine-coals-svelte).

The licensing audit found that the ITF Free Font License prohibits redistributing Clash Display and General Sans font files through a repository. Those binaries are excluded from Git and the production build. The page loads them from Fontshare's hosted CSS API, which the license permits. Instrument Serif remains bundled under the SIL Open Font License. Photographs, food cutouts, fonts and map data are not relicensed by MIT; their separate terms are recorded in `ASSET-LICENSES.md` and `NOTICE.md`.

## Boundaries and implementation decisions

- No live order, reservation, payment or message submission exists. Personal form details remain transient; only dish IDs/quantities persist locally.
- Reference photographs and Instrument Serif are served locally. Clash Display and General Sans load from Fontshare's hosted CSS API because the ITF Free Font License prohibits redistributing those font files through a repository. OpenStreetMap tiles and Fontshare stylesheets are the runtime third-party dependencies; both receive the visitor's IP address, as stated in the privacy dialog.
- SvelteKit 3 configuration uses Vite plugin options, `$app/tsconfig` and `#lib` imports. Pinned dependencies and `bun.lock` are required; older SvelteKit configuration conventions do not apply.
- Shared basket state is a typed per-layout Svelte rune class instead of the plan's superseded store interface, avoiding cross-user server state.
- The project was initially delivered without Git history. The user later authorized publication as the public repository [edengilbertus/nine-coals-svelte](https://github.com/edengilbertus/nine-coals-svelte). No hosting deployment occurred.
- Browser evidence is limited to the installed Chromium engine because the current installer does not support macOS 13.
- The three requested Svelte skills are installed globally in `~/.agents/skills`; byte-identical leftover project-local files were removed. No feedback issue was published.
