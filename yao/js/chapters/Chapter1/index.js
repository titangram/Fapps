// js/chapters/Chapter1/index.js

// 第一章的流程控制和逻辑管理

// 导入需要的模块
import { getData } from '../../core/dataLoader.js'; // 获取游戏数据
import { StateManager } from '../../core/stateManager.js'; // 管理玩家状态
import { showChapterScreen } from '../../ui/chapterScreen.js'; // 显示章节界面
// 导入练习题处理函数
import { handleSubmitAnswer } from './exerciseHandler.js';


// 定义第一章的模块序列
// 这个数组决定了玩家在第一章的学习路径和内容顺序
// type: 'intro' 或 'exercise'
// dataId: 用于在 displayCurrentModule 中从 gameData 提取对应数据的标识。它的含义取决于 type。
// moduleTitle: 可选，用于在界面上显示更具体的模块标题
// exerciseType: 如果 type 是 'exercise'，需要这个字段来标识具体的练习类型 (例如 'yin_yang_identify')
const chapter1Modules = [
    { type: 'intro', dataId: 'ch1_intro', moduleTitle: '引言：阴阳与爻' }, // 第一节：对应 ch1_intro.json 的数据
    { type: 'exercise', dataId: 'ch1_yin_yang_exercises', moduleTitle: '练习：阴阳识别', exerciseType: 'yin_yang_identify' }, // 第二节：阴阳识别练习
    { type: 'intro', dataId: 'ch1_trigram_intro', moduleTitle: '八个经卦简介' }, // 第三节：介绍八经卦 (示例 dataId，可能需要 ch1_intro.json 结构调整)
    { type: 'exercise', dataId: 'ch1_trigram_match_exercises', moduleTitle: '练习：经卦匹配', exerciseType: 'trigram_symbol_name_match' }, // 第四节：经卦符号名称匹配练习 (示例 dataId)
    // TODO: 根据 ch1_intro.json 和 ch1_exercises.json 的实际结构和内容来精细定义这个模块序列
    // dataId 应该能帮助你在 displayCurrentModule 中精确找到对应的数据片段
    // exerciseType 应该能帮助你在 ui/chapterScreen.js 和 exerciseHandler.js 中识别练习类型
    // 示例 dataId 命名约定：ch[章节ID]_[数据类型]_[具体标识]
];

// 获取第一章的整体信息 (例如标题)
const chapterInfo = {
    id: 1, // 章节 ID
    title: '第一章：认识基础', // 章节标题
    totalModules: chapter1Modules.length // 总模块数用于导航判断
};


/**
 * 初始化并进入第一章的学习界面
 * 这个函数由外部 (如 app.js) 调用
 * @param {HTMLElement} appContainer - 应用的主容器元素
 * @param {StateManager} stateManager - 状态管理器实例
 * @param {object} gameData - 已加载的游戏数据
 */
export function initChapter1(appContainer, stateManager, gameData) {
    console.log("进入第一章初始化...");

    const currentState = stateManager.getState();
    // 获取当前玩家在第一章的进度 (模块索引)
    // 如果当前章节不是第一章，从第0个模块开始；否则加载保存的模块索引
    const currentModuleIndex = currentState.currentChapter === chapterInfo.id
                                ? currentState.currentModuleIndex
                                : 0;

    // 如果当前章节不是第一章，先更新状态到第一章的起始模块
    if (currentState.currentChapter !== chapterInfo.id) {
         stateManager.updateState({ currentChapter: chapterInfo.id, currentModuleIndex: 0 });
         // 重新获取更新后的状态 (虽然 StateManager 已更新内部状态，这里局部变量可以刷新)
         // currentState = stateManager.getState(); // 再次获取确保使用了最新状态的模块索引
    } else {
         // 如果是回到本章，确保从 StateManager 加载的模块索引不超过实际模块总数
         if (currentModuleIndex >= chapter1Modules.length) {
             stateManager.updateState({ currentModuleIndex: 0 }); // 如果超出了，重置到开始
             // currentModuleIndex = 0; // 再次获取或直接使用 0
         }
    }


    // 显示当前模块的界面
    // 这里的 stateManager 和 gameData 已经是传入的实例，可以直接使用
    displayCurrentModule(appContainer, stateManager, gameData);

    console.log(`章节 ${chapterInfo.id} 初始化完成。当前模块索引: ${stateManager.getState().currentModuleIndex}`);
}

