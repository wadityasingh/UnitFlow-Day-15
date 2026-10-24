/**
 * UnitFlow — Length & Weight Unit Converter (script.js)
 * Day 15 | Level 1 — Veda Technology Web Development Internship
 *
 * Conversion Architecture:
 * - Length uses Meter (m) as the common base unit.
 * - Weight uses Kilogram (kg) as the common base unit.
 * - Every calculation converts the source value into the base unit first,
 *   then divides by the target unit's base conversion factor.
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // 1. Unit Definitions & Base Conversion Factors
  // ---------------------------------------------------------------------------
  const UNIT_CATALOG = {
    length: {
      baseUnitLabel: "Meter (m)",
      defaultFrom: "m",
      defaultTo: "ft",
      units: {
        mm: { name: "Millimeter", plural: "Millimeters", symbol: "mm", toBase: 0.001 },
        cm: { name: "Centimeter", plural: "Centimeters", symbol: "cm", toBase: 0.01 },
        m: { name: "Meter", plural: "Meters", symbol: "m", toBase: 1 },
        km: { name: "Kilometer", plural: "Kilometers", symbol: "km", toBase: 1000 },
        in: { name: "Inch", plural: "Inches", symbol: "in", toBase: 0.0254 },
        ft: { name: "Foot", plural: "Feet", symbol: "ft", toBase: 0.3048 },
        yd: { name: "Yard", plural: "Yards", symbol: "yd", toBase: 0.9144 },
        mi: { name: "Mile", plural: "Miles", symbol: "mi", toBase: 1609.344 }
      }
    },
    weight: {
      baseUnitLabel: "Kilogram (kg)",
      defaultFrom: "kg",
      defaultTo: "lb",
      units: {
        mg: { name: "Milligram", plural: "Milligrams", symbol: "mg", toBase: 0.000001 },
        g: { name: "Gram", plural: "Grams", symbol: "g", toBase: 0.001 },
        kg: { name: "Kilogram", plural: "Kilograms", symbol: "kg", toBase: 1 },
        t: { name: "Metric tonne", plural: "Metric tonnes", symbol: "t", toBase: 1000 },
        oz: { name: "Ounce", plural: "Ounces", symbol: "oz", toBase: 0.028349523125 },
        lb: { name: "Pound", plural: "Pounds", symbol: "lb", toBase: 0.45359237 }
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 2. Application State
  // ---------------------------------------------------------------------------
  const state = {
    category: "length",
    copyTimeoutId: null
  };

  // ---------------------------------------------------------------------------
  // 3. DOM Element References
  // ---------------------------------------------------------------------------
  const elements = {
    form: document.getElementById("converter-form"),
    categoryTabs: document.querySelectorAll(".category-tab"),
    baseUnitBadge: document.getElementById("base-unit-badge"),
    amountInput: document.getElementById("amount-input"),
    inputUnitTag: document.getElementById("input-unit-tag"),
    validationMessage: document.getElementById("validation-message"),
    fromSelect: document.getElementById("from-unit"),
    toSelect: document.getElementById("to-unit"),
    swapBtn: document.getElementById("swap-btn"),
    resultValue: document.getElementById("result-value"),
    resultUnit: document.getElementById("result-unit"),
    conversionFormula: document.getElementById("conversion-formula"),
    copyBtn: document.getElementById("copy-btn"),
    resetBtn: document.getElementById("reset-btn"),
    copyFeedback: document.getElementById("copy-feedback")
  };

  // ---------------------------------------------------------------------------
  // 4. Pure Calculation & Formatting Functions
  // ---------------------------------------------------------------------------

  /**
   * Converts a numeric amount from one unit to another within a category
   * using the category's base unit (meters for length, kilograms for weight).
   */
  function convertValue(amount, categoryKey, fromUnitKey, toUnitKey) {
    const categoryData = UNIT_CATALOG[categoryKey];
    if (!categoryData) {
      return null;
    }

    const fromUnit = categoryData.units[fromUnitKey];
    const toUnit = categoryData.units[toUnitKey];
    if (!fromUnit || !toUnit) {
      return null;
    }

    if (fromUnitKey === toUnitKey) {
      return amount;
    }

    // Step 1: Convert input value to the base unit (meters or kilograms)
    const valueInBaseUnit = amount * fromUnit.toBase;

    // Step 2: Convert from the base unit into the target unit
    const convertedValue = valueInBaseUnit / toUnit.toBase;

    return convertedValue;
  }

  /**
   * Formats a numeric result for readable display without floating-point
   * artifacts or unnecessary trailing zeros.
   */
  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "0";
    }

    if (value === 0) {
      return "0";
    }

    const absValue = Math.abs(value);

    // Handle extremely small non-zero values so they don't round down to 0
    if (absValue > 0 && absValue < 0.0001) {
      return parseFloat(value.toFixed(10)).toString();
    }

    // Strip standard IEEE-754 floating-point noise first (e.g., 1.6093440000000001)
    const cleaned = Number(value.toPrecision(12));
    const cleanedString = cleaned.toString();
    const decimalPart = cleanedString.includes(".")
      ? cleanedString.split(".")[1]
      : "";

    // If the decimal terminates cleanly within 8 places (e.g. 1.609344 or 0.45359237), keep it exact
    if (!cleanedString.includes("e") && decimalPart.length <= 8) {
      return cleanedString;
    }

    // For non-terminating ratios (e.g. 1 m = 3.28084 ft, 1 kg = 2.20462 lb), round to 5 decimals
    return parseFloat(value.toFixed(5)).toString();
  }

  /**
   * Validates the raw string value from the amount input field.
   */
  function validateAmountInput(rawString) {
    const trimmed = rawString.trim();

    if (trimmed === "") {
      return {
        isValid: false,
        isEmpty: true,
        message: "Enter a numeric value above to calculate the conversion."
      };
    }

    const parsed = Number(trimmed);

    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      return {
        isValid: false,
        isEmpty: false,
        message: "Please enter a valid number."
      };
    }

    if (parsed < 0) {
      return {
        isValid: false,
        isEmpty: false,
        message: "Please enter a positive value (0 or greater). Length and weight cannot be negative."
      };
    }

    return {
      isValid: true,
      isEmpty: false,
      value: parsed,
      message: ""
    };
  }

  // ---------------------------------------------------------------------------
  // 5. DOM Rendering & UI Update Functions
  // ---------------------------------------------------------------------------

  /**
   * Populates the From and To dropdown menus for the selected category.
   */
  function populateUnitDropdowns(categoryKey) {
    const categoryData = UNIT_CATALOG[categoryKey];
    if (!categoryData) return;

    const unitEntries = Object.entries(categoryData.units);

    elements.fromSelect.innerHTML = "";
    elements.toSelect.innerHTML = "";

    unitEntries.forEach(function ([unitKey, unitInfo]) {
      const optionLabel = unitInfo.name + " (" + unitInfo.symbol + ")";

      const fromOption = document.createElement("option");
      fromOption.value = unitKey;
      fromOption.textContent = optionLabel;
      elements.fromSelect.appendChild(fromOption);

      const toOption = document.createElement("option");
      toOption.value = unitKey;
      toOption.textContent = optionLabel;
      elements.toSelect.appendChild(toOption);
    });

    elements.fromSelect.value = categoryData.defaultFrom;
    elements.toSelect.value = categoryData.defaultTo;
    elements.baseUnitBadge.textContent = "Base unit: " + categoryData.baseUnitLabel;
  }

  /**
   * Displays or hides the validation feedback message.
   */
  function renderValidationState(validation) {
    if (!validation.isValid && !validation.isEmpty) {
      elements.validationMessage.textContent = validation.message;
      elements.validationMessage.hidden = false;
      elements.amountInput.classList.add("input-error");
    } else {
      elements.validationMessage.textContent = "";
      elements.validationMessage.hidden = true;
      elements.amountInput.classList.remove("input-error");
    }
  }

  /**
   * Computes the current conversion and updates the live result section.
   */
  function updateConversionUI() {
    const categoryData = UNIT_CATALOG[state.category];
    const fromKey = elements.fromSelect.value;
    const toKey = elements.toSelect.value;
    const fromUnit = categoryData.units[fromKey];
    const toUnit = categoryData.units[toKey];

    if (!fromUnit || !toUnit) {
      return;
    }

    // Update the unit symbol inside the input box
    elements.inputUnitTag.textContent = fromUnit.symbol;

    const validation = validateAmountInput(elements.amountInput.value);
    renderValidationState(validation);

    // Handle empty or invalid input gracefully without NaN or undefined
    if (!validation.isValid) {
      elements.resultValue.textContent = "—";
      elements.resultValue.classList.add("result-muted");
      elements.resultUnit.textContent = toUnit.plural + " (" + toUnit.symbol + ")";
      elements.conversionFormula.textContent = validation.message;
      elements.copyBtn.disabled = true;
      return;
    }

    elements.resultValue.classList.remove("result-muted");
    elements.copyBtn.disabled = false;

    const rawConverted = convertValue(validation.value, state.category, fromKey, toKey);
    const formattedResult = formatNumber(rawConverted);

    // Choose singular or plural unit label
    const isSingular = Number(formattedResult) === 1;
    const targetUnitName = isSingular ? toUnit.name : toUnit.plural;

    elements.resultValue.textContent = formattedResult;
    elements.resultUnit.textContent = targetUnitName + " (" + toUnit.symbol + ")";

    // Display the unit-to-unit reference rate
    const unitRate = convertValue(1, state.category, fromKey, toKey);
    const formattedRate = formatNumber(unitRate);
    elements.conversionFormula.textContent =
      "1 " +
      fromUnit.name +
      " (" +
      fromUnit.symbol +
      ") = " +
      formattedRate +
      " " +
      toUnit.plural +
      " (" +
      toUnit.symbol +
      ")";
  }

  /**
   * Switches between Length and Weight categories.
   */
  function setCategory(newCategory) {
    if (!UNIT_CATALOG[newCategory] || state.category === newCategory) {
      return;
    }

    state.category = newCategory;

    elements.categoryTabs.forEach(function (tab) {
      const isSelected = tab.getAttribute("data-category") === newCategory;
      tab.classList.toggle("active", isSelected);
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    clearCopyConfirmation();
    populateUnitDropdowns(newCategory);
    updateConversionUI();
  }

  /**
   * Swaps the selected From and To units while keeping the entered value.
   */
  function handleSwapUnits() {
    const currentFrom = elements.fromSelect.value;
    const currentTo = elements.toSelect.value;

    elements.fromSelect.value = currentTo;
    elements.toSelect.value = currentFrom;

    clearCopyConfirmation();
    updateConversionUI();
  }

  /**
   * Resets the converter to default amount (1) and default unit selections.
   */
  function handleResetConverter() {
    const categoryData = UNIT_CATALOG[state.category];
    elements.amountInput.value = "1";
    elements.fromSelect.value = categoryData.defaultFrom;
    elements.toSelect.value = categoryData.defaultTo;

    clearCopyConfirmation();
    updateConversionUI();
  }

  /**
   * Clears any active copy confirmation message.
   */
  function clearCopyConfirmation() {
    if (state.copyTimeoutId) {
      clearTimeout(state.copyTimeoutId);
      state.copyTimeoutId = null;
    }
    elements.copyFeedback.textContent = "";
    elements.copyBtn.textContent = "Copy Result";
  }

  /**
   * Shows a temporary confirmation message after copying the result.
   */
  function showCopyConfirmation(message) {
    if (state.copyTimeoutId) {
      clearTimeout(state.copyTimeoutId);
    }

    elements.copyFeedback.textContent = message;
    elements.copyBtn.textContent = "Copied!";

    state.copyTimeoutId = setTimeout(function () {
      elements.copyFeedback.textContent = "";
      elements.copyBtn.textContent = "Copy Result";
      state.copyTimeoutId = null;
    }, 2200);
  }

  /**
   * Copies the calculated result and destination unit symbol to the clipboard,
   * with a fallback for environments where navigator.clipboard is restricted.
   */
  function handleCopyResult() {
    if (elements.copyBtn.disabled) {
      return;
    }

    const categoryData = UNIT_CATALOG[state.category];
    const toUnit = categoryData.units[elements.toSelect.value];
    const resultText = elements.resultValue.textContent + " " + toUnit.symbol;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard
        .writeText(resultText)
        .then(function () {
          showCopyConfirmation("Copied: " + resultText);
        })
        .catch(function () {
          fallbackCopyText(resultText);
        });
    } else {
      fallbackCopyText(resultText);
    }
  }

  /**
   * Fallback copy helper using a temporary off-screen textarea.
   */
  function fallbackCopyText(text) {
    try {
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = text;
      tempTextArea.setAttribute("readonly", "");
      tempTextArea.style.position = "fixed";
      tempTextArea.style.left = "-9999px";
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(tempTextArea);

      if (copied) {
        showCopyConfirmation("Copied: " + text);
      } else {
        showCopyConfirmation("Copy unavailable—select result manually");
      }
    } catch (_err) {
      showCopyConfirmation("Copy unavailable—select result manually");
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Event Listeners & Initialization
  // ---------------------------------------------------------------------------
  function bindEvents() {
    // Prevent form submission from reloading the page
    elements.form.addEventListener("submit", function (event) {
      event.preventDefault();
      updateConversionUI();
    });

    // Live conversion as user types or increments the numeric field
    elements.amountInput.addEventListener("input", function () {
      clearCopyConfirmation();
      updateConversionUI();
    });

    // Category tab switching
    elements.categoryTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const selectedCategory = tab.getAttribute("data-category");
        setCategory(selectedCategory);
      });
    });

    // Dropdown selection changes
    elements.fromSelect.addEventListener("change", function () {
      clearCopyConfirmation();
      updateConversionUI();
    });

    elements.toSelect.addEventListener("change", function () {
      clearCopyConfirmation();
      updateConversionUI();
    });

    // Swap, Reset, and Copy buttons
    elements.swapBtn.addEventListener("click", handleSwapUnits);
    elements.resetBtn.addEventListener("click", handleResetConverter);
    elements.copyBtn.addEventListener("click", handleCopyResult);
  }

  function init() {
    populateUnitDropdowns(state.category);
    bindEvents();
    updateConversionUI();
  }

  init();
})();
