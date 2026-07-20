## ✨ About
CSS Gradient Generator is a **zero-dependency, fully static** visual CSS gradient builder that helps frontend developers and designers quickly create beautiful gradient backgrounds. No installation required — just open it in your browser, preview changes in real-time, and copy production-ready CSS code with one click.

The tool supports professional features including multi-layer stacking, multiple gradient types, draggable color stops, opacity controls, and background tiling configuration. It comes with 30+ hand-picked gradient presets, making it easy to create professional-grade gradient effects.

## 🚀 Live Demo
👉 Chinese: **[Try it now](https://2925112454.github.io/CSS-Gradient-Generator/zh/)**
👉 English: **[Try it now](https://2925112454.github.io/CSS-Gradient-Generator/en/)**

> 💡 Note: This tool runs entirely locally in your browser. No data is uploaded, ensuring your privacy.

## 🎯 Features
### Core Features
- ✅ **Four Gradient Types**: Linear gradient, repeating linear gradient, radial gradient, repeating radial gradient
- ✅ **Multi-Layer System**: Unlimited layer stacking with drag-and-drop reordering; right-click to copy/paste/delete
- ✅ **Color Stop Management**: Visually drag sliders to adjust stop positions; supports color picking and opacity adjustment
- ✅ **Real-Time Preview**: All changes take effect instantly — what you see is what you get
- ✅ **One-Click Copy**: Click the preview area or button to copy complete CSS code
- ✅ **Curated Presets**: 30+ beautiful built-in gradient presets, apply with one click
- ✅ **Tiling Configuration**: Custom `background-size` and `background-position` for easy checkerboard, stripe, and pattern creation

### UX Improvements
- 🌓 **Light/Dark Themes**: Toggle between dark and light mode with automatic preference saving
- 📱 **Responsive Design**: Perfectly adapts to desktop and mobile with touch support
- 🖱️ **Context Menus**: Right-click shortcuts for layers and color stops
- 💾 **Local Storage**: Theme settings are automatically saved locally
- ⚡ **Zero Dependencies**: Built with vanilla HTML/CSS/JavaScript — no framework dependencies
- 🌍 **Bilingual Support**: Available in both Chinese and English

## 📖 Usage Guide
### Basic Workflow
1. **Select Gradient Type**: Choose your desired gradient type (linear/radial/repeating) from the right-side control panel
2. **Adjust Gradient Parameters**:
   - Linear gradients: Adjust the angle (0°-360°)
   - Radial gradients: Set shape (circle/ellipse), size, and center position
3. **Manage Color Stops**:
   - Click "Add Color Stop" to add new color nodes
   - Drag sliders on the track to adjust stop positions
   - Click the color picker to change colors
   - Drag the opacity slider to adjust transparency
4. **Multi-Layer Stacking**: Click "Add Layer" to add more gradient layers; drag to reorder layers
5. **Apply Presets**: Click any gradient in the left preset panel to apply beautiful effects instantly
6. **Configure Tiling**: For repeating patterns, set background tile size and position
7. **Copy Code**: Click "Copy CSS Code" button or directly click the preview area to copy the generated CSS

### Right-Click Shortcuts
- **Layer Right-Click**: Duplicate layer, paste layer, delete layer
- **Color Stop Right-Click**: Duplicate stop, paste stop, delete stop

### Keyboard Shortcuts
- Click preview area: Quick copy CSS code

## 🔧 Feature Details
### Gradient Types Explained
| Type | Description | Use Cases |
|------|-------------|-----------|
| Linear Gradient `linear-gradient` | Colors transition along a straight line | Most general backgrounds, button gradients |
| Repeating Linear `repeating-linear-gradient` | Linear gradient repeated in tiles | Stripe patterns, progress bars, textured backgrounds |
| Radial Gradient `radial-gradient` | Colors radiate outward from a center point | Spotlight effects, circular glows, spheres |
| Repeating Radial `repeating-radial-gradient` | Radial gradient repeated in tiles | Concentric circle patterns, ripple effects, targets |

### Radial Gradient Parameters
- **Shape**: `circle` (perfect circle) / `ellipse` (elliptical)
- **Size Keywords**:
  - `closest-side`: Radius equals distance from center to nearest edge
  - `farthest-side`: Radius equals distance from center to farthest edge
  - `closest-corner`: Radius equals distance from center to nearest corner
  - `farthest-corner`: (Default) Radius equals distance from center to farthest corner
- **Center Point**: Adjust gradient center position using X% and Y%

### Generated CSS Code Examples
```css
/* Simple linear gradient */
background: linear-gradient(45deg, rgba(79,172,254,1) 0%, rgba(0,242,254,1) 100%);

/* Multi-layer stacked gradient */
background: radial-gradient(circle farthest-side at 100% 0%, rgba(15,215,255,0.7) 0%, rgba(0,0,0,0) 22%), 
            linear-gradient(227deg, rgba(97,77,255,1) 0%, rgba(76,0,255,1) 50%, rgba(212,0,255,1) 100%);

/* Checkerboard pattern with tiling */
background: linear-gradient(45deg, rgba(34,34,34,1) 25%, rgba(170,170,170,0) 25%, rgba(170,170,170,0) 75%, rgba(34,34,34,1) 75%), 
            linear-gradient(45deg, rgba(34,34,34,1) 25%, rgba(171,171,171,1) 25%, rgba(171,171,171,1) 75%, rgba(34,34,34,1) 75%);
background-size: 20px 20px;
background-position: 0 0, 10px 10px;
```

## 📁 Project Structure
```
csscolor/
├── zh/                     # Chinese version
│   ├── index.html         # Main page
│   ├── css/
│   │   ├── style.css      # Main stylesheet
│   │   ├── remixicon.css  # Icon library styles
│   │   └── remixicon.woff2 # Icon font
│   └── js/
│       ├── color.js       # Gradient preset data
│       ├── cssCode.js     # Core logic: gradient generation, interaction handling
│       ├── light.js       # Theme switching (light/dark mode)
│       └── message.js     # Toast notification component
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
- **Remix Icon**: Open-source icon library (bundled locally)

### Code Features
- Pure vanilla implementation — no build tools required; edit source and refresh to see changes
- Modular design with single-responsibility JS files
- Smart bracket parsing for correctly importing complex multi-layer gradients
- Compatible with both mouse and touch events, mobile-friendly
- Local storage for theme preferences with private mode fallback

## 🌐 Browser Compatibility
| Browser | Version Support |
|---------|-----------------|
| Chrome | ✅ 60+ |
| Firefox | ✅ 55+ |
| Safari | ✅ 12+ |
| Edge | ✅ 79+ |
| Mobile Browsers | ✅ iOS 12+, Android 8+ |

> 💡 Note: This tool uses modern CSS and JS features and does not support Internet Explorer.

## 🤝 Contributing
Areas where contributions are welcome:
- 🎨 Adding more beautiful gradient presets
- 🌍 Translations for other languages
- 🐛 Bug fixes and compatibility improvements
- ✨ New features (e.g., gradient export as image, CSS minification, additional color format support)
- 📝 Documentation improvements

## 📋 Changelog
### v1.0.0 (2026-7-20)
- 🎉 Initial release
- ✅ Support for four gradient types
- ✅ Multi-layer stacking with drag-and-drop reordering
- ✅ Visual draggable color stops
- ✅ 30+ built-in gradient presets
- ✅ Background tiling configuration
- ✅ Light/dark theme toggle
- ✅ Bilingual Chinese/English support
- ✅ Right-click context menus
- ✅ Mobile touch adaptation

## 📄 License
This project is open source under GPL 3.0. Free for personal and commercial use with attribution.

## 🙏 Acknowledgements
- [Remix Icon](https://remixicon.com/) - For the beautiful open-source icons
- All contributors and users for your support

---
If this tool helps you, please consider giving it a ⭐️ Star!