/**
 * 根据当前状态显示章节中的特定模块界面
 * 这个函数是章节流程的核心，它决定了显示什么内容并设置交互回调
 * @param {HTMLElement} appContainer - 应用主容器
 * @param {StateManager} stateManager - 状态管理器实例
 * @param {object} gameData - 已加载的游戏数据
 */
function displayCurrentModule(appContainer, stateManager, gameData) {
    const currentModuleIndex = stateManager.getState().currentModuleIndex;
    const currentModuleDef = chapter1Modules[currentModuleIndex]; // 获取当前模块的定义

    if (!currentModuleDef) {
         console.error(`错误: 未找到索引为 ${currentModuleIndex} 的模块定义.`);
         appContainer.innerHTML = `<p>加载模块失败，请返回主菜单。</p>`;
          // TODO: 可能需要显示一个返回主菜单的按钮
         return;
    }

    let moduleContentData = null; // 传递给 UI 显示函数 (showChapterScreen) 的具体内容数据
    const moduleType = currentModuleDef.type;


    // --- 从加载的游戏数据中提取当前模块所需的数据 ---
    // 这个逻辑非常关键，需要根据你的 JSON 数据结构 和 chapter1Modules 的 dataId 定义来精确实现
    if (moduleType === 'intro') {
        // 对于 intro 模块，从 lessons 数据中获取内容
        // 假设 dataId 'ch1_intro' 对应整个 ch1_intro.json 对象
        // TODO: 如果 intro.json 需要分段显示，并且 dataId 对应某个 section ID，需要在这里筛选
        moduleContentData = gameData.lessons[`ch${chapterInfo.id}`]; // 假设 dataId 'ch1_intro' 代表整个 ch1 的 intro 数据
        // if (currentModuleDef.dataId === 'ch1_intro') {
        //     moduleContentData = gameData.lessons[`ch${chapterInfo.id}`]; // 整个 intro 对象
        // } else if (currentModuleDef.dataId === 'trigram_intro') {
        //     // 示例：如果 dataId 是 'trigram_intro'，可能需要从 ch1_intro.json 中提取特定部分
        //     moduleContentData = { heading: "八个经卦", content: "卦象简介内容..." }; // 手动构造或从加载数据中查找
        // }


    } else if (moduleType === 'exercise') {
        // 对于 exercise 模块，从 exercises 数据中获取对应的练习题集合
        const allExercises = gameData.exercises[`ch${chapterInfo.id}`];
        if (allExercises) {
            // 筛选出本模块特定类型或 dataId 的练习题
            // 假设 dataId 对应 exercises 数组中的一个或多个题目
            // 假设 exerciseType 用于在 renderExercise 中识别如何渲染
            // moduleContentData = allExercises.filter(q => q.type === currentModuleDef.exerciseType); // 示例：按类型筛选所有题目
            // moduleContentData = allExercises.filter(q => q.moduleId === currentModuleDef.dataId); // 示例：按 moduleId 筛选
             // TODO: 根据实际 ch1_exercises.json 结构和 chapter1Modules 的 dataId 定义来精确获取本模块的题目数据数组

             // 为了配合 ui/chapterScreen.js 中的 renderExercise 函数 (它期望 { type: ..., questions: [...] } 或 [] )
             // 我们构建传递的数据结构
             const filteredQuestions = allExercises.filter(q => q.moduleId === currentModuleDef.dataId); // 假设按 dataId (作为 moduleId) 筛选题目
             if (filteredQuestions.length > 0) {
                 moduleContentData = {
                     type: currentModuleDef.exerciseType || (filteredQuestions[0].type || 'unknown'), // 使用模块定义的 exerciseType，或者题目中的 type
                     questions: filteredQuestions
                 };
             } else {
                 moduleContentData = { type: currentModuleDef.exerciseType || 'unknown', questions: [] }; // 未找到题目数据
             }


        } else {
            moduleContentData = { type: currentModuleDef.exerciseType || 'unknown', questions: [] }; // 练习数据未加载或为空
            console.warn(`未找到章节 ${chapterInfo.id} 的练习题数据。`);
        }


    } // else if (moduleType === 'summary') { ... 章节总结模块 }


    // 调用 uiDisplay 显示模块界面
    showChapterScreen(appContainer, moduleContentData, moduleType, chapterInfo, currentModuleIndex, {
        // 在这里将回调函数与必要的参数“绑定”，传递给 UI 层
        // 这些回调在 UI 元素 (按钮) 被点击时触发，然后调用 index.js 或 exerciseHandler.js 中的逻辑
        onNextClick: () => handleNavigation(appContainer, stateManager, gameData, 1),
        onPreviousClick: () => handleNavigation(appContainer, stateManager, gameData, -1),
        // 将 exerciseHandler 的 handleSubmitAnswer 传递下去，并绑定需要的参数
        // 当 ui/chapterScreen.js 中的提交按钮被点击时，会调用这个回调
        onSubmitAnswer: (playerAnswer) => handleSubmitAnswer(
            playerAnswer, // 玩家的答案，由 ui/chapterScreen.js 提供 (现在是收集到的答案对象)
            currentModuleDef.exerciseType, // 练习类型
            moduleContentData, // 当前模块的题目数据
            appContainer, // 用于更新 UI 反馈
            stateManager,
            gameData, // 可选，如果需要全局数据
            chapterInfo, // 传递章节信息
            currentModuleIndex, // 传递模块索引
            (direction) => handleNavigation(appContainer, stateManager, gameData, direction) // 传递导航回调给 exerciseHandler
        ),
        onBackToMenuClick: () => handleBackToMenu(appContainer, stateManager) // 传递返回菜单回调
    });

    // 在显示界面后在 DOM 上控制导航按钮的可见性 (更精确的判断在 ui/chapterScreen.js 中实现更合适)
    // 这里可以保留打印日志用于调试
    console.log(`模块显示完成: 章节 ${chapterInfo.id}, 索引 ${currentModuleIndex}, 类型 ${moduleType}, dataId: ${currentModuleDef.dataId}`);

}


