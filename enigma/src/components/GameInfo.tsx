import React from 'react';

// 定义 GameInfo 组件接收的 props 类型
interface GameInfoProps {
  score: number;
  timeLeft: number;
}

// GameInfo 组件：只负责显示得分和时间
const GameInfo: React.FC<GameInfoProps> = ({ score, timeLeft }) => {
  return (
    <div className="game-info">
      <div>得分: {score}</div>
      <div>时间: {timeLeft}s</div>
    </div>
  );
};

export default GameInfo;