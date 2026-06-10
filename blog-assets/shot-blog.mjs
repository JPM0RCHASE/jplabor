import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

// 집 PC에서는 PW_CHROME 없이 실행 → playwright 기본 크롬 사용.
// (이 클라우드 환경에서만 PW_CHROME 경로 지정)
const LAUNCH = process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {};

const file = process.argv[2];                       // 예: blog-노조가입.html
const slug = file.split('/').pop().replace('blog-', '').replace('.html', '');

// 주제별 폴더: blog-output/[주제]/
const outDir = join(process.cwd(), 'blog-output', slug);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch(LAUNCH);
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto('file://' + process.cwd() + '/' + file);
await page.waitForTimeout(1800);

// 썸네일 + 면책조항만 이미지. 본문은 같은 폴더에 본문.txt(수기)로.
await (await page.$('#thumb')).screenshot({ path: join(outDir, 'thumbnail.png') });
await (await page.$('#disc')).screenshot({ path: join(outDir, 'disclaimer.png') });

console.log(`✅ 완료 → blog-output/${slug}/`);
console.log(`   · thumbnail.png   (썸네일)`);
console.log(`   · disclaimer.png  (면책조항)`);
console.log(`   · 본문.txt         (본문 텍스트 — 별도 작성, 네이버 복붙용)`);
await browser.close();