/**
 * 处理章节内部导航 (下一节/上一节)
 * 这个函数由 UI 层 (showChapterScreen) 的导航按钮点击触发
 * 它更新 StateManager 的模块索引，并调用 displayCurrentModule 显示下一个界面
 * @param {HTMLElement} appContainer - 应用容器
 * @param {StateManager} stateManager - 状态管理器
 * @param {object} gameData - 游戏数据
 * @param {number} direction - 导航方向 (1 为下一节, -1 为上一节)
 */
function handleNavigation(appContainer, stateManager, gameData, direction) {
    const currentState = stateManager.getState();
    const currentModuleIndex = currentState.currentModuleIndex;
    const currentModuleDef = chapter1Modules[currentModuleIndex]; // 获取当前模块定义
    const moduleType = currentModuleDef.type;

    // TODO: 在允许向前导航 (direction === 1) 前，检查当前练习模块是否已完成
    // 可以检查 stateManager 中是否已记录本模块的完成状态
    // const isCurrentModuleCompleted = stateManager.getModuleCompletion(`ch${chapterInfo.id}`, currentModuleIndex) > 0; // 假设大于0星表示完成

    // if (direction === 1 && moduleType === 'exercise' && !isCurrentModuleCompleted) {
    //      // 如果是练习模块且未完成，阻止导航，并给出提示
    //      console.log(`[Navigation] 练习模块 ${chapterInfo.id}-${currentModuleIndex} 未完成，阻止前进。`);
    //       // 可以在这里更新 UI 上的反馈信息
    //      const moduleFeedbackElement = appContainer.querySelector('#exercise-module-feedback');
    //       if (moduleFeedbackElement) {
    //            moduleFeedbackElement.style.color = 'red';
    //            moduleFeedbackElement.innerText = '请完成本节练习才能进入下一节。';
    //       }
    //      return; // 阻止导航
    // }


    let newModuleIndex = currentModuleIndex + direction;

    // 检查新索引是否在当前章节范围内
    if (newModuleIndex >= 0 && newModuleIndex < chapter1Modules.length) {
        // 更新状态并显示新模块
        stateManager.updateState({ currentModuleIndex: newModuleIndex });
        console.log(`导航到章节 ${chapterInfo.id} 的模块索引: ${newModuleIndex}`);
        displayCurrentModule(appContainer, stateManager, gameData);

    } else if (newModuleIndex >= chapter1Modules.length) {
         // 当前章节已完成所有模块，尝试进入下一章或显示完成界面
         console.log(`章节 ${chapterInfo.id} (索引 ${currentModuleIndex}) 已完成所有模块。`);
         // TODO: 判断当前章节是否是最后一章
         const totalChapters = 4; // 占位符：需要知道总章节数

         if (chapterInfo.id < totalChapters) {
             // 进入下一章节的第一个模块
             console.log(`尝试进入章节 ${chapterInfo.id + 1} 的模块 0`);
             // StateManager 的 goToNextModule 会更新章节ID和模块索引到下一章的开始
             stateManager.goToNextModule(); // 这个方法会更新 stateManager 的内部状态

             // TODO: 需要加载下一章的数据和逻辑 (如果不是全部数据一次加载的话)，然后调用下一章的 init 函数
             // 目前我们的数据是全部加载的，所以只需要调用下一章的 init 函数
             // 但我们需要一个机制来根据章节ID调用对应的 init 函数 (例如 initChapter2, initChapter3 等)
             // 这可能需要一个简单的路由或章节管理器 (例如在 app.js 中根据 stateManager.getCurrentChapter() 调用不同的 init 函数)

             alert(`恭喜完成第一章！应该进入第 ${stateManager.getCurrentChapter()} 章了！(功能待实现...)`); // 暂时弹窗提示并停留在当前界面

             // 如果 StateManager.goToNextModule 成功更新了状态，我们可以调用 displayCurrentModule
             // 但 displayCurrentModule 内部会使用 stateManager.getState().currentChapter 和 .currentModuleIndex 来决定加载哪个章节/模块
             // 所以理论上，如果 stateManager 更新了，直接调用 displayCurrentModule 会显示下一章的第一个模块
             // displayCurrentModule(appContainer, stateManager, gameData); // 这个调用需要在下一章的 init 函数中处理，或者有一个顶层路由来决定何时调用哪个 init 函数

         } else {
             // 所有章节都完成了
             console.log("恭喜，所有章节已完成!");
             alert("恭喜完成所有章节！(功能待实现...)"); // 暂时提示
             // TODO: 显示最终完成界面
         }


    } else if (newModuleIndex < 0) {
         // 已经是章节第一节，无法后退到上一章
         console.log(`已在章节 ${chapterInfo.id} 第一节 (索引 ${currentModuleIndex})。无法后退。`);
         // TODO: 如果需要，可以允许后退到上一章的最后一节
     }
}


