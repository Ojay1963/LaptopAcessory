#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/laptop-store}"
DATA_DIR="${DATA_DIR:-/var/www/oj-devices-data}"
SOURCE_DIR="${SOURCE_DIR:-}"
DOMAIN="${DOMAIN:-}"
PORT="${PORT:-5000}"
NODE_VERSION="${NODE_VERSION:-20}"

if [ -z "$SOURCE_DIR" ] || [ ! -d "$SOURCE_DIR" ]; then
  echo "SOURCE_DIR must point to a checked-out copy of the repository."
  exit 1
fi

echo "=========================================="
echo "OJ Devices GitHub deploy starting"
echo "=========================================="

sudo dnf install -y rsync git curl >/dev/null

sudo mkdir -p "$APP_DIR" "$DATA_DIR"
sudo chown -R ec2-user:ec2-user "$APP_DIR" "$DATA_DIR"

if [ ! -f "$DATA_DIR/store.json" ] && [ -f "$APP_DIR/server/data/store.json" ]; then
  cp "$APP_DIR/server/data/store.json" "$DATA_DIR/store.json"
fi

rsync -a --delete \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude "client/node_modules" \
  --exclude "dist" \
  --exclude "client/dist" \
  --exclude "server/.env" \
  --exclude "client/.env.local" \
  --exclude "server/data/store.json" \
  "$SOURCE_DIR"/ "$APP_DIR"/

if [ ! -f "$DATA_DIR/store.json" ] && [ -f "$APP_DIR/server/data/store.json" ]; then
  cp "$APP_DIR/server/data/store.json" "$DATA_DIR/store.json"
fi

if [ -f "$APP_DIR/server/.env" ] && ! grep -q '^STORE_FILE=' "$APP_DIR/server/.env"; then
  echo "" >> "$APP_DIR/server/.env"
  echo "# Persistent store outside the git working tree" >> "$APP_DIR/server/.env"
  echo "STORE_FILE=$DATA_DIR/store.json" >> "$APP_DIR/server/.env"
fi

export APP_DIR
export DOMAIN
export PORT
export NODE_VERSION

bash "$APP_DIR/ops/deploy.sh"
