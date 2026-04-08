/**
 * 页面截图工具
 *
 * 使用方法：
 * 1. 在 config.cjs 中填入 GITEE_TOKEN
 * 2. 运行: node screenshots/capture.cjs
 * 3. 截图保存在 screenshots/screenshots/ 目录
 *
 * 注意：提交前确保 config.cjs 中 TOKEN 为空！
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { GITEE_TOKEN, MOBILE_VIEWPORT, PAGES } = require('./config.cjs');

// 检查 Token
if (!GITEE_TOKEN) {
  console.error('❌ 错误: 请在 config.cjs 中填入 GITEE_TOKEN');
  console.error('   提示: 从 Gitee 设置 -> 私人令牌 中获取');
  process.exit(1);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: MOBILE_VIEWPORT,
    isMobile: true,
  });

  const dir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // 浅色模式
  console.log('\n=== 浅色模式截图 ===\n');
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('SYNC_ENDPOINT', 'gitee');
    localStorage.setItem('gitee_user_token', 'YOUR_TOKEN_HERE');
    localStorage.setItem('user-store', '{"state":{"id":1,"name":"test","loading":false},"version":0}');
    localStorage.setItem('book-store', '{"state":{"currentBookId":"test-book-id","visible":false},"version":0}');
  });

  // 替换 Token
  await page.addInitScript((token) => {
    localStorage.setItem('gitee_user_token', token);
  }, GITEE_TOKEN);

  for (const p of PAGES) {
    console.log(`${p.name}: ${p.path}`);
    await page.goto(`http://localhost:5173${p.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // 处理账本弹窗
    try {
      await page.click('[role="dialog"] button[role="checkbox"]', { timeout: 2000 });
      await page.waitForTimeout(500);
      await page.click('[role="dialog"] button:has-text("确认")');
      await page.waitForTimeout(2000);
    } catch {}

    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(dir, `light-${p.name}.png`) });
    console.log(`  ✓ light-${p.name}.png`);
  }
  await page.close();

  // 深色模式
  console.log('\n=== 深色模式截图 ===\n');
  const dark = await context.newPage();

  await dark.addInitScript(() => {
    localStorage.setItem('SYNC_ENDPOINT', 'gitee');
    localStorage.setItem('gitee_user_token', 'YOUR_TOKEN_HERE');
    localStorage.setItem('user-store', '{"state":{"id":1,"name":"test","loading":false},"version":0}');
    localStorage.setItem('book-store', '{"state":{"currentBookId":"test-book-id","visible":false},"version":0}');
    localStorage.setItem('preference-store', '{"state":{"theme":"dark"},"version":0}');
  });

  await dark.addInitScript((token) => {
    localStorage.setItem('gitee_user_token', token);
  }, GITEE_TOKEN);

  for (const p of PAGES) {
    console.log(`${p.name}: ${p.path}`);
    await dark.goto(`http://localhost:5173${p.path}`, { waitUntil: 'networkidle' });
    await dark.waitForTimeout(3000);
    await dark.evaluate(() => document.documentElement.classList.add('dark'));

    try {
      await dark.click('[role="dialog"] button[role="checkbox"]', { timeout: 2000 });
      await dark.waitForTimeout(500);
      await dark.click('[role="dialog"] button:has-text("确认")');
      await dark.waitForTimeout(2000);
    } catch {}

    await dark.waitForTimeout(5000);
    await dark.evaluate(() => document.documentElement.classList.add('dark'));
    await dark.screenshot({ path: path.join(dir, `dark-${p.name}.png`) });
    console.log(`  ✓ dark-${p.name}.png`);
  }
  await dark.close();
  await browser.close();

  console.log('\n✅ 截图完成!');
  console.log(`📁 保存目录: ${dir}`);
}

main().catch(console.error);