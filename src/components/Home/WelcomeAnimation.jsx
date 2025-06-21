import React from "react";
import dynamic from "next/dynamic";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

const WelcomeAnimation = React.memo(({ animationData, isVisible }) => {
  if (!isVisible) return null;
  return (
    <div
      className="mb-4 text-center"
      style={{
        willChange: "opacity, transform",
        animation: "fadeIn 1s ease-in-out",
      }}
    >
      <LottiePlayer
        animationData={animationData}
        loop={true}
        play
        style={{ width: 150, height: 150, margin: "0 auto" }}
      />
    </div>
  );
});

export default WelcomeAnimation;