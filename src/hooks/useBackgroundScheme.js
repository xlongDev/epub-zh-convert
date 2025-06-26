import { useState, useEffect } from "react";
import backgroundSchemes from "@/config/backgroundSchemes";

export default function useBackgroundScheme() {
  const [backgroundScheme, setBackgroundScheme] = useState(backgroundSchemes[0]);

  useEffect(() => {
    const savedScheme = sessionStorage.getItem("backgroundScheme");
    if (savedScheme) {
      const randomScheme = backgroundSchemes[Math.floor(Math.random() * backgroundSchemes.length)];
      setBackgroundScheme(randomScheme);
    } else {
      sessionStorage.setItem("backgroundScheme", JSON.stringify(backgroundSchemes[0]));
    }
  }, []);

  return backgroundScheme;
}