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
