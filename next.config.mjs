/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 启用最新的实验性功能
  experimental: {
    // 优化打包（lottie-react 已移除，仅保留实际使用的 react-icons）
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
