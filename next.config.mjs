/** @type {import('next').NextConfig} */
// 仅当为 GitHub Pages 静态导出构建时才切换为 export 模式：
// - CI 中 `actions/configure-pages` 会注入 NEXT_BASE_PATH（如 /epub-zh-convert）
// - 本地/ Vercel 构建不设置该变量，保持默认的服务端输出
const isGitHubPages = !!process.env.NEXT_BASE_PATH || process.env.NEXT_EXPORT === "1";

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
    optimizePackageImports: ["react-icons"],
  },
  // 启用压缩
  compress: true,
  // 优化构建
  productionBrowserSourceMaps: false,
  // GitHub Pages 是纯静态托管：开启静态导出、关闭图片优化（无服务器）。
  // 这两个选项只在导出构建时生效，不干扰 Vercel/本地服务端构建。
  ...(isGitHubPages
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {
        // 本地 / Vercel 构建保留 headers 缓存策略（静态导出不支持 headers()）。
        // 静态资源（动画 JSON / 音频 / 图标）长期缓存：内容哈希不变，可安全设为 immutable
        async headers() {
          return [
            {
              source: "/animations/:path*",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
            {
              source: "/:file.(mp3|ico|svg|woff2)",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
          ];
        },
      }),
  // basePath 仅在 GitHub Pages 构建时由 configure-pages 注入；本地 dev / Vercel 保持为空。
  // 仅影响 Next 自身的 _next 资源与路由前缀；手动资源路径由 withBasePath() 用相对路径处理。
  basePath: process.env.NEXT_BASE_PATH || "",
};

export default nextConfig;
