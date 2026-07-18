import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    // 构建产物与依赖目录不参与 lint
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // 允许未使用的变量（开发时常用）
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      // 以下规则来自 eslint-config-next@16 升级带来的 react-hooks v7 / 显示名检查。
      // 它们多为风格性或强主观规则，直接重构全部组件存在回归风险，故按团队习惯放宽：
      // - display-name：箭头函数组件大量触发，纯展示性，不影响运行
      "react/display-name": "off",
      // - set-state-in-effect：原 4 处（mounted 标记、sessionStorage 随机背景、
      //   sessionStorage 初始化、错误态派生）已用正确 React 模式重构，现已合规并
      //   重新启用为 error：
      //   · ThemeToggle 的 mounted 标记改用 useSyncExternalStore（水合安全）
      //   · 随机背景 / sessionStorage 初始化改用 requestAnimationFrame 延迟 setState
      //   · index.jsx 的错误态复位同样改为 rAF 延迟，提示音拆为独立副作用 effect
      "react-hooks/set-state-in-effect": "error",
      // 以下两条回开（来自 react-hooks v7）：
      // - immutability：能抓到直接变更 state 的 bug，安全收益高
      "react-hooks/immutability": "error",
      // - exhaustive-deps：仅作可见性 warning，不阻断构建/lint
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
