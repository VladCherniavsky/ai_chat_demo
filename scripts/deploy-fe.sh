#!/usr/bin/env bash
# Deploy frontend: build → S3 sync → CloudFront invalidation
# Usage: ./scripts/deploy-fe.sh [--skip-build]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
INFRA_DIR="$ROOT_DIR/infra"
FE_DIR="$ROOT_DIR/fe"

SKIP_BUILD=false
for arg in "$@"; do
  [[ "$arg" == "--skip-build" ]] && SKIP_BUILD=true
done

# ── 1. Read Terraform outputs ──────────────────────────────────────────────────
echo "==> Reading Terraform outputs from $INFRA_DIR ..."
BUCKET=$(terraform -chdir="$INFRA_DIR" output -raw frontend_bucket)
CF_DIST_ID=$(terraform -chdir="$INFRA_DIR" output -raw cloudfront_distribution_id)
CF_URL=$(terraform -chdir="$INFRA_DIR" output -raw cloudfront_url)

echo "    Bucket : $BUCKET"
echo "    CF ID  : $CF_DIST_ID"
echo "    URL    : $CF_URL"

# ── 2. Build ───────────────────────────────────────────────────────────────────
if [[ "$SKIP_BUILD" == "false" ]]; then
  echo ""
  echo "==> Building frontend ..."
  npm --prefix "$FE_DIR" run build
else
  echo ""
  echo "==> Skipping build (--skip-build)"
  [[ -d "$FE_DIR/dist" ]] || { echo "ERROR: fe/dist not found — run without --skip-build first"; exit 1; }
fi

# ── 3. Sync to S3 ─────────────────────────────────────────────────────────────
echo ""
echo "==> Syncing fe/dist → s3://$BUCKET ..."

# Hashed assets (JS, CSS, fonts, images) — long-lived cache
aws s3 sync "$FE_DIR/dist" "s3://$BUCKET" \
  --delete \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

# index.html — must never be cached so users always get the latest shell
aws s3 cp "$FE_DIR/dist/index.html" "s3://$BUCKET/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html"

# ── 4. Invalidate CloudFront ───────────────────────────────────────────────────
echo ""
echo "==> Invalidating CloudFront distribution $CF_DIST_ID ..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CF_DIST_ID" \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text)
echo "    Invalidation ID: $INVALIDATION_ID"

# ── Done ───────────────────────────────────────────────────────────────────────
echo ""
echo "Deploy complete → $CF_URL"
