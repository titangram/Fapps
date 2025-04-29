// js/ui/chapterScreen.js

// 导入通用 UI 工具
import { clearContainer } from './uiUtils.js';

/**
 * 显示章节界面 (包含学习内容或练习)
 * 这个函数负责渲染章节的通用框架和当前模块的具体内容
 * @param {HTMLElement} containerElement - 应用的主容器元素
 * @param {object|Array} moduleContentData - 当前模块的具体内容数据 (可能是 intro 对象或 exercise 数组/对象)
 * @param {string} moduleType - 当前模块的类型 ('intro' 或 'exercise')
 * @param {object} chapterInfo - 当前章节的整体信息 (例如章节标题，总模块数)
 * @param {number} currentModuleIndex - 当前模块在章节中的索引 (从0开始)
 * @param {object} options - 包含导航和练习交互回调的选项
 * @param {function} options.onNextClick - 点击“下一节”按钮时的回调函数
 * @param {function} options.onPreviousClick - 点击“上一节”按钮时的回调函数
 * @param {function} options.onSubmitAnswer - 提交练习答案时的回调函数 (练习模块需要)
 * @param {function} options.onBackToMenuClick - 点击“返回主菜单”按钮时的回调函数
 */
export function showChapterScreen(containerElement, moduleContentData, moduleType, chapterInfo, currentModuleIndex, options = {}) {
    clearContainer(containerElement); // 清空现有内容

    // 创建章节界面的基本 HTML 结构
    const chapterHTML = `
        <div id="chapter-screen">
            <h2 id="chapter-title" style="text-align: center; margin-bottom: 20px;">
                ${chapterInfo.title} - 第 ${currentModuleIndex + 1} 节
                 ${(chapterInfo.totalModules !== undefined && chapterInfo.totalModules !== null && chapterInfo.totalModules > 0) ? ` / 共 ${chapterInfo.totalModules} 节` : ''}
            </h2>

            <div id="module-content" style="margin: 0 auto; padding: 20px; border: 1px solid #ccc; max-width: 600px; min-height: 200px; text-align: left; background-color: #f9f9f9;">
                加载内容中...
            </div>

            <div id="exercise-feedback" style="margin: 10px auto; max-width: 600px; text-align: center; color: red; min-height: 1.5em;">
                 </div>

            <div id="navigation-buttons" style="text-align: center; margin-top: 20px;">
                <button id="btn-previous" style="padding: 10px 20px; margin: 0 10px; cursor: pointer;">上一节</button>
                <button id="btn-next" style="padding: 10px 20px; margin: 0 10px; cursor: pointer;">下一节</button>
            </div>

             <div style="text-align: center; margin-top: 20px;">
                 <button id="btn-back-to-menu" style="padding: 5px 15px; cursor: pointer;">返回主菜单</button>
             </div>
        </div>
    `;

    // 将基本结构插入容器
    if (containerElement) {
        containerElement.innerHTML = chapterHTML;

        // 获取内容区域和反馈区域
        const moduleContentElement = document.getElementById('module-content');
        const feedbackElement = document.getElementById('exercise-feedback'); // 这个是用于整个模块的反馈，如“模块已完成”


        const btnPrevious = document.getElementById('btn-previous');
        const btnNext = document.getElementById('btn-next');
        const btnBack = document.getElementById('btn-back-to-menu');


        // 根据模块类型显示具体内容
        if (moduleContentElement) {
            if (moduleType === 'intro') {
                // 显示讲解文本内容
                moduleContentElement.innerHTML = formatIntroContent(moduleContentData);
                // 讲解模块通常只需要导航按钮
                 if(btnPrevious) btnPrevious.style.visibility = 'visible';
                 if(btnNext) btnNext.style.visibility = 'visible';


            } else if (moduleType === 'exercise') {
                // 显示练习题界面
                 // 调用一个函数来渲染具体的练习题表单和选项
                 // 需要根据 moduleContentData 中的题目数据来生成 HTML
                 // 传递 onSubmitAnswer 回调给 renderExercise，让它在需要时调用
                 renderExercise(moduleContentElement, moduleContentData, options.onSubmitAnswer);

                 // 练习模块也需要导航按钮 (可能需要根据完成状态来禁用/启用下一节)
                if(btnPrevious) btnPrevious.style.visibility = 'visible';
                if(btnNext) btnNext.style.visibility = 'visible'; // 暂时总是可见


                // TODO: 在练习模块未完成时，禁用“下一节”按钮
                // 可以通过在 renderExercise 中返回一个状态，或者在 index.js 中根据 StateManager 判断
                // 暂时假定未完成时，index.js 不会允许通过 handleNavigation 向前跳转
                // if(btnNext) btnNext.disabled = true; // 可以在这里默认禁用下一节，直到练习通过

            } else {
                moduleContentElement.innerHTML = '<p>未知模块类型。</p>';
                 if(btnPrevious) btnPrevious.style.visibility = 'hidden';
                 if(btnNext) btnNext.style.visibility = 'hidden';
            }
            // 更精确的导航按钮可见性判断 (基于 totalModules 和 currentModuleIndex)
            if (btnPrevious) {
                 btnPrevious.style.visibility = currentModuleIndex === 0 ? 'hidden' : 'visible'; // 第一节隐藏上一节
            }
            if (btnNext && chapterInfo.totalModules !== undefined && chapterInfo.totalModules !== null) {
                 btnNext.style.visibility = currentModuleIndex === chapterInfo.totalModules - 1 ? 'hidden' : 'visible'; // 最后一节隐藏下一节
                 if (currentModuleIndex === chapterInfo.totalModules - 1) {
                    // TODO: 在最后一节显示“完成本章”按钮或提示 (这个逻辑可能在 index.js 中处理更合适，显示不同的按钮)
                 }
             } else {
                 // 如果没有总模块数信息，导航按钮总是可见
                 if(btnPrevious) btnPrevious.style.visibility = 'visible';
                 if(btnNext) btnNext.style.visibility = 'visible';
             }
        }

        // 添加导航按钮的事件监听器
        if(btnPrevious && options.onPreviousClick) {
             btnPrevious.addEventListener('click', options.onPreviousClick);
        }
         if(btnNext && options.onNextClick) {
             btnNext.addEventListener('click', options.onNextClick);
         }
         if(btnBack && options.onBackToMenuClick) {
             btnBack.addEventListener('click', options.onBackToMenuClick);
         }
    }
    // 返回 content 和 feedback 元素，方便外部直接操作（可选，或者通过专门函数操作）
    // return { moduleContentElement, feedbackElement };
}

