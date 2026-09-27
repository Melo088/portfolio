#!/usr/bin/env bash
# Creates the Cloudflare Pages project on first deploy; a no-op afterwards.
# Needs CLOUDFLARE_API_TOKEN (Account > Cloudflare Pages > Edit),
# CLOUDFLARE_ACCOUNT_ID and PAGES_PROJECT in the environment.
set -euo pipefail

api="https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects"
auth=(-H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}")

status=$(curl -sS -o /dev/null -w '%{http_code}' "${auth[@]}" "${api}/${PAGES_PROJECT}")
case "$status" in
  200)
    echo "Pages project '${PAGES_PROJECT}' exists."
    ;;
  404)
    curl -fsS -o /dev/null "${auth[@]}" -H 'Content-Type: application/json' \
      --data "{\"name\":\"${PAGES_PROJECT}\",\"production_branch\":\"main\"}" "$api"
    echo "Created Pages project '${PAGES_PROJECT}'."
    ;;
  *)
    echo "::error::Cloudflare API answered ${status} for project '${PAGES_PROJECT}'. Check the token scope and account ID."
    exit 1
    ;;
esac
