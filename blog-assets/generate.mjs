// ════════════════════════════════════════════════════════════
//  JP LABOR 블로그 자산 자동 생성기
//  사용법:  node generate.mjs posts/노조가입.json
//  결과물:  blog-output/<slug>/ 폴더에 썸네일·구분선·CTA·원고 생성
// ════════════════════════════════════════════════════════════
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── 1) 입력 데이터 로드 ──────────────────────────────
// JSON 한 개 = 블로그 글 한 편. 아래 형식으로 작성:
// {
//   "slug": "노조가입",
//   "label": "JP LABOR · 노동법 실무",
//   "title": "인사담당자가|노동조합|에 가입했다면?",   // | 로 줄/강조 구분
//   "titleAccent": "노동조합",                         // 초록 강조 단어
//   "subtitle": "노조법 소극적 요건 완벽 정리",
//   "sections": ["노조법상 소극적 요건이란?", "누가 이익대표자인가?", "실무 대응 방안"],
//   "body": "본문 원고 텍스트 (네이버 붙여넣기용)"
// }
const inputPath = process.argv[2];
if (!inputPath) { console.error('사용법: node generate.mjs <input.json>'); process.exit(1); }
const data = JSON.parse(readFileSync(inputPath, 'utf8'));
const outDir = join(__dir, 'blog-output', data.slug);
mkdirSync(outDir, { recursive: true });

// ── 2) 공통 스타일 ───────────────────────────────────
const FONT = `@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');`;
const RESET = `*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Pretendard',sans-serif;}`;

// 제목 파싱: "인사담당자가|노동조합|에 가입했다면?" + accent
function renderTitle(title, accent) {
  return title.split('|').map(part =>
    part === accent ? `<span class="acc">${part}</span>` : part
  ).join('').replace(/\n/g, '<br>');
}

// ── 3) 썸네일 HTML ───────────────────────────────────
function thumbHTML(d) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${FONT}${RESET}
  .thumb{width:1200px;height:630px;position:relative;overflow:hidden;
    background:radial-gradient(circle at 18% 22%,rgba(30,215,96,.10),transparent 42%),
    radial-gradient(circle at 88% 90%,rgba(30,215,96,.06),transparent 40%),#121212;
    display:flex;flex-direction:column;justify-content:center;padding:0 90px;}
  .thumb::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;
    background:linear-gradient(180deg,#1ed760,rgba(30,215,96,.15));}
  .label{font-size:22px;font-weight:700;letter-spacing:3px;color:#1ed760;
    text-transform:uppercase;margin-bottom:34px;}
  .label .dot{display:inline-block;width:9px;height:9px;border-radius:50%;
    background:#1ed760;margin-right:12px;vertical-align:middle;box-shadow:0 0 12px rgba(30,215,96,.8);}
  .title{font-size:78px;font-weight:800;line-height:1.22;letter-spacing:-2px;color:#fff;
    text-shadow:0 4px 30px rgba(0,0,0,.5);}
  .title .acc{color:#1ed760;text-shadow:0 0 30px rgba(30,215,96,.45);}
  .subtitle{font-size:26px;font-weight:500;color:#9a9a9a;margin-top:40px;}
  .accent-line{position:absolute;left:90px;bottom:78px;width:120px;height:4px;
    background:#1ed760;border-radius:2px;box-shadow:0 0 14px rgba(30,215,96,.6);}
  .watermark{position:absolute;right:46px;bottom:38px;font-size:20px;font-weight:700;color:#6f6f6f;}
  .watermark b{color:#1ed760;}
  </style></head><body>
  <div class="thumb" id="capture">
    <div class="label"><span class="dot"></span>${d.label}</div>
    <div class="title">${renderTitle(d.title, d.titleAccent)}</div>
    <div class="subtitle">${d.subtitle}</div>
    <div class="accent-line"></div>
    <div class="watermark"><b>jp</b>labor.com</div>
  </div></body></html>`;
}

// ── 4) 구분선 HTML (섹션별 1장) ──────────────────────
function dividerHTML(text, num) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${FONT}${RESET}
  .divider{width:1000px;height:90px;position:relative;overflow:hidden;background:#121212;
    display:flex;align-items:center;padding:0 40px;}
  .dot{width:13px;height:13px;border-radius:50%;background:#1ed760;
    box-shadow:0 0 12px rgba(30,215,96,.8);flex-shrink:0;margin-right:20px;}
  .txt{font-size:30px;font-weight:700;color:#fff;letter-spacing:-.5px;white-space:nowrap;flex-shrink:0;}
  .num{color:#1ed760;margin-right:10px;}
  .line{flex:1;height:2px;margin-left:28px;
    background:linear-gradient(90deg,rgba(30,215,96,.9),rgba(30,215,96,0));}
  </style></head><body>
  <div class="divider" id="capture"><span class="dot"></span>
    <span class="txt"><span class="num">${String(num).padStart(2,'0')}</span>${text}</span>
    <span class="line"></span></div></body></html>`;
}

// ── 5) CTA HTML ──────────────────────────────────────
function ctaHTML() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${FONT}${RESET}
  .cta{width:1000px;height:180px;position:relative;overflow:hidden;
    background:linear-gradient(100deg,#1ed760 0%,#17c155 60%,#11a847 100%);
    display:flex;align-items:center;justify-content:space-between;padding:0 56px;}
  .head{font-size:34px;font-weight:800;color:#063018;letter-spacing:-.6px;line-height:1.3;}
  .url{font-size:20px;font-weight:600;color:rgba(0,40,15,.55);margin-top:8px;}
  .cta-btn{background:#0a0a0a;color:#fff;font-size:26px;font-weight:700;
    padding:20px 40px;border-radius:9999px;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.25);}
  .cta-btn .arrow{color:#1ed760;margin-left:8px;}
  </style></head><body>
  <div class="cta" id="capture">
    <div><div class="head">더 복잡한 사안은<br>JP 노무사에게</div><div class="url">jplabor.com</div></div>
    <div class="cta-btn">상담문의<span class="arrow">→</span></div>
  </div></body></html>`;
}

// ── 6) 캡처 실행 ─────────────────────────────────────
// 로컬 PC: executablePath 줄을 지우면 playwright 기본 크롬 사용
const LAUNCH = process.env.PW_CHROME
  ? { executablePath: process.env.PW_CHROME }
  : {};

const browser = await chromium.launch(LAUNCH);
const page = await browser.newPage({ deviceScaleFactor: 2 });

async function shot(html, out) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const el = await page.$('#capture');
  await el.screenshot({ path: join(outDir, out) });
  console.log('  ✓', out);
}

console.log(`▶ "${data.slug}" 자산 생성 중...`);
await shot(thumbHTML(data), 'thumbnail.png');
let n = 1;
for (const s of data.sections) { await shot(dividerHTML(s, n), `divider-${n}.png`); n++; }
await shot(ctaHTML(), 'cta.png');

// ── 7) 원고 텍스트 저장 (네이버 붙여넣기용) ──────────
if (data.body) {
  writeFileSync(join(outDir, '원고.txt'), data.body, 'utf8');
  console.log('  ✓ 원고.txt');
}

await browser.close();
console.log(`✅ 완료 → blog-output/${data.slug}/`);
