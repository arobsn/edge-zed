# Edge color theme for Zed

A port of [Edge](https://github.com/sainnhe/edge) to the [Zed](https://zed.dev) editor.

<img width="1459" height="915" alt="Screenshot 2026-09-30 at 21 09 27" src="https://github.com/user-attachments/assets/7f485153-0491-4b5b-ab6d-89af11f41ae0" />


## Features

- Vivid colors.
- Designed to have a soft contrast for eye protection.
- `Dark`, `Aura`, `Neon`, and `Light` color variants.
- `Classic`, `Material`, and `Blur` UI style variants.

## Development

The files in `themes/` are generated from the Edge palettes. Edit `generate.ts`, then run it with Node 22.18+ (no build step needed):

```sh
node generate.ts
```

### Loading the theme

- **Dev extension:** in Zed run `zed: install dev extension` and select this directory.
- **Manual:** copy the files in `themes/` into `~/.config/zed/themes/`.

Then pick a variant with `theme selector: toggle`. If the theme fails to load, check `zed: open log`.

## Credits

- Palettes come from [Edge](https://github.com/sainnhe/edge).
- Syntax and UI mappings follow the official [VS Code port](https://github.com/sainnhe/edge-vscode).
- Material and blur styles follow [zed-everforest](https://github.com/albertsko/zed-everforest).

## License

Released under the [MIT](LICENSE).
