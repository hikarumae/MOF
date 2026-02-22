import { test, expect } from '@playwright/test';

test.describe('文書アップロード機能のE2Eテスト', () => {
  test('ユーザーが正しいファイルをアップロードし、成功メッセージが表示されること', async ({ page }) => {
    
    // 1. 【ベストプラクティス】API通信をモック化して、必ず「成功(200 OK)」を返すようにする
    await page.route('**/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'アップロード成功' }),
      });
    });

    await page.goto('http://localhost:3000/');
    const dummyFile = Buffer.from('dummy pdf content');

    // 2. ダイアログの出現を待機するPromiseを準備
    const dialogPromise = page.waitForEvent('dialog');

    // 3. ファイルをセットする
    await page.locator('input[type="file"]').setInputFiles({
      name: 'e2e-test-document.pdf',
      mimeType: 'application/pdf',
      buffer: dummyFile,
    });

    // 4. ダイアログを待ち、内容を検証する
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Azureへのアップロードが完了しました！');
    await dialog.accept();
    
  });
});