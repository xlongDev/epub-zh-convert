import React from "react";
import type { ReactNode } from "react";
import type { BackgroundScheme } from "@/types";

interface LayoutWrapperProps {
  backgroundScheme: BackgroundScheme;
  children: ReactNode;
}

export default function LayoutWrapper({ backgroundScheme, children }: LayoutWrapperProps) {
  return (
    <div
      className={`min-h-screen flex items-start justify-center ${backgroundScheme.light} ${backgroundScheme.dark}`}
    >
      <main className="w-full max-w-2xl mx-4 min-h-[600px]">
        {children}
      </main>
    </div>
  );
}
