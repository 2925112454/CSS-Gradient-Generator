## ✨ About
CSS Gradient Generator is a **zero-dependency, fully static** visual CSS gradient generation tool that helps frontend developers and designers quickly create beautiful gradient background effects. No installation required — simply open it in your browser, preview changes in real-time, and copy production-ready CSS code with one click.

The tool supports professional features including multi-layer stacking, multiple gradient types, draggable color stops, opacity control, and background tiling configuration. It comes with 30+ curated gradient presets, making it easy to create professional-grade gradient effects.

## 🚀 Live Demo
👉 Chinese: **[Try it now](https://2925112454.github.io/CSS-Gradient-Generator/zh/)**
👉 English: **[Try it now](https://2925112454.github.io/CSS-Gradient-Generator/en/)**

> 💡 Note: The tool runs entirely locally in your browser. No data is uploaded, protecting your privacy.

## 🎯 Features
### Core Features
- ✅ **Six Gradient Types**: Linear gradient, repeating linear gradient, radial gradient, repeating radial gradient, conic gradient, repeating conic gradient
- ✅ **Multi-Layer System**: Unlimited layer stacking with drag-and-drop reordering, right-click copy/paste/delete
- ✅ **Color Stop Management**: Visually drag to adjust color stop positions, with color picker and opacity controls
- ✅ **Real-Time Preview**: All adjustments take effect instantly — what you see is what you get
- ✅ **One-Click Copy**: Click the preview area or button to copy complete CSS code
- ✅ **Curated Presets**: 30+ built-in beautiful gradient presets, apply with one click
- ✅ **Tiling Configuration**: Custom `background-size` and `background-position` for easy creation of checkerboards, stripes, and other patterns
- ✅ **Text Gradient**: Freely switch between box gradient mode and text gradient mode (`background-clip: text;`)

### UX Improvements
- 🌓 **Light/Dark Theme**: Toggle between dark and light modes, with automatic preference persistence
- 📱 **Responsive Design**: Perfectly adapts to desktop and mobile, with touch support
- 🖱️ **Context Menu**: Right-click shortcuts for layers and color stops
- 💾 **Local Storage**: Theme settings are automatically saved locally
- ⚡ **Zero Dependencies**: Built with vanilla HTML/CSS/JavaScript, no framework dependencies
- 🌍 **Bilingual Support**: Available in both Chinese and English

## 📖 Usage Guide
### Basic Workflow
1. **Select Gradient Type**: Choose your desired gradient type from the right-side control panel (linear/radial/conic/repeating gradients)
2. **Adjust Gradient Parameters**:
   - Linear gradient: Adjust the gradient angle (0°-360°)
   - Radial gradient: Set shape (circle/ellipse), size, and center position
   - Conic gradient: Adjust starting angle (0°-360°) and center position
3. **Manage Color Stops**:
   - Click "Add Color Stop" to add new color nodes
   - Drag color stop sliders on the track to adjust positions
   - Click the color picker to modify colors
   - Drag the opacity slider to adjust color transparency
4. **Multi-Layer Stacking**: Click "New Layer" to add more gradient layers, drag to adjust layer order
5. **Apply Presets**: Click any gradient in the left preset panel to apply beautiful effects instantly
6. **Configure Tiling**: For repeating patterns, set background tile size and position
7. **Copy Code**: Click the "Copy CSS Code" button or directly click the preview area to copy the generated CSS code

### Right-Click Shortcuts
- **Layer Right-Click**: Copy layer, paste layer, delete layer
- **Color Stop Right-Click**: Copy color stop, paste color stop, delete color stop

### Keyboard Shortcuts
- Click the preview area on desktop: Quickly copy CSS code

## 🔧 Feature Details
### Gradient Type Reference
| Type | Description | Use Cases |
|------|-------------|-----------|
| Linear gradient `linear-gradient` | Colors transition along a straight line | Most general backgrounds, button gradients |
| Repeating linear `repeating-linear-gradient` | Tiled repeating linear gradient | Stripe patterns, progress bars, textured backgrounds |
| Radial gradient `radial-gradient` | Colors radiate outward from a center point | Spotlight effects, circular glows, spheres |
| Repeating radial `repeating-radial-gradient` | Tiled repeating radial gradient | Concentric circle patterns, ripple effects, bullseyes |
| Conic gradient `conic-gradient` | Colors rotate clockwise around a center | Pie charts, cones, spheres |
| Repeating conic `repeating-conic-gradient` | Tiled repeating conic gradient | Concentric circle patterns, ripple effects, bullseyes |

### Radial Gradient Parameters
- **Shape**: `circle` / `ellipse`
- **Size**:
  - `closest-side`: Radius is distance from center to nearest edge
  - `farthest-side`: Radius is distance from center to farthest edge
  - `closest-corner`: Radius is distance from center to nearest corner
  - `farthest-corner`: Default, radius is distance from center to farthest corner
- **Center Point**: Adjust gradient center position via X% and Y%

### Conic Gradient Parameters
- **Starting Angle**: 0°-360°
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
│       ├── light.js        # Theme switching (light/dark mode)
│       └── message.js      # Toast notification component
├── en/                     # English version (same structure as Chinese)
│   ├── index.html
│   ├── css/
│   └── js/
└── README.md               # Project documentation
```

## 🛠️ Tech Stack
- **HTML5**: Semantic markup
- **CSS3**: CSS variables, Flexbox, Grid, transitions
- **Vanilla JavaScript (ES6+)**: No framework dependencies
- **Remix Icon**: Open-source icon library (bundled locally)

### Code Highlights
- Pure vanilla implementation, no build tools required — modify source and refresh to see changes
- Modular design with single-responsibility JS files
- Smart bracket parsing for correct import of complex multi-layer gradients
- Compatible with mouse and touch events, mobile-friendly
- Local storage for theme persistence, with private mode fallback

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
Areas for contribution:
- 🎨 Add more beautiful gradient presets
- 🌐 Translations for other languages
- 🐛 Bug fixes and compatibility improvements
- ✨ New features (e.g., gradient export as image, CSS minification, more color format support)
- 📝 Documentation improvements

## 📋 Changelog
### v1.1.0 (2026-7-21)
- ✅ Expanded to six gradient types, added conic gradient and repeating conic gradient
- ✅ Added more presets
- ✅ Added text gradient support (free switching between box gradient and text gradient modes)
- ✅ Fixed known bugs and optimizations

### v1.0.0 (2026-7-20)
- 🎉 Initial release
- ✅ Support for four gradient types
- ✅ Multi-layer stacking and drag-and-drop reordering
- ✅ Visual drag adjustment for color stops
- ✅ 30+ built-in gradient presets
- ✅ Background tiling configuration
- ✅ Light/dark theme toggle
- ✅ Chinese-English bilingual support
- ✅ Right-click context menu
- ✅ Mobile touch adaptation

## 📄 License
This project is open-sourced under GPL-3.0. Free for personal and commercial use, with copyright notice retained.

## 🙏 Acknowledgements
- [Remix Icon](https://remixicon.com/) - For the beautiful open-source icons
- All contributors and users for your support

---
If this tool helps you, please consider giving it a ⭐️ Star!
