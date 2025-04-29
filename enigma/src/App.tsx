import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// 导入拆分后的子组件
import InitialScreen from './components/InitialScreen';
import PlayingScreen from './components/PlayingScreen';
import GameOverScreen from './components/GameOverScreen';
import TutorialModal from './components/TutorialModal';
import CountdownScreen from './components/CountdownScreen';

// 导入自定义 Hooks
import useCountdown from './hooks/useCountdown';
import useGameTimer from './hooks/useGameTimer';
import useTutorial from './hooks/useTutorial';
// useWordSelection Hook 在当前玩法中不再需要
// import useWordSelection from './hooks/useWordSelection';


// 导入分类词语列表和默认难度 (不再用于核心玩法)
// import { categorizedWordList, defaultDifficulty } from './words'; // 移除词语数据导入

const SWIPE_THRESHOLD = 50; // 游戏内滑动距离阈值 (像素)
const FEEDBACK_DURATION = 330; // 视觉反馈显示时长 (毫秒)
const GAME_DURATION = 60; // 每轮游戏时长 (秒)
const TUTORIAL_STORAGE_KEY = 'hasSeenTutorial'; // localStorage 的 key
const COUNTDOWN_START_VALUE = 3; // 倒计时从几开始

// 新增常量：最大允许的错误滑动次数
const MAX_INCORRECT_SWIPES = 3;

// 定义所有可能的游戏状态 (导出 GameState)
export type GameState = 'initial' | 'countdown' | 'playing' | 'gameOver';

// 定义可能的滑动方向
type SwipeDirection = 'left' | 'right';

