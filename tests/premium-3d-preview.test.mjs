import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relativePath) => fs.readFileSync(new URL(relativePath, import.meta.url), "utf8");

const home = read("../app/page.tsx");
const rootLayout = read("../app/layout.tsx");
const nextConfig = read("../next.config.ts");
const pageA = read("../app/onizleme/3d-premium-a/page.tsx");
const pageB = read("../app/onizleme/3d-premium-b/page.tsx");
const layoutA = read("../app/onizleme/3d-premium-a/layout.tsx");
const layoutB = read("../app/onizleme/3d-premium-b/layout.tsx");
const stage = read("../app/onizleme/_premium3d/Premium3DStage.tsx");
const css = read("../app/onizleme/_premium3d/stage.module.css");

const CANONICAL_DRAFT = "<HybridDraft live lumen previewFlow fullPreview showPreviewBadge={false} />";

test("canlı ana sayfa ve kök yerleşim değişmedi", () => {
  assert.match(home, /<HybridDraft live lumen previewFlow fullPreview showPreviewBadge=\{false\} \/>/);
  assert.doesNotMatch(home, /Premium3DStage|_premium3d|3d-premium/);
  assert.doesNotMatch(rootLayout, /Premium3DStage|_premium3d|3d-premium/);
  assert.match(rootLayout, /robots: \{ index: true, follow: true \}/);
});

test("iki önizleme rotası canlıyla birebir aynı bileşeni ve propları kullanır", () => {
  for (const page of [pageA, pageB]) {
    assert.ok(page.includes(CANONICAL_DRAFT), "önizleme canlı ana sayfayla aynı HybridDraft propunu kullanmalı");
    assert.match(page, /from "\.\.\/\.\.\/taslaklar\/DraftGallery"/);
    assert.match(page, /<Premium3DStage variant="[ab]" \/>/);
  }
  assert.match(pageA, /styles\.variantA/);
  assert.match(pageB, /styles\.variantB/);
});

test("önizleme rotaları indekslenmez", () => {
  for (const layout of [layoutA, layoutB]) {
    assert.match(layout, /index: false/);
    assert.match(layout, /follow: false/);
    assert.match(layout, /noarchive: true/);
  }
  assert.match(nextConfig, /source: "\/onizleme\/:path\*"/);
  assert.match(nextConfig, /X-Robots-Tag[\s\S]{0,60}noindex, nofollow/);
});

