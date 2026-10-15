# Testing notes — visual refresh

## Verified
- `index.html` parses and every ID is unique.
- All local `src`, `href`, CSS image, and font references resolve to files in this project.
- `js/main.js` passes `node --check`.
- Every original SVG illustration parses as XML.
- Desktop and mobile self-contained Chromium smoke tests reported no JavaScript or console errors.
- Tested theme change, accent palette cycle, journal filter, gallery open/next/close, visualizer toggle, quiet mode, and mobile menu open/close.
- No document-level horizontal overflow at 1440 px or 390 px in the browser smoke tests.
- Reduced-motion CSS is present, and the intro is bypassed when `prefers-reduced-motion: reduce` is active.

## Test environment note
The preview runner blocked direct navigation to local and loopback URLs. For browser interaction checks, the HTML, CSS, JavaScript, TTF fonts, and SVG files were inlined into a self-contained preview page. The project itself remains a standard static website with ordinary relative file references. Check it again in the intended browser, and perform a physical-phone and assistive-technology review before publication.

## Not implemented / expected static behaviour
- No remote server, live comment submissions, analytics, actual audio stream, or user accounts.
- The visualizer is an animated graphic only, not an audio player.
- Copying the current URL depends on clipboard permissions; the page shows a fallback message if copying is unavailable.
