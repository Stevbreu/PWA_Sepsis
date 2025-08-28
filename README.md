# PWA Sepsis & Pneumonie Leitlinien

Progressive Web App für medizinische Leitlinien des AKH Celle.

## Features

- 🏥 **Sepsis Leitlinie** - S3-Leitlinie 2025 mit Bundle-Therapie
- 🫁 **Pneumonie Leitlinie** - Case Map und Behandlungspfade  
- 🧮 **Medizinische Rechner** - CRB-65, CURB-65, Flüssigkeit, etc.
- 📱 **PWA** - Offline-fähig, installierbar
- 🔄 **Auto-Updates** - GitHub-basierte Versionsprüfung

## Deployment

### Automatisch via GitHub Actions

1. **Repository erstellen** auf GitHub
2. **Secrets konfigurieren:**
   - `SSH_PRIVATE_KEY` - SSH-Key für Server-Zugriff
3. **Push nach main** - Automatisches Deployment

### Server-Requirements

- Docker & Docker Compose
- SSH-Zugriff auf Port 122
- Freier Port 3306

## Entwicklung

```bash
# Lokal testen
python3 -m http.server 8080
open http://localhost:8080

# Docker Build (lokal)
docker build -t pwa-sepsis .
docker run -p 8080:80 pwa-sepsis
```

## Architektur

```
PWA_Sepsis/
├── index.html          # Haupt-App mit allen Modulen
├── app.js             # Navigation, Rechner, Updates
├── sw.js              # Service Worker (Offline)
├── manifest.webmanifest # PWA-Metadaten
├── icons/             # App-Icons
├── Dockerfile         # Multi-stage Nginx Build
└── .github/workflows/ # Auto-Deployment
```

## URLs

- **Entwicklung:** http://localhost:8080  
- **Produktion:** http://23.88.11.69:3306

## Updates

Die App prüft automatisch auf neue Versionen via GitHub Releases und bietet PWA-gerechte Updates an.

## Lizenz

Medizinische Leitlinien - AKH Celle