/**
 * 处理返回主菜单
 * 这个函数由 UI 层 (showChapterScreen) 的返回按钮点击触发
 * @param {HTMLElement} appContainer - 应用容器
 * @param {StateManager} stateManager - 状态管理器
 */
function handleBackToMenu(appContainer, stateManager) {
    console.log("处理返回主菜单...");
    // TODO: 实现返回主菜单的逻辑
    // 需要能调用显示主菜单的函数 (showMainMenu)
    // 如果 app.js 或一个路由模块负责界面切换，应该调用那里的函数

     if (confirm("确定返回主菜单吗？当前章节进度已自动保存。")) {
         // 最简单的返回方式是重新加载页面，但这会丢失当前内存中的所有状态（State Manager 会从 localStorage 恢复）
         window.location.reload(); // 暂时使用刷新页面，这会回到 app.js 重新初始化并显示主菜单

         // 更优雅的方式是调用一个顶层路由或界面管理器来切换回主菜单
         // 例如，如果 app.js 中有一个 router.goTo('main-menu')
     }
}

// TODO: 需要一个函数来根据 exerciseType 和 moduleContentData 渲染出实际的练习题表单/交互元素
// 这个逻辑已经移动到 ui/chapterScreen.js 中的 renderExercise 函数里了

// TODO: 需要在 handleSubmitAnswer 中实现获取玩家答案的逻辑 (取决于渲染方式)
// 玩家答案通过 ui/chapterScreen.js 中的 renderExercise 函数收集并通过 onSubmitAnswer 回调传递过来

// TODO: 需要在 handleSubmitAnswer 中实现答案检查、反馈、计分、模块完成判断和导航逻辑
// 这些逻辑现在应该在 exerciseHandler.js 文件里实现