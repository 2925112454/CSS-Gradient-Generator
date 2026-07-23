## ✨ Project Introduction

CSS Gradient Generator is a **zero-dependency, pure static** CSS gradient visualization tool that helps front-end developers and designers quickly create beautiful gradient background effects. No software installation required — simply open it in your browser, preview effects in real time, and copy ready-to-use CSS code with one click.

The tool supports multi-layer stacking, multiple gradient types, color stop drag-and-drop adjustment, opacity control, background tiling configuration, and other professional features. With 30+ built-in curated gradient presets, you can easily create professional-grade gradient effects.

## 🚀 Live Demo

👉 Chinese: **[Click to Experience](https://2925112454.github.io/CSS-Gradient-Generator/zh/)**
👉 English: **[Click to Experience](https://2925112454.github.io/CSS-Gradient-Generator/en/)**

> 💡 Note: The tool runs entirely locally in your browser — no data is uploaded, protecting your privacy and security.

## 🎯 Features

### Core Features

- ✅ **Six Gradient Types**: Linear gradient, repeating linear gradient, radial gradient, repeating radial gradient, conic gradient, repeating conic gradient
- ✅ **Multi-Layer System**: Supports unlimited layer stacking, drag-and-drop reordering, right-click copy/paste/delete
- ✅ **Color Stop Management**: Visually drag to adjust color stop positions, with color picker and opacity adjustment
- ✅ **Real-Time Preview**: All adjustments take effect instantly — what you see is what you get
- ✅ **One-Click Copy**: Click the preview area or button to copy the complete CSS code
- ✅ **Curated Presets**: 30+ built-in beautiful gradient presets, apply with one click
- ✅ **Tiling Configuration**: Customize `background-size` and `background-position` to easily create checkerboard patterns, stripes, and more
- ✅ **Text Gradient**: Freely switch between box gradient mode and text gradient mode (`background-clip: text;`)
- ✅ **Preset Extension**: Dedicated CSS gradient preset page with customizable preset library, one-click CSS code copying, and seamless switching to the editor for secondary editing

### Experience Optimizations

- 🌓 **Light/Dark Theme**: Supports dark/light mode switching with automatic preference memory
- 📱 **Responsive Design**: Perfectly adapts to desktop and mobile devices, with touch support
- 🖱️ **Right-Click Menu**: Quick right-click operations for layers and color stops
- 💾 **Local Storage**: Theme settings are automatically saved locally
- ⚡ **Zero Dependencies**: Written in pure native HTML/CSS/JavaScript, no framework dependencies
- 🌍 **Bilingual Support**: Available in both Chinese and English versions

## 📖 Usage Guide

### Basic Workflow

1. **Select Gradient Type**: Choose your desired gradient type in the right control panel (linear/radial/conic/repeating)
2. **Adjust Gradient Parameters**:
   - Linear gradient: Adjust gradient angle (0°–360°)
   - Radial gradient: Set shape (circle/ellipse), size, and center position
   - Conic gradient: Adjust starting angle (0°–360°) and center position
3. **Manage Color Stops**:
   - Click "Add Color Stop" to add color nodes
   - Drag color stop sliders on the track to adjust positions
   - Click the color picker to modify colors
   - Drag the opacity slider to adjust color transparency
4. **Multi-Layer Stacking**: Click "Add Layer" to add more gradient layers, drag to adjust layer order
5. **Apply Presets**: Click any gradient in the left preset area to apply beautiful effects instantly
6. **Configure Tiling**: Fill in background tiling size and position for repeating patterns
7. **Copy Code**: Click the "Copy CSS Code" button or directly click the preview area to copy the generated CSS code

### Right-Click Shortcuts

- **Layer Right-Click**: Copy layer, paste layer, delete layer
- **Layer Drag**: Adjust layer order
- **Color Stop Right-Click**: Copy color stop, paste color stop, delete color stop
- **Mobile**: Long-press layers to drag and reorder; all right-click operations are replaced with double-click

### Keyboard Shortcuts

- PC: Click the preview area to quickly copy CSS code
- Mobile: Click and drag the preview box to adjust its position

## 🔧 Feature Details

### Gradient Types

| Type | Description | Use Cases |
|------|-------------|-----------|
| Linear Gradient `linear-gradient` | Colors transition along a straight line | Most common backgrounds, button gradients |
| Repeating Linear `repeating-linear-gradient` | Repeating tiled linear gradient | Stripe patterns, progress bars, textured backgrounds |
| Radial Gradient `radial-gradient` | Colors radiate outward from a center point | Spotlight effects, circular glows, spheres |
| Repeating Radial `repeating-radial-gradient` | Repeating tiled radial gradient | Concentric circle patterns, ripple effects, bullseye |
| Conic Gradient `conic-gradient` | Colors rotate clockwise around a point | Pie charts, cones, spheres |
| Repeating Conic `repeating-conic-gradient` | Repeating tiled conic gradient | Concentric circle patterns, ripple effects, bullseye |

### Radial Gradient Parameters

- **Shape**: `circle` / `ellipse`
- **Size**:
  - `closest-side`: Gradient radius reaches the nearest side from the center
  - `farthest-side`: Gradient radius reaches the farthest side from the center
  - `closest-corner`: Gradient radius reaches the nearest corner from the center
  - `farthest-corner`: Default value — gradient radius reaches the farthest corner from the center
- **Center Point**: Adjust gradient center position via X% and Y%

### Conic Gradient Parameters

- **Starting Angle**: 0°–360°
- **Center Point**: Adjust gradient center position via X% and Y%

### Generated CSS Code Examples

```css
/* Simple linear gradient */
background: linear-gradient(45deg, rgba(79,172,254,1) 0%, rgba(0,242,254,1) 100%);

/* Multi-layer stacked gradient */
background: radial-gradient(circle farthest-side at 100% 0%, rgba(15,215,255,0.7) 0%, rgba(0,0,0,0) 22%), 
            linear-gradient(227deg, rgba(97,77,255,1) 0%, rgba(76,0,255,1) 50%, rgba(212,0,255,1) 100%);

/* Checkerboard pattern with tiling configuration */
background: linear-gradient(45deg, rgba(34,34,34,1) 25%, rgba(170,170,170,0) 25%, rgba(170,170,170,0) 75%, rgba(34,34,34,1) 75%), 
            linear-gradient(45deg, rgba(34,34,34,1) 25%, rgba(171,171,171,1) 25%, rgba(171,171,171,1) 75%, rgba(34,34,34,1) 75%);
background-size: 20px 20px;
background-position: 0 0, 10px 10px;
```

### Preset Extension Page

- **Features**:
  - One-click copy of preset CSS code
  - One-click edit button for seamless switching to the editor for secondary editing
  - Support for setting categories and preset names
  - Filter by configured categories

## 📁 Project Structure

```
../
├── zh/                          # Chinese version
│   ├── index.html               # Main page (gradient editor)
│   ├── color.html               # Preset extension page
│   ├── css/
│   │   ├── style.css            # Main stylesheet
│   │   ├── remixicon.css        # Icon library styles
│   │   └── remixicon.woff2      # Icon font
│   └── js/
│       ├── color.js             # Gradient preset data for main page
│       ├── colors.js            # Core logic: preset extension page copying, seamless switching to editor
│       ├── loadGradientData.js  # Gradient preset data for preset extension page
│       ├── cssCode.js           # Core logic: gradient generation, interaction handling
│       ├── light.js             # Theme switching (dark/light mode)
│       └── message.js           # Message toast component
├── en/                          # English version (same structure as Chinese)
│   ├── index.html
│   ├── css/
│   └── js/
├── index.html                   # Temporary language redirect page (for Github Pages, can be removed)
├── README.zh-CN.md              # Project documentation (Chinese)
└── README.md                    # Project documentation (English)
```

## 🛠️ Tech Stack

- **HTML5**: Semantic tags
- **CSS3**: CSS variables, Flexbox, Grid, transition animations
- **Native JavaScript (ES6+)**: No framework dependencies
- **Remix Icon**: Open-source icon library (bundled locally)

### Code Highlights

- Pure native implementation — no build tools required, modify source and refresh to see changes
- Modular design — each JS file has a single responsibility
- Smart bracket parsing for correct handling of complex multi-layer gradient imports
- Compatible with mouse and touch events, mobile-friendly
- Local storage for theme settings, with private mode fallback

## 🌐 Browser Compatibility

| Browser | Version Support |
|---------|-----------------|
| Chrome | ✅ 60+ |
| Firefox | ✅ 55+ |
| Safari | ✅ 12+ |
| Edge | ✅ 79+ |
| Mobile Browsers | ✅ iOS 12+, Android 8+ |

> 💡 Note: The tool uses modern CSS and JS features and does not support Internet Explorer.

### How to Contribute

- 🎨 Add more beautiful gradient presets
- 🌍 Translations for other languages
- 🐛 Fix bugs and compatibility issues
- ✨ Add new features (e.g., export gradient as image, CSS code minification, more color format support)
- 📝 Improve documentation

## 📋 Changelog

### v2.0.0 (2026-07-23)
- ✅ Added dedicated preset page `color.html` to support more presets, with seamless switching to the editor for secondary editing and one-click preset code copying (presets on the extension page and editor page are independent of each other)

### v1.1.0 (2026-07-21)
- ✅ Expanded to six gradient types, added conic gradient and repeating conic gradient
- ✅ Added more presets
- ✅ Added text gradient support (free switching between box gradient and text gradient modes)
- ✅ Fixed several known bugs

### v1.0.0 (2026-07-20)
- 🎉 Initial release
- ✅ Supports four gradient types
- ✅ Multi-layer stacking and drag-and-drop reordering
- ✅ Visual color stop drag-and-drop adjustment
- ✅ 30+ built-in gradient presets
- ✅ Background tiling configuration
- ✅ Light/dark theme switching
- ✅ Chinese/English bilingual support
- ✅ Right-click context menu
- ✅ Mobile touch adaptation

## 📄 License

This project is open-source under GPL 3.0. It can be freely used in personal and commercial projects, provided that the copyright notice is retained.

## 🙏 Acknowledgments

- [Remix Icon](https://remixicon.com/) — Beautiful open-source icons
- All contributors and users for their support

---

If this tool has been helpful to you, please give it a ⭐️ Star to show your support!