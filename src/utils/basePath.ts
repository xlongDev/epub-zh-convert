/**
 * 把指向 /public 下静态资源的绝对路径转为「相对路径」。
 *
 * 站点始终部署在某个子目录下（本地为 /，GitHub Pages 项目页为 /<repo>/），
 * 相对当前页面目录即可正确解析，无需依赖构建期内联的 NEXT_PUBLIC_* 环境变量
 * （Turbopack 当前不会把 NEXT_PUBLIC_* 内联进客户端产物，会导致 fetch 路径 404）。
 * next/image、next/link、next/router 会自动加 basePath，不需要本函数。
 *
 * @param path 形如 "/animations/welcome.json" 或 "favicon.ico"
 */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path; // 已是相对或外部地址
  return path.slice(1); // 去掉前导 /，改为相对路径（相对站点根目录）
}
