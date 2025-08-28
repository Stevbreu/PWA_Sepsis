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
