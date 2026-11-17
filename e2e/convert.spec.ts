import { test, expect } from "@playwright/test";
import JSZip from "jszip";

async function makeEpub(): Promise<Buffer> {
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip");
  zip.file("OEBPS/chapter1.html", "<p>這是一段繁體文字</p>");
  return zip.generateAsync({ type: "nodebuffer" });
}

test("上传 EPUB → 繁转简 → 下载结果，全链路内容正确", async ({ page }) => {
  await page.goto("/");

  await page.locator("#file-upload").setInputFiles({
    name: "測試.epub",
    mimeType: "application/epub+zip",
    buffer: await makeEpub(),
  });

  await page.getByRole("button", { name: /开始转换/ }).click();

  // 转换完成后结果区出现对应文件的下载按钮（文件名同步转简体）
  const downloadBtn = page.getByRole("button", { name: "下载 测试.epub" });
  await expect(downloadBtn).toBeVisible({ timeout: 30_000 });

  const download = await Promise.all([page.waitForEvent("download"), downloadBtn.click()]).then(
    ([d]) => d,
  );

  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const c of stream) chunks.push(Buffer.from(c));
  const out = await JSZip.loadAsync(Buffer.concat(chunks));
  const html = await out.file("OEBPS/chapter1.html")!.async("text");
  expect(html).toContain("这是一段繁体文字");
  expect(html).not.toContain("這是一段繁體文字");
});
