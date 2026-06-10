import { chromium } from 'playwright';

// 집 PC에서는 PW_CHROME 없이 실행 → playwright 기본 크롬 사용.
// (이 클라우드 환경에서만 PW_CHROME 경로 지정)
const LAUNCH = process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {};

const browser = await chromium.launch(LAUNCH);
const page = await browser.newPage({ deviceScaleFactor: 2 });
const file = process.argv[2];
const slug = file.replace('blog-', '').replace('.html', '');

await page.goto('file://' + process.cwd() + '/' + file);
await page.waitForTimeout(1800);

// 썸네일 + 면책조항만 이미지로. 본문은 별도 .txt(수기 정돈)로 붙여넣기.
await (await page.$('#thumb')).screenshot({ path: `output-${slug}-thumb.png` });
await (await page.$('#disc')).screenshot({ path: `output-${slug}-disc.png` });

console.log(`✅ 이미지 2장 저장 완료 → ${slug}`);
console.log(`   · output-${slug}-thumb.png  (썸네일)`);
console.log(`   · output-${slug}-disc.png   (면책조항)`);
console.log(`   · output-${slug}-본문.txt    (본문은 텍스트 파일로 별도 — 네이버 복붙용)`);
await browser.close();
