# ESL Student Wireframes — Figma Plugin

This plugin recreates all 4 ESL Student wireframe screens as native Figma objects.

## Wireframes Included

| Frame | Name | Description |
|-------|------|-------------|
| A | Word Bank Homepage | Bento grid: sidebar, word entry card, practice buttons, word list, learning curve chart |
| B | Filtered View | Category-filtered view with word card, detail panel, and word list table |
| C | Practice Setup (Homepage) | Popup overlay with stepper, Step 1 pre-selected, at Step 2 |
| D | Practice Setup (Category) | Popup overlay with stepper, scope locked to category |

## How to Use

### Option 1: Import as Plugin (Recommended)

1. Open **Figma Desktop**
2. Go to **Plugins → Development → Import plugin from manifest...**
3. Select the `manifest.json` file from this folder
4. The plugin "ESL Student Wireframes" will appear under **Plugins → Development**
5. Click **Run** — it will create a new page with all 4 wireframes

### Option 2: Paste in Console

1. Open **Figma Desktop**
2. Open the dev console: **Plugins → Development → Open console**
3. Copy the entire contents of `code.js`
4. Paste into the console and press Enter

## Notes

- The plugin uses the **Inter** font family (Regular, Medium, Semi Bold, Bold, Extra Bold). Make sure it's available in your Figma account.
- All frames are created on a new page called "ESL Student — Wireframes"
- After running, the viewport auto-scrolls to show all wireframes
- Colors match the design tokens from the HTML wireframes
