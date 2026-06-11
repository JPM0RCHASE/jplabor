import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const [,, htmlFile, outFile] = process.argv;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chromePath = process.env.PW_CHROME;

const browser = await chromium.launch({ executablePath: chromePath });
const page = await browser.newPage({ viewport: { width: 2000, height: 1200 } });
await page.goto('file://' + path.resolve(__dirname, htmlFile));
await page.waitForTimeout(500);

const el = await page.$('#thumb');
await el.screenshot({ path: path.resolve(__dirname, outFile) });
await browser.close();
console.log('saved:', outFile);
