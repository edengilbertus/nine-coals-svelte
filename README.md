# Nine Coals

A Svelte recreation of [the supplied Nine Coals reference](https://saastemp-zeta.vercel.app), using the reference's photography, food cutouts and typography. Motion uses GSAP and ScrollTrigger.

Public repository: [github.com/edengilbertus/nine-coals-svelte](https://github.com/edengilbertus/nine-coals-svelte).

## Run

Use Bun 1.3 or newer and a Node version supported by SvelteKit 3 (22.17 or newer).

```sh
bun install --frozen-lockfile
bun run dev
```

Open **http://127.0.0.1:5179**. This project uses a dedicated strict port so it does not silently reuse another app's development server.

```sh
bun run build
bun run preview --port 4179 --strictPort
```

## Pages

Home, menu, story, gallery, events, contact, table reservations, pickup order and photo credits are separate SvelteKit routes. Deep links, category anchors and browser history work without a custom client-side router.

- The home page includes the layered smoke/steak hero, scroll-linked ribbon and editorial copy, sticky fire timeline, signature carousel and nine coal-bed links.
- The menu includes all 17 reference dishes and an 11-dish carousel with arrows, keyboard navigation and swipe support.
- The gallery uses CSS 3D transforms, pointer drag, rotation buttons, roving keyboard focus, a flat photo list and a native modal viewer.
- The basket persists locally, supports quantity changes/removal and handles unavailable or corrupt browser storage.
- Reservations use Johannesburg dates, exclude Mondays and validate each of four steps.
- Reduced-motion preferences disable scroll choreography and animated dish/gallery transitions.

## Demo limits

Nine Coals is a fictional sample brand. The reference's menu prices, owner story, events, address, telephone and email are prototype content, not verified business information.

Orders, bookings and contact messages are **local demonstrations**. They do not make an HTTP submission, charge a payment, send an email or reserve a real table. Entered personal details are not persisted. Only dish IDs and quantities are stored under `nine-coals-basket` in local storage.

The contact map requests OpenStreetMap tiles. Clash Display and General Sans load from Fontshare's hosted CSS API. If either service is unavailable, system fallback fonts, the address, external directions link and retry action remain usable. Using external directions, telephone or email links invokes those external services or applications.

## Checks

```sh
bun run check
bun run test:unit
bunx playwright install chromium
bun run test:e2e
bun run check:svelte
bun run build
```

Browser tests start their own server on port 5179. Stop an existing development server first, or deliberately use `REUSE_DEV_SERVER=1 bun run test:e2e` with this project's server already running.

To run the same suite against a running production preview, use `TEST_BASE_URL=http://127.0.0.1:4179 bun run test:e2e`.

The current Playwright browser installer does not support this machine's macOS 13. An existing Chromium executable was used here. To test with another installed compatible executable:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/absolute/path/to/chromium bun run test:e2e
```

This is Chromium verification, not a claim of Safari, Firefox or physical-device testing. Final evidence: 42/42 production browser tests, 16/16 unit tests, clean Svelte/TypeScript checks, a successful production build, 18/18 screenshot captures and a zero-issue Svelte autofixer scan. See [the verification report](docs/verification.md) for test results, interaction coverage and limitations.

`bun run check:svelte` runs the official Svelte MCP autofixer without editing source files. Optional file arguments limit it to selected components. `bun run screenshots` captures every route at desktop and phone widths into `docs/screenshots/` using the running development server; set `BASE_URL=http://127.0.0.1:4179` to target the production preview, and use the same browser-executable environment variable.

## Structure

- `src/routes/`: the nine public pages, shared layout and error page.
- `src/lib/components/`: visual sections, dialogs, map and navigation.
- `src/lib/cart.ts`, `booking.ts`: pure, unit-tested validation and arithmetic.
- `src/lib/cart.svelte.ts`, `cart-context.ts`: per-layout Svelte 5 state and typed context, not shared server state.
- `src/lib/motion.ts`: GSAP setup and reduced-motion-aware lifecycle cleanup.
- `static/`: locally served reference images and the OFL Instrument Serif font. Clash Display and General Sans are served by Fontshare.
- `tests/`: browser flows, accessibility and responsive checks.

SvelteKit 3 configuration lives in `vite.config.ts`. The application uses Svelte 5 runes, modern event attributes, snippets, attachments and `#lib` subpath imports.

## Assets and skills

Photo credits remain available at `/credits`. Font and derivative-image licensing is recorded in [ASSET-LICENSES.md](ASSET-LICENSES.md). `bun run assets` re-fetches the reference photographs, Instrument Serif and its license; it needs network access and does not generate new artwork. The Fontshare font files are intentionally not redistributed through this repository.

At the user's request, the official `svelte-code-writer`, `svelte-core-bestpractices` and `svelte-mcp-feedback` skills were installed globally in `~/.agents/skills`, which OpenCode discovers. Project-local copies were removed. No GitHub feedback issue was published.

## License

The source code and original documentation are available under the [MIT License](LICENSE). The repository is public at [edengilbertus/nine-coals-svelte](https://github.com/edengilbertus/nine-coals-svelte). Bundled photographs, food cutouts, the Instrument Serif font and referenced map data are not relicensed by MIT and retain the licenses recorded in [ASSET-LICENSES.md](ASSET-LICENSES.md) and [NOTICE.md](NOTICE.md). Clash Display and General Sans are loaded from Fontshare and are not distributed in this repository.

The repository is public. No hosting deployment was performed.
