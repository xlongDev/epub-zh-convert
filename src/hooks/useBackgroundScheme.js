import { useState, useEffect } from "react";
import backgroundSchemes from "@/config/backgroundSchemes";

export default function useBackgroundScheme() {
  const [backgroundScheme, setBackgroundScheme] = useState(backgroundSchemes[0]);

  // 仅在客户端完成挂载后读取 sessionStorage 并随机选取背景。
  // 用 requestAnimationFrame 把 setState 推迟到下一帧，避免 effect 内同步 setState 的级联渲染告警；
  // effect 不执行于服务端，且首帧仍为默认值，因此 SSR 安全且水合一致。
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const savedScheme = sessionStorage.getItem("backgroundScheme");
      if (savedScheme) {
        const randomScheme =
          backgroundSchemes[Math.floor(Math.random() * backgroundSchemes.length)];
        setBackgroundScheme(randomScheme);
      } else {
        sessionStorage.setItem(
          "backgroundScheme",
          JSON.stringify(backgroundSchemes[0])
        );
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return backgroundScheme;
}