test("sahne dekoratiftir: klavye ve fare erişimini engellemez", () => {
  assert.match(stage, /aria-hidden="true"/);
  assert.match(stage, /tabIndex=\{-1\}/);
  assert.match(css, /\.stage \{[\s\S]*?pointer-events: none;/);
  assert.match(css, /focus-visible[\s\S]{0,220}outline: 3px solid var\(--gold\)/);
});

test("video hatası, görünürlük ve hareket kısıtlaması ele alınır", () => {
  assert.match(stage, /onError=\{\(\) => setVideoFailed\(true\)\}/);
  assert.match(stage, /videoFailed \? \([\s\S]{0,140}styles\.objectFallback/);
  assert.match(stage, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(stage, /document\.visibilityState !== "visible"/);
  assert.match(stage, /element\.pause\(\)/);
  assert.match(stage, /readyState === 0/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none !important/);
});

test("kanonik koyu-altın marka paleti korunur, mavi yoktur", () => {
  assert.match(css, /--night: #03040a/);
  assert.match(css, /--ink: #f7f4ed/);
  assert.match(css, /--gold: #d8bf8d/);
  assert.match(css, /var\(--font-geist-sans\)/);
  assert.doesNotMatch(css, /#275ff3|#2c63f5|#275df5|#5c7cff|#7d70ff|#91a7ff/i);
  assert.doesNotMatch(stage, /#275ff3|#2c63f5|blue/i);
});

test("hafif 3D: ağır kütüphane yok, tek yerel döngü videosu var", () => {
  const packageJson = JSON.parse(read("../package.json"));
  const dependencyNames = Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies });
  for (const name of dependencyNames) {
    assert.doesNotMatch(name, /three|babylon|gltf|troika/i, `ağır 3D bağımlılığı eklenmemeli: ${name}`);
  }
  for (const source of [stage, pageA, pageB]) {
    assert.doesNotMatch(source, /^import[^\n]*(three|babylon|webgl|gltf)/im);
    assert.doesNotMatch(source, /getContext\(\s*["'](webgl|webgl2|webgpu)/i);
  }
  assert.match(stage, /src="\/media\/lumen-arc-rotation-loop\.mp4"/);
  assert.ok(fs.existsSync(new URL("../public/media/lumen-arc-rotation-loop.mp4", import.meta.url)));
  assert.match(css, /\.stageRoot \.stageContent video \{\s*display: none;/);
  // Sayfada tek video kalır: sahne bir video, miras alınanlar kapalı.
  assert.equal(stage.match(/<video/g).length, 1);
});

/** Bir CSS seçicisini içeren tam kuralları (seçici + gövde) döndürür. */
function rulesMatching(source, needle) {
  const blocks = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let found;
  while ((found = pattern.exec(source)) !== null) {
    if (found[1].includes(needle)) blocks.push(found[0]);
  }
  return blocks;
}

test("yerleşim değil, yalnız arka plan ve hover katmanı değişir", () => {
  // Sahne kabının kendi kuralı hariç: yalnız canlı içeriğin üzerine yazan kurallar denetlenir.
  const contentRules = rulesMatching(css, ".stageContent").filter(
    (rule) => rule.slice(0, rule.indexOf("{")).trim() !== ".stageContent",
  );
  assert.ok(contentRules.length >= 10, "içerik üzerine yazan kurallar bulunmalı");
  const forbidden = /(grid-template|flex-direction|\border:\s*-?\d|\bpadding\b|\bmargin\b|\bgap\b|\bwidth\b|\bheight\b|\bfont-size\b|\bposition\b|\bdisplay:(?!\s*none))/;
  for (const rule of contentRules) {
    const body = rule.slice(rule.indexOf("{"));
    assert.doesNotMatch(body, forbidden, `yerleşim değiştiren kural bulundu: ${rule.trim().slice(0, 90)}`);
  }
  assert.match(css, /\.variantB \.stageContent > div > section article:hover/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
});

test("statik poster ilk boyamayı ve hareketsiz yedeği garantiler", () => {
  assert.match(stage, /poster="\/media\/lumen-arc-loop-poster\.jpg"/);
  const poster = new URL("../public/media/lumen-arc-loop-poster.jpg", import.meta.url);
  assert.ok(fs.existsSync(poster));
  assert.ok(fs.statSync(poster).size < 120_000, "poster hafif kalmalı");
});

test("video yükleme sayacı yalnız sayfa görünürken çalışır", () => {
  assert.match(stage, /armFailTimer/);
  assert.match(stage, /if \(document\.visibilityState !== "visible"\) return;/);
  assert.match(stage, /clearFailTimer/);
});

test("önizlemede mavi/mor kalıntılar kanonik altına çevrilir", () => {
  for (const selector of [
    '[class*="pointerGlow"]',
    '[class*="storyIntro"] h2 em',
    '[class*="storyPulse"] > span',
    '[class*="storyTimeline"] > i[class*="storyDone"]',
    '[class*="liveFinder"] > div > small',
  ]) {
    assert.ok(css.includes(selector), `marka onarımı eksik: ${selector}`);
  }
  // Onarımlar yalnız önizleme kapsamında kalır.
  for (const rule of rulesMatching(css, '[class*="')) {
    assert.match(rule, /\.stageRoot \.stageContent/);
  }
  // Koyu zeminde okunmayan metinler düzeltilir.
  assert.match(css, /\[class\*="capabilityFlow"\] strong[\s\S]{0,90}color: #f3efe6/);
});

test("mobil uyum ve okunabilirlik perdesi vardır", () => {
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /background-color: rgba\(6, 8, 17, 0\.9\)/);
  assert.match(css, /\.stageRoot \.stageContent > div > section:first-of-type \{\s*background: transparent;/);
});
