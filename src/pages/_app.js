import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'framer-motion';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
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
          {/* 预加载欢迎动画 JSON：
              桌面端带宽充足，预加载可让动画随导航并行下载、更快出现；
              移动端带宽受限且该 JSON(≈534KB) 并非 LCP 元素（LCP 由 CSS 骨架即时绘制），
              预加载会与首屏关键资源争抢带宽、拖慢 FCP/LCP，因此仅在大屏预加载。 */}
          <link
            rel="preload"
            as="fetch"
            href="/animations/welcome.json"
            type="application/json"
            media="(min-width: 1024px)"
          />
        </Head>
        <Component {...pageProps} />
      </MotionConfig>
    </ThemeProvider>
  );
}

export default MyApp;