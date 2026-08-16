import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const config = fs.readFileSync(path.join(root, "app/siteConfig.ts"), "utf8");
const site = fs.readFileSync(path.join(root, "app/taslaklar/DraftGallery.tsx"), "utf8");
const layout = fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8");

test("doğrulanmış telefon, Instagram ve LinkedIn görünür; eksik kanallar gizli kalır", () => {
  assert.match(config, /phoneDisplay:\s*"0531 423 75 77"/);
  assert.match(config, /phoneHref:\s*"\+905314237577"/);
  assert.match(config, /whatsappHref:\s*""/);
  assert.match(config, /instagramHref:\s*"https:\/\/www\.instagram\.com\/agentaxislabs\/"/);
  assert.match(config, /instagramDisplay:\s*"@agentaxislabs"/);
  assert.match(config, /linkedinDisplay:\s*"Umut İşbilen"/);
  assert.match(config, /linkedinHref:\s*"https:\/\/www\.linkedin\.com\/in\/umut-i%C5%9Fbilen-3a2960428\/"/);
  assert.match(config, /youtubeHref:\s*""/);
  assert.match(site, /siteContact\.phoneDisplay &&/);
  assert.match(site, /siteContact\.whatsappHref &&/);
  assert.match(site, /siteContact\.instagramHref &&/);
  assert.match(site, /siteContact\.linkedinHref &&/);
  assert.match(site, /siteContact\.youtubeHref &&/);
  assert.match(layout, /telephone:\s*siteContact\.phoneHref/);
  assert.match(layout, /sameAs:.*instagramHref.*filter\(Boolean\)/);
});

test("iletişim kanalları güvenli yeni sekme davranışı kullanır", () => {
  assert.match(site, /Instagram · \{siteContact\.instagramDisplay\} ↗<\/a>/);
  assert.match(site, /LinkedIn · \{siteContact\.linkedinDisplay\} ↗<\/a>/);
  assert.match(site, /YouTube ↗<\/a>/);
  assert.doesNotMatch(config, /https?:\/\/example\.com/);
});

test("hareketli arka plan görünmez sekmede ve ekran dışında durur", () => {
  assert.match(site, /function LumenLoopVideo/);
  assert.match(site, /document\.visibilityState === "visible"/);
  assert.match(site, /new IntersectionObserver/);
  assert.match(site, /video\.pause\(\)/);
  assert.match(site, /preload="metadata"/);
});

test("özel demo doğru paylaşım ve hizmet bağlantısı dilini kullanır", () => {
  const demo = fs.readFileSync(path.join(root, "app/inceleme/_shared/PremiumClinicDemo.tsx"), "utf8");
  assert.match(demo, /ÖZEL ÇALIŞMA · YALNIZ SİZİN İÇİN/);
  assert.doesNotMatch(demo, /ÖZEL ÖNİZLEME · PAYLAŞILMADI/);
  assert.match(site, /<Services sectionId="hizmetler" \/>/);
});
