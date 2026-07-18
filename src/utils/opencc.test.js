import { describe, it, expect } from "vitest";
import { convertText, convertFilename } from "./opencc";

describe("convertText", () => {
  it("繁转简 (t2s)", () => {
    expect(convertText("說明", "t2s")).toBe("说明");
  });

  it("简转繁 (s2t)", () => {
    expect(convertText("说明", "s2t")).toBe("說明");
  });

  it("未知方向原样返回", () => {
    expect(convertText("hello", "unknown")).toBe("hello");
  });

  it("默认方向为 t2s", () => {
    expect(convertText("說明")).toBe("说明");
  });
});

describe("convertFilename", () => {
  it("转换文件名并保留 .epub 扩展名", () => {
    expect(convertFilename("說明.epub", "t2s")).toBe("说明.epub");
  });

  it("无扩展名时追加 .epub", () => {
    expect(convertFilename("book", "t2s")).toBe("book.epub");
  });

  it("简转繁文件名", () => {
    expect(convertFilename("说明.epub", "s2t")).toBe("說明.epub");
  });
});
