// js/chapters/Chapter1/exerciseHandler.js

// 负责处理第一章练习题的提交、检查和反馈逻辑

// 导入需要的模块 (这些通过参数从 index.js 传递进来)
// import { getData } from '../../core/dataLoader.js'; // 不需要在这里直接getData，数据已通过参数传递
// import { StateManager } from '../../core/stateManager.js'; // StateManager 通过参数传递
// import { showChapterScreen } from '../../ui/chapterScreen.js'; // 不需要在这里显示界面，只更新UI元素


/**
 * 处理练习题答案提交
 * 这个函数将被从 index.js 中调用
 * @param {Array<object>} playerAnswers - 玩家提交的答案数组。每个对象包含 { questionIndex: number, questionData: object, playerAnswer: any }
 * @param {string} exerciseType - 当前练习题的类型标识 (例如 'yin_yang_identify')
 * @param {object|Array} currentModuleData - 当前练习模块的完整题目数据 (如从 dataLoader 加载的原始题目数组或筛选后的题目数组)。期望格式：{ type: '...', questions: [...] }
 * @param {HTMLElement} appContainer - 应用容器 (用于查找和更新UI元素，如反馈区域和题目元素)
 * @param {StateManager} stateManager - 状态管理器实例
 * @param {object} gameData - 已加载的游戏数据 (用于查找正确答案等，虽然答案在 playerAnswers[].questionData 里已有)
 * @param {object} chapterInfo - 当前章节信息 { id: ..., title: ..., totalModules: ... }
 * @param {number} currentModuleIndex - 当前模块索引 (从0开始)
 * @param {function} navigationCallback - 一个回调函数，用于在练习完成并判断后，通知 index.js 进行导航 (例如调用 handleNavigation)
 */
