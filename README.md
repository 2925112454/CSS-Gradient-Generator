## ✨ About

CSS Gradient Generator is a **zero-dependency, fully static** visual CSS gradient generation tool that helps frontend developers and designers quickly create beautiful gradient background effects. No installation required — just open it in your browser, preview effects in real-time, and copy production-ready CSS code with one click.

The tool supports professional features including multi-layer stacking, multiple gradient types, draggable color stop adjustment, opacity control, and background tiling configuration. It comes with 30+ carefully crafted gradient presets, making it easy to create professional-grade gradient effects.

## 🚀 Live Demo

👉 Chinese: **[Try it now](https://2925112454.github.io/CSS-Gradient-Generator/zh/)**
👉 English: **[Try it now](https://2925112454.github.io/CSS-Gradient-Generator/en/)**

> 💡 Note: The tool runs entirely locally in your browser. No data is uploaded, protecting your privacy.

## 🎯 Features

### Core Features
- ✅ **Six gradient types**: Linear gradient, repeating linear gradient, radial gradient, repeating radial gradient, conic gradient, repeating conic gradient
- ✅ **Multi-layer system**: Support for unlimited layer stacking, drag-and-drop reordering, right-click copy/paste/delete
- ✅ **Color stop management**: Visual drag-and-drop adjustment of color stop positions, with color picker and opacity controls
- ✅ **Real-time preview**: All changes take effect instantly — what you see is what you get
- ✅ **One-click copy**: Click the preview area or button to copy complete CSS code
- ✅ **Curated presets**: 30+ beautiful built-in gradient presets, apply with one click
- ✅ **Tiling configuration**: Custom `background-size` and `background-position` support for easily creating checkerboards, stripes, and other patterns
- ✅ **Text gradient**: Freely switch between box gradient mode and text gradient mode (`background-clip: text;`)

### Experience Optimizations
- 🌓 **Light/Dark themes**: Toggle between dark and light mode, with automatic preference saving
- 📱 **Responsive design**: Perfectly adapts to desktop and mobile, with full touch support
- 🖱️ **Context menus**: Right-click shortcuts for layers and color stops
- 💾 **Local storage**: Theme settings are automatically saved locally
- ⚡ **Zero dependencies**: Built with vanilla HTML/CSS/JavaScript, no framework dependencies
- 🌍 **Bilingual support**: Available in both Chinese and English

## 📖 Usage Guide

### Basic Workflow
1. **Select gradient type**: Choose your desired gradient type (linear/radial/conic/repeating) from the control panel on the right
2. **Adjust gradient parameters**:
   - Linear gradient: Adjust the gradient angle (0°-360°)
   - Radial gradient: Set shape (circle/ellipse), size, and center point position
   - Conic gradient: Adjust starting angle (0°-360°) and center point position
3. **Manage color stops**:
   - Click "Add Color Stop" to add new color nodes
   - Drag color stop thumbs on the track to adjust positions
   - Click the color picker to change colors
   - Drag the opacity slider to adjust color transparency
4. **Multi-layer stacking**: Click "Add Layer" to add more gradient layers, drag to adjust layer order
5. **Apply presets**: Click any gradient in the preset panel on the left to apply beautiful effects instantly
6. **Configure tiling**: For repeating patterns, fill in background tile size and position
7. **Copy code**: Click the "Copy CSS Code" button or directly click the preview area to copy the generated CSS code

### Right-click Shortcuts
- **Layer right-click**: Copy layer, paste layer, delete layer
- **Layer drag**: Adjust layer order
- **Color stop right-click**: Copy color stop, paste color stop, delete color stop
- **Mobile**: Long press layers to drag and reorder; all right-click operations available on PC are implemented via double-tap on mobile

### Shortcuts
- Click preview area on PC: Quickly copy CSS code
- Click and drag preview area on mobile: Move the preview box to adjust its position

## 🔧 Feature Details

### Gradient Type Reference

| Type | Description | Use Cases |
|------|-------------|-----------|
| Linear gradient `linear-gradient` | Colors transition along a straight line | Most regular backgrounds, button gradients |
| Repeating linear `repeating-linear-gradient` | Linear gradient tiled repeatedly | Stripe patterns, progress bars, textured backgrounds |
| Radial gradient `radial-gradient` | Colors radiate outward from a center point | Spotlight effects, circular glows, spheres |
| Repeating radial `repeating-radial-gradient` | Radial gradient tiled repeatedly | Concentric circle patterns, ripple effects, bullseyes |
| Conic gradient `conic-gradient` | Colors rotate clockwise around a center | Pie charts, cones, spheres |
| Repeating conic `repeating-conic-gradient` | Conic gradient tiled repeatedly | Starburst patterns, checkerboards, circular designs |

### Radial Gradient Parameters
- **Shape**: `circle` (perfect circle) / `ellipse` (oval)
- **Size**:
  - `closest-side`: Radius extends to the closest edge from the center
  - `farthest-side`: Radius extends to the farthest edge from the center
  - `closest-corner`: Radius extends to the closest corner from the center
  - `farthest-corner`: Default, radius extends to the farthest corner from the center
- **Center point**: Adjust gradient center position via X% and Y%

### Conic Gradient Parameters
- **Starting angle**: 0°-360°
- **Center point**: Adjust gradient center position via X% and Y%

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

## 📁 Project Structure

```
../
├── zh/                     # Chinese version
│   ├── index.html          # Main page
│   ├── css/
│   │   ├── style.css       # Main stylesheet
│   │   ├── remixicon.css   # Icon library styles
│   │   └── remixicon.woff2 # Icon font
│   └── js/
│       ├── color.js        # Gradient preset data
│       ├── cssCode.js      # Core logic: gradient generation, interaction handling
│       ├── light.js        # Theme toggle (light/dark mode)
│       └── message.js      # Toast notification component
├── en/                     # English version (same structure as Chinese)
│   ├── index.html
│   ├── css/
│   └── js/
└── README.md               # Project documentation
```

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: CSS variables, Flexbox, Grid, transitions and animations
- **Vanilla JavaScript (ES6+)**: No framework dependencies
- **Remix Icon**: Open source icon library (bundled locally)

### Code Features
- Pure vanilla implementation, no build tools required — refresh to see changes after editing source
- Modular design, each JS file has a single responsibility
- Smart parenthesis parsing for correctly importing complex multi-layer gradients
- Compatible with both mouse and touch events, mobile-friendly
- Local storage for theme preferences with private mode fallback

## 🌐 Browser Compatibility

| Browser | Version Support |
|---------|-----------------|
| Chrome | ✅ 60+ |
| Firefox | ✅ 55+ |
| Safari | ✅ 12+ |
| Edge | ✅ 79+ |
| Mobile browsers | ✅ iOS 12+, Android 8+ |

> 💡 Note: This tool uses modern CSS and JS features and does not support Internet Explorer.

### Contribution Opportunities
- 🎨 Add more beautiful gradient presets
- 🌍 Translations for other languages
- 🐛 Bug fixes and compatibility improvements
- ✨ New features (e.g., gradient export as image, CSS minification, more color format support)
- 📝 Documentation improvements

## 📋 Changelog

### v1.1.0 (2026-7-21)
- ✅ Expanded to six gradient types, added conic gradient and repeating conic gradient
- ✅ Added more presets
- ✅ Added text gradient support (free switching between box gradient and text gradient modes)
- ✅ Fixed known bugs

### v1.0.0 (2026-7-20)
- 🎉 Initial release
- ✅ Support for four gradient types
- ✅ Multi-layer stacking and drag-and-drop reordering
- ✅ Visual drag-and-drop color stop adjustment
- ✅ 30+ built-in gradient presets
- ✅ Background tiling configuration
- ✅ Light/dark theme toggle
- ✅ Chinese/English bilingual support
- ✅ Right-click context menus
- ✅ Mobile touch adaptation

## 📄 License

This project is open source under GPLv3. You may freely use it for personal and commercial projects, as long as you retain the copyright notice.

## 🙏 Acknowledgements

- [Remix Icon](https://remixicon.com/) - For providing beautiful open source icons
- Thanks to all contributors and users for your support
---

If this tool helps you, please consider giving it a ⭐️ Star to show your support!
