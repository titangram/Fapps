// src/hooks/useCountdown.ts
import { useState, useEffect } from 'react';

interface UseCountdownOptions {
  initialValue: number; // 倒计时开始的数值
  startTrigger: boolean; // 控制倒计时是否开始/运行的布尔值
  onCountdownEnd: () => void; // 倒计时结束时调用的回调函数
}

const useCountdown = ({ initialValue, startTrigger, onCountdownEnd }: UseCountdownOptions) => {
  const [countdownValue, setCountdownValue] = useState(initialValue);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // 当 startTrigger 为 true 且 countdownValue > 0 时开始倒计时
    if (startTrigger && countdownValue > 0) {
      timer = setTimeout(() => {
        setCountdownValue(prevValue => prevValue - 1);
      }, 1000);
    } else if (startTrigger && countdownValue === 0) {
      // 倒计时结束
      onCountdownEnd(); // 调用结束回调
      // setCountdownValue(initialValue); // 可选：倒计时结束后重置数值，以便下次开始
    }

    // 当 startTrigger 变为 false 时，停止计时器并重置数值
    if (!startTrigger && countdownValue !== initialValue) {
        setCountdownValue(initialValue);
    }


    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [initialValue, startTrigger, countdownValue, onCountdownEnd]); // 依赖项

  // 返回当前的倒计时数值
  return countdownValue;
};

export default useCountdown;