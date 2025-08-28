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
