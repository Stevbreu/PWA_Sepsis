// Navigation System für die PWA
(function() {
  const dashboard = document.getElementById('dashboard');
  const modules = {
    sepsis: document.getElementById('sepsis-module'),
    pneumonia: document.getElementById('pneumonia-module'),
    antibiotika: document.getElementById('antibiotika-module'), // Neue Antibiotika-Modul
  };
  const backBtn = document.getElementById('btn-back');
  const appTitle = document.getElementById('app-title');
  const appSubtitle = document.getElementById('app-subtitle');

  // Handle tile clicks
  document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const moduleId = tile.dataset.module;
      if (tile.classList.contains('disabled')) return;
      
      if (modules[moduleId]) {
        showModule(moduleId);
      }
    });
  });

  // Show specific module
  function showModule(moduleId) {
    dashboard.classList.remove('active');
    Object.values(modules).forEach(m => m && m.classList.remove('active'));
    if (modules[moduleId]) {
      modules[moduleId].classList.add('active');
    }
    backBtn.style.display = 'block';
    
    // Update header based on module
    switch(moduleId) {
      case 'sepsis':
        appTitle.textContent = 'AKH Celle · CODE SEPSIS';
        appSubtitle.textContent = 'S3‑Leitlinie 2025 (AWMF 079‑001) · QS‑Sepsis (G‑BA)';
        break;
      case 'pneumonia':
        appTitle.textContent = 'AKH Celle · Pneumonie';
        appSubtitle.textContent = 'Leitlinien für ambulant erworbene Pneumonie';
        break;
      case 'antibiotika':
        appTitle.textContent = 'AKH Celle · Antibiotikatherapie';
        appSubtitle.textContent = 'Antiinfektiva-Leitfaden für klinische Praxis';
        break;
      default:
        appTitle.textContent = 'AKH Celle · Medizinische Leitlinien';
        appSubtitle.textContent = 'Leitlinien & Rechner für den klinischen Alltag';
    }
  }

  // Back to dashboard
  backBtn.addEventListener('click', () => {
    Object.values(modules).forEach(m => m && m.classList.remove('active'));
    dashboard.classList.add('active');
    backBtn.style.display = 'none';
    appTitle.textContent = 'AKH Celle · Medizinische Leitlinien';
    appSubtitle.textContent = 'Leitlinien & Rechner für den klinischen Alltag';
  });

  // Make showModule globally available for calculator links
  window.showModule = showModule;
})();
// Tab-System für alle Module
(function() {
  // Main tabs within modules
  const tabs = document.querySelectorAll('.tab');
  const panes = {
    // Sepsis panes
    definition: document.getElementById('pane-definition'),
    screening: document.getElementById('pane-screening'),
    akut: document.getElementById('pane-akut'),
    therapie: document.getElementById('pane-therapie'),
    timeline: document.getElementById('pane-timeline'),
    rechner: document.getElementById('pane-rechner'),
    nachsorge: document.getElementById('pane-nachsorge'),
    // Pneumonie panes
    'definition-pneu': document.getElementById('pane-definition-pneu'),
    diagnostik: document.getElementById('pane-diagnostik'),
    risiko: document.getElementById('pane-risiko'),
    'therapie-pneu': document.getElementById('pane-therapie-pneu'),
    casemap: document.getElementById('pane-casemap'),
    'rechner-pneu': document.getElementById('pane-rechner-pneu'),
    verlauf: document.getElementById('pane-verlauf'),
    // Antibiotika panes
    'antibiotika-grundlagen': document.getElementById('pane-antibiotika-grundlagen'),
    'antibiotika-therapie': document.getElementById('pane-antibiotika-therapie'),
    'antibiotika-resistenzen': document.getElementById('pane-antibiotika-resistenzen'),
    'antibiotika-prophylaxe': document.getElementById('pane-antibiotika-prophylaxe'),
    'antibiotika-tdm': document.getElementById('pane-antibiotika-tdm'),
    'antibiotika-leitlinien': document.getElementById('pane-antibiotika-leitlinien'),
  };

  tabs.forEach(btn => btn.addEventListener('click', () => {
    // Find the parent module to only affect tabs within the same module
    const parentModule = btn.closest('.module');
    if (parentModule) {
      const moduleTabs = parentModule.querySelectorAll('.tab');
      moduleTabs.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
    } else {
      // Fallback to global tab handling if no parent module found
      tabs.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
    }
    
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    Object.values(panes).forEach(p => p && p.classList.remove('active'));
    if (panes[btn.dataset.tab]) {
      panes[btn.dataset.tab].classList.add('active');
    }
  }));

  // Sub-tabs for detailed therapy navigation
  const subTabs = document.querySelectorAll('.sub-tab');
  const subPanes = {
    haemo: document.getElementById('sub-haemo'),
    antibiotika: document.getElementById('sub-antibiotika'),
    beatmung: document.getElementById('sub-beatmung'),
    zusatz: document.getElementById('sub-zusatz'),
  };

  subTabs.forEach(btn => btn.addEventListener('click', () => {
    subTabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(subPanes).forEach(p => p && p.classList.remove('active'));
    if (subPanes[btn.dataset.subtab]) {
      subPanes[btn.dataset.subtab].classList.add('active');
    }
  }));

  // Timeline interaction
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      timelineItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Make panes accessible globally
  window.panes = panes;
})();
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
// Therapie-Navigator für strukturierte Antibiotika-Therapien
(function() {
  // Therapie-Hierarchie basierend auf Antiinfektiva-Leitfaden
  const therapyStructure = {
    'abdominal': {
      title: '1.1 Abdominalinfektionen',
      icon: '🏥',
      color: '#dc2626',
      subcategories: {
        'appendizitis': {
          title: '1.1.1 Akute Appendizitis',
          therapy: {
            'unkompliziert': {
              title: 'Unkomplizierte Appendizitis',
              antibiotics: [
                { name: 'Amoxicillin/Clavulansäure', dose: '2,2g 3x täglich i.v.', duration: '3-5 Tage' },
                { name: 'Cefuroxim + Metronidazol', dose: '1,5g 3x + 500mg 3x täglich i.v.', duration: '3-5 Tage' }
              ],
              alternatives: [
                { name: 'Ciprofloxacin + Metronidazol', dose: '400mg 2x + 500mg 3x täglich i.v.', note: 'Bei β-Laktam-Allergie' }
              ]
            },
            'kompliziert': {
              title: 'Komplizierte Appendizitis',
              antibiotics: [
                { name: 'Piperacillin/Tazobactam', dose: '4,5g 3x täglich i.v.', duration: '5-7 Tage' },
                { name: 'Meropenem', dose: '1g 3x täglich i.v.', duration: '5-7 Tage' }
              ],
              alternatives: [
                { name: 'Ciprofloxacin + Metronidazol', dose: '400mg 2x + 500mg 3x täglich i.v.', note: 'Bei β-Laktam-Allergie' }
              ]
            }
          }
        },
        'cholangitis': {
          title: '1.1.2 Akute Cholangitis',
          therapy: {
            'standard': {
              title: 'Standardtherapie',
              antibiotics: [
                { name: 'Piperacillin/Tazobactam', dose: '4,5g 3x täglich i.v.', duration: '7-10 Tage' },
                { name: 'Meropenem', dose: '1g 3x täglich i.v.', duration: '7-10 Tage' }
              ],
              alternatives: [
                { name: 'Ciprofloxacin', dose: '400mg 2x täglich i.v.', note: 'Bei leichteren Fällen' }
              ],
              notes: ['Frühe ERCP indiziert', 'Blutkulturen vor Therapie']
            }
          }
        },
        'peritonitis': {
          title: '1.1.3 Peritonitis',
          therapy: {
            'spontan': {
              title: 'Spontane bakterielle Peritonitis',
              antibiotics: [
                { name: 'Ceftriaxon', dose: '2g 1x täglich i.v.', duration: '5 Tage' },
                { name: 'Cefotaxim', dose: '2g 3x täglich i.v.', duration: '5 Tage' }
              ]
            },
            'sekundaer': {
              title: 'Sekundäre Peritonitis',
              antibiotics: [
                { name: 'Piperacillin/Tazobactam', dose: '4,5g 3x täglich i.v.', duration: '7-14 Tage' },
                { name: 'Meropenem', dose: '1g 3x täglich i.v.', duration: '7-14 Tage' }
              ],
              notes: ['Source Control essentiell', 'Individuell verlängern je nach Verlauf']
            }
          }
        }
      }
    },
    'respiratory': {
      title: '1.2 Atemwegsinfektionen',
      icon: '🫁',
      color: '#7c3aed',
      subcategories: {
        'cap': {
          title: '1.2.1 Ambulant erworbene Pneumonie',
          therapy: {
            'ambulant': {
              title: 'Ambulante Behandlung',
              antibiotics: [
                { name: 'Amoxicillin', dose: '1g 3x täglich p.o.', duration: '7 Tage' },
                { name: 'Amoxicillin/Clavulansäure', dose: '875/125mg 2x täglich p.o.', duration: '7 Tage' }
              ],
              alternatives: [
                { name: 'Azithromycin', dose: '500mg 1x täglich p.o.', duration: '3 Tage', note: 'Bei Allergie' }
              ]
            },
            'stationaer': {
              title: 'Stationäre Behandlung',
              antibiotics: [
                { name: 'Amoxicillin/Clavulansäure', dose: '2,2g 3x täglich i.v.', duration: '7-10 Tage' },
                { name: 'Cefuroxim', dose: '1,5g 3x täglich i.v.', duration: '7-10 Tage' }
              ],
              combination: [
                { name: 'Beta-Laktam + Makrolid', note: 'Bei schwerer CAP erwägen' }
              ]
            }
          }
        },
        'exazerbation': {
          title: '1.2.2 COPD-Exazerbation',
          therapy: {
            'standard': {
              title: 'Antibiotische Therapie',
              antibiotics: [
                { name: 'Amoxicillin/Clavulansäure', dose: '875/125mg 2x täglich p.o.', duration: '5-7 Tage' },
                { name: 'Azithromycin', dose: '500mg 1x täglich p.o.', duration: '3 Tage' }
              ],
              indications: ['Purulentes Sputum', 'Verstärkte Dyspnoe', 'Verschlechterung AZ']
            }
          }
        }
      }
    },
    'urinary': {
      title: '1.3 Harnwegsinfektionen',
      icon: '🫘',
      color: '#059669',
      subcategories: {
        'zystitis': {
          title: '1.3.1 Unkomplizierte Zystitis',
          therapy: {
            'erstlinie': {
              title: 'Erstlinientherapie',
              antibiotics: [
                { name: 'Fosfomycin', dose: '3g Einmaldosis p.o.', duration: '1 Tag' },
                { name: 'Nitrofurantoin', dose: '100mg 2x täglich p.o.', duration: '7 Tage' }
              ],
              alternatives: [
                { name: 'Trimethoprim/Sulfamethoxazol', dose: '160/800mg 2x täglich p.o.', duration: '3 Tage', note: 'Nur bei <20% Resistenz' }
              ]
            }
          }
        },
        'pyelonephritis': {
          title: '1.3.2 Akute Pyelonephritis',
          therapy: {
            'ambulant': {
              title: 'Ambulante Therapie',
              antibiotics: [
                { name: 'Ciprofloxacin', dose: '500mg 2x täglich p.o.', duration: '7-10 Tage' },
                { name: 'Levofloxacin', dose: '750mg 1x täglich p.o.', duration: '5 Tage' }
              ]
            },
            'stationaer': {
              title: 'Stationäre Therapie',
              antibiotics: [
                { name: 'Ceftriaxon', dose: '2g 1x täglich i.v.', duration: '10-14 Tage' },
                { name: 'Ciprofloxacin', dose: '400mg 2x täglich i.v.', duration: '7-10 Tage' }
              ],
              sequenz: 'Switch auf orale Therapie nach klinischer Besserung'
            }
          }
        }
      }
    },
    'skin': {
      title: '1.4 Haut- und Weichteilinfektionen',
      icon: '🩹',
      color: '#f59e0b',
      subcategories: {
        'zellulitis': {
          title: '1.4.1 Zellulitis/Erysipel',
          therapy: {
            'standard': {
              title: 'Standardtherapie',
              antibiotics: [
                { name: 'Penicillin V', dose: '1,5 MIE 3x täglich p.o.', duration: '7-10 Tage' },
                { name: 'Amoxicillin/Clavulansäure', dose: '875/125mg 2x täglich p.o.', duration: '7-10 Tage' }
              ],
              severe: [
                { name: 'Penicillin G', dose: '5 MIE 4x täglich i.v.', duration: '7-10 Tage' }
              ]
            }
          }
        },
        'abszess': {
          title: '1.4.2 Abszess',
          therapy: {
            'standard': {
              title: 'Nach Drainage',
              antibiotics: [
                { name: 'Clindamycin', dose: '600mg 3x täglich p.o./i.v.', duration: '7-10 Tage' },
                { name: 'Amoxicillin/Clavulansäure', dose: '875/125mg 2x täglich p.o.', duration: '7-10 Tage' }
              ],
              notes: ['Drainage ist Therapie der Wahl', 'Antibiotika adjuvant bei ausgedehntem Befund']
            }
          }
        }
      }
    }
  };

  // Therapie-Navigation UI erstellen
  function createTherapyNavigation() {
    const therapyTab = document.querySelector('[data-tab="antibiotika-therapie"]');
    if (!therapyTab) return;

    therapyTab.addEventListener('click', () => {
      setTimeout(() => {
        const therapyPane = document.getElementById('pane-antibiotika-therapie');
        if (therapyPane && !therapyPane.querySelector('.therapy-navigator')) {
          renderTherapyStructure(therapyPane);
        }
      }, 100);
    });
  }

  // Therapie-Struktur rendern
  function renderTherapyStructure(container) {
    const existingGrid = container.querySelector('.grid');
    if (existingGrid) {
      existingGrid.remove();
    }

    const navigatorHtml = `
      <div class="therapy-navigator">
        <div class="therapy-search">
          <input type="text" id="therapy-search" placeholder="🔍 Therapie suchen..." class="therapy-search-input">
        </div>
        
        <div class="therapy-categories">
          ${Object.entries(therapyStructure).map(([key, category]) => `
            <div class="therapy-category-card" data-category="${key}" style="border-left: 4px solid ${category.color}">
              <h3>${category.icon} ${category.title}</h3>
              <div class="therapy-subcategories" style="display:none;">
                ${Object.entries(category.subcategories).map(([subKey, subcategory]) => `
                  <div class="therapy-subcategory" data-subcategory="${subKey}">
                    <h4>${subcategory.title}</h4>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="therapy-detail" id="therapy-detail" style="display:none;">
          <!-- Detailansicht wird hier dynamisch geladen -->
        </div>
      </div>
    `;

    container.innerHTML = navigatorHtml;
    setupTherapyInteractions();
  }

  // Interaktionen einrichten
  function setupTherapyInteractions() {
    // Kategorie-Klicks
    document.querySelectorAll('.therapy-category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryKey = card.dataset.category;
        const subcategories = card.querySelector('.therapy-subcategories');
        
        // Toggle Subcategories
        if (subcategories.style.display === 'none') {
          // Alle anderen schließen
          document.querySelectorAll('.therapy-subcategories').forEach(sub => {
            sub.style.display = 'none';
          });
          subcategories.style.display = 'block';
        } else {
          subcategories.style.display = 'none';
        }
      });
    });

    // Subkategorie-Klicks
    document.querySelectorAll('.therapy-subcategory').forEach(subcard => {
      subcard.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryKey = subcard.closest('.therapy-category-card').dataset.category;
        const subcategoryKey = subcard.dataset.subcategory;
        
        showTherapyDetail(categoryKey, subcategoryKey);
      });
    });

    // Suchfunktion
    const searchInput = document.getElementById('therapy-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterTherapies(e.target.value);
      });
    }
  }

  // Therapie-Details anzeigen
  function showTherapyDetail(categoryKey, subcategoryKey) {
    const category = therapyStructure[categoryKey];
    const subcategory = category.subcategories[subcategoryKey];
    const detailContainer = document.getElementById('therapy-detail');

    let detailHtml = `
      <div class="therapy-detail-header">
        <button class="btn" id="back-to-categories">← Zurück zur Übersicht</button>
        <h2 style="color: ${category.color}">${category.icon} ${subcategory.title}</h2>
      </div>
      
      <div class="therapy-options">
        ${Object.entries(subcategory.therapy).map(([therapyKey, therapy]) => `
          <div class="card therapy-option">
            <h3>${therapy.title}</h3>
            
            ${therapy.antibiotics ? `
              <div class="antibiotic-group">
                <h4>🎯 Erstlinientherapie:</h4>
                ${therapy.antibiotics.map(ab => `
                  <div class="antibiotic-item">
                    <strong>${ab.name}</strong><br>
                    <span class="dose">Dosierung: ${ab.dose}</span><br>
                    <span class="duration">Dauer: ${ab.duration}</span>
                    ${ab.note ? `<br><span class="note-text">💡 ${ab.note}</span>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${therapy.alternatives ? `
              <div class="antibiotic-group">
                <h4>⚖️ Alternativen:</h4>
                ${therapy.alternatives.map(ab => `
                  <div class="antibiotic-item alternative">
                    <strong>${ab.name}</strong><br>
                    <span class="dose">Dosierung: ${ab.dose}</span><br>
                    ${ab.duration ? `<span class="duration">Dauer: ${ab.duration}</span><br>` : ''}
                    ${ab.note ? `<span class="note-text">💡 ${ab.note}</span>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${therapy.combination ? `
              <div class="antibiotic-group">
                <h4>🔗 Kombinationstherapie:</h4>
                ${therapy.combination.map(comb => `
                  <div class="antibiotic-item combination">
                    <strong>${comb.name}</strong><br>
                    ${comb.note ? `<span class="note-text">💡 ${comb.note}</span>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${therapy.notes ? `
              <div class="therapy-notes">
                <h4>📝 Wichtige Hinweise:</h4>
                <ul>
                  ${therapy.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${therapy.sequenz ? `
              <div class="badge badge-info">
                <span class="badge-icon">🔄</span>
                ${therapy.sequenz}
              </div>
            ` : ''}

            ${therapy.indications ? `
              <div class="therapy-indications">
                <h4>✅ Indikationen:</h4>
                <ul>
                  ${therapy.indications.map(ind => `<li>${ind}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;

    detailContainer.innerHTML = detailHtml;
    detailContainer.style.display = 'block';

    // Zurück-Button
    document.getElementById('back-to-categories').addEventListener('click', () => {
      detailContainer.style.display = 'none';
    });

    // Scroll to top
    detailContainer.scrollIntoView({ behavior: 'smooth' });
  }

  // Suchfunktion
  function filterTherapies(searchTerm) {
    const categories = document.querySelectorAll('.therapy-category-card');
    const term = searchTerm.toLowerCase();

    categories.forEach(category => {
      const categoryText = category.textContent.toLowerCase();
      const shouldShow = categoryText.includes(term);
      
      category.style.display = shouldShow ? 'block' : 'none';
    });
  }

  // CSS für Therapie-Navigator
  const therapyStyles = `
    .therapy-navigator {
      max-width: 100%;
    }

    .therapy-search {
      margin-bottom: 20px;
    }

    .therapy-search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid var(--border);
      border-radius: 10px;
      font-size: 14px;
      background: #fff;
    }

    .therapy-search-input:focus {
      outline: none;
      border-color: var(--antibiotika);
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
    }

    .therapy-categories {
      display: grid;
      gap: 16px;
      grid-template-columns: 1fr;
    }

    .therapy-category-card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .therapy-category-card:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .therapy-category-card h3 {
      margin: 0 0 10px;
      font-size: 18px;
      font-weight: 600;
    }

    .therapy-subcategories {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    .therapy-subcategory {
      padding: 8px 12px;
      margin: 4px 0;
      background: #f1f5f9;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .therapy-subcategory:hover {
      background: #e2e8f0;
      transform: translateX(4px);
    }

    .therapy-subcategory h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: var(--ink);
    }

    .therapy-detail-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--border);
    }

    .therapy-detail-header h2 {
      margin: 0;
      flex: 1;
    }

    .therapy-options {
      display: grid;
      gap: 20px;
      grid-template-columns: 1fr;
    }

    .therapy-option {
      border-left: 4px solid var(--antibiotika);
    }

    .antibiotic-group {
      margin: 16px 0;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .antibiotic-group h4 {
      margin: 0 0 12px;
      color: var(--antibiotika);
      font-size: 14px;
    }

    .antibiotic-item {
      padding: 10px;
      margin: 8px 0;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 6px;
    }

    .antibiotic-item.alternative {
      border-left: 3px solid var(--warn);
    }

    .antibiotic-item.combination {
      border-left: 3px solid var(--brand);
    }

    .dose {
      color: var(--brand);
      font-weight: 500;
      font-size: 13px;
    }

    .duration {
      color: var(--muted);
      font-size: 13px;
    }

    .note-text {
      color: var(--warn);
      font-size: 12px;
      font-style: italic;
    }

    .therapy-notes, .therapy-indications {
      margin: 16px 0;
      padding: 12px;
      background: #fff7ed;
      border-radius: 8px;
      border-left: 4px solid var(--warn);
    }

    .therapy-notes h4, .therapy-indications h4 {
      margin: 0 0 8px;
      font-size: 14px;
      color: var(--warn);
    }

    .therapy-notes ul, .therapy-indications ul {
      margin: 0;
      padding-left: 16px;
    }

    .therapy-notes li, .therapy-indications li {
      font-size: 13px;
      line-height: 1.4;
      margin: 4px 0;
    }

    @media (min-width: 800px) {
      .therapy-categories {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 640px) {
      .therapy-detail-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .therapy-category-card {
        padding: 16px;
      }
      
      .antibiotic-group {
        padding: 8px;
      }
    }
  `;

  // Styles injizieren
  if (!document.querySelector('#therapy-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'therapy-styles';
    styleSheet.textContent = therapyStyles;
    document.head.appendChild(styleSheet);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', createTherapyNavigation);
  
  // Falls DOM bereits geladen
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTherapyNavigation);
  } else {
    createTherapyNavigation();
  }

})();
// PWA-Funktionen und Versionsverwaltung
(function() {
  const currentVersion = '1.0.4'; // Erhöht für die neue Struktur
  const githubRepo = 'Stevbreu/PWA_Sepsis';
  
  // Version checking
  async function checkForUpdates(isAutomatic = false) {
    const checkBtn = document.getElementById('check-version');
    const headerCheckBtn = document.getElementById('header-check-version');
    const dashboardCheckBtn = document.getElementById('dashboard-check-version');
    const updateNotification = document.getElementById('update-notification');
    const updateLink = document.getElementById('update-link');
    const dashboardUpdateNotification = document.getElementById('dashboard-update-notification');
    const dashboardUpdateLink = document.getElementById('dashboard-update-link');
    const updateBanner = document.getElementById('update-banner');
    const bannerUpdateLink = document.getElementById('banner-update-link');
    
    const activeBtn = dashboardCheckBtn || headerCheckBtn || checkBtn;
    
    try {
      if (activeBtn && !isAutomatic) {
        activeBtn.disabled = true;
        activeBtn.textContent = 'Prüfe...';
      }
      
      // GitHub API Aufruf für die neueste Version
      const response = await fetch(`https://api.github.com/repos/${githubRepo}/releases/latest`);
      
      if (response.ok) {
        const release = await response.json();
        const latestVersion = release.tag_name.replace('v', ''); // Entferne 'v' prefix falls vorhanden
        
        if (latestVersion !== currentVersion && isNewerVersion(latestVersion, currentVersion)) {
          // Update verfügbar - PWA-Update anzeigen
          if (updateBanner) {
            updateBanner.classList.add('show');
            bannerUpdateLink.href = '#';
            bannerUpdateLink.textContent = `Version ${latestVersion} - PWA aktualisieren`;
            bannerUpdateLink.onclick = () => triggerPWAUpdate(latestVersion);
          }
          
          // Dashboard Update anzeigen
          if (dashboardUpdateNotification) {
            dashboardUpdateNotification.style.display = 'block';
            dashboardUpdateLink.href = '#';
            dashboardUpdateLink.textContent = `Version ${latestVersion} - PWA aktualisieren`;
            dashboardUpdateLink.onclick = () => triggerPWAUpdate(latestVersion);
          }
          
          // Auch in der Detailansicht anzeigen
          if (updateNotification) {
            updateNotification.style.display = 'block';
            updateLink.href = '#';
            updateLink.textContent = `Version ${latestVersion} - PWA aktualisieren`;
            updateLink.onclick = () => triggerPWAUpdate(latestVersion);
          }
        } else if (!isAutomatic) {
          // Kurz "Aktuell" anzeigen
          if (activeBtn) {
            activeBtn.textContent = 'Aktuell ✓';
            setTimeout(() => {
              activeBtn.textContent = 'Updates';
            }, 2000);
          }
        }
      } else {
        throw new Error('GitHub API nicht erreichbar');
      }
    } catch (error) {
      console.error('Versionsprüfung fehlgeschlagen:', error);
      if (activeBtn && !isAutomatic) {
        activeBtn.textContent = 'Fehler';
        setTimeout(() => {
          activeBtn.textContent = 'Updates';
        }, 2000);
      }
    } finally {
      if (activeBtn && !isAutomatic) {
        activeBtn.disabled = false;
      }
    }
  }
  
  function isNewerVersion(latest, current) {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);
    
    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
      const latestPart = latestParts[i] || 0;
      const currentPart = currentParts[i] || 0;
      
      if (latestPart > currentPart) return true;
      if (latestPart < currentPart) return false;
    }
    return false;
  }
  
  // PWA Update Funktion
  async function triggerPWAUpdate(newVersion) {
    if (confirm(`Neue Version ${newVersion} verfügbar!\n\nDie PWA wird aktualisiert und neu geladen.\nMöchten Sie fortfahren?`)) {
      try {
        // Service Worker aktualisieren
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.update();
            
            // Warte auf neuen Service Worker
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            
            // Cache leeren für komplettes Update
            if ('caches' in window) {
              const cacheNames = await caches.keys();
              await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
          }
        }
        
        // App neu laden
        alert(`Update auf Version ${newVersion} wird installiert...`);
        window.location.reload(true);
        
      } catch (error) {
        console.error('Update fehlgeschlagen:', error);
        alert('Update fehlgeschlagen. Bitte versuchen Sie es später erneut.');
      }
    }
  }
  
  // Event Listener für Versionsprüfung
  const checkVersionBtn = document.getElementById('check-version');
  if (checkVersionBtn) {
    checkVersionBtn.addEventListener('click', () => checkForUpdates(false));
  }

  const headerCheckVersionBtn = document.getElementById('header-check-version');
  if (headerCheckVersionBtn) {
    headerCheckVersionBtn.addEventListener('click', () => checkForUpdates(false));
  }

  const dashboardCheckVersionBtn = document.getElementById('dashboard-check-version');
  if (dashboardCheckVersionBtn) {
    dashboardCheckVersionBtn.addEventListener('click', () => checkForUpdates(false));
  }
  
  // Banner schließen
  const closeBannerBtn = document.getElementById('close-update-banner');
  if (closeBannerBtn) {
    closeBannerBtn.addEventListener('click', () => {
      const updateBanner = document.getElementById('update-banner');
      if (updateBanner) {
        updateBanner.classList.remove('show');
      }
    });
  }
  
  // Automatische Versionsprüfung beim Start
  setTimeout(() => checkForUpdates(true), 2000);

  // Install prompt (still available via browser menu)
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js');
    });
  }

  // Expose current version
  window.currentVersion = currentVersion;
})();
