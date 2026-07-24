import { useEffect } from "react";

// 动画与配置
import backgroundSchemes from "@/config/backgroundSchemes";
import { useAppStore } from "@/store/useAppStore";

// 子组件
import LayoutWrapper from "@/components/Home/LayoutWrapper";
import Header from "@/components/Home/Header";
import { useConversionLifecycle } from "@/components/Home/useConversionLifecycle";

// 主功能组件
import WelcomeAnimation from "@/components/WelcomeAnimation/WelcomeAnimation";
import DirectionSelector from "@/components/DirectionSelector/DirectionSelector";
import UploadSection from "@/components/UploadSection/UploadSection";
import ConvertedSection from "@/components/ConvertedSection/ConvertedSection";

export default function Home() {
  const backgroundScheme = useAppStore((s) => s.backgroundScheme);
  const setBackgroundScheme = useAppStore((s) => s.setBackgroundScheme);

  // 副作用统一收口：提示音、状态推导、下载提示
  useConversionLifecycle();

  // 延迟到下一帧读取 sessionStorage 并随机选取背景，避免 effect 内同步 setState 的级联渲染告警；
  // effect 不执行于服务端，首帧仍为默认值，因此 SSR 安全且水合一致
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
  }, [setBackgroundScheme]);

  return (
    <LayoutWrapper backgroundScheme={backgroundScheme}>
      <WelcomeAnimation isVisible={true} />

      <Header />

      <DirectionSelector />

      <UploadSection />

      <ConvertedSection />
    </LayoutWrapper>
  );
}
