// js/core/app.js

import { loadData } from './dataLoader.js'; // 假设未来会有数据加载模块
import { StateManager } from './stateManager.js'; // 假设未来会有状态管理模块
// import { router } from './router.js'; // 假设未来会有路由模块

// 获取应用容器
const appContainer = document.getElementById('app-container');
let stateManager; // 状态管理器实例

/**
 * 应用的初始化函数
 * 在页面加载完成后调用
 */
async function initializeApp() {
    console.log("应用开始初始化...");

    // 1. 清除加载中的提示
    if (appContainer) {
        appContainer.innerHTML = ''; // 清空容器内容
    } else {
        console.error("无法找到 '#app-container' 元素!");
        return; // 如果找不到容器，停止初始化
    }

    // 2. 初始化状态管理器 (处理玩家进度等)
    stateManager = new StateManager();
    stateManager.loadProgress(); // 从本地存储加载进度

    // 3. 加载游戏所需数据 (卦象、练习题等)
    // try {
    //     await loadData(); // 调用数据加载函数
    //     console.log("游戏数据加载成功。");
    // } catch (error) {
    //     console.error("游戏数据加载失败:", error);
    //     appContainer.innerHTML = '<p>加载数据失败，请稍后重试。</p>';
    //     return; // 数据加载失败则停止
    // }

    // 4. 根据当前状态，显示初始界面 (例如：主菜单 或 继续学习的章节)
    console.log("应用初始化完成。");

    // 暂时先显示一个欢迎信息作为测试
    displayWelcomeScreen();

    // 实际应用中会根据 stateManager.getCurrentView() 或其他状态来决定显示哪个界面
    // 例如:
    // if (stateManager.hasSavedProgress()) {
    //     router.goTo('resume-chapter', { chapterId: stateManager.getSavedChapter() });
    // } else {
    //     router.goTo('main-menu');
    // }
}

/**
 * 示例：显示一个简单的欢迎界面
 * 后续会被主菜单或其他界面替换
 */
function displayWelcomeScreen() {
    if (appContainer) {
        appContainer.innerHTML = `
            <div style="text-align: center; margin-top: 50px;">
                <h1>《易经学习之旅》</h1>
                <p>应用核心已启动！</p>
                <p>这是一个临时的欢迎屏幕。</p>
                <button id="start-learning-btn" style="margin-top: 20px; padding: 10px 20px; font-size: 16px;">
                    开始学习
                </button>
            </div>
        `;

        // 添加一个简单的按钮事件监听器作为示例
        document.getElementById('start-learning-btn')?.addEventListener('click', () => {
            alert('你点击了开始学习按钮！');
            // 实际应用中会调用 router.goTo('chapter1'); 或其他逻辑
        });
    }