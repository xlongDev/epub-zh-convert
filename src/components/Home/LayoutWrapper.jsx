import React from "react";

export default function LayoutWrapper({ backgroundScheme, children }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${backgroundScheme.light} ${backgroundScheme.dark}`}
    >
      <div className="w-full max-w-2xl mx-4">
        {children}
      </div>
    </div>
  );
}
