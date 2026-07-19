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
          {/* 预加载首屏欢迎动画 JSON，使其随导航并行下载，缩短 LCP */}
          <link
            rel="preload"
            as="fetch"
            href="/animations/welcome.json"
            type="application/json"
          />
        </Head>
        <Component {...pageProps} />
      </MotionConfig>
    </ThemeProvider>
  );
}

export default MyApp;