/**
 * 辅助函数：将包含换行符的讲解文本格式化为 HTML
 * @param {object} introData - 讲解模块数据 { title: ..., sections: [...] } 或包含 heading/content 的 section 对象
 * @returns {string} 格式化后的 HTML 字符串
 */
function formatIntroContent(introData) {
    let html = ``;
    // 根据 introData 的结构来判断如何格式化
    if (introData && introData.sections && Array.isArray(introData.sections)) {
         // 如果是包含多个 section 的完整介绍对象
        // if(introData.title) html += `<h3>${introData.title}</h3>`; // 如果 introData 结构包含 title，这里之前注释掉了
        introData.sections.forEach(section => {
            if(section.heading) html += `<h4>${section.heading}</h4>`;
            // 将文本中的 \n 替换为 <br> 标签以实现换行
            if(section.content) html += `<p>${section.content.replace(/\n/g, '<br>')}</p>`;
            // TODO: 处理 section 中的其他可能属性，如图片、图示等
        });
    } else if (introData && (introData.heading || introData.content)) {
        // 如果 introData 就是一个单独的 section 对象
        if(introData.heading) html += `<h4>${introData.heading}</h4>`;
        if(introData.content) html += `<p>${introData.content.replace(/\n/g, '<br>')}</p>`;
        // TODO: 处理 section 中的其他可能属性
    }
    // TODO: 如果 introData 是其他格式（如纯字符串），需要添加处理
    return html;
}

