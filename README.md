# Edge for Zed

A port of [Edge](https://github.com/sainnhe/edge) by sainnhe to the [Zed](https://zed.dev) editor.

Variants: **Edge Dark**, **Edge Aura**, **Edge Neon** (dark) and **Edge Light**.

## Install

- **Dev extension:** in Zed run `zed: install dev extension` and select this directory.
- **Manual:** copy `themes/edge.json` into `~/.config/zed/themes/`.

Then pick a variant with `theme selector: toggle`. If the theme fails to load, check `zed: open log`.

## Development

`themes/edge.json` is generated from the Edge palettes. Edit `scripts/generate.ts`, then run it with Node 22.18+ (no build step needed):

```sh
node scripts/generate.ts
```

Syntax colors follow Edge's tree-sitter highlight groups with its default options (italic comments only).
