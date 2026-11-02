# Nine Coals: Svelte recreation

## Intent and source

Recreate https://saastemp-zeta.vercel.app in Svelte, using GSAP for motion. The user supplied this reference and asked for a recreation, not a redesign. The workspace began empty and without Git history; the user later authorized public GitHub publication.

The reference is the visual and content specification. It is a fictional restaurant design prototype, not an operating restaurant. Preserve its sample-brand disclosure and photographic attribution. Do not imply that reference addresses, names, prices, events, or availability describe a real business.

## User decisions

- Svelte is required.
- GSAP is requested; other libraries may be used as needed.
- Match the supplied reference rather than introduce a different brand direction.
- Use the recommended visual-quality checks during development (the user's affirmative response to the recommended option).

## Proposed scope

Recreate all public reference destinations:

| Route | Content and interactions |
| --- | --- |
| `/` | Smoke-and-ember hero, oversized stacked NINE / COALS typography, original tomahawk cutout, local fire-status text, CTA links, scroll-responsive orange text ribbon, light editorial story section, five-panel sticky fire timeline, eleven-dish signature carousel, and links to the nine coal beds. |
| `/menu` | Signature carousel and the full seventeen-item menu, grouped into nine coal beds, with category anchor links, prices, descriptions, and working add-to-basket buttons. |
| `/story` | Light-background ONE FIRE. editorial opening, sourced quotation and owner attribution as fictional reference content, story copy, three photographic panels, reference fire numbers, and booking/menu links. |
| `/gallery` | A drag-rotatable, domed photographic arrangement resembling the reference, with click-to-open images, accessible gallery controls and a keyboard-operable lightbox. |
| `/events` | Four reference events, alternating/asymmetric photographic and textual compositions, each linking to bookings. |
| `/contact` | Address, opening hours, fire-status text, map and directions, telephone and email links, and a labeled contact demo form. |
| `/reservations` | Four stages: date, guest count, service time, and contact details. Back/next and step navigation retain values; validation blocks incomplete steps; a local-only confirmation names the chosen details. |
| `/order` | Empty basket, populated basket with quantity changes and removal, calculated totals, pickup/contact details, validation, and a local-only order confirmation. |
| `/credits` | Preserve the reference photographic credits and license/source links, with any additional original font/license credits. |

Shared responsive navigation and footer must work on every route, including refresh, deep links, browser back/forward, active navigation state and a missing-route state.

## Visual direction and reasons

Reading this as: an open-fire restaurant prototype for diners, in the reference's bold, smoky, editorial visual language, with ENERGY 3 / RHYTHM 3 / MOTION 3.

- Near-black `#0d0c0b`, charcoal `#181513`, ash `#e8e6e3`, ink `#141110`, ember orange `#ff4d1a` and flame amber `#ffb347` reproduce the reference fire identity.
- Secondary per-bed carousel colors are reference-derived semantic states, not extra permanent brand accents. Only the current dish/bed colors are active at a time.
- Clash Display creates the reference's compact, monumental headlines; General Sans carries readable UI/body copy; Instrument Serif italic supplies the reference's fire-related editorial accents.
- A full-height, layered smoke photograph and warm ember gradient recreate the actual hero, rather than substituting generated artwork.
- Large type, the original dish photography, varied dark/light sections and asymmetric whitespace reproduce the original hierarchy and pacing.
- Pill CTAs contrast with square editorial sections and selectively rounded photographs; not all surfaces are pills or cards.
- Sticky chronological photo panels communicate how the fire develops through the day. The carousel focuses one dish at a time. A three-dimensional gallery communicates the room and cooking atmosphere.
- Keep the reference's fixed dark identity instead of adding an unrelated theme toggle. The deliberately light story sections are part of that identity.

Reference implementation measurements: page margin `clamp(20px, 2.4vw, 36px)`, section gap `clamp(120px, 13vw, 220px)`, giant text `clamp(5rem, 17vw, 19rem)`, section headlines `clamp(2.5rem, 1.4rem + 4.4vw, 6rem)`.

## Motion and accessibility

- GSAP timelines animate the hero type and dish into place, matching the reference's introduction without leaving content hidden if motion fails.
- GSAP ScrollTrigger coordinates story emphasis, timeline stacking/scaling, photographic movement and the orange ribbon. Prefer scroll-linked movement over new endless decorative loops.
- Carousel navigation animates the image, heading, text and background as one state change; offer arrows, keyboard controls and touch swipe.
- Gallery drag supports pointer and touch, plus explicit keyboard-accessible rotation controls and a flat photo-list fallback. Clicks are distinguished from drags.
- GSAP contexts/listeners are cleaned up on route changes. `prefers-reduced-motion` disables scrubbed/pinned choreography and animated transitions while keeping all content and interactions.
- Use semantic navigation, buttons, links, headings, labels, live regions and native dialogs where appropriate. Modal focus is trapped and restored; Escape closes overlays.
- Minimum 44px interactive target sizes, visible focus rings, no page-level horizontal overflow, no inaccessible low-contrast small text.
- Match the reference at desktop, tablet and phone widths, with a true stacked mobile hero and mobile navigation, not a shrunk desktop layout. Test at 360, 390, 768, 1024 and 1440px.

## Data and application behavior

Builder decision proposed for approval: this is a front-end recreation with no restaurant backend, payment processing, email delivery or live reservation integration.

- Reference menu and content are static local data. Reference counts and prices are copied as prototype content, not invented metrics.
- Persist the basket locally and validate persisted item identifiers and quantities. Handle blocked/corrupt local storage without a crash.
- Reservation availability is generated locally for the next thirty days, excluding Mondays, using Johannesburg time. Label slots as demo availability, not real availability.
- Forms have field validation, in-progress feedback, success feedback and recoverable errors where work can fail. Do not create fake network failures or pretend to contact a restaurant.
- Contact, booking and order actions prominently disclose local/demo-only behavior before submission and in their confirmation. Do not collect payment/card details or transmit entered personal information.
- Telephone, email, map directions and photo-credit links are real protocol/external destinations reproduced from the prototype. The interface retains the sample-brand notice so these are not represented as verified business details.
- A map may use Leaflet/OpenStreetMap with attribution, provided failure/offline states retain readable address and external directions. Lazy-load it so it does not block the landing page.
- Footer Privacy, Terms and Cookies text may remain non-interactive as in the source, or open concise truthful prototype information dialogs. Never create links to nonexistent pages or invent restaurant legal policies.

## Assets and licensing

Reuse the publicly served reference photography and food cutouts for fidelity, keeping the source credits. No generated images, invented logos or avatars are necessary. Download and serve assets locally for predictable rendering where their source licenses permit it. Preserve CC BY-SA attribution for the credited Wikimedia assets and provide a notice identifying any locally reused derivatives. Instrument Serif is bundled under the SIL Open Font License. Clash Display and General Sans load from Fontshare's hosted CSS API because the ITF Free Font License prohibits redistributing their font files through this public repository. Do not claim proprietary ownership of reference assets.

Reference inspection screenshots are in `/private/var/folders/3j/lrh80v0n0j13dsljy1ygsv1m0000gn/T/opencode/nine-coals-reference/`.

## Technical choices left to the builder

- Use current stable SvelteKit, Svelte 5 and TypeScript, with conventional route/component/data separation and plain CSS design tokens.
- Use GSAP and ScrollTrigger directly in Svelte lifecycle code. A CSS 3D dome is preferred to a large WebGL dependency if it achieves the reference appearance and interactions.
- Choose minimal dependencies for the map, unit tests and browser testing. Avoid UI kits that change the reference appearance.
- Include build, type-check, unit-test and end-to-end-test commands, plus a short README with startup and demo limitations.
- Initial implementation scope excluded deployment, external account creation, real checkout, backend provisioning and live email sending. The user later separately authorized public GitHub publication. No hosting deployment is authorized.

## Acceptance evidence

- Production build and Svelte/TypeScript checks succeed.
- Unit tests cover menu grouping, price totals, quantity bounds, persistence validation, date/guest/time validation and reservation progression.
- Browser checks exercise every shared link, all routes, menu anchors, all carousel controls, add/remove/update basket, order form, all booking stages, contact form, gallery drag/lightbox/keyboard controls, mobile navigation, external link targets and error/missing-route behavior.
- Capture and compare desktop/mobile screenshots with the source, including hero placement, typography, colors and responsive composition. Check console and image failures.
- Verify narrow/intermediate/large breakpoints, reduced motion, keyboard-only use, 200% text scaling and computed contrast.
- Record an element-by-element interaction report and the antislop hard-gate, purpose-gate, liveliness and craftsmanship results in project documentation.

## Work tracker

- [x] Inspect the empty workspace and reference routes, source styling and screenshots.
- [x] Record user requirements, proposed scope, visual direction and builder decisions.
- [x] Run the builder check and resolve material gaps (subagent unavailable due to model-access denial; completed the same review inline, with no material questions beyond the demo-scope approval below).
- [x] Obtain user approval of this design/scope, especially front-end-only demo flows (user: "yes please").
- [x] Write the implementation plan after approval.
- [x] Implement and verify against the plan and reference. Final evidence is recorded in `docs/verification.md`.

## Approval status

Approved by the user on 2026-11-02, including all nine pages and front-end-only ordering, reservations and messaging demos.
