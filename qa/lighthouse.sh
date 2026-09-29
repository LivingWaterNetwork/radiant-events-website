#!/usr/bin/env bash
# Lighthouse (mobile, simulated throttling) on the QA gate pages. Median of 3 runs.
# Usage: qa/lighthouse.sh http://localhost:3300
set -e
BASE=${1:-http://localhost:3300}
export CHROME_PATH=${CHROME_PATH:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}
mkdir -p qa/lighthouse
for r in / /services /portfolio /portfolio/pink-sweet-16-garden-celebration /contact; do
  n=$([ "$r" = / ] && echo home || echo "${r#/}" | tr / _)
  for i in 1 2 3; do
    npx lighthouse "$BASE$r" --quiet --chrome-flags="--headless=new --no-sandbox" --form-factor=mobile \
      --throttling-method=simulate --output=json --output=html --output-path="qa/lighthouse/$n-run$i" >/dev/null 2>&1
  done
  node -e "
    const fs=require('fs');
    const runs=[1,2,3].map(i=>JSON.parse(fs.readFileSync('qa/lighthouse/$n-run'+i+'.report.json')));
    runs.sort((a,b)=>a.categories.performance.score-b.categories.performance.score);
    const r=runs[1]; const c=r.categories, a=r.audits;
    fs.copyFileSync('qa/lighthouse/$n-run'+([1,2,3].find(i=>JSON.parse(fs.readFileSync('qa/lighthouse/$n-run'+i+'.report.json')).fetchTime===r.fetchTime))+'.report.html','qa/lighthouse/$n.report.html');
    const row={page:'$r',performance:Math.round(c.performance.score*100),accessibility:Math.round(c.accessibility.score*100),bestPractices:Math.round(c['best-practices'].score*100),seo:Math.round(c.seo.score*100),lcp:a['largest-contentful-paint'].displayValue,cls:a['cumulative-layout-shift'].displayValue,tbt:a['total-blocking-time'].displayValue,bytes:a['total-byte-weight'].displayValue, allPerf: runs.map(x=>Math.round(x.categories.performance.score*100))};
    console.log(JSON.stringify(row));
    fs.appendFileSync('qa/lighthouse/summary.jsonl', JSON.stringify(row)+'\n');"
  rm -f qa/lighthouse/$n-run*.report.html qa/lighthouse/$n-run*.report.json
done