export function handleSubmitAnswer(
    playerAnswers, // 玩家提交的答案，现在是格式化后的数组 [ { questionIndex, questionData, playerAnswer }, ... ]
    exerciseType,
    currentModuleData, // 当前模块的所有题目数据 (例如 { type: '...', questions: [...] } )
    appContainer, // 用于获取和更新 UI 元素，如反馈区域
    stateManager,
    gameData, // 可选，如果需要全局数据，但不推荐在这里直接访问
    chapterInfo, // 章节信息
    currentModuleIndex, // 模块索引
    navigationCallback // 用于章节内导航 (下一节/上一节)
) {
    console.log(`[exerciseHandler] 收到玩家对练习类型 "${exerciseType}" 的答案:`, playerAnswers);
    // console.log("[exerciseHandler] 当前模块的原始题目数据:", currentModuleData); // 调试用


    // 获取模块的整体反馈区域和提交按钮
    const moduleFeedbackElement = appContainer.querySelector('#exercise-module-feedback');
    const submitButton = appContainer.querySelector('#btn-submit-exercise');


    let correctCount = 0;
    const totalQuestions = playerAnswers.length; // 玩家尝试回答了多少题 (应该等于总题目数)

    // 从传递进来的模块数据中获取原始题目数组
    const originalQuestions = currentModuleData.questions || (Array.isArray(currentModuleData) ? currentModuleData : []); // 尝试获取原始题目数据数组

    if (originalQuestions.length === 0) {
         console.error("[exerciseHandler] 未找到当前练习模块的原始题目数据。无法检查答案。");
         if (moduleFeedbackElement) {
              moduleFeedbackElement.style.color = 'red';
              moduleFeedbackElement.innerText = '错误：无法检查答案，题目数据丢失。';
         }
         // 重新显示提交按钮，让玩家知道出错了
          if (submitButton) submitButton.style.display = 'inline-block';
         return;
    }

    // 遍历玩家提交的答案，与原始题目数据对比，并显示反馈
    playerAnswers.forEach(playerAnswerItem => {
        const questionIndex = playerAnswerItem.questionIndex;
        const playerSelectedAnswer = playerAnswerItem.playerAnswer;
        const questionData = originalQuestions[questionIndex]; // 获取对应的原始题目数据，确保顺序和索引对应

        if (!questionData) {
             console.warn(`[exerciseHandler] 未找到索引为 ${questionIndex} 的题目原始数据。`);
             return;
        }

        let isCorrect = false;
        let correctAnswer = '未知'; // 用于显示正确答案

        // --- 答案检查逻辑 (根据 exerciseType 实现) ---
        if (exerciseType === 'yin_yang_identify') {
            // 阴阳识别练习：比较玩家选择的值和题目数据的 'answer' 字段
            correctAnswer = questionData.answer;
            if (playerSelectedAnswer === correctAnswer) {
                isCorrect = true;
            }
        } else if (exerciseType === 'trigram_symbol_name_match') {
            // 符号名称匹配练习：比较玩家选择的值和题目数据的 'correct_answer_name' 字段
             correctAnswer = questionData.correct_answer_name;
             if (playerSelectedAnswer === correctAnswer) {
                 isCorrect = true;
             }
        }
        // TODO: 添加其他练习类型的答案检查逻辑
        // else if (exerciseType === '...') { ... }


        // --- 显示单题反馈 ---
        const questionElement = appContainer.querySelector(`.exercise-question[data-question-index="${questionIndex}"]`);
        if (questionElement) {
            const feedbackSpecificElement = questionElement.querySelector('.question-feedback');
            const optionButtons = questionElement.querySelectorAll('.option-btn'); // 获取本题的所有选项按钮

            if (feedbackSpecificElement) {
                if (isCorrect) {
                    feedbackSpecificElement.style.color = 'green';
                    feedbackSpecificElement.innerText = '正确！';
                    correctCount++; // 统计答对数量

                    // 答对后，禁用所有选项按钮，并高亮正确选项
                     optionButtons.forEach(btn => {
                         btn.disabled = true;
                         if (btn.dataset.answerValue === correctAnswer) {
                             btn.style.backgroundColor = 'green'; // 高亮正确答案
                             btn.style.color = 'white';
                             btn.style.fontWeight = 'bold';
                         } else {
                              btn.style.backgroundColor = ''; // 移除错误选项的背景
                              btn.style.color = '#333';
                              btn.style.fontWeight = 'normal';
                         }
                     });


                } else {
                    feedbackSpecificElement.style.color = 'red';
                    feedbackSpecificElement.innerText = `错误。正确答案是: ${correctAnswer}`;

                     // 答错后，禁用所有选项按钮，并高亮正确答案 (目前不允许重试，检查一次定对错)
                      optionButtons.forEach(btn => {
                         btn.disabled = true;
                         if (btn.dataset.answerValue === correctAnswer) {
                              btn.style.backgroundColor = 'green'; // 高亮正确答案
                              btn.style.color = 'white';
                              btn.style.fontWeight = 'bold';
                         } else {
                              btn.style.backgroundColor = ''; // 移除错误选项的背景
                              btn.style.color = '#333';
                              btn.style.fontWeight = 'normal';
                         }
                     });
                }
            }
        }
    });


    // --- 显示模块整体完成情况反馈 ---
    const totalQuestionsInModule = originalQuestions.length; // 本模块总题目数
    if (moduleFeedbackElement) {
         moduleFeedbackElement.style.color = (correctCount === totalQuestionsInModule) ? 'green' : 'orange';
         moduleFeedbackElement.innerText = `你答对了 ${correctCount} / ${totalQuestionsInModule} 道题。`;
    }

    // --- 判断模块是否完成 (是否全部答对)，并更新状态和导航 ---
    if (correctCount === totalQuestionsInModule) {
        console.log(`[exerciseHandler] 模块 ${chapterInfo.id}-${currentModuleIndex} 全部答对！`);

        // TODO:
        // 1. 计算本模块最终得分和星级 (例如，根据答对题数、尝试次数、时间等)
        //    这里简单示例：全对 100 分，3 颗星
        const scoreEarned = 100;
        const stars = 3;

        // 2. 更新 StateManager 中的模块完成状态和得分
        //    markModuleCompleted(chapterId, moduleIndex, scoreEarned, stars)
        stateManager.markModuleCompleted(`ch${chapterInfo.id}`, currentModuleIndex, scoreEarned, stars);
        console.log("[exerciseHandler] 状态已更新。");

        // 3. 显示模块完成的最终提示
         if (moduleFeedbackElement) {
              moduleFeedbackElement.innerText += ` 模块完成！获得了 ${scoreEarned} 分，${stars} 颗星！即将进入下一节...`;
              moduleFeedbackElement.style.color = 'green'; // 完成提示设为绿色
         }

        // 4. 延迟一段时间后，调用导航回调跳转到下一节
        console.log("[exerciseHandler] 延迟后跳转到下一节...");
        if (navigationCallback) {
             setTimeout(() => {
                navigationCallback(1); // 调用 index.js 中的 handleNavigation(..., 1)
             }, 2000); // 延迟 2 秒
        }


    } else {
         console.log("[exerciseHandler] 模块未全部答对。");
         // 如果没有全部答对，提示玩家并停止自动导航
         // ui/chapterScreen.js 已经隐藏了提交按钮，这里无需重新显示，除非想实现重试机制
         // 可以在 moduleFeedbackElement 中给出重试提示
         if (moduleFeedbackElement) {
             // moduleFeedbackElement.innerText += ` 请检查错误，修正后再次提交。`; // 这个提示在上面统计答对数时已经加了
             // TODO: 如果允许重试，需要在这里调用 UI 层的方法来重置题目状态
         }
    }
}

// 后续可以添加其他辅助函数，例如根据练习类型渲染不同表单的函数 (已在 ui/chapterScreen.js)
// 一个函数来获取玩家的答案 (已在 ui/chapterScreen.js 的事件监听器中)
// 一个函数来管理练习模块的完成状态 (如标记单题是否答对)