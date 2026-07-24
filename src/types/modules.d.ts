// 第三方模块类型兜底声明（仓库未提供类型，且不属于本项目自行维护的类型）

// react-lottie-player 未携带类型定义，统一声明为默认导出的组件模块，
// 由 next/dynamic 引入后仅透传动画相关 props，无需精确类型。
declare module "react-lottie-player";
