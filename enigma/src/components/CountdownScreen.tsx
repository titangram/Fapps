// src/components/CountdownScreen.tsx
import React from 'react';
import styles from './CountdownScreen.module.css'; // 导入 CSS Module

// 定义 CountdownScreen 组件接收的 props 类型
interface CountdownScreenProps {
  countdownValue: number; // 要显示的倒计时数值
}

// CountdownScreen 组件：显示倒计时数字
const CountdownScreen: React.FC<CountdownScreenProps> = ({ countdownValue }) => {
  return (
    // 这个 div 将覆盖屏幕中心，显示倒计时
    <div className={styles.countdownContainer}>
      {/* 使用 CSSTransition 包裹数字，实现每个数字出现时的动画 */}
      {/* 注意：这里需要安装 react-transition-group 如果还没装 */}
      {/* key 使用 countdownValue，当数值变化时触发动画 */}
      <span key={countdownValue} className={styles.countdownNumber}>
         {countdownValue > 0 ? countdownValue : 'Go!'} {/* 倒计时结束时显示Go! */}
      </span>
    </div>
  );
};

export default CountdownScreen;