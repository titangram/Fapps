// src/hooks/useGameTimer.ts
import { useState, useEffect } from 'react';

interface UseGameTimerOptions {
  initialDuration: number; // 游戏总时长
  startTrigger: boolean; // 控制计时器是否开始/运行的布尔值 (比如 gameState === 'playing')
  onTimerEnd: () => void; // 计时结束时调用的回调函数
}

const useGameTimer = ({ initialDuration, startTrigger, onTimerEnd }: UseGameTimerOptions) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // 当 startTrigger 为 true 且 timeLeft > 0 时开始计时
    if (startTrigger && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (startTrigger && timeLeft === 0) {
      // 计时结束
      onTimerEnd(); // 调用结束回调
      // setTimeLeft(initialDuration); // 可选：计时结束后重置数值
    }

    // 当 startTrigger 变为 false 时，停止计时器并重置数值
     if (!startTrigger && timeLeft !== initialDuration) {
         setTimeLeft(initialDuration);
     }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [initialDuration, startTrigger, timeLeft, onTimerEnd]); // 依赖项

  // 返回剩余时间
  return timeLeft;
};

export default useGameTimer;