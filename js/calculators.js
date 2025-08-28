// Rechner für medizinische Berechnungen
(function() {
  // Calculator links navigation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('calc-link')) {
      e.preventDefault();
      const calcType = e.target.dataset.calc;
      
      // Determine which module and tab to activate
      let targetModule = null;
      let targetTabQuery = null;
      let targetPane = null;
      
      // Sepsis calculators
      if (['fluid', 'map', 'lactate', 'ibw'].includes(calcType)) {
        targetModule = 'sepsis';
        targetTabQuery = '[data-tab="rechner"]';
        targetPane = 'rechner';
      }
      // Pneumonia calculators  
      else if (['crb65', 'curb65'].includes(calcType)) {
        targetModule = 'pneumonia';
        targetTabQuery = '[data-tab="rechner-pneu"]';
        targetPane = 'rechner-pneu';
      }
      
      if (targetModule && targetTabQuery && targetPane) {
        // First ensure we're in the correct module
        window.showModule(targetModule);
        
        // Then switch to the correct calculator tab within that module
        setTimeout(() => {
          const activeModule = document.getElementById(`${targetModule}-module`);
          if (activeModule) {
            const rechnerTab = activeModule.querySelector(targetTabQuery);
            const moduleSpecificTabs = activeModule.querySelectorAll('.tab');
            
            if (rechnerTab) {
              // Activate rechner tab within the specific module
              moduleSpecificTabs.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
              });
              rechnerTab.classList.add('active');
              rechnerTab.setAttribute('aria-selected', 'true');
              
              // Activate the correct pane
              Object.values(window.panes).forEach(p => p && p.classList.remove('active'));
              if (window.panes[targetPane]) {
                window.panes[targetPane].classList.add('active');
              }
              
              // Scroll to specific calculator
              setTimeout(() => {
                let targetElement = null;
                switch(calcType) {
                  case 'fluid':
                    targetElement = document.getElementById('kg');
                    break;
                  case 'map':
                    targetElement = document.getElementById('map');
                    break;
                  case 'lactate':
                    targetElement = document.getElementById('l0');
                    break;
                  case 'ibw':
                    targetElement = document.getElementById('sex');
                    break;
                  case 'crb65':
                    targetElement = document.getElementById('crb-confusion');
                    break;
                  case 'curb65':
                    targetElement = document.getElementById('curb-urea');
                    break;
                }
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  targetElement.focus();
                }
              }, 100);
            }
          }
        }, 100);
      }
    }
  });

  // Sepsis Calculators
  
  // Fluid 30 ml/kg
  const kg = document.getElementById('kg');
  const fluidOut = document.getElementById('fluid');
  const btnFluid = document.getElementById('btn-fluid');
  if (btnFluid) {
    btnFluid.addEventListener('click', () => {
      const w = parseFloat(kg.value || '0');
      const ml = Math.round(w * 30);
      fluidOut.textContent = isFinite(ml) ? ml : '–';
    });
  }

  // Lactate clearance
  const l0 = document.getElementById('l0');
  const l1 = document.getElementById('l1');
  const btnLac = document.getElementById('btn-lac');
  if (btnLac) {
    btnLac.addEventListener('click', () => {
      const a = parseFloat(l0.value || '0');
      const b = parseFloat(l1.value || '0');
      const delta = +(b - a).toFixed(2);
      const pct = a > 0 ? Math.round((a - b)/a * 100) : 0;
      document.getElementById('lac-delta').textContent = delta;
      document.getElementById('lac-pct').textContent = pct;
    });
  }

  // MAP delta
  const mapIn = document.getElementById('map');
  const btnMap = document.getElementById('btn-map');
  if (btnMap) {
    btnMap.addEventListener('click', () => {
      const cur = parseFloat(mapIn.value || '0');
      const d = Math.max(0, Math.round(65 - cur));
      document.getElementById('map-delta').textContent = d;
    });
  }

  // IBW & tidal volume (Devine formula; height in cm)
  const btnIbw = document.getElementById('btn-ibw');
  if (btnIbw) {
    btnIbw.addEventListener('click', () => {
      const sex = document.getElementById('sex').value;
      const cm = parseFloat(document.getElementById('cm').value || '0');
      if (!cm || cm < 120) {
        document.getElementById('ibw').textContent = '–';
        return;
      }
      const base = (sex === 'm') ? 50.0 : 45.5;
      const ibw = +(base + 0.9 * (cm - 152)).toFixed(1); // kg
      const vt6 = Math.round(6 * ibw);
      const vt4 = Math.round(4 * ibw);
      const vt8 = Math.round(8 * ibw);
      document.getElementById('ibw').textContent = ibw;
      document.getElementById('vt6').textContent = vt6;
      document.getElementById('vt48').textContent = vt4 + '–' + vt8;
    });
  }

  // Pneumonie Rechner
  
  // CRB-65 Score
  const btnCrb65 = document.getElementById('btn-crb65');
  if (btnCrb65) {
    btnCrb65.addEventListener('click', () => {
      let score = 0;
      if (document.getElementById('crb-confusion').checked) score++;
      if (document.getElementById('crb-respiratory').checked) score++;
      if (document.getElementById('crb-bloodpressure').checked) score++;
      if (document.getElementById('crb-age').checked) score++;
      
      document.getElementById('crb65-result').textContent = score;
      
      let recommendation = '';
      if (score === 0) {
        recommendation = 'Ambulante Behandlung möglich';
      } else if (score <= 2) {
        recommendation = 'Stationäre Behandlung erwägen';
      } else {
        recommendation = 'Intensivtherapie prüfen';
      }
      document.getElementById('crb65-recommendation').textContent = recommendation;
    });
  }

  // CURB-65 Score
  const btnCurb65 = document.getElementById('btn-curb65');
  if (btnCurb65) {
    btnCurb65.addEventListener('click', () => {
      let score = 0;
      const urea = parseFloat(document.getElementById('curb-urea').value || '0');
      if (urea > 42) score++; // > 42 mg/dl entspricht > 7 mmol/l
      if (document.getElementById('curb-confusion').checked) score++;
      if (document.getElementById('curb-respiratory').checked) score++;
      if (document.getElementById('curb-bloodpressure').checked) score++;
      if (document.getElementById('curb-age').checked) score++;
      
      document.getElementById('curb65-result').textContent = score;
      
      let mortality = '';
      if (score <= 1) {
        mortality = 'Mortalität: < 3%';
      } else if (score === 2) {
        mortality = 'Mortalität: ~9%';
      } else {
        mortality = 'Mortalität: 15-40%';
      }
      document.getElementById('curb65-mortality').textContent = mortality;
    });
  }
})();
