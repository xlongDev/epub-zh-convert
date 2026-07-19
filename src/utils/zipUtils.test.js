import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { convertEpubBuffer, convertEpub } from "./zipUtils";

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

  it("mimetype 必须为 ZIP 首个条目且以 STORED（未压缩）存储", async () => {
    // 故意把 mimetype 放在后面，制造不合规顺序，验证转换后会纠正
    const zip = new JSZip();
    zip.file("OEBPS/chapter1.html", "<p>這是一段繁體文字</p>");
    zip.file("mimetype", "application/epub+zip");
    const buf = await zip.generateAsync({ type: "uint8array" });

    const { blob } = await convertEpubBuffer(buf, "t2s", () => {}, () => false);

    // 解析 ZIP 本地文件头，读取第一个条目的名称与压缩方式
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let first = null;
    for (let i = 0; i < bytes.length - 4; i++) {
      if (
        bytes[i] === 0x50 &&
        bytes[i + 1] === 0x4b &&
        bytes[i + 2] === 0x03 &&
        bytes[i + 3] === 0x04
      ) {
        const view = new DataView(bytes.buffer, i);
        const compression = view.getUint16(8, true); // 压缩方式（offset 8）
        const nameLen = view.getUint16(26, true);
        let name = "";
        for (let j = 0; j < nameLen; j++) {
          name += String.fromCharCode(bytes[i + 30 + j]);
        }
        first = { name, compression };
        break;
      }
    }
    expect(first).not.toBeNull();
    expect(first.name).toBe("mimetype");
    expect(first.compression).toBe(0); // 0 = STORED（未压缩）
  });

  it("convertEpub 返回转换后的 blob 并重命名文件", async () => {
    const zip = new JSZip();
    zip.file("mimetype", "application/epub+zip");
    zip.file("OEBPS/ch.html", "<p>這是繁體</p>");
    const buf = await zip.generateAsync({ type: "uint8array" });
    const file = new File([buf], "說明.epub", {
      type: "application/epub+zip",
    });

    const { blob, name } = await convertEpub(
      file,
      () => {},
      new AbortController().signal,
      "t2s"
    );
    expect(name).toBe("说明.epub");
    const out = await JSZip.loadAsync(await blob.arrayBuffer());
    const html = await out.file("OEBPS/ch.html").async("text");
    expect(html).toContain("这是繁体");
  });
});
