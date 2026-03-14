#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/var/www/laptop-store"
APP_NAME="oj-devices"
PORT="${PORT:-5000}"
DOMAIN="${DOMAIN:-51.20.5.125}"
NODE_VERSION="${NODE_VERSION:-20}"

echo "=========================================="
echo "OJ Devices deployment starting"
echo "=========================================="

if [ ! -d "$APP_DIR" ]; then
  echo "App directory $APP_DIR does not exist."
  exit 1
fi

echo "Installing system dependencies..."
sudo dnf install -y nginx git curl

echo "Installing Node.js ${NODE_VERSION}..."
sudo dnf remove -y nodejs 2>/dev/null || true
curl -fsSL "https://rpm.nodesource.com/setup_${NODE_VERSION}.x" | sudo bash -
sudo dnf install -y nodejs

echo "Installing PM2..."
sudo npm install -g pm2

cd "$APP_DIR"

if [ ! -f "$APP_DIR/server/.env" ]; then
  cp "$APP_DIR/server/.env.example" "$APP_DIR/server/.env"
  echo "Created server/.env from example. Update it with real production values."
fi

if [ ! -f "$APP_DIR/client/.env.local" ] && [ -f "$APP_DIR/client/.env.example" ]; then
  cp "$APP_DIR/client/.env.example" "$APP_DIR/client/.env.local"
  echo "Created client/.env.local from example. Update frontend keys if needed."
fi

echo "Installing workspace dependencies..."
npm ci

echo "Building client..."
npm run build

echo "Restarting PM2 process..."
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save
sudo env PATH="$PATH:/usr/bin" pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo "Configuring Nginx..."
sudo tee /etc/nginx/conf.d/oj-devices.conf > /dev/null <<EOF
server {
  listen 80;
  server_name $DOMAIN _;

  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  location / {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF

sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=========================================="
echo "Deployment complete"
echo "=========================================="
echo "App: http://$DOMAIN"
echo "PM2: pm2 status $APP_NAME"
