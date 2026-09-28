/**
 * Generate themes/edge.json from the Edge palettes.
 *
 * Palettes come from https://github.com/sainnhe/edge (autoload/edge.vim). Syntax colors follow
 * https://github.com/sainnhe/edge-vscode, including its comment grey; the UI follows the Vim theme.
 * Run from anywhere with Node 22.18+:
 *
 *     node scripts/generate.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Appearance = "dark" | "light";

type Palette = Record<
  | "black"
  | "bg_dim"
  | "bg0"
  | "bg1"
  | "bg2"
  | "bg3"
  | "bg4"
  | "bg_grey"
  | "bg_red"
  | "bg_yellow"
  | "bg_green"
  | "bg_blue"
  | "bg_purple"
  | "filled_red"
  | "filled_green"
  | "filled_blue"
  | "filled_purple"
  | "fg"
  | "red"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "grey"
  | "grey_dim"
  | "comment"
  | "hint",
  string
>;

type ColorName = keyof Palette;

interface HighlightStyle {
  color: string;
  font_style?: "normal" | "italic" | "oblique";
  font_weight?: number;
}

const DARK_FG = { fg: "#c5cdd9", grey: "#758094", grey_dim: "#535c6a", hint: "#5e6673" };

const DARK_ACCENTS = {
  bg_red: "#55393d",
  bg_yellow: "#4e432f",
  bg_green: "#394634",
  bg_blue: "#354157",
  filled_red: "#ec7279",
  filled_green: "#a0c980",
  filled_blue: "#6cb6eb",
  filled_purple: "#d38aea",
  red: "#ec7279",
  yellow: "#deb974",
  green: "#a0c980",
  cyan: "#5dbbc1",
  blue: "#6cb6eb",
  purple: "#d38aea",
};

const PALETTES: Record<string, [Appearance, Palette]> = {
  "Edge Dark": [
    "dark",
    {
      ...DARK_ACCENTS,
      ...DARK_FG,
      black: "#202023",
      bg_dim: "#24262a",
      bg0: "#2c2e34",
      bg1: "#33353f",
      bg2: "#363944",
      bg3: "#3b3e48",
      bg4: "#414550",
      bg_grey: "#828a98",
      bg_purple: "#493c53",
      comment: "#7f8490",
    },
  ],
  "Edge Aura": [
    "dark",
    {
      ...DARK_ACCENTS,
      ...DARK_FG,
      black: "#202023",
      bg_dim: "#24262d",
      bg0: "#2b2d37",
      bg1: "#333644",
      bg2: "#363a49",
      bg3: "#3a3e4e",
      bg4: "#404455",
      bg_grey: "#7e869b",
      bg_purple: "#483b55",
      comment: "#7e8294",
    },
  ],
  "Edge Neon": [
    "dark",
    {
      ...DARK_ACCENTS,
      ...DARK_FG,
      black: "#202023",
      bg_dim: "#252630",
      bg0: "#2b2d3a",
      bg1: "#333648",
      bg2: "#363a4e",
      bg3: "#393e53",
      bg4: "#3f445b",
      bg_grey: "#7a819d",
      bg_purple: "#483b57",
      comment: "#7e8294",
    },
  ],
  "Edge Light": [
    "light",
    {
      black: "#dde2e7",
      bg_dim: "#e8ebf0",
      bg0: "#fafafa",
      bg1: "#eef1f4",
      bg2: "#e8ebf0",
      bg3: "#e8ebf0",
      bg4: "#dde2e7",
      bg_grey: "#bcc5cf",
      bg_red: "#f6e4e4",
      bg_yellow: "#f0ece2",
      bg_green: "#e5eee4",
      bg_blue: "#e3eaf6",
      bg_purple: "#f4e9f8",
      filled_red: "#e17373",
      filled_green: "#76af6f",
      filled_blue: "#6996e0",
      filled_purple: "#bf75d6",
      fg: "#4b505b",
      red: "#d05858",
      yellow: "#be7e05",
      green: "#608e32",
      cyan: "#3a8b84",
      blue: "#5079be",
      purple: "#b05ccc",
      grey: "#8790a0",
      grey_dim: "#bac3cb",
      hint: "#adb6c0",
      comment: "#8790a0",
    },
  ],
};

const alpha = (color: string, a: string) => color + a;

function syntax(p: Palette): Record<string, HighlightStyle> {
  const s = (color: string, extra: Omit<HighlightStyle, "color"> = {}): HighlightStyle => ({
    color,
    ...extra,
  });

  const italic = { font_style: "italic" } as const;
  const bold = { font_weight: 700 };
  // Colors and italics follow edge-vscode's TextMate scopes.
  return {
    attribute: s(p.yellow, italic),
    boolean: s(p.green, italic),
    comment: s(p.comment),
    "comment.doc": s(p.comment),
    constant: s(p.red),
    "constant.builtin": s(p.green, italic),
    constructor: s(p.blue),
    "diff.minus": s(p.red),
    "diff.plus": s(p.green),
    embedded: s(p.fg),
    emphasis: s(p.purple, italic),
    "emphasis.strong": s(p.yellow, bold),
    enum: s(p.yellow),
    function: s(p.blue),
    "function.builtin": s(p.cyan),
    // Macros: tree-sitter uses function.special, LSP semantic tokens use function.macro.
    "function.macro": s(p.cyan),
    "function.special": s(p.cyan),
    hint: s(p.hint),
    keyword: s(p.purple),
    label: s(p.fg),
    link_text: s(p.red),
    link_uri: s(p.fg),
    namespace: s(p.yellow),
    number: s(p.green),
    operator: s(p.purple),
    predictive: s(p.comment),
    preproc: s(p.purple),
    primary: s(p.fg),
    property: s(p.cyan),
    punctuation: s(p.fg),
    "punctuation.bracket": s(p.fg),
    "punctuation.delimiter": s(p.fg),
    "punctuation.list_marker": s(p.fg),
    "punctuation.markup": s(p.blue),
    "punctuation.special": s(p.yellow),
    selector: s(p.red),
    "selector.pseudo": s(p.yellow, italic),
    string: s(p.green),
    "string.escape": s(p.cyan),
    "string.regex": s(p.cyan),
    "string.special": s(p.cyan),
    "string.special.symbol": s(p.cyan),
    tag: s(p.red),
    "text.literal": s(p.fg),
    title: s(p.red),
    type: s(p.yellow),
    "type.builtin": s(p.yellow),
    variable: s(p.red),
    "variable.parameter": s(p.fg),
    "variable.special": s(p.red, italic),
    variant: s(p.cyan),
  };
}

function style(appearance: Appearance, p: Palette) {
  const dark = appearance === "dark";
  const border = dark ? p.black : p.bg4;
  const transparent = "#00000000";
  // Zed doesn't invert selected rows like Vim's PmenuSel, and the light bg steps repeat,
  // so interactive states are translucent overlays that read on any surface.
  const overlay = dark ? p.bg_grey : p.grey;
  const hover = alpha(overlay, "1f");
  const selected = alpha(overlay, "40");

  const players = [
    { cursor: p.blue, background: p.blue, selection: dark ? p.bg3 : p.bg4 },
    ...(["purple", "green", "yellow", "red", "cyan"] as const).map((c) => ({
      cursor: p[c],
      background: p[c],
      selection: alpha(p[c], "3d"),
    })),
  ];

  const status: Record<string, string> = {};
  const statusColors: [string, ColorName, ColorName][] = [
    ["error", "red", "bg_red"],
    ["warning", "yellow", "bg_yellow"],
    ["info", "blue", "bg_blue"],
    ["hint", "purple", "bg_purple"],
    ["success", "green", "bg_green"],
    ["created", "green", "bg_green"],
    ["modified", "blue", "bg_blue"],
    ["deleted", "red", "bg_red"],
    ["renamed", "cyan", "bg_blue"],
    ["conflict", "yellow", "bg_yellow"],
    ["predictive", "grey", "bg1"],
    ["hidden", "grey_dim", "bg1"],
    ["ignored", "grey_dim", "bg1"],
    ["unreachable", "grey", "bg1"],
  ];
  for (const [name, fg, bg] of statusColors) {
    status[name] = p[fg];
    status[`${name}.background`] = p[bg];
    status[`${name}.border`] = p[fg];
  }

  // Edge's terminal palette: black/white swap between backgrounds, brights match normals.
  const termBlack = dark ? p.bg3 : p.fg;
  const termWhite = dark ? p.fg : p.bg3;
  const terminal: Record<string, string> = {};
  const ansi: [string, string][] = [
    ["black", termBlack],
    ["red", p.red],
    ["green", p.green],
    ["yellow", p.yellow],
    ["blue", p.blue],
    ["magenta", p.purple],
    ["cyan", p.cyan],
    ["white", termWhite],
  ];
  for (const [name, color] of ansi) {
    terminal[`terminal.ansi.${name}`] = color;
    terminal[`terminal.ansi.bright_${name}`] = color;
    terminal[`terminal.ansi.dim_${name}`] = alpha(color, "b3");
  }
  terminal["terminal.ansi.bright_black"] = p.grey;

  return {
    accents: (["blue", "purple", "green", "yellow", "red", "cyan"] as const).map((c) => p[c]),
    "background.appearance": "opaque",

    // Edge keeps sidebars on the editor background and puts bars on bg1 (see its screenshots).
    background: p.bg1,
    "surface.background": p.bg0,
    "elevated_surface.background": dark ? p.bg2 : p.bg0,
    "drop_target.background": alpha(p.bg_grey, "40"),

    border: border,
    "border.variant": border,
    "border.focused": p.blue,
    "border.selected": p.blue,
    "border.transparent": transparent,
    "border.disabled": p.bg4,

    "element.background": p.bg1,
    "element.hover": hover,
    "element.active": selected,
    "element.selected": selected,
    "element.disabled": p.bg1,
    "ghost_element.background": transparent,
    "ghost_element.hover": hover,
    "ghost_element.active": selected,
    "ghost_element.selected": selected,
    "ghost_element.disabled": transparent,

    text: p.fg,
    "text.muted": p.grey,
    "text.placeholder": p.grey_dim,
    "text.disabled": p.grey_dim,
    "text.accent": p.blue,
    "link_text.hover": p.blue,

    icon: p.fg,
    "icon.muted": p.grey,
    "icon.disabled": p.grey_dim,
    "icon.placeholder": p.grey_dim,
    "icon.accent": p.blue,

    "title_bar.background": p.bg1,
    "title_bar.inactive_background": p.bg1,
    "toolbar.background": p.bg0,
    "status_bar.background": p.bg1,
    "tab_bar.background": p.bg1,
    "tab.inactive_background": p.bg1,
    "tab.active_background": p.bg0,
    "panel.background": p.bg0,
    "panel.focused_border": p.blue,
    "panel.indent_guide": p.bg4,
    "panel.indent_guide_active": p.bg_grey,
    "panel.indent_guide_hover": p.bg_grey,
    "pane.focused_border": p.blue,
    "pane_group.border": border,

    "scrollbar.thumb.background": alpha(p.bg_grey, "4d"),
    "scrollbar.thumb.hover_background": alpha(p.bg_grey, "80"),
    "scrollbar.thumb.border": transparent,
    "scrollbar.track.background": transparent,
    "scrollbar.track.border": transparent,

    "editor.background": p.bg0,
    "editor.foreground": p.fg,
    "editor.gutter.background": p.bg0,
    "editor.subheader.background": p.bg1,
    "editor.active_line.background": p.bg1,
    "editor.highlighted_line.background": p.bg1,
    "editor.line_number": p.grey_dim,
    "editor.active_line_number": p.grey,
    "editor.hover_line_number": p.grey,
    "editor.invisible": p.bg4,
    "editor.wrap_guide": p.bg1,
    "editor.active_wrap_guide": p.bg2,
    "editor.indent_guide": p.bg2,
    "editor.indent_guide_active": p.bg4,
    "editor.document_highlight.read_background": p.bg2,
    "editor.document_highlight.write_background": p.bg2,
    "editor.document_highlight.bracket_background": p.bg4,

    // Zed doesn't invert text over search matches, so use the soft backgrounds.
    "search.match_background": alpha(p.filled_green, "40"),
    "search.active_match_background": alpha(p.filled_blue, "59"),

    ...status,

    "version_control.added": p.green,
    "version_control.modified": p.blue,
    "version_control.deleted": p.red,
    "version_control.word_added": alpha(p.green, "33"),
    "version_control.word_deleted": alpha(p.red, "33"),
    "version_control.conflict_marker.ours": alpha(p.green, "33"),
    "version_control.conflict_marker.theirs": alpha(p.blue, "33"),

    "terminal.background": p.bg0,
    "terminal.ansi.background": p.bg0,
    "terminal.foreground": p.fg,
    "terminal.bright_foreground": p.fg,
    "terminal.dim_foreground": p.grey,
    ...terminal,

    players: players,
    syntax: syntax(p),
  };
}

const family = {
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: "Edge",
  author: "sainnhe (ported to Zed)",
  themes: Object.entries(PALETTES).map(([name, [appearance, p]]) => ({
    name,
    appearance,
    style: style(appearance, p),
  })),
};

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "themes", "edge.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(family, null, 2) + "\n");
console.log(`wrote ${out}`);
