# UnitFlow — Length & Weight Unit Converter

> **Task:** Day 15 | Level 1  
> **Program:** Veda Technology Web Development Internship  
> **Tech Stack:** HTML5 · CSS3 · Vanilla JavaScript (No frameworks or external libraries)

UnitFlow is a clean, responsive, and accurate unit converter utility built for everyday engineering, scientific, and educational conversions. It supports standard metric and imperial units across **Length** and **Weight** categories with instant live calculation, input validation, and one-click clipboard copying.

---

## 🌟 Key Features

- **⚡ Real-Time Live Conversion**: Calculates and updates results instantly as you type without page reloads.
- **📏 Length & ⚖️ Weight Categories**:
  - **Length Units**: Millimeter (`mm`), Centimeter (`cm`), Meter (`m`), Kilometer (`km`), Inch (`in`), Foot (`ft`), Yard (`yd`), Mile (`mi`).
  - **Weight Units**: Milligram (`mg`), Gram (`g`), Kilogram (`kg`), Metric tonne (`t`), Ounce (`oz`), Pound (`lb`).
- **📐 Base-Unit Mathematical Architecture**:
  - Length uses **Meter (`m`)** as the standard base unit.
  - Weight uses **Kilogram (`kg`)** as the standard base unit.
  - Converts source unit $\rightarrow$ base unit $\rightarrow$ target unit for maximum precision without hardcoding pairs.
- **🔄 Instant Swap Button**: Reverses source (`From`) and destination (`To`) units with a single click while preserving your entered amount.
- **📋 Copy Result to Clipboard**: One-click copying with visual confirmation ("Copied!") and fallback support.
- **🛡️ Graceful Input Validation**:
  - Handles whole numbers and decimals.
  - Rejects negative values with friendly explanatory messages.
  - Handles empty and non-numeric inputs cleanly without displaying `NaN` or `undefined`.
- **🎨 Engineering Utility Design**:
  - High-contrast, clean typography (`tabular-nums` for numeric alignment).
  - Subtle color palette: Warm off-white (`#F7F6F2`), Deep Forest Green (`#285943`), Muted Orange (`#D97745`), and Soft Sage (`#E4E9E1`).
  - Pure CSS icons (two-arrow conversion icons) without external icon fonts or SVG dependencies.
- **📱 100% Responsive & Accessible**:
  - Fluid layout optimized for mobile phones, tablets, and desktop displays.
  - Accessible form labels, focus indicators (`:focus-visible`), and ARIA live regions for screen readers.

---

## 📁 Project Structure

This project strictly adheres to the standalone 3-file architecture:

```text
├── index.html        # Semantic HTML5 markup, accessible forms, and document structure
├── style.css         # Modern CSS3 styles, CSS variables, Flexbox & CSS Grid layouts
└── script.js         # Vanilla JavaScript: base-unit conversion logic, validation & event handlers
```

---

## 🧮 Conversion Factors & Math Logic

Every conversion utilizes a 2-step base-unit normalization:

$$\text{Value in Base} = \text{Input Amount} \times \text{Source Unit Factor}$$
$$\text{Final Result} = \frac{\text{Value in Base}}{\text{Target Unit Factor}}$$

### 1. Length (Base: Meter `m`)

| Unit | Symbol | Factor to Base (`m`) |
| :--- | :---: | :--- |
| Millimeter | `mm` | `0.001` |
| Centimeter | `cm` | `0.01` |
| Meter (Base) | `m` | `1.0` |
| Kilometer | `km` | `1000.0` |
| Inch | `in` | `0.0254` |
| Foot | `ft` | `0.3048` |
| Yard | `yd` | `0.9144` |
| Mile | `mi` | `1609.344` |

### 2. Weight (Base: Kilogram `kg`)

| Unit | Symbol | Factor to Base (`kg`) |
| :--- | :---: | :--- |
| Milligram | `mg` | `0.000001` (`1e-6`) |
| Gram | `g` | `0.001` |
| Kilogram (Base) | `kg` | `1.0` |
| Metric tonne | `t` | `1000.0` |
| Ounce | `oz` | `0.028349523125` |
| Pound | `lb` | `0.45359237` |

### Verified Test Examples

- `1 kilometer` = `1000 meters`
- `1 meter` ≈ `3.28084 feet`
- `1 mile` = `1.609344 kilometers`
- `1 kilogram` ≈ `2.20462 pounds`
- `1 pound` = `0.45359237 kilograms`
- `100 centimeters` = `1 meter`

---

## 🚀 How to Run the Project

### Option 1: Direct Browser Opening (No server needed)
1. Clone or download the repository.
2. Double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Live Server (VS Code)
1. Open the project folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: GitHub Pages Deployment
1. Push `index.html`, `style.css`, and `script.js` to your GitHub repository.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and `/ (root)`.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/`.

---

## 💻 Code Highlights

- **Pure Vanilla JavaScript**: Encapsulated in an IIFE to prevent global namespace pollution.
- **Separation of Concerns**: Pure conversion functions separate from DOM manipulation and event binding.
- **Smart Precision Handling**: Strips floating-point IEEE-754 noise (e.g. `1.6093440000000001` $\rightarrow$ `1.609344`) and rounds irrational ratios cleanly without trailing zero clutter.

---

## 📜 License & Credits

- Developed for **Veda Technology Web Development Internship — Day 15 (Level 1)**.
- Built using **HTML5, CSS3, and JavaScript**.
