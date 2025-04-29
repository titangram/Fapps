// src/components/PlayingScreen.tsx
import React from 'react';
import GameInfo from './GameInfo';
import styles from './PlayingScreen.module.css'; // 导入 CSS Module

// 定义可能的滑动方向 (这里可以重复定义，或者从 App.tsx 导入)
type SwipeDirection = 'left' | 'right';

// 定义 PlayingScreen 组件接收的 props 类型 (更新以接收 requiredDirection)
interface PlayingScreenProps {
  score: number;
  timeLeft: number;
  // currentWord: string; // 不再接收 currentWord
  requiredDirection: SwipeDirection; // --> 新增：当前回合需要滑动的方向
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  // handleCorrect: () => void; // 不直接使用
  // handleSkip: () => void;     // 不直接使用
}

// PlayingScreen 组件：负责显示游戏进行中的界面 (新的方向挑战玩法)
const PlayingScreen: React.FC<PlayingScreenProps> = ({
  score,
  timeLeft,
  requiredDirection, // 接收需要滑动的方向
  onTouchStart,
  onTouchEnd,
}) => {

  // 根据方向显示不同的视觉提示 (例如：大箭头或文字)
  const directionText = requiredDirection === 'left' ? '向左滑动' : '向右滑动';
  // 或者可以使用箭头符号
  // const directionSymbol = requiredDirection === 'left' ? '←' : '→';


  return (
    <>
      {/* 顶部区域显示得分和计时器 - 使用 GameInfo 组件 */}
      <GameInfo score={score} timeLeft={timeLeft} />

      {/*
        中间区域显示方向提示，并作为主要的滑动检测区域
        onTouchStart 和 onTouchEnd 事件监听器在这里
      */}
      <div
        className="word-display full-screen-swipe-area" // 基础布局样式
        onTouchStart={onTouchStart} // 绑定触摸开始事件
        onTouchEnd={onTouchEnd}     // 绑定触摸结束事件 (滑动检测和动作触发)
        // 可以添加 key prop 来触发动画，比如 key={requiredDirection}
        key={requiredDirection}
      >
        {/* 显示当前回合需要滑动的方向提示 */}
        {/* 可以根据需要调整样式，让提示更醒目 */}
        <h1>{directionText}</h1>
        {/* <h1>{directionSymbol}</h1> */} {/* 使用箭头 */}

      </div>

      {/* 底部区域已移除 */}
    </>
  );
};

export default PlayingScreen;