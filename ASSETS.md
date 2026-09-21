# Generated background

Tool: built-in `image_gen__imagegen` (ImageGen), one generation.

Files: `public/assets/construction-background.png` (original), `public/assets/construction-background.webp` (optimized web copy).

Prompt:

> Use case: illustration-story. Asset type: original raster background illustration for a board-game website, clean artwork only. Create exactly one wide landscape image, approximately 1536x1024. Friendly, sophisticated hand-inked watercolor construction site in a modern European illustrated building board-game box style. Confident fine ink outlines, subtle textured paper, layered watercolor washes, warm inviting daylight, professional and not childish. Palette: dusty sky blue, parchment cream, terracotta bricks, mustard yellow. Composition: building scaffold with a couple of small workers and construction cranes concentrated on the far RIGHT. Distant soft blue city silhouettes only at the outer edges. A mustard hard hat, rolled architectural plans, and terracotta bricks form an attractive still life along the BOTTOM LEFT. The upper middle and center-left must have abundant uninterrupted pale cream negative space suitable for HTML text, with no dense objects or lines crossing this area. Illustration fades softly into pale cream through the middle. Absolutely no text, lettering, numbers, logos, watermarks, UI, borders, frames, or website mockup. Architectural plans can have subtle drawing lines but NO lettering. Only one finished original background illustration.

## Product image cleanup

File: `public/assets/game-clean.webp`. Input: `public/assets/game.webp`, extracted from the supplied rules PDF. Tool: built-in `image_gen__imagegen`, one edit. The unwanted rules paragraph above the components was removed. The result is visually similar but not pixel-identical: use an original standalone publisher image for exact product fidelity when available.

Edit brief: remove only the black paragraph/bulleted text in the empty top-left background, replacing it with matching plain beige background. Preserve the game box, exact box artwork/title, components, trucks, cards, board, scale and positions; no redesign.

## Logo background removal

Files: `public/assets/logo-transparent.webp` (used by the page) and
`public/assets/logo-transparent.png` (favicon + fallback). Input: `Logo.png`.
Script: `scripts/make-logo-transparent.cjs`, run with `node` and `sharp`.

The supplied logo is a crest on a solid near-black background. It is drawn with
near-black outlines too, so a colour-tolerance cutout removes the linework along
with the backdrop and leaves the mascots ragged. The script instead flood-fills
inward from the image border with a tight tolerance, which keeps the enclosed
pockets between the mascots, then erodes the resulting mask by a few pixels so
the black outlines are preserved. No pixels of the artwork itself are redrawn.

Re-run after replacing `Logo.png`:

```sh
npm install --no-save sharp
node scripts/make-logo-transparent.cjs
```
