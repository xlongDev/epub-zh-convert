/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 启用最新的实验性功能
  experimental: {
    // 优化打包
    optimizePackageImports: ['react-icons', 'lottie-react'],
  },
  // 优化图片加载
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // 启用压缩
  compress: true,
  // 优化构建
  productionBrowserSourceMaps: false,
};

export default nextConfig;