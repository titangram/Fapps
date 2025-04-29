// src/hooks/useTutorial.ts
import { useState, useEffect } from 'react';

const TUTORIAL_STORAGE_KEY = 'hasSeenTutorial'; // localStorage 的 key

interface UseTutorialReturn {
  showTutorial: boolean; // 是否显示教程
  markTutorialAsSeen: () => void; // 标记教程为已看过并关闭
}

const useTutorial = (): UseTutorialReturn => {
  const [showTutorial, setShowTutorial] = useState(false);

  // 在 hook 第一次被使用时检查 localStorage
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []); // 空依赖项，只在 hook 首次调用时运行一次

  // 标记教程为已看过并关闭
  const markTutorialAsSeen = () => {
    setShowTutorial(false);
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  };

  return {
    showTutorial,
    markTutorialAsSeen,
  };
};

export default useTutorial;