#!/usr/bin/env bash
set -euo pipefail

SPEC_PATH=${1:-infra/digitalocean-app.yaml}

if [[ -z "${DIGITALOCEAN_APP_ID:-}" ]]; then
  echo "DIGITALOCEAN_APP_ID environment variable is required." >&2
  exit 1
fi

if ! command -v doctl >/dev/null 2>&1; then
  echo "doctl CLI is required to deploy. Install from https://docs.digitalocean.com/reference/doctl/how-to/install/." >&2
  exit 1
fi

echo "Deploying Metamorphic Mixtape adapter using spec ${SPEC_PATH}"
doctl apps update "${DIGITALOCEAN_APP_ID}" --spec "${SPEC_PATH}" --wait

echo "Deployment complete."
