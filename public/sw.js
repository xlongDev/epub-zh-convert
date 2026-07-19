// 自愈式 Service Worker（清理脚本）
//
// 本项目是纯前端 EPUB 转换工具，本身不依赖 Service Worker。
// 但本机 localhost:3000 上某个早期项目曾注册过 /sw.js，浏览器每次导航都会
// 携带 `Service-Worker: script` 头重新请求 /sw.js 做更新检查，而 Next.js 16 的
// 内置 SW 路由在找不到 sw.js 源文件时会 500。这里提供一个合法、最小化的 SW：
// 一旦被当作更新安装，就主动注销自己，浏览器随后停止轮询 /sw.js，500 报错消失。
//
// 全新浏览器（无注册记录）永远不会请求 /sw.js，因此本文件对它们无副作用。

self.addEventListener('install', () => {
  self.skipWaiting();
  self.registration.unregister().catch(() => {});
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().catch(() => {})
  );
});
