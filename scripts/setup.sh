#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Setup phase only (requires internet access)
npm install --workspaces

echo "Setup complete. You can now run: npm run bootstrap && npm run dev"
