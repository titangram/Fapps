// js/core/appHandlers.js

// 存放应用顶层事件（如主菜单按钮点击）的处理函数

// 导入需要的模块
// 这些模块在 app.js 中初始化，并通过 init 函数传递进来或在这里导入
import { initChapter1 } from '../chapters/Chapter1/index.js'; // 导入第一章初始化函数
// import { showHexagramLibraryScreen } from '../ui/hexagramLibraryScreen.js'; // 导入卦象库显示函数 (待实现)
// import { showMainMenu } from '../ui/mainMenuScreen.js'; // 用于返回主菜单 (可选)


// 在这里存储从 app.js 传入的核心实例引用
let appContainer;
let stateManager;
let gameData;

/**
 * 初始化事件处理模块，接收核心实例
 * 这个函数由 app.js 在初始化完成后调用
 * @param {HTMLElement} container - 应用的主容器元素
 * @param {object} sm - StateManager 实例
 * @param {object} gd - 已加载的游戏数据
 */
export function init(container, sm, gd) {
    appContainer = container;
    stateManager = sm;
    gameData = gd;
    console.log("appHandlers 模块初始化完成。");
}


// --- 顶层 UI 事件的处理函数 ---

/**
 * 处理主菜单“开始学习”按钮点击
 */
export function handleStartLearningClick() {
    console.log("appHandlers: '开始学习' 被点击了！准备进入章节。");
    // 根据当前玩家进度决定进入哪个章节
    const currentChapterId = stateManager.getCurrentChapter();

    // TODO: 根据 currentChapterId 调用对应的章节初始化函数
    // 目前只有第一章，所以直接调用 initChapter1
    if (currentChapterId === 1) {
         // 调用第一章的初始化函数，并传递必要的参数
        initChapter1(appContainer, stateManager, gameData);
    } else {
        // TODO: 处理其他章节的入口逻辑
        console.warn(`尝试进入章节 ${currentChapterId}，但对应的初始化函数未实现或未导入。`);
         alert(`应该进入第 ${currentChapterId} 章！(功能待实现)`); // 临时提示
    }

}

/**
 * 处理主菜单“卦象库”按钮点击
 */
export function handleHexagramLibraryClick() {
    console.log("appHandlers: '卦象库' 被点击了！准备显示卦象库界面。");
     // TODO: 实现跳转到卦象库的逻辑
     // 例如：
     // showHexagramLibraryScreen(appContainer, gameData.hexagrams, stateManager.getState().unlockedHexagramIds, {
     //     onBackToMenuClick: () => { /* 调用函数显示主菜单 */ } // 卦象库界面可能需要返回主菜单的回调
     // });
     alert("打开卦象库！功能待实现...");
}

/**
 * 处理主菜单“关于易经”按钮点击 (示例)
 */
export function handleAboutClick() {
     console.log("appHandlers: '关于易经' 被点击了！");
     // TODO: 显示关于易经的界面
     alert("关于易经页面待实现...");
}

/**
 * 处理主菜单“设置”按钮点击 (示例)
 */
export function handleSettingsClick() {
     console.log("appHandlers: '设置' 被点击了！");
     // TODO: 显示设置界面
     alert("设置页面待实现...");
}

// 后续可以添加其他顶层事件处理函数