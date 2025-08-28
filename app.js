// PWA bootstrapping, navigation, tabs, calculators. No personal data is stored.
(function(){
  // Navigation between dashboard and modules
  const dashboard = document.getElementById('dashboard');
  const modules = {
    sepsis: document.getElementById('sepsis-module'),
    pneumonia: document.getElementById('pneumonia-module'),
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
    Object.values(modules).forEach(m => m.classList.remove('active'));
    modules[moduleId].classList.add('active');
    backBtn.style.display = 'block';
    
    // Update header based on module
    if (moduleId === 'sepsis') {
      appTitle.textContent = 'AKH Celle · CODE SEPSIS';
      appSubtitle.textContent = 'S3‑Leitlinie 2025 (AWMF 079‑001) · QS‑Sepsis (G‑BA)';
    } else if (moduleId === 'pneumonia') {
      appTitle.textContent = 'AKH Celle · Pneumonie';
      appSubtitle.textContent = 'Leitlinien für ambulant erworbene Pneumonie';
    }
  }

  // Back to dashboard
  backBtn.addEventListener('click', () => {
    Object.values(modules).forEach(m => m.classList.remove('active'));
    dashboard.classList.add('active');
    backBtn.style.display = 'none';
    appTitle.textContent = 'AKH Celle · Medizinische Leitlinien';
    appSubtitle.textContent = 'Leitlinien & Rechner für den klinischen Alltag';
  });

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
    Object.values(panes).forEach(p => p.classList.remove('active'));
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
    Object.values(subPanes).forEach(p => p.classList.remove('active'));
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

  // Calculator links
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
        showModule(targetModule);
        
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
              Object.values(panes).forEach(p => p.classList.remove('active'));
              if (panes[targetPane]) {
                panes[targetPane].classList.add('active');
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

  // Version checking
  const currentVersion = '1.0.4';
  const githubRepo = 'Stevbreu/PWA_Sepsis'; // Ersetze mit deinem GitHub Repository
  
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
  
  // Event Listener für Versionsprüfung
  document.getElementById('check-version')?.addEventListener('click', () => checkForUpdates(false));
  document.getElementById('header-check-version')?.addEventListener('click', () => checkForUpdates(false));
  document.getElementById('dashboard-check-version')?.addEventListener('click', () => checkForUpdates(false));
  
  // Banner schließen
  document.getElementById('close-update-banner')?.addEventListener('click', () => {
    document.getElementById('update-banner').classList.remove('show');
  });

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

  // Calculators
  // Fluid 30 ml/kg
  const kg = document.getElementById('kg'); const fluidOut = document.getElementById('fluid');
  document.getElementById('btn-fluid').addEventListener('click', () => {
    const w = parseFloat(kg.value || '0');
    const ml = Math.round(w * 30);
    fluidOut.textContent = isFinite(ml) ? ml : '–';
  });

  // Lactate clearance
  const l0 = document.getElementById('l0'); const l1 = document.getElementById('l1');
  document.getElementById('btn-lac').addEventListener('click', () => {
    const a = parseFloat(l0.value || '0'); const b = parseFloat(l1.value || '0');
    const delta = +(b - a).toFixed(2);
    const pct = a>0 ? Math.round((a - b)/a * 100) : 0;
    document.getElementById('lac-delta').textContent = delta;
    document.getElementById('lac-pct').textContent = pct;
  });

  // MAP delta
  const mapIn = document.getElementById('map');
  document.getElementById('btn-map').addEventListener('click', () => {
    const cur = parseFloat(mapIn.value || '0');
    const d = Math.max(0, Math.round(65 - cur));
    document.getElementById('map-delta').textContent = d;
  });

  // IBW & tidal volume (Devine formula; height in cm)
  document.getElementById('btn-ibw').addEventListener('click', () => {
    const sex = document.getElementById('sex').value;
    const cm = parseFloat(document.getElementById('cm').value || '0');
    if(!cm || cm < 120){ document.getElementById('ibw').textContent = '–'; return; }
    const base = (sex === 'm') ? 50.0 : 45.5;
    const ibw = +(base + 0.9 * (cm - 152)).toFixed(1); // kg
    const vt6 = Math.round(6 * ibw);
    const vt4 = Math.round(4 * ibw);
    const vt8 = Math.round(8 * ibw);
    document.getElementById('ibw').textContent = ibw;
    document.getElementById('vt6').textContent = vt6;
    document.getElementById('vt48').textContent = vt4 + '–' + vt8;
  });

  // Pneumonie Rechner
  // CRB-65 Score
  document.getElementById('btn-crb65')?.addEventListener('click', () => {
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

  // CURB-65 Score
  document.getElementById('btn-curb65')?.addEventListener('click', () => {
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
})();