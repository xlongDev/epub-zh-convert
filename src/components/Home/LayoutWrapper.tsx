import type { ReactNode } from "react";
import type { BackgroundScheme } from "@/types";

interface LayoutWrapperProps {
  backgroundScheme: BackgroundScheme;
  children: ReactNode;
}

export default function LayoutWrapper({ backgroundScheme, children }: LayoutWrapperProps) {
  return (
    <div
      className={`relative isolate min-h-screen flex items-start justify-center ${backgroundScheme.light} ${backgroundScheme.dark}`}
    >
      {/* 暗色环境光：给玻璃表面提供可折射的明暗起伏，浅色模式保持原样 */}
      <div aria-hidden="true" className="liquid-ambient hidden dark:block">
        <div className="liquid-ambient__orb liquid-ambient__orb--sky" />
        <div className="liquid-ambient__orb liquid-ambient__orb--indigo" />
        <div className="liquid-ambient__orb liquid-ambient__orb--teal" />
      </div>
      <main className="relative z-10 w-full max-w-2xl mx-4 min-h-[600px]">{children}</main>
    </div>
  );
}
