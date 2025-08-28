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
