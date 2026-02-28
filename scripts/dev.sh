#!/usr/bin/env bash
set -euo pipefail

pids=()

cleanup() {
  for pid in "${pids[@]:-}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
}
trap cleanup EXIT INT TERM

npm run dev --workspace contracts &
pids+=("$!")

# Give hardhat a brief head start so services can connect to localhost:8545
sleep 2

npm run dev --workspace backend &
pids+=("$!")

npm run dev --workspace frontend &
pids+=("$!")

wait -n "${pids[@]}"
exit $?