/**
 * 辅助函数：渲染练习题界面
 * 这个函数需要根据不同的练习类型 (从 exerciseData 中判断) 来生成对应的 HTML 表单和交互元素
 * 它不处理答案检查，只负责显示题目和收集玩家输入。
 * @param {HTMLElement} containerElement - 用于显示练习题内容的容器元素 (#module-content)
 * @param {object|Array} exerciseData - 当前练习模块的题目数据。结构取决于练习类型。期望格式：{ type: '...', questions: [...] }
 * @param {function} onSubmitAnswer - 提交答案时的回调函数，需要调用它并将玩家答案传递回去 (来自 index.js)
 */
function renderExercise(containerElement, exerciseData, onSubmitAnswer) {
    if (!containerElement) return;

    // 清空旧的练习内容
    containerElement.innerHTML = ``; // 清空内容区域

    if (!exerciseData || !Array.isArray(exerciseData.questions) || exerciseData.questions.length === 0 || !exerciseData.type) {
         containerElement.innerHTML += `<p>未找到练习题数据或格式不正确。</p>`;
         console.error("renderExercise: Invalid exerciseData format", exerciseData);
         return;
    }

    const exerciseType = exerciseData.type;
    const questions = exerciseData.questions;


    // --- 根据 exerciseType 渲染不同的练习题 UI ---
    let exerciseHTML = ``;

    // 添加一个用于显示整体练习反馈的区域 (例如：请回答所有题目)
    exerciseHTML += `<div id="exercise-module-feedback" style="text-align: center; color: orange; min-height: 1.5em; margin-bottom: 15px;"></div>`;


    if (exerciseType === 'yin_yang_identify') {
        // 渲染阴阳识别练习题
        // 假设每个题目是 { question: '—', answer: '阳', options: ['阳', '阴'] }
        exerciseHTML += `<h4>请判断阴阳（选择题）：</h4>`;
        questions.forEach((question, index) => {
            // 为每个题目创建一个容器
            exerciseHTML += `
                <div class="exercise-question" data-question-index="${index}" style="margin-bottom: 20px; padding: 15px; border: 1px dashed #ccc; border-radius: 5px;">
                    <p style="font-size: 1.2em; margin-bottom: 10px;">题目 ${index + 1}: <strong>${question.question}</strong></p>
                    <div class="options">
                        `;
                         // 渲染选项按钮
                         if (question.options && Array.isArray(question.options)) {
                             question.options.forEach(option => {
                                 exerciseHTML += `
                                     <button class="option-btn" data-question-index="${index}" data-answer-value="${option}" style="margin-right: 10px; padding: 8px 15px; cursor: pointer; font-size: 1em;">${option}</button>
                                 `;
                             });
                         }
             exerciseHTML += `
                    </div>
                     <div class="question-feedback" style="margin-top: 10px; font-weight: bold; min-height: 1em;"></div>
                </div>
            `;
        });

        // 添加一个通用的提交或检查按钮 (或者每个题目一个，取决于设计)
         exerciseHTML += `
             <div style="text-align: center; margin-top: 30px;">
                <button id="btn-submit-exercise" style="padding: 10px 20px; cursor: pointer; font-size: 1.1em;">检查答案</button>
             </div>
         `;


    } else if (exerciseType === 'trigram_symbol_name_match') {
        // 渲染符号名称匹配练习题 (示例框架)
         exerciseHTML += `<h4>匹配卦象符号与名称（选择题）：</h4>`;
         questions.forEach((question, index) => {
             exerciseHTML += `
                 <div class="exercise-question" data-question-index="${index}" style="margin-bottom: 20px; padding: 15px; border: 1px dashed #ccc; border-radius: 5px;">
                     <p style="font-size: 1.2em; margin-bottom: 10px;">题目 ${index + 1}: <strong>${question.question_symbol}</strong></p>
                      <div class="options">
                        ${(question.options_names && Array.isArray(question.options_names)) ? question.options_names.map(option => `
                             <button class="option-btn" data-question-index="${index}" data-answer-value="${option}" style="margin-right: 10px; padding: 8px 15px; cursor: pointer; font-size: 1em;">${option}</button>
                         `).join('') : ''}
                     </div>
                     <div class="question-feedback" style="margin-top: 10px; font-weight: bold; min-height: 1em;"></div>
                 </div>
             `;
         });
          exerciseHTML += `
              <div style="text-align: center; margin-top: 30px;">
                 <button id="btn-submit-exercise" style="padding: 10px 20px; cursor: pointer; font-size: 1.1em;">检查答案</button>
              </div>
          `;

    }
     // TODO: 添加其他练习类型的渲染逻辑 (trigram_symbol_keyword_match, trigram_pattern_symbol_match 等)


    containerElement.innerHTML += exerciseHTML; // 将生成的练习题 HTML 添加到内容区域


    // --- 添加事件监听器 ---
    // 这里需要为所有选项按钮添加点击事件，记录玩家的选择
    // 并且为“检查答案”按钮添加事件监听器，收集所有答案并调用 onSubmitAnswer

    // 存储玩家当前模块的答案 { questionIndex: selectedValue }
    const playerCurrentAnswers = {};

    containerElement.querySelectorAll('.exercise-question .option-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const questionIndex = event.target.dataset.questionIndex;
            const selectedAnswerValue = event.target.dataset.answerValue;
            const questionElement = event.target.closest('.exercise-question'); // 获取当前问题容器

            console.log(`玩家为题目 ${questionIndex} 选择了答案: ${selectedAnswerValue}`);

            // 移除同组其他按钮的“选中”状态样式 (如果需要视觉反馈)
            questionElement.querySelectorAll('.option-btn').forEach(btn => {
                 btn.classList.remove('selected-option'); // 假设有一个 selected-option CSS 类
                 btn.style.backgroundColor = ''; // 移除背景色样式
                 btn.style.color = '#333'; // 恢复文本颜色
                 btn.style.fontWeight = 'normal';
            });

            // 标记当前选择的按钮
             event.target.classList.add('selected-option');
             event.target.style.backgroundColor = '#007bff'; // 示例：改变背景色
             event.target.style.color = 'white'; // 示例：改变文本颜色
             event.target.style.fontWeight = 'bold';


            // 记录玩家的选择
            playerCurrentAnswers[questionIndex] = selectedAnswerValue;

            console.log("玩家当前模块的选择:", playerCurrentAnswers);

            // TODO: 如果是单题立即反馈的模式，可以在这里调用 onSubmitAnswer 并传入单题答案
        });
    });


     // 绑定“检查答案”按钮的事件监听器
     const btnSubmitExercise = document.getElementById('btn-submit-exercise'); // 注意ID改为 btn-submit-exercise
     if (btnSubmitExercise && onSubmitAnswer) {
         btnSubmitExercise.addEventListener('click', () => {
            console.log("提交练习按钮点击，收集玩家答案...");
            // 检查玩家是否回答了所有问题 (如果一个模块有多题)
            const answeredCount = Object.keys(playerCurrentAnswers).length;
            if (answeredCount < questions.length) {
                 // 提示玩家还有题目未回答
                 const moduleFeedbackElement = document.getElementById('exercise-module-feedback'); // 获取模块整体反馈区域
                 if (moduleFeedbackElement) {
                     moduleFeedbackElement.style.color = 'orange';
                     moduleFeedbackElement.innerText = `请回答所有 ${questions.length} 道题。当前已回答 ${answeredCount} 道。`;
                 } else {
                    alert(`请回答所有 ${questions.length} 道题。当前已回答 ${answeredCount} 道。`);
                 }
                 return; // 停止提交
            }

            // 隐藏检查答案按钮，避免重复提交 (可选)
             btnSubmitExercise.style.display = 'none';


             // 构建传递给 exerciseHandler.js 的玩家答案格式
             // 格式可以是一个数组，每个元素包含题目索引和玩家答案
             const formattedAnswers = questions.map((q, index) => ({
                 questionIndex: index, // 题目在当前模块题目数组中的索引
                 questionData: q, // 题目原始数据
                 playerAnswer: playerCurrentAnswers[index] // 玩家的选择
             }));

             onSubmitAnswer(formattedAnswers); // 调用传递进来的提交答案回调函数
         });
     }

}


// 后续可以添加其他界面的显示函数...
/*
export function showHexagramLibraryScreen(containerElement, hexagramsData, unlockedIds, options = {}) {
    clearContainer(containerElement);
    // 构建并显示卦象库的 HTML
    // ...
}
*/