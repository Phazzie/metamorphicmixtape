#!/usr/bin/env bash
set -euo pipefail

if ! command -v doctl >/dev/null 2>&1; then
  echo "doctl CLI is required" >&2
  exit 1
fi

if [ -z "${DIGITALOCEAN_ACCESS_TOKEN:-}" ]; then
  echo "DIGITALOCEAN_ACCESS_TOKEN environment variable must be set" >&2
  exit 1
fi

APP_SPEC=${1:-infra/digitalocean/app-spec.yaml}
IMAGE=${2:-ghcr.io/OWNER/REPO:latest}

TMP_SPEC=$(mktemp)
trap 'rm -f "$TMP_SPEC"' EXIT

sed "s|ghcr.io/OWNER/REPO:latest|${IMAGE}|g" "$APP_SPEC" > "$TMP_SPEC"

doctl apps spec validate "$TMP_SPEC"

if doctl apps list --format ID,Spec.Name --no-header | grep -q "metamorphic-mixtape"; then
  APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | awk '$2=="metamorphic-mixtape" {print $1}')
  doctl apps update "$APP_ID" --spec "$TMP_SPEC"
else
  doctl apps create --spec "$TMP_SPEC"
fi
