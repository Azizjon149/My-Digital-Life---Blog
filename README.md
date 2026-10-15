# MY WORLD · BY AZIZJON

A responsive, English-language personal digital journal for the Grade 8 assignment “My Digital Life: A Personal Blog”. Built with standalone HTML, CSS, JavaScript, and original local SVG artwork. No framework, build step, backend, API key, remote image service, or third-party runtime is required.

## Open the website

1. Extract the `MY_WORLD_BY_AZIZJON` folder from the ZIP archive.
2. Open `index.html` in a modern browser.
3. Keep `assets/`, `css/`, and `js/` beside `index.html` so local paths continue to resolve.

If a browser restricts some features when opened from a local file, run a static server from this folder, for example `python -m http.server 8000`, and open `http://localhost:8000`.

## Design and interactions

- Cinematic, skippable opening scene with an option to replay it from the hero.
- Smooth light/dark theme switch in the top-right corner. The chosen theme is stored locally when browser storage is available.
- Four changeable accent palettes: coral, violet, aqua, and amber.
- Frosted-glass panels, blurred ambient light, moving decorative orbits, an animated ticker, scroll reveal, and cursor-following circular button highlights.
- Three journal cards with functioning mood filters and links to the full stories.
- Visual diary with four clickable frames, a lightbox, and previous/next controls.
- Rotating thoughts, small inspiration prompts, a visual-only music visualizer, interactive project tags, and a quiet/focus mode.
- Small keyboard easter egg: type `A`, `Z`, `I` in sequence. The footer also has a clickable secret.
- Reading progress, active navigation, back-to-top control, responsive mobile menu, keyboard-visible focus, skip-to-content, and reduced-motion support.
- Six original SVG illustrations stored locally; the site does not download images from a third-party server.

The “visual vibe” control animates the visualizer only; **it does not play sound**. The copy-link action copies the current URL when browser permissions allow it. The reader comments are static fictional examples, explicitly labelled as such; this is a static blog and has no comment backend.

## Typography

The four generated ASSAN TTF prototypes are included in `assets/fonts/`:

- `assan-signature/assan-signature.ttf`
- `assan-sans/assan-sans.ttf`
- `assan-editorial/assan-editorial.ttf`
- `assan-mono/assan-mono.ttf`

Their local `@font-face` declarations are in `css/styles.css`. The Signature and Mono faces supply selected accents and metadata; system serif/sans-serif stacks are used for long-form and large display copy to keep the text readable. Sans and Editorial are retained as available experimental faces for further tuning. These prototypes have limited glyph coverage, no complete kerning, and no true bold/italic/variable versions; unsupported glyphs fall back to system fonts. The original font specimen is included as `assets/images/assan-typography-specimen.png` for reference.

## Project structure

```text
MY_WORLD_BY_AZIZJON/
  index.html
  README.md
  preview-desktop.png
  preview-mobile.png
  css/styles.css
  js/main.js
  assets/
    fonts/assan-signature/assan-signature.ttf
    fonts/assan-sans/assan-sans.ttf
    fonts/assan-editorial/assan-editorial.ttf
    fonts/assan-mono/assan-mono.ttf
    images/assan-typography-specimen.png
    images/hero-landscape.svg
    images/morning.svg
    images/workspace.svg
    images/city-evening.svg
    images/music-waves.svg
    images/ideas-orbit.svg
  documentation/
    content.md
    rubric-checklist.md
    testing-notes.md
    testing-results.json
  preview/
    hero-desktop.png
    hero-mobile.png
    hero-light-desktop.png
    hero-light-mobile.png
```

## Content and school requirements

`documentation/content.md` contains the Assignment Version and Extended Version. The visible page keeps the three main stories concise and separate from About Me, interface labels, reader comments, and reflection. `documentation/rubric-checklist.md` tracks the requirements; it is a checklist, not a guaranteed grade.

## Verification notes

The HTML parses without duplicate IDs, all referenced local paths were checked, the JavaScript passes `node --check`, and every original SVG parses as XML. Browser smoke tests were run in headless Chromium using a self-contained preview with local CSS, JavaScript, font and image assets inlined. The tests exercised the theme and palette controls, journal filters, image viewer navigation, visualizer toggle, quiet mode, and mobile menu without JavaScript errors or viewport-level horizontal overflow at 390 px and 1440 px. Physical-device testing and assistive-technology review are still recommended.

## Editing

Edit content in `index.html`, visual rules in `css/styles.css`, and behaviour in `js/main.js`. All images and fonts are local assets, so they can be replaced without changing the rest of the site.


## Version 2.1 update
- Added a local `assets/images/` set of generated visual crops for the hero, morning, workspace, city, music, ideas, about, gaming, Ada Payment, Asepriid and fitness areas.
- Replaced the previous hand-drawn SVG scene illustrations in the page with image assets.
- Added a custom SVG pointer for desktop and a short animated `ASSAN × AZIJON` identity intro.
- All assets are local; no image API, remote server, or API key is required.

Note: these images were extracted from generated visual contact sheets available in this session, so they are compact artwork crops rather than individually regenerated full-resolution source images.


## v2.1 generated image collection

The individually generated user-provided images are stored in `assets/images/generated/`. They remain separate full-resolution files, not a contact sheet. The website uses these local assets for the hero, article cards, project visuals, and creative gallery. Original SVG UI assets and the existing custom cursor remain available.
