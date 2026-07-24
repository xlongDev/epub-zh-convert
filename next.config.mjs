/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 类型安全由 `pnpm typecheck`(tsc --noEmit, TS 7) 单独把关；
  // 关闭 Next 构建期的 TS 检查，规避 Next 16.2.11 在检测到已安装 typescript 时
  // 仍误触发“自动安装”并崩溃(Turbopack worker `id is undefined`)的回归问题。
  typescript: {
    ignoreBuildErrors: true,
  },
  // 启用最新的实验性功能
  experimental: {
    // 优化打包：react-icons 为实际使用的图标库（多组件直接 import）；
    // react-lottie-player 经 Lottie.jsx 的 dynamic import 单独加载，无需在此列入。
    optimizePackageImports: ['react-icons'],
  },
  // 启用压缩
  compress: true,
  // 优化构建
  productionBrowserSourceMaps: false,
  // 静态资源（动画 JSON / 音频 / 图标）长期缓存：内容哈希不变，可安全设为 immutable
  async headers() {
    return [
      {
        source: '/animations/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:file.(mp3|ico|svg|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
