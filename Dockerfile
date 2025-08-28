# Multi-stage build für optimierte PWA
FROM nginx:alpine as production

# Kopiere PWA-Dateien
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY sw.js /usr/share/nginx/html/
COPY manifest.webmanifest /usr/share/nginx/html/
COPY icons/ /usr/share/nginx/html/icons/

# Nginx-Konfiguration für PWA
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # PWA-spezifische Headers
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Cache-Control für PWA
        add_header Cache-Control "no-cache, must-revalidate";
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
    }

    # Service Worker sollte nie gecacht werden
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Manifest sollte auch aktuell bleiben
    location = /manifest.webmanifest {
        add_header Cache-Control "no-cache, must-revalidate";
        add_header Content-Type "application/manifest+json";
    }

    # Statische Assets können länger gecacht werden
    location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Health Check Endpoint
    location = /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
}
EOF

# Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Exponiere Port 80
EXPOSE 80

# Starte Nginx
CMD ["nginx", "-g", "daemon off;"]
