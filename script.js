function convertColors() {
    const r = parseInt(document.getElementById('r').value) || 0;
    const g = parseInt(document.getElementById('g').value) || 0;
    const b = parseInt(document.getElementById('b').value) || 0;
    const mode = document.getElementById('cb-mode').value;
  
    const colorDisplay = document.getElementById('color-display');
    const convertedValues = document.getElementById('converted-values');
    const palette = document.getElementById('palette');
  
    // Apply selected color blind simulation (very basic)
    let displayColor = `rgb(${r}, ${g}, ${b})`;
    let simulated = { r, g, b };
  
    if (mode !== "normal") {
      simulated = simulateColorBlind(r, g, b, mode);
      displayColor = `rgb(${simulated.r}, ${simulated.g}, ${simulated.b})`;
    }
  
    colorDisplay.style.backgroundColor = displayColor;
  
    // Show converted values
    convertedValues.innerHTML = `
      <strong>RGB:</strong> ${r}, ${g}, ${b}<br />
      <strong>Simulated:</strong> ${simulated.r}, ${simulated.g}, ${simulated.b}<br />
      <strong>Hex:</strong> ${rgbToHex(simulated.r, simulated.g, simulated.b)}<br />
      <strong>HSV:</strong> ${rgbToHsvString(simulated.r, simulated.g, simulated.b)}<br />
      <strong>HSL:</strong> ${rgbToHslString(simulated.r, simulated.g, simulated.b)}
    `;
  
    // Generate palette
    palette.innerHTML = '';
    const variations = [
      { r: Math.min(r + 30, 255), g, b },
      { r, g: Math.min(g + 30, 255), b },
      { r, g, b: Math.min(b + 30, 255) },
      { r: Math.max(r - 30, 0), g, b },
      { r, g: Math.max(g - 30, 0), b },
      { r, g, b: Math.max(b - 30, 0) }
    ];
  
    variations.forEach(c => {
      const swatch = document.createElement('div');
      swatch.style.backgroundColor = `rgb(${c.r}, ${c.g}, ${c.b})`;
      palette.appendChild(swatch);
    });
  }
  
  function simulateColorBlind(r, g, b, mode) {
    // Simple approximation, not scientifically accurate
    switch (mode) {
      case "protanopia":
        return { r: 0.56667 * r + 0.43333 * g, g: g, b: b };
      case "deuteranopia":
        return { r: r, g: 0.55833 * g + 0.44167 * b, b: b };
      case "tritanopia":
        return { r: r, g: g, b: 0.95 * b + 0.05 * r };
      default:
        return { r, g, b };
    }
  }
  
  function rgbToHex(r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map(x => {
          const hex = Math.round(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }
  
  function rgbToHsvString(r, g, b) {
    let [h, s, v] = rgbToHsv(r, g, b);
    return `${h.toFixed(1)}°, ${s.toFixed(1)}%, ${v.toFixed(1)}%`;
  }
  
  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
  
    const d = max - min;
    s = max === 0 ? 0 : d / max;
  
    if (max === min) h = 0;
    else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return [h * 360, s * 100, v * 100];
  }
  
  function rgbToHslString(r, g, b) {
    let [h, s, l] = rgbToHsl(r, g, b);
    return `${h.toFixed(1)}°, ${s.toFixed(1)}%, ${l.toFixed(1)}%`;
  }
  
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return [h * 360, s * 100, l * 100];
  }
  