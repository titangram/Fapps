// src/components/TutorialModal.tsx
import React from 'react';
import styles from './TutorialModal.module.css'; // 导入 CSS Module

// 定义 TutorialModal 组件接收的 props 类型
interface TutorialModalProps {
  onClose: () => void; // 关闭教程时调用的函数
}

// TutorialModal 组件：显示游戏教程内容的模态框
const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    // 模态框覆盖层
    <div className={styles.modalOverlay} onClick={onClose}> {/* 点击覆盖层也可以关闭 */}
      {/* 模态框内容区域，阻止点击事件冒泡，以免点击内容时关闭模态框 */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>游戏玩法教程</h2>
        <p>欢迎来到疯狂猜词！</p>
        <p>游戏开始后，请将设备朝向你的队友，屏幕会显示一个词语。</p>
        <p>队友通过语言或肢体动作描述该词语，你根据描述进行猜测。</p>
        <p>当你猜对时，请向**左滑动**屏幕。</p>
        <p>如果你想跳过，猜下一个词，请向**右滑动**屏幕。</p>
        <p>每轮游戏有时间限制，猜对越多得分越高。</p>
        <p>祝你玩得愉快！</p>
        <button className={styles.closeButton} onClick={onClose}>
          好的，明白了！
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;