// js/core/app.js

// 导入核心模块
import { loadData, getData } from './dataLoader.js';
import { StateManager } from './stateManager.js';
// 导入界面显示模块 - 从新的路径导入 showMainMenu
import { showMainMenu } from '../ui/mainMenuScreen.js';
// 导入应用顶层事件处理模块
import * as appHandlers from './appHandlers.js'; // 使用 * as 导入整个模块

// 获取应用容器元素
const appContainer = document.getElementById('app-container');

// 定义全局可访问的应用核心实例（如果需要）
// 这些现在会在 appHandlers 模块内部存储一份引用
let stateManager;
let gameData;

/**
 * 应用的初始化函数
 * 这是应用的起点，负责设置一切
 */
async function initializeApp() {
    console.log("应用开始初始化...");

    // 1. 检查应用容器是否存在
    if (!appContainer) {
        console.error("错误: 无法找到 '#app-container' 元素! 应用无法启动。");
        // 可以在这里显示一个致命错误信息给用户
        return;
    }

    // 2. 清除加载中的提示
    appContainer.innerHTML = ''; // 清空容器内容

    // 3. 初始化状态管理器
    stateManager = new StateManager();
    stateManager.loadProgress(); // 从本地存储加载进度
    console.log("状态管理器初始化完成。");
    console.log("当前加载的玩家状态:", stateManager.getState());

    // 4. 加载游戏所需的所有数据 (JSON 文件)
    try {
        gameData = await loadData(); // dataLoader 会加载数据并存储在其内部
        console.log("游戏数据加载成功。");
        // 数据加载成功后，gameData 对象已填充，可以通过 getData() 访问

    } catch (error) {
                console.error("游戏数据加载失败:", error);
        // 显示错误信息给用户
        appContainer.innerHTML = '<p>加载游戏数据失败。请检查文件是否存在或稍后重试。</p>';
        return; // 数据加载失败，应用无法继续
    }

    // 5. 初始化顶层事件处理模块，并将核心实例传递给它
    appHandlers.init(appContainer, stateManager, gameData);
     console.log("顶层事件处理模块初始化完成。");


    // 6. 应用核心已就绪，显示初始界面 (主菜单或继续学习的章节)
    console.log("应用核心初始化完成，准备显示界面。");

    // TODO:
    // - 根据 stateManager.getState().currentChapter 来决定是显示主菜单还是直接进入章节。
    // - 引入并使用 router 模块来管理界面切换。

    // 暂时总是显示主菜单作为初始界面
    showMainMenu(appContainer, {
        // 从 appHandlers 模块导入并传递处理函数
        onStartLearningClick: appHandlers.handleStartLearningClick,
        onHexagramLibraryClick: appHandlers.handleHexagramLibraryClick,
        onAboutClick: appHandlers.handleAboutClick, // 新增 关于 按钮回调
        onSettingsClick: appHandlers.handleSettingsClick // 新增 设置 按钮回调
    });

    // 示例：可以在这里触发一些初始逻辑，比如如果没有任何进度，就解锁第一个卦象（乾卦）
    // if (stateManager.getState().isFirstRun) {
    //      const initialHexagramId = 'qian_wei_tian';
    //      const allHexagrams = getData().hexagrams;
    //      const initialHexagram = allHexagrams ? allHexagrams.find(g => g.id === initialHexagramId) : null;

    //      if (initialHexagram) {
    //          stateManager.unlockHexagram(initialHexagram.id);
    //          console.log(`首次运行，自动解锁卦象: ${initialHexagram.name}`);
    //      } else {
    //          console.warn(`无法找到初始解锁卦象ID: ${initialHexagramId} 的定义，或 hexagrams 数据未加载。`);
    //      }
    //      stateManager.markAsNotFirstRun(); // 标记为非首次运行
    // }
}

// ---- 应用启动入口 ----
// 监听 DOMContentLoaded 事件，确保在 DOM 就绪后执行初始化
document.addEventListener('DOMContentLoaded', initializeApp);

// 可以在这里暴露一些模块或函数到全局，方便在开发者工具中调试（仅在开发环境推荐）
// window.stateManager = stateManager; // 现在 stateManager 的直接引用可能在 appHandlers 中
// window.gameData = gameData; // 现在 gameData 的直接引用可能在 appHandlers 中
// window.getData = getData; // getData 函数仍然可以访问
// window.appHandlers = appHandlers; // 暴露处理模块方便调用和调试