const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

test.describe('쇼핑 리스트 앱', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FILE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle('쇼핑 리스트');
    await expect(page.locator('h1')).toContainText('쇼핑 리스트');
    await expect(page.locator('#itemInput')).toBeVisible();
    await expect(page.locator('.btn-add')).toBeVisible();
    await expect(page.locator('#empty')).toBeVisible();
  });

  test('아이템 추가 - 버튼 클릭', async ({ page }) => {
    await page.fill('#itemInput', '사과');
    await page.click('.btn-add');
    const items = page.locator('li');
    await expect(items).toHaveCount(1);
    await expect(items.first().locator('.item-text')).toHaveText('사과');
    await expect(page.locator('#empty')).not.toBeVisible();
  });

  test('아이템 추가 - Enter 키', async ({ page }) => {
    await page.fill('#itemInput', '바나나');
    await page.press('#itemInput', 'Enter');
    await expect(page.locator('li')).toHaveCount(1);
    await expect(page.locator('.item-text').first()).toHaveText('바나나');
  });

  test('빈 입력으로 추가 시 무시된다', async ({ page }) => {
    await page.fill('#itemInput', '   ');
    await page.click('.btn-add');
    await expect(page.locator('li')).toHaveCount(0);
    await expect(page.locator('#empty')).toBeVisible();
  });

  test('여러 아이템 추가', async ({ page }) => {
    const items = ['우유', '계란', '빵'];
    for (const item of items) {
      await page.fill('#itemInput', item);
      await page.press('#itemInput', 'Enter');
    }
    await expect(page.locator('li')).toHaveCount(3);
    await expect(page.locator('.item-text').first()).toHaveText('빵');
  });

  test('아이템 삭제', async ({ page }) => {
    await page.fill('#itemInput', '지울 항목');
    await page.press('#itemInput', 'Enter');
    await expect(page.locator('li')).toHaveCount(1);
    await page.click('.btn-delete');
    await expect(page.locator('li')).toHaveCount(0);
    await expect(page.locator('#empty')).toBeVisible();
  });

  test('여러 아이템 중 특정 아이템 삭제', async ({ page }) => {
    for (const name of ['항목A', '항목B', '항목C']) {
      await page.fill('#itemInput', name);
      await page.press('#itemInput', 'Enter');
    }
    await expect(page.locator('li')).toHaveCount(3);
    await page.locator('li').nth(1).locator('.btn-delete').click();
    await expect(page.locator('li')).toHaveCount(2);
  });

  test('아이템 체크', async ({ page }) => {
    await page.fill('#itemInput', '우유');
    await page.press('#itemInput', 'Enter');
    const item = page.locator('li').first();
    await expect(item).not.toHaveClass(/checked/);
    await item.locator('.checkbox').click();
    await expect(item).toHaveClass(/checked/);
    await expect(item.locator('.item-text')).toHaveCSS('text-decoration', /line-through/);
  });

  test('아이템 체크 해제', async ({ page }) => {
    await page.fill('#itemInput', '계란');
    await page.press('#itemInput', 'Enter');
    const item = page.locator('li').first();
    await item.locator('.checkbox').click();
    await expect(item).toHaveClass(/checked/);
    await item.locator('.checkbox').click();
    await expect(item).not.toHaveClass(/checked/);
  });

  test('완료 항목 수 요약 표시', async ({ page }) => {
    for (const name of ['항목1', '항목2', '항목3']) {
      await page.fill('#itemInput', name);
      await page.press('#itemInput', 'Enter');
    }
    await page.locator('li').first().locator('.checkbox').click();
    const summary = page.locator('#summary');
    await expect(summary).toContainText('총 3개 중');
    await expect(summary).toContainText('1개');
  });

  test('완료 항목 모두 삭제 버튼', async ({ page }) => {
    for (const name of ['항목1', '항목2', '항목3']) {
      await page.fill('#itemInput', name);
      await page.press('#itemInput', 'Enter');
    }
    await expect(page.locator('#clearBtn')).not.toBeVisible();
    await page.locator('li').nth(0).locator('.checkbox').click();
    await page.locator('li').nth(1).locator('.checkbox').click();
    await expect(page.locator('#clearBtn')).toBeVisible();
    await page.click('#clearBtn');
    await expect(page.locator('li')).toHaveCount(1);
    await expect(page.locator('#clearBtn')).not.toBeVisible();
  });

  test('localStorage에 데이터가 저장된다', async ({ page }) => {
    await page.fill('#itemInput', '지속성 테스트');
    await page.press('#itemInput', 'Enter');
    await page.reload();
    await expect(page.locator('li')).toHaveCount(1);
    await expect(page.locator('.item-text').first()).toHaveText('지속성 테스트');
  });

  test('XSS 방어 - 특수문자 안전 처리', async ({ page }) => {
    await page.fill('#itemInput', '<script>alert(1)</script>');
    await page.press('#itemInput', 'Enter');
    const itemText = page.locator('.item-text').first();
    await expect(itemText).toBeVisible();
    await expect(itemText).toHaveText('<script>alert(1)</script>');
  });
});