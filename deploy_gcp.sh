#!/usr/bin/env bash
set -e

# ==============================================================================
# RivaanshPrep - Automated Production Deployment Script for Google Cloud Engine
# Domain: rivaanshprep.com / www.rivaanshprep.com
# Stack: Nginx + React 19 + Spring Boot 3.3.5 (Java 21) + Systemd + Certbot SSL
# ==============================================================================

echo "=========================================================="
echo "🚀 Starting RivaanshPrep Deployment for rivaanshprep.com"
echo "=========================================================="

DOMAIN="rivaanshprep.com"
APP_DIR="/opt/rivaanshprep"
WEB_ROOT="/var/www/rivaanshprep"

# 0. Free disk space on the server to prevent "E: You don't have enough free space"
echo "🧹 [0/6] Freeing up disk space on server..."
sudo apt-get clean
sudo journalctl --vacuum-size=50M 2>/dev/null || true
if command -v docker &> /dev/null; then
    echo "Cleaning unused Docker cache..."
    sudo docker system prune -af 2>/dev/null || true
fi
sudo apt-get autoremove -y || true

echo "📊 Disk status:"
df -h /

# 1. Update and install required packages
echo "📦 [1/6] Installing dependencies (OpenJDK 21, Nginx, Certbot)..."
sudo apt-get update -y
sudo apt-get install -y curl git ufw nginx certbot python3-certbot-nginx openjdk-21-jdk

# Install Node.js 20 LTS if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "Node version: $(node -v)"
echo "Java version: $(java -version 2>&1 | head -n 1)"

# 2. Setup project directories
echo "📁 [2/6] Setting up project directories..."
sudo mkdir -p "$APP_DIR"
sudo mkdir -p "$WEB_ROOT"
sudo chown -R $USER:$USER "$APP_DIR"
sudo chown -R $USER:$USER "$WEB_ROOT"

# Determine script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 3. Build React Frontend
echo "⚛️  [3/6] Building Production React Frontend..."
cd "$SCRIPT_DIR/web-app/frontend"
npm ci || npm install
npm run build
cp -r dist/* "$WEB_ROOT/"
echo "✅ Frontend built and copied to $WEB_ROOT"

# 4. Build Spring Boot Backend
echo "☕ [4/6] Building Spring Boot Backend Jar..."
cd "$SCRIPT_DIR/web-app/backend"
chmod +x mvnw
./mvnw clean package -DskipTests -B
cp target/*.jar "$APP_DIR/backend.jar"
mkdir -p "$APP_DIR/data"
echo "✅ Backend packaged at $APP_DIR/backend.jar"

# 5. Create Systemd Service for Spring Boot
echo "⚙️  [5/6] Configuring Systemd Service (rivaanshprep-backend)..."
sudo tee /etc/systemd/system/rivaanshprep-backend.service > /dev/null << 'EOF'
[Unit]
Description=RivaanshPrep Spring Boot Backend Service
After=syslog.target network.target

[Service]
User=root
WorkingDirectory=/opt/rivaanshprep
ExecStart=/usr/bin/java -Xms256m -Xmx768m -Djava.security.egd=file:/dev/./urandom -jar /opt/rivaanshprep/backend.jar
SuccessExitStatus=143
Restart=always
RestartSec=10
Environment="PORT=8080"
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="CLOUDFLARE_R2_ENDPOINT=https://9c6e8d481ebdbbb383ab06fa35991a66.r2.cloudflarestorage.com"
Environment="CLOUDFLARE_R2_ACCESS_KEY_ID=4fe33a10f8439eb2e3386e91ecd1c4f5"
Environment="CLOUDFLARE_R2_SECRET_ACCESS_KEY=aad1c8e96c9f4381d46731315ea8c550a05182c3422584f5e0e3d723159a0945"
Environment="CLOUDFLARE_R2_BUCKET=rivaanshprep"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable rivaanshprep-backend
sudo systemctl restart rivaanshprep-backend
echo "✅ Systemd service rivaanshprep-backend is active and running!"

# 6. Configure Nginx for rivaanshprep.com
echo "🌐 [6/6] Configuring Nginx Reverse Proxy for $DOMAIN..."

if [ -f /etc/letsencrypt/live/rivaanshprep.com/fullchain.pem ]; then
    echo "🔒 SSL certificate found! Configuring HTTPS & HTTP redirect..."
    sudo tee /etc/nginx/sites-available/rivaanshprep > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name rivaanshprep.com www.rivaanshprep.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rivaanshprep.com www.rivaanshprep.com;

    ssl_certificate /etc/letsencrypt/live/rivaanshprep.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rivaanshprep.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/rivaanshprep;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
else
    echo "⚠️ SSL certificate not yet found. Setting up HTTP on port 80..."
    sudo tee /etc/nginx/sites-available/rivaanshprep > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name rivaanshprep.com www.rivaanshprep.com;

    root /var/www/rivaanshprep;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
fi

# Clean conflicting sites
sudo rm -f /etc/nginx/sites-enabled/default
if [ -f /etc/nginx/sites-enabled/kahani ]; then
    sudo mv /etc/nginx/sites-enabled/kahani /etc/nginx/sites-available/kahani.bak 2>/dev/null || sudo rm -f /etc/nginx/sites-enabled/kahani
fi
sudo ln -sf /etc/nginx/sites-available/rivaanshprep /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "=========================================================="
echo "🎉 SUCCESS: RivaanshPrep is deployed on your GCP Server!"
echo "=========================================================="
echo "Domain: https://$DOMAIN"
echo "Backend Status: sudo systemctl status rivaanshprep-backend"
echo "Nginx Status:   sudo systemctl status nginx"
echo "=========================================================="
