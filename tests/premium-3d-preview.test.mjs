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
  assert.match(stage, /draggable=\{false\}/);
  assert.doesNotMatch(stage, /<(button|a|input|textarea|select)\b/);
  assert.match(css, /\.stage \{[\s\S]*?pointer-events: none;/);
  assert.match(css, /focus-visible[\s\S]{0,220}outline: 3px solid var\(--gold\)/);
});

test("görsel hatası ve hareket kısıtlaması ele alınır", () => {
  assert.match(stage, /onError=\{\(\) => setAssetFailed\(true\)\}/);
  assert.match(stage, /assetFailed \? \([\s\S]{0,140}styles\.objectFallback/);
  assert.match(stage, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
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

test("hafif 3D: ağır kütüphane yok, iki farklı sıkıştırılmış görsel var", () => {
  const packageJson = JSON.parse(read("../package.json"));
  const dependencyNames = Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies });
  for (const name of dependencyNames) {
    assert.doesNotMatch(name, /three|babylon|gltf|troika/i, `ağır 3D bağımlılığı eklenmemeli: ${name}`);
  }
  for (const source of [stage, pageA, pageB]) {
    assert.doesNotMatch(source, /^import[^\n]*(three|babylon|webgl|gltf)/im);
    assert.doesNotMatch(source, /getContext\(\s*["'](webgl|webgl2|webgpu)/i);
  }
  assert.match(stage, /\/media\/agentaxis-premium-3d-a-v2\.jpg/);
  assert.match(stage, /\/media\/agentaxis-premium-3d-b-v2\.jpg/);
  assert.doesNotMatch(stage, /lumen-arc-rotation-loop|<video/);
  for (const asset of [
    "../public/media/agentaxis-premium-3d-a-v2.jpg",
    "../public/media/agentaxis-premium-3d-b-v2.jpg",
  ]) {
    const file = new URL(asset, import.meta.url);
    assert.ok(fs.existsSync(file), `3D görseli eksik: ${asset}`);
    assert.ok(fs.statSync(file).size < 350_000, `3D görseli gereğinden ağır: ${asset}`);
  }
  assert.match(css, /\.stageRoot \.stageContent video \{\s*display: none;/);
  // Miras alınan hero videoları bu rotalarda kapalı; yeni sahne yalnız hafif görsel kullanır.
  assert.equal(stage.match(/<img/g).length, 1);
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

test("iki rota gerçekten farklı yeni 3D varlıklar kullanır", () => {
  assert.match(stage, /variant === "a"[\s\S]{0,160}agentaxis-premium-3d-a-v2\.jpg[\s\S]{0,160}agentaxis-premium-3d-b-v2\.jpg/);
  assert.match(css, /@keyframes axSceneFloat/);
  assert.match(css, /\.objectShell[\s\S]{0,180}animation: axSceneFloat/);
});

test("miras alınan gizli hero videosu bu rotalarda serbest bırakılır", () => {
  // Yalnız CSS ile gizlemek yetmiyordu: tarayıcı 5 MB videoyu ve 1 MB posteri yine indiriyordu.
  assert.match(stage, /releaseHiddenVideos/);
  assert.match(stage, /video\.removeAttribute\("src"\)/);
  assert.match(stage, /video\.removeAttribute\("poster"\)/);
  assert.match(stage, /video\.pause\(\)/);
  // Panel açılıp kapandığında yeniden bağlanan video da yakalanır.
  assert.match(stage, /new MutationObserver\(releaseHiddenVideos\)/);
  assert.match(stage, /observer\.disconnect\(\)/);
});

test("A geniş masaüstünde heykel panelin arkasında kaybolmaz", () => {
  assert.match(
    css,
    /@media \(min-width: 901px\) \{[\s\S]{0,400}\.stageA \.object \{[\s\S]{0,220}translate3d\(calc\(-10%/,
  );
  // Hareket kısıtlamasında da aynı çerçeveleme korunur.
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\) and \(min-width: 901px\)[\s\S]{0,140}translate3d\(-10%, -1%, 0\) scale\(1\.26\)/,
  );
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
