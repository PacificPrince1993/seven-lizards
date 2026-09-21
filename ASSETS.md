# Artwork

## Supplied illustrations

The publisher supplied six numbered PNGs. They are kept in `art-src/` and are
not served; `scripts/prepare-art.cjs` turns them into the named, web-sized
assets under `public/assets/`.

| Source | Asset | Used for |
| --- | --- | --- |
| `5.png` | `hero-city.webp` | Hero background. Cranes frame the left and right edges, leaving clear cream sky in the middle for the title. |
| `6.png` | `scene-builders.webp` | Hero foreground, bottom right (below the copy on phones). |
| `1.png` | `scene-helmet.webp` | Faint accent in the rules panel. |
| `2.png` | `scene-blueprints.webp` | Faint accent in the links panel. |
| `4.png` | `band-foundation.webp` | Full-bleed brick strip before the footer. It is pulled up behind the game-photo panel, so the panel rests on the foundation. |
| `3.png` | `logo-crest.png` / `.webp` | Brand crest. PNG is the favicon, the 560px webp is what the header loads. |

Re-run after replacing anything in `art-src/`:

```sh
npm install --no-save sharp
node scripts/prepare-art.cjs
```

### What the script does

**Un-premultiplying the edges (`despill`).** The PNGs already carry an alpha
channel, but they were cut from a dark glow backdrop, so roughly 70% of their
soft edge pixels are dark. Composited on the cream page that reads as a grey
halo. The script divides the colour of each partially transparent pixel by its
coverage, restoring the intended edge colour. Fully opaque and fully
transparent pixels are untouched, so no artwork is redrawn.

**Cropping the foundation strip (`trimTop`).** `4.png` carries about 230px of
empty sky above the bricks, which would open a visible gap before the footer.
The script finds the first row with real coverage and crops to it. The crop also
sets how far the band can be pulled up behind the game-photo panel: the overlap
is measured from the bricks, not from the empty sky that used to precede them.

## Product image cleanup

File: `public/assets/game-clean.webp`. Input: `public/assets/game.webp`,
extracted from the supplied rules PDF. Tool: built-in `image_gen__imagegen`,
one edit. The unwanted rules paragraph above the components was removed. The
result is visually similar but not pixel-identical: use an original standalone
publisher image for exact product fidelity when available.

Edit brief: remove only the black paragraph/bulleted text in the empty top-left
background, replacing it with matching plain beige background. Preserve the game
box, exact box artwork/title, components, trucks, cards, board, scale and
positions; no redesign.

## Display title

The reference shows the game name as hand-painted brick blocks. No web font
ships that, so the effect is built in CSS (`.title-line` in `src/styles.css`)
from three stacked copies of the word: a dark keyline, an extruded side wall
made of offset shadows, and a brick-gradient face clipped to the glyphs on top.

The face has to be a separate `::after` layer. A text-clipped background paints
at the bottom of its own stacking context, so putting the gradient on the
element itself would let the extrusion bury it. The `::after` also has to reset
`-webkit-text-stroke` and `text-shadow`, or it inherits the keyline and the
gradient is painted over.

The words come from `data-text`, which React keeps in sync with the language, so
the extrusion follows the Ukrainian and English titles alike.
