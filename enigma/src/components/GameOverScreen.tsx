// src/components/GameOverScreen.tsx
import React from 'react';
import GameInfo from './GameInfo';
import styles from './GameOverScreen.module.css'; // 导入 CSS Module

// 定义 GameOverScreen 组件接收的 props 类型
interface GameOverScreenProps {
  score: number;
  onPlayAgain: () => void;
}

// GameOverScreen 组件：负责显示游戏结束后的界面
const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onPlayAgain }) => {
  return (
    <>
      {/* 顶部显示 GameInfo，时间为0 */}
       <GameInfo score={score} timeLeft={0} /> {/* GameInfo 样式来自 App.css */}

      {/* word-display 基础样式来自 App.css, game-over-display 特定样式可能在 App.css 或这里 */}
      <div className="word-display game-over-display">
        <h1>游戏结束！</h1>
        {/* 使用模块化样式类 */}
        <p className={styles.finalScore}>最终得分：{score}</p>
        <button className={styles.playAgainButton} onClick={onPlayAgain}>
          再玩一次
        </button>
      </div>

      {/* 底部留空或者放其他信息 - 使用类名代替行内样式 */}
      {/* action-area 基础布局样式来自 App.css */}
      <div className={`action-area ${styles.bottomArea}`}>
           {/* 可以使用模块化样式类 */}
            <p className={styles.gameOverInfoText}>新的挑战，新的分数！</p> {/* 更新提示文字 */}
      </div>
    </>
  );
};

export default GameOverScreen;