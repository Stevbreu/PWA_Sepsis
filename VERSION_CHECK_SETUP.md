# Versionsprüfung über GitHub einrichten

## 1. GitHub Repository erstellen

1. Erstelle ein GitHub Repository für deine PWA
2. Lade alle Dateien hoch (`index.html`, `app.js`, `manifest.webmanifest`, `sw.js`, Icons)

## 2. Repository-Name in der App anpassen

In der `app.js` Datei, Zeile 148:
```javascript
const githubRepo = 'deinbenutzername/dein-repository-name'; // Hier anpassen!
```

Beispiel:
```javascript
const githubRepo = 'stevenbreuer/PWA_Sepsis';
```

## 3. GitHub Releases erstellen

### Erste Version taggen:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Release auf GitHub erstellen:
1. Gehe zu deinem Repository auf GitHub
2. Klicke auf "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Version 1.0.0`
5. Beschreibung: Was ist neu/geändert
6. Klicke "Publish release"

## 4. Neue Versionen veröffentlichen

### Versionsnummer in der App erhöhen:
```javascript
const currentVersion = '1.0.1'; // In app.js anpassen
```

### Neues Release erstellen:
```bash
git tag v1.0.1
git push origin v1.0.1
```

Dann wieder ein Release auf GitHub erstellen.

## 5. Funktionsweise

- **Manuell:** Benutzer klickt "Updates prüfen"
- **Automatisch:** Auskommentierte Zeile 209 in `app.js` aktivieren
- **API:** Nutzt GitHub API: `https://api.github.com/repos/user/repo/releases/latest`
- **Vergleich:** Semantic Versioning (1.0.0 vs 1.0.1)

## 6. Vorteile

✅ Kostenlos über GitHub API  
✅ Automatische Versionserkennung  
✅ Direkter Link zum Download  
✅ Funktioniert offline (Fehlerbehandlung)  
✅ Keine externe Abhängigkeiten  

## 7. Limitierungen

- GitHub API: 60 Anfragen/Stunde ohne Authentifizierung
- Benötigt Internetverbindung für Prüfung
- Nur für öffentliche Repositories (ohne Token)
