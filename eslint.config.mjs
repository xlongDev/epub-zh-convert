import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 允许未使用的变量（开发时常用）
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      // 其他自定义规则可以在这里添加
    }
  }
];

export default eslintConfig;
