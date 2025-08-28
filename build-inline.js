#!/usr/bin/env node
/**
 * Build-Script für Inline-Version der PWA
 * Bettet alle externen CSS und JS Dateien direkt in die HTML ein
 * Lösung für Server mit falschen MIME-Types
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Erstelle Inline-Version der PWA...\n');

function readFileIfExists(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        } else {
            console.warn(`⚠️  Datei nicht gefunden: ${filePath}`);
            return '';
        }
    } catch (error) {
        console.error(`❌ Fehler beim Lesen von ${filePath}:`, error.message);
        return '';
    }
}

function buildInlineVersion() {
    try {
        // HTML laden
        let html = readFileIfExists('index.html');
        if (!html) {
            console.error('❌ index.html nicht gefunden!');
            process.exit(1);
        }

        console.log('📄 HTML-Grundlage geladen');

        // CSS inline einbetten
        const css = readFileIfExists('styles.css');
        if (css) {
            html = html.replace(
                '<link rel="stylesheet" href="styles.css">',
                `<style>\n${css}\n  </style>`
            );
            console.log('🎨 CSS erfolgreich inline eingebettet');
        }

        // JavaScript-Dateien sammeln und inline einbetten
        const jsFiles = [
            'js/navigation.js',
            'js/tabs.js', 
            'js/calculators.js',
            'js/therapy-navigator.js',
            'js/pwa.js'
        ];

        let jsContent = '';
        let loadedJsFiles = 0;

        jsFiles.forEach(file => {
            const jsCode = readFileIfExists(file);
            if (jsCode) {
                jsContent += `\n// === ${file} ===\n${jsCode}\n`;
                loadedJsFiles++;
                console.log(`📝 ${file} geladen`);
            }
        });

        if (jsContent) {
            // Alle individuellen script tags entfernen
            html = html.replace(/  <script src="js\/.*?"><\/script>\n/g, '');
            
            // Kombinierten JS-Code vor </body> einfügen
            html = html.replace('</body>', `  <script>\n${jsContent}\n  </script>\n</body>`);
            console.log(`🔧 ${loadedJsFiles} JavaScript-Dateien inline eingebettet`);
        }

        // Inline-Version speichern
        const outputFile = 'index-inline.html';
        fs.writeFileSync(outputFile, html);
        
        console.log('\n✅ Inline-Version erfolgreich erstellt!');
        console.log(`📁 Ausgabe: ${outputFile}`);
        console.log(`📊 Dateigröße: ${Math.round(fs.statSync(outputFile).size / 1024)} KB`);
        
        // Zusätzliche Informationen
        console.log('\n📋 Nächste Schritte:');
        console.log('1. Laden Sie "index-inline.html" auf Ihren Server hoch');
        console.log('2. Benennen Sie sie in "index.html" um');
        console.log('3. Die PWA sollte jetzt ohne MIME-Type Probleme funktionieren');
        
        return true;
    } catch (error) {
        console.error('❌ Fehler beim Erstellen der Inline-Version:', error.message);
        return false;
    }
}

function createBackup() {
    try {
        if (fs.existsSync('index.html')) {
            fs.copyFileSync('index.html', 'index-original.html.bak');
            console.log('💾 Backup erstellt: index-original.html.bak');
        }
    } catch (error) {
        console.warn('⚠️  Backup konnte nicht erstellt werden:', error.message);
    }
}

function showStatistics() {
    try {
        const originalSize = fs.statSync('index.html').size;
        const inlineSize = fs.statSync('index-inline.html').size;
        const difference = inlineSize - originalSize;
        
        console.log('\n📈 Größenvergleich:');
        console.log(`Original: ${Math.round(originalSize / 1024)} KB`);
        console.log(`Inline:   ${Math.round(inlineSize / 1024)} KB`);
        console.log(`Differenz: +${Math.round(difference / 1024)} KB`);
        
        if (difference > 0) {
            console.log('💡 Die Inline-Version ist größer, aber löst die MIME-Type Probleme');
        }
    } catch (error) {
        console.warn('⚠️  Statistiken nicht verfügbar:', error.message);
    }
}

// Haupt-Ausführung
function main() {
    console.log('🔧 AKH Celle PWA - Inline Builder v1.0\n');
    
    // Backup erstellen
    createBackup();
    
    // Inline-Version erstellen
    const success = buildInlineVersion();
    
    if (success) {
        showStatistics();
        console.log('\n🎉 Build erfolgreich abgeschlossen!\n');
        
        // Deployment-Hinweise
        console.log('🚀 Deployment-Optionen:');
        console.log('• Upload index-inline.html und benenne in index.html um');
        console.log('• Oder: Nutze index-inline.html als separate Version');
        console.log('• Icons und Manifest-Dateien sind weiterhin extern erforderlich\n');
        
    } else {
        console.log('\n💥 Build fehlgeschlagen. Überprüfen Sie die Dateien und versuchen Sie es erneut.\n');
        process.exit(1);
    }
}

// Ausführen wenn direkt aufgerufen
if (require.main === module) {
    main();
}

module.exports = { buildInlineVersion };