function App() {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('initial');

  // 新增状态：错误滑动次数
  const [incorrectSwipeCount, setIncorrectSwipeCount] = useState(0);

  // 当前回合需要滑动的方向
  const [requiredSwipeDirection, setRequiredSwipeDirection] = useState<SwipeDirection>('left');

  const [feedback, setFeedback] = useState<'correct' | 'skip' | null>(null);

  // 使用 useTutorial Hook 管理教程显示逻辑
  const { showTutorial, markTutorialAsSeen } = useTutorial();

  // 使用 useCountdown Hook 管理游戏开始前的倒计时
  const countdownValue = useCountdown({
      initialValue: COUNTDOWN_START_VALUE,
      startTrigger: gameState === 'countdown',
      onCountdownEnd: () => {
          setGameState('playing'); // 倒计时结束，进入游戏进行中
          setRequiredSwipeDirection(Math.random() < 0.5 ? 'left' : 'right'); // 游戏开始时随机生成第一个正确方向
      }
  });

  // 使用 useGameTimer Hook 管理游戏进行中的时间倒计时
  const timeLeft = useGameTimer({
      initialDuration: GAME_DURATION,
      startTrigger: gameState === 'playing',
      onTimerEnd: () => {
          setGameState('gameOver'); // 游戏时间到，进入游戏结束
      }
  });


  const gameTouchStartX = useRef(0);


  // === 游戏逻辑：处理滑动 ===
  const handleSwipe = (detectedDirection: SwipeDirection) => {
      // 只在 playing 状态下响应操作
      if (gameState !== 'playing') return;

      console.log('Detected swipe:', detectedDirection, 'Required:', requiredSwipeDirection);

      // 判断滑动方向是否正确
      if (detectedDirection === requiredSwipeDirection) {
          console.log('正确滑动！+1 分');
          setScore(score + 1);
          setFeedback('correct'); // 绿色反馈
      } else {
          console.log('滑动方向错误！');
          // 错误滑动次数增加
          setIncorrectSwipeCount(prevCount => prevCount + 1); // --> 错误次数增加
          setFeedback('skip'); // 红色反馈
      }

      // 生成下一个回合的正确滑动方向
      setRequiredSwipeDirection(Math.random() < 0.5 ? 'left' : 'right');
  };

   // 处理游戏内触摸开始事件 (传递给 PlayingScreen)
   const onGameTouchStart = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    gameTouchStartX.current = e.touches[0].clientX;
  };

   // 处理游戏内触摸结束事件 (传递给 PlayingScreen)
   const onGameTouchEnd = (e: React.TouchEvent) => {
     if (gameState !== 'playing') return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - gameTouchStartX.current;

    // 根据滑动距离判断方向，并调用 handleSwipe 函数
    if (diff > SWIPE_THRESHOLD) { // 向右滑动
      handleSwipe('right');
    } else if (diff < -SWIPE_THRESHOLD) { // 向左滑动
      handleSwipe('left');
    }
    // 如果滑动距离小于阈值，视为无效滑动，不触发任何动作
  };
  // ===============================


  // 处理点击开始游戏 (也作为再玩一次的函数)
  const startGame = () => {
     if (showTutorial) {
         return; // 显示教程，不立即开始
     }

    setScore(0); // 重置分数
    setIncorrectSwipeCount(0); // --> 重置错误次数
    setGameState('countdown'); // 进入倒计时状态
    setFeedback(null);
  }

  // 移除难度改变处理函数
  /*
  const handleDifficultyChange = (difficulty: keyof typeof categorizedWordList) => { ... };
  */

  // 处理关闭教程
  const handleCloseTutorial = () => {
      markTutorialAsSeen(); // 调用 Hook 返回的函数
      startGame(); // 关闭教程后自动开始倒计时
  }


  // useEffect 处理视觉反馈的自动清除 (保留)
  useEffect(() => {
    let feedbackTimer: NodeJS.Timeout | null = null;
    if (feedback !== null) {
      feedbackTimer = setTimeout(() => {
        setFeedback(null);
      }, FEEDBACK_DURATION);
    }

    return () => {
      if (feedbackTimer) {
        clearTimeout(feedbackTimer);
      }
    };
  }, [feedback]);


    // 新增 useEffect：检查错误次数是否达到上限，如果是则结束游戏
    useEffect(() => {
        if (gameState === 'playing' && incorrectSwipeCount >= MAX_INCORRECT_SWIPES) {
            console.log('错误次数达到上限，游戏结束！');
            setGameState('gameOver'); // --> 错误次数达到上限，进入 gameOver 状态
        }
    }, [gameState, incorrectSwipeCount]); // 依赖项：gameState 和 incorrectSwipeCount 变化时运行


  // 移除检查词库是否用完的 Effect (不再需要)
  /*
  useEffect(() => {
      if (gameState === 'playing' && (wordListIsEmpty || allWordsUsedInCurrentDifficulty)) {
           setGameState('gameOver');
      }
  }, [gameState, wordListIsEmpty, allWordsUsedInCurrentDifficulty]);
  */


  // 根据游戏状态渲染不同的组件
  const renderGameContent = () => {
    switch (gameState) {
        case 'initial':
            const instructionsText = '游戏说明：屏幕会显示一个方向提示 (左或右)。你需要快速向屏幕指示的正确方向滑动。\n\n 如果滑动方向与提示一致，加一分！累计错误 ' + MAX_INCORRECT_SWIPES + ' 次，游戏结束。'; // 更新说明文本
             return (
                <InitialScreen
                  currentWord={'方向挑战！'}
                  onStartGame={startGame}
                  gameInstructions={instructionsText}
                   // 移除难度相关的 props
                  availableDifficulties={[]}
                  selectedDifficulty={''}
                  onDifficultyChange={() => {}}
                />
              );
        case 'countdown':
             return (
                 <CountdownScreen countdownValue={countdownValue} />
             );
        case 'playing':
             return (
                <PlayingScreen
                  score={score}
                  timeLeft={timeLeft}
                  requiredDirection={requiredSwipeDirection}
                  onTouchStart={onGameTouchStart}
                  onTouchEnd={onGameTouchEnd}
                   // 不再直接调用 handleCorrect/handleSkip
                />
              );
        case 'gameOver':
             // 游戏结束界面可能需要更新文字，提示是因为时间到还是错误次数过多
             return (
                <GameOverScreen
                  score={score}
                  onPlayAgain={startGame}
                   // 可以传递错误次数给 GameOverScreen，以便显示结束原因
                  incorrectSwipeCount={incorrectSwipeCount} // --> 传递错误次数
                  gameEndedByTime={timeLeft === 0} // --> 传递是否因时间结束
                />
              );
         default:
             return null;
    }
  };

  return (
    // 根据 feedback 状态添加 CSS 类来改变背景颜色
    <div className={`game-container ${feedback === 'correct' ? 'feedback-correct' : ''} ${feedback === 'skip' ? 'feedback-skip' : ''}`}>
      {renderGameContent()} {/* 根据状态渲染内容 */}

      {showTutorial && <TutorialModal onClose={handleCloseTutorial} />}
    </div>
  );
}

export default App;