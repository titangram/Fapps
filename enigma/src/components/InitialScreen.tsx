// src/components/InitialScreen.tsx
import React, { useRef } from 'react';
import styles from './InitialScreen.module.css'; // 导入 CSS Module

// 移除难度滑动阈值常量
// const DIFFICULTY_SWIPE_THRESHOLD = 30;

// 定义 InitialScreen 组件接收的 props 类型 (移除难度相关的 props)
interface InitialScreenProps {
  currentWord: string; // 显示初始提示文本，比如“方向挑战！”
  onStartGame: () => void; // 开始游戏按钮点击时调用的函数
  gameInstructions: string; // 更新后的游戏说明文字
  // 移除难度相关的 props
  // availableDifficulties: (keyof typeof categorizedWordList)[];
  // selectedDifficulty: keyof typeof categorizedWordList;
  // onDifficultyChange: (difficulty: keyof typeof categorizedWordList) => void;
}

// InitialScreen 组件：负责显示游戏开始前的界面，现在不再有难度选择 UI
const InitialScreen: React.FC<InitialScreenProps> = ({
  currentWord,
  onStartGame,
  gameInstructions,
  // 移除难度相关的 props
  // availableDifficulties,
  // selectedDifficulty,
  // onDifficultyChange,
}) => {

  // 移除触摸事件处理函数，这个界面不再需要滑动切换难度
  // const touchStartX = useRef(0);
  // const getDifficultyDisplayName = (difficulty: keyof typeof categorizedWordList): string => { ... };
  // const onTouchStart = (e: React.TouchEvent) => { ... };
  // const onTouchEnd = (e: React.TouchEvent) => { ... };


  return (
    <>
      <div className="game-info"></div> {/* game-info 样式来自 App.css */}

      {/* 中间显示初始提示和开始按钮 */}
      {/* 移除难度滑动区域的 JSX */}
      <div
        className="word-display initial-display"
        // 移除触摸事件监听器
        // onTouchStart={onTouchStart}
        // onTouchEnd={onTouchEnd}
      >
        <p className={styles.initialMessage}>{currentWord}</p> {/* 显示 "方向挑战！" */}

        {/* 移除难度滑动区域的 JSX */}
        {/*
        <div className={styles.difficultySwipeArea}>
            <span className={styles.swipeArrow}>{'<'}</span>
            <span className={styles.currentDifficultyName}>{getDifficultyDisplayName(selectedDifficulty)}</span>
            <span className={styles.swipeArrow}>{'>'}</span>
        </div>
        */}

        {/* 开始游戏按钮 */}
        <button className={styles.startButton} onClick={onStartGame}>
          开始游戏
        </button>
      </div>

      {/* 底部显示游戏说明 - 使用类名代替行内样式 */}
      <div className={`action-area ${styles.bottomArea}`}> {/* action-area 基础布局样式来自 App.css */}
        <p className={styles.instructionsText}>{gameInstructions}</p>
      </div>
    </>
  );
};

export default InitialScreen;