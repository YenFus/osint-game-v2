// Absolute URLs for bundled assets.
//
// `import.meta.env.BASE_URL` is "/osint-game-v2/" on the dev server but "./"
// in the artifact build (vite build --base=./). A relative url() is fine in an
// <img src> or an SVG <image href>, which resolve against the document — but
// NOT inside a CSS custom property. A custom property holding `url(./art/x.jpg)`
// is substituted textually into whatever stylesheet reads it, and Chrome then
// resolves it against THAT stylesheet's URL. The board CSS ships from
// /assets/, so `--cork` was fetching /assets/art/cork-surface.jpg and 404ing —
// on the artifact only, which is why the dev server never showed it.
//
// Resolving against document.baseURI here makes the value absolute before it
// ever reaches CSS, so it cannot be re-resolved.
export function assetUrl(relPath) {
  const base = import.meta.env.BASE_URL ?? '/'
  try {
    return new URL(`${base}${relPath}`, document.baseURI).href
  } catch {
    return `${base}${relPath}`
  }
}

/** The same thing wrapped for a CSS custom property. */
export function assetCssUrl(relPath) {
  return `url("${assetUrl(relPath)}")`
}
