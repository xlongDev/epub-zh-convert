[简体中文](README_zh.md) · [English](README.md) · 繁體中文

# EPUB 繁簡轉換工具

一個基於 React 和 Next.js 的網頁工具，可將 EPUB 文件中的中文在繁體與簡體之間互轉。它提供友善的介面，支援拖曳上傳、批次轉換、即時進度與單獨 / 批次下載。**所有轉換都在你的瀏覽器本地完成，文件不會上傳到任何伺服器。**

## 簡介

這是一個基於 React 和 Next.js 的 EPUB 繁簡轉換工具，支援將 EPUB 文件中的繁體中文轉換為簡體中文，或簡體中文轉換為繁體中文。工具提供了友善的使用者介面，支援拖曳上傳、批次轉換和下載功能。

## 功能

- **繁簡互轉**：支援繁體轉簡體，或簡體轉繁體。
- **拖曳上傳**：直接將 EPUB 文件拖入上傳區域。
- **批次轉換**：一次上傳多個 EPUB 文件並批次轉換。
- **即時進度**：轉換過程中顯示即時進度條與動畫。
- **靈活下載**：轉換完成後可單獨或批次下載文件。
- **暫停 / 繼續**：轉換過程中可暫停佇列（目前文件處理完即停），再點擊繼續從中斷處恢復，已轉換的結果不會遺失。
- **清空全部**：結果區提供「清空全部」按鈕，經二次確認後一次性清空上傳清單與轉換結果，方便快速開始新一批任務。
- **主題支援**：透過 next-themes 提供淺色 / 深色 / 跟隨系統主題。
- **本地私密**：轉換在瀏覽器內完成，文件不會離開你的電腦。下載完成的物件 URL 會立即釋放，剪貼簿分享的連結在頁面卸載時統一回收，記憶體佔用始終有界。

## 技術棧

- **前端**：React 19、Next.js 16（Pages Router）、Tailwind CSS v4、Framer Motion
- **工具庫**：JSZip、opencc-js
- **動畫**：Framer Motion、react-lottie-player
- **測試**：Vitest
- **執行環境**：轉換優先在 Web Worker 中執行，確保大文件不凍結介面

## 安裝

```bash
pnpm install
# 或
npm install
# 或
yarn install
```

## 使用方式

1. **啟動開發伺服器**

   ```bash
   pnpm dev
   ```

   然後開啟終端機印出的本地地址（預設 http://localhost:3000）。

2. **選擇方向** —— 使用選擇器切換「繁 → 簡」（`t2s`）或「簡 → 繁」（`s2t`）。

3. **新增 EPUB 文件** —— 將 EPUB 文件拖入上傳區域，或點擊選擇。可一次新增多個文件批次轉換。

4. **開始轉換** —— 點擊轉換按鈕，進度條會即時顯示狀態。大體積書籍在背景 Web Worker 中處理，介面始終流暢。

5. **下載** —— 單一文件完成後可單獨下載，或使用「全部下載」一次取得所有結果。

6. **暫停 / 繼續** —— 轉換過程中點擊「暫停」，目前文件處理完即暫停佇列，進度區顯示「已暫停」；點擊「繼續」從中斷處恢復。暫停是中性操作，不會丟棄已轉換的文件。

7. **清空全部** —— 轉換完成後，結果區頭部出現「清空全部」按鈕（轉換中禁用）。點擊後彈出確認框，列出將移除的上傳清單與結果文件數量；確認後一次性清空兩類清單，回到乾淨的初始狀態。

## 設定選項

多數行為由介面控制，但以下幾個位置便於在程式碼中自訂：

- **轉換方向** —— `t2s`（繁 → 簡）與 `s2t`（簡 → 繁）定義在 [`src/utils/opencc.js`](src/utils/opencc.js)，目前方向由介面上的 `DirectionSelector` 選擇。
- **背景漸變方案** —— 編輯 [`src/config/backgroundSchemes.js`](src/config/backgroundSchemes.js)。每個條目是一對 `{ light, dark }` 的 Tailwind 漸變類名字串，每次會話隨機選取（存入 `sessionStorage`）。向陣列追加物件即可新增方案。
- **主題** —— 由 `next-themes` 驅動。`ThemeToggle` 元件可切換淺色 / 深色，並自動偵測系統偏好；手動選擇會存入 `sessionStorage` 的 `theme` 鍵。
- **轉換引擎** —— 核心純函式 [`convertEpubBuffer(arrayBuffer, direction, onProgress, isCancelled)`](src/utils/zipUtils.js) 刻意不依賴瀏覽器 `File` / `FileReader` API，因此可在 Web Worker（[`src/workers/convert.worker.js`](src/workers/convert.worker.js)）中執行。若 Worker 建立失敗，會自動降級回主執行緒。

## 開發與測試

常用腳本：

```bash
pnpm install        # 安裝依賴
pnpm dev            # 本地開發（Turbopack）
pnpm build          # 生產構建
pnpm start          # 啟動生產服務
pnpm lint           # 程式碼檢查（ESLint）
pnpm test           # 單元測試（Vitest）
```

**構建環境注意**：若在強制注入 `--use-system-ca` 等 Node 選項的沙箱環境中執行 `pnpm build`，Turbopack 啟動 Worker 時可能報 `ERR_WORKER_INVALID_EXEC_ARGV`。請先剝離該選項（僅保留必要的 shim）再構建；普通本地環境無需此操作。

## 貢獻指南

歡迎提交 Issue 或 Pull Request！請確保程式碼風格一致，並附上詳細的改動說明。

## 授權

本專案採用 MIT 授權條款，詳情請參閱 [LICENSE](LICENSE) 文件。

## 聯絡

- 信箱：byte7956@gmail.com
- GitHub：xlongDev
