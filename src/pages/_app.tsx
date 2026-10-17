import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { installGlobalErrorHandlers } from "@/utils/errorReporter";
import { withBasePath } from "@/utils/basePath";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  // 安装全局错误钩子（运行时异常 / 未处理 Promise 拒绝），让 Worker 崩溃等可见
  useEffect(() => {
    const cleanup = installGlobalErrorHandlers();
    return cleanup;
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <MotionConfig reducedMotion="user">
        <Head>
          <html lang="zh-CN" />
          <title>EPUB 繁简转换 | epub-zh-convert</title>
          <meta
            name="description"
            content="在线 EPUB 繁简（繁体/简体）转换工具，支持批量上传、实时进度与一键下载。"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script
            type="application/ld+json"
            // 结构化数据：帮助搜索引擎理解这是一个 Web 应用
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "EPUB 繁简转换",
                description:
                  "在线 EPUB 繁简（繁体/简体）转换工具，支持批量上传、实时进度与一键下载。",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Any",
                inLanguage: "zh-CN",
              }),
            }}
          />
          {/* 预加载欢迎动画 JSON：
              桌面端带宽充足，预加载可让动画随导航并行下载、更快出现；
              移动端带宽受限且该 JSON(≈534KB) 并非 LCP 元素（LCP 由 CSS 骨架即时绘制），
              预加载会与首屏关键资源争抢带宽、拖慢 FCP/LCP，因此仅在大屏预加载。 */}
          <link
            rel="preload"
            as="fetch"
            href={withBasePath("/animations/welcome.json")}
            type="application/json"
            media="(min-width: 1024px)"
          />
        </Head>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default MyApp;
