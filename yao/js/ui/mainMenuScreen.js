// js/ui/mainMenuScreen.js

// 导入通用 UI 工具
import { clearContainer } from './uiUtils.js';

/**
 * 显示主菜单界面
 * @param {HTMLElement} containerElement - 应用的主容器元素
 * @param {object} options - 包含菜单按钮点击事件处理函数的选项
 * @param {function} options.onStartLearningClick - 点击“开始学习”按钮时的回调函数
 * @param {function} options.onHexagramLibraryClick - 点击“卦象库”按钮时的回调函数
 * @param {function} options.onAboutClick - 点击“关于易经”按钮时的回调函数 (可选)
 * @param {function} options.onSettingsClick - 点击“设置”按钮时的回调函数 (可选)
 */
export function showMainMenu(containerElement, options = {}) {
    clearContainer(containerElement); // 清空现有内容

    // 创建主菜单的 HTML 结构
    const menuHTML = `
        <div id="main-menu-screen" style="text-align: center; margin-top: 50px;">
            <h1>《易经学习之旅》</h1>
            <p style="margin-bottom: 30px;">欢迎来到易经学习之旅</p>
            <button id="btn-start-learning" style="margin-top: 10px; padding: 10px 20px; font-size: 18px; cursor: pointer; display: block; margin: 10px auto;">
                开始学习
            </button>
            <button id="btn-hexagram-library" style="margin-top: 10px; padding: 10px 20px; font-size: 18px; cursor: pointer; display: block; margin: 10px auto;">
                卦象库
            </button>
            <button id="btn-about" style="margin-top: 10px; padding: 10px 20px; font-size: 18px; cursor: pointer; display: block; margin: 10px auto;">
                关于易经
            </button>
             <button id="btn-settings" style="margin-top: 10px; padding: 10px 20px; font-size: 18px; cursor: pointer; display: block; margin: 10px auto;">
                设置
            </button>
        </div>
    `;

    // 将 HTML 插入容器
    if (containerElement) {
        containerElement.innerHTML = menuHTML;

        // 添加按钮事件监听器
        document.getElementById('btn-start-learning')?.addEventListener('click', () => {
            console.log("主菜单: '开始学习' 按钮点击");
            if (options.onStartLearningClick) {
                options.onStartLearningClick(); // 调用传入的回调函数
            }
        });

        document.getElementById('btn-hexagram-library')?.addEventListener('click', () => {
            console.log("主菜单: '卦象库' 按钮点击");
             if (options.onHexagramLibraryClick) {
                options.onHexagramLibraryClick(); // 调用传入的回调函数
            }
        });

         document.getElementById('btn-about')?.addEventListener('click', () => {
            console.log("主菜单: '关于易经' 按钮点击");
             if (options.onAboutClick) {
                options.onAboutClick(); // 调用传入的回调函数
            }
        });

         document.getElementById('btn-settings')?.addEventListener('click', () => {
            console.log("主菜单: '设置' 按钮点击");
             if (options.onSettingsClick) {
                options.onSettingsClick(); // 调用传入的回调函数
            }
        });
    }
}