#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ ! -d node_modules ]; then
  echo "Missing node_modules. Run setup phase first: ./scripts/setup.sh"
  exit 1
fi

# Rebuild workspace links/binaries without fetching new packages.
npm rebuild --workspaces

npm run compile --workspace contracts

echo "Bootstrap complete. Run: npm run dev"
