import { useRef, useEffect } from "react";

export default function useSoundEffect(soundFile) {
  const audioRef = useRef(null);
  const userInteractedRef = useRef(false);
  const audioContextRef = useRef(null);

  useEffect(() => {
    // 创建音频对象
    audioRef.current = new Audio(soundFile);
    
    // 尝试恢复音频上下文
    const tryResumeAudioContext = async () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        try {
          await audioContextRef.current.resume();
          console.log("AudioContext resumed successfully");
        } catch (e) {
          console.error("Failed to resume AudioContext:", e);
        }
      }
    };

    const handleUserInteraction = () => {
      if (!userInteractedRef.current) {
        // 创建音频上下文
        try {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          
          // 创建音频节点
          const source = audioContextRef.current.createMediaElementSource(audioRef.current);
          source.connect(audioContextRef.current.destination);
          
          userInteractedRef.current = true;
          
          // 移除事件监听
          window.removeEventListener("click", handleUserInteraction);
          window.removeEventListener("keydown", handleUserInteraction);
          window.removeEventListener("touchstart", handleUserInteraction);
          
          console.log("Audio unlocked by user interaction");
        } catch (e) {
          console.error("Failed to create AudioContext:", e);
        }
      }
    };

    // 添加用户交互监听
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    // 清理函数
    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      
      // 清理音频资源
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [soundFile]);

  const playSound = async () => {
    if (!userInteractedRef.current || !audioRef.current) {
      console.log("Audio not ready - user hasn't interacted yet");
      return;
    }
    
    try {
      // 确保音频上下文已恢复
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      
      // 重置并播放音频
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.2;
      await audioRef.current.play();
      console.log("Sound played successfully");
      return true;
    } catch (e) {
      console.error("Failed to play sound:", e);
      return false;
    }
  };

  return playSound;
}