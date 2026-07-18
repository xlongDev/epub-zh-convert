import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { convertEpubBuffer } from "./zipUtils";

async function buildSampleEpub() {
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip");
  zip.file("OEBPS/chapter1.html", "<p>這是一段繁體文字</p>");
  zip.file("OEBPS/toc.ncx", "<nav>目錄</nav>");
  zip.file("OEBPS/cover.jpg", new Uint8Array([1, 2, 3, 4]));
  return zip.generateAsync({ type: "uint8array" });
}

describe("convertEpubBuffer", () => {
  it("转换文本内容并保持非文本文件原样", async () => {
    const buf = await buildSampleEpub();
    const { blob } = await convertEpubBuffer(buf, "t2s", () => {}, () => false);

    expect(blob).toBeTruthy();
    expect(typeof blob.arrayBuffer).toBe("function");

    const out = await JSZip.loadAsync(await blob.arrayBuffer());
    const html = await out.file("OEBPS/chapter1.html").async("text");
    expect(html).toContain("这是一段繁体文字");
    expect(html).not.toContain("這是一段繁體文字");

    const ncx = await out.file("OEBPS/toc.ncx").async("text");
    expect(ncx).toContain("目录");

    // 非文本（图片）应原样保留
    const img = await out.file("OEBPS/cover.jpg").async("uint8array");
    expect(Array.from(img)).toEqual([1, 2, 3, 4]);
  });

  it("取消时抛出 AbortError", async () => {
    const buf = await buildSampleEpub();
    let threw = false;
    try {
      await convertEpubBuffer(buf, "t2s", () => {}, () => true);
    } catch (e) {
      threw = true;
      expect(e.name).toBe("AbortError");
    }
    expect(threw).toBe(true);
  });

  it("s2t 方向反向转换", async () => {
    const zip = new JSZip();
    zip.file("OEBPS/ch.html", "<p>这是简体</p>");
    const buf = await zip.generateAsync({ type: "uint8array" });
    const { blob } = await convertEpubBuffer(buf, "s2t", () => {}, () => false);
    const out = await JSZip.loadAsync(await blob.arrayBuffer());
    const html = await out.file("OEBPS/ch.html").async("text");
    expect(html).toContain("這是簡體");
  });
});
