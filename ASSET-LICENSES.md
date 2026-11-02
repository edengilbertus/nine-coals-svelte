# Asset sources and licenses

This is a recreation of the user-supplied https://saastemp-zeta.vercel.app design prototype. Nine Coals is a sample brand, not a real restaurant. Reference photographs and cutouts are reused, not claimed as original work. The in-app `/credits` page preserves the source's named photographers and source links.

- Unsplash photographs: [Unsplash License](https://unsplash.com/license). Local crops/cutouts are derivatives supplied by the reference prototype; they do not represent Nine Coals itself.
- Bread cutout: derived from **Breads of Moskovskaya Oblast. img 006**, Dmitry Makeev, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), [source](https://commons.wikimedia.org/wiki/File:Breads_of_Moskovskaya_Oblast._img_006.jpg). The reference removes the background; this reused derivative remains under CC BY-SA 4.0.
- Potato cutout: **BakedPotatoWithButter**, Renee Comet, public domain, [source](https://commons.wikimedia.org/wiki/File:BakedPotatoWithButter.jpg).
- Clash Display and General Sans: Indian Type Foundry via [Fontshare](https://www.fontshare.com/), under the [ITF Free Font License](https://www.fontshare.com/licenses/itf-free-font-license). These font files are loaded at runtime from Fontshare's hosted CSS API and are not included in this repository. The ITF license prohibits redistributing the Font Software through a repository or other download service.
- Instrument Serif: Rodrigo Fuenzalida and Jordan Egstad, SIL Open Font License 1.1. The font file is bundled and the license is included in `static/fonts/instrument-serif-OFL.txt`.
- The map uses OpenStreetMap data and tiles. Visible attribution is retained. [OpenStreetMap copyright](https://www.openstreetmap.org/copyright).

`bun run assets` re-fetches the reference photographs, the OFL Instrument Serif file and its license. It does not download or redistribute the Fontshare font software. It does not generate imagery or copy the source application's code.
