#!/usr/bin/env bash
# Post-deploy smoke test: the pages and files that matter answer 200, the
# home page is ours, and the security headers from public/_headers are live.
# Usage: scripts/smoke-test.sh https://example.pages.dev
set -euo pipefail

base="${1%/}"
curl_opts=(-fsS --retry 6 --retry-delay 5 --retry-all-errors --max-time 20)

home=$(curl "${curl_opts[@]}" -L "${base}/")
grep -q 'Juan Camilo Melo' <<<"$home" || { echo "::error::${base}/ does not look like the portfolio"; exit 1; }

headers=$(curl "${curl_opts[@]}" -I "${base}/")
for h in content-security-policy strict-transport-security x-content-type-options; do
  grep -qi "^${h}:" <<<"$headers" || { echo "::error::missing header ${h} on ${base}/"; exit 1; }
done

for path in /about/ /cv/ /projects/platform-pipeline/ /juancmelo-cv.pdf /og.jpg /robots.txt /sitemap-index.xml; do
  curl "${curl_opts[@]}" -L -o /dev/null "${base}${path}"
done

echo "Smoke test passed for ${base}"
