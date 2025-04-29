// js/core/stateManager.js

const STORAGE_KEY = 'yijingLearningProgress'; // 在 localStorage 中存储进度的键名

/**
 * 管理应用的状态和玩家进度
 */
export class StateManager {
    constructor() {
        // 定义应用状态的默认结构
        this.state = {
            currentChapter: 1,         // 当前所在的章节 ID (例如 1, 2, 3...)
            currentModuleIndex: 0,     // 当前章节内的模块索引 (从 0 开始)
            score: 0,                  // 总得分
            unlockedHexagramIds: [],   // 已解锁的六十四卦ID列表 (字符串数组，存储 hexagrams.json 中的 id)
            moduleCompletion: {},      // 记录每个模块的完成状态/星级 { 'ch1_mod0': 3, 'ch1_mod1': 2, 'ch2_mod0': 3, ... }
            // 可以根据需要添加更多状态，例如：已学过的爻辞、已完成的情境挑战等
            // 示例：首次运行时可能需要一个标记
            isFirstRun: true,
        };
        // 将 STORAGE_KEY 暴露出来，方便在 app.js 中进行清除操作（虽然不太推荐直接外部访问）
        this._STORAGE_KEY = STORAGE_KEY;
        console.log("StateManager 初始化。默认状态:", this.state);
    }

    /**
     * 从浏览器本地存储加载玩家进度
     */
    loadProgress() {
        const savedState = localStorage.getItem(this._STORAGE_KEY);
        if (savedState) {
            try {
                const loadedState = JSON.parse(savedState);
                 // 合并加载的状态到默认状态，以防状态结构更新导致旧进度缺少新字段
                 this.state = { ...this.state, ...loadedState };
                console.log("玩家进度加载成功:", this.state);

                // 加载后标记为非首次运行
                this.state.isFirstRun = false;

            } catch (error) {
                console.error("加载玩家进度时解析错误:", error);
                // 如果解析失败，可能是数据损坏，打印错误并保留或重置为默认状态（这里选择保留当前默认状态）
                 alert("玩家进度文件损坏，将使用默认进度或上次成功加载的进度。");
                 // 可选：清除损坏的进度 localStorage.removeItem(this._STORAGE_KEY);
            }
        } else {
            console.log("未找到玩家进度，使用默认状态。", this.state);
            this.state.isFirstRun = true; // 标记为首次运行
        }
         // 无论是否加载到旧进度，首次加载后都尝试保存一次默认或加载到的状态，确保 localStorage 有数据
         this.saveProgress();
    }

    /**
     * 将当前玩家进度保存到浏览器本地存储
     */
    saveProgress() {
        try {
            const stateToSave = JSON.stringify(this.state);
            localStorage.setItem(this._STORAGE_KEY, stateToSave);
            console.log("玩家进度保存成功。");
        } catch (error) {
            console.error("保存玩家进度时发生错误:", error);
            // 可以在这里给用户一些提示，比如浏览器不支持 localStorage 或存储空间不足
            // alert("保存进度失败，您的浏览器可能不支持本地存储或存储空间不足。");
        }
    }

    /**
     * 获取当前玩家状态的副本 (推荐获取副本，避免外部直接修改原始状态)
     * @returns {object} 当前状态对象的副本
     */
    getState() {
        // 返回一个副本，防止外部直接修改内部状态对象
        return JSON.parse(JSON.stringify(this.state));
    }

     /**
      * 直接设置整个状态对象 (谨慎使用，可能会覆盖重要属性)
      * @param {object} newState - 完整的新的状态对象
      */
     setState(newState) {
         console.warn("警告: 直接设置整个状态对象。请确保你知道你在做什么。", newState);
         this.state = newState;
         this.saveProgress();
     }

    /**
     * 更新状态的一部分并自动保存
     * @param {object} newStatePatch - 需要合并到当前状态的新状态片段
     */
    updateState(newStatePatch) {
        this.state = { ...this.state, ...newStatePatch };
        console.log("状态更新:", newStatePatch, "当前状态:", this.state);
        this.saveProgress(); // 状态更新后自动保存
    }

    // --- 示例：获取/设置特定状态的方法 (更推荐通过这些方法来操作状态) ---

    getCurrentChapter() {
        return this.state.currentChapter;
    }

    getCurrentModuleIndex() {
         return this.state.currentModuleIndex;
    }

    getScore() {
         return this.state.score;
    }

    // 标记某个卦象为已解锁
    unlockHexagram(hexagramId) {
        if (!this.state.unlockedHexagramIds.includes(hexagramId)) {
            this.state.unlockedHexagramIds.push(hexagramId);
            this.saveProgress();
            console.log(`卦象 "${hexagramId}" 已解锁。`);
            return true; // 标记成功解锁
        }
        console.log(`卦象 "${hexagramId}" 已经解锁。`);
        return false; // 标记之前已解锁
    }

    // 检查某个卦象是否已解锁
    isHexagramUnlocked(hexagramId) {
        return this.state.unlockedHexagramIds.includes(hexagramId);
    }

    // 记录模块完成状态和分数
    // chapterId: 例如 'ch1'
    // moduleIndex: 例如 0, 1, 2...
    // scoreEarned: 本次模块获得的得分
    // stars: 本次模块获得的星级 (1-3)
    markModuleCompleted(chapterId, moduleIndex, scoreEarned, stars = 1) {
         const moduleId = `${chapterId}_mod${moduleIndex}`;
         const currentBestStars = this.state.moduleCompletion[moduleId] || 0;

         if (stars > currentBestStars) {
             // 如果本次星级更高，则更新星级并增加得分差额
             const scoreToAdd = scoreEarned - (this.state.moduleCompletion[moduleId] ? this.state.moduleCompletion[moduleId] * 10 : 0); // 假设每星10分
             this.state.moduleCompletion[moduleId] = stars;
             this.state.score += scoreEarned; // 直接加本次得分 (或者只加提高星级带来的额外分)
             console.log(`模块 ${moduleId} 记录新最佳成绩。得分: ${this.state.score} (总分), 星级: ${stars}`);

         } else {
             // 如果本次星级不高，只加得分 (可选，如果希望重复玩也能加分的话)
              this.state.score += scoreEarned;
              console.log(`模块 ${moduleId} 已有记录，本次得分: ${scoreEarned}, 星级: ${stars}。总分: ${this.state.score}`);
         }
         this.saveProgress();
    }

    // 检查模块是否完成以及完成的星级
    getModuleCompletion(chapterId, moduleIndex) {
        const moduleId = `${chapterId}_mod${moduleIndex}`;
        return this.state.moduleCompletion[moduleId] || 0; // 返回星级，未完成返回0
    }

    // 标记应用为非首次运行 (用于在加载进度后更新状态)
    markAsNotFirstRun() {
         if (this.state.isFirstRun) {
             this.updateState({ isFirstRun: false });
         }
    }

    // 可以根据需要添加更多方法来操作和获取不同的状态属性
    // 例如：跳转到下一模块/章节的方法
    goToNextModule() {
        // TODO: 实现复杂的跳转逻辑，需要知道每个章节有多少模块，以及总共有多少章节
        // 这是一个简化的示例
        const currentModuleIndex = this.state.currentModuleIndex;
        const currentChapter = this.state.currentChapter;
        // 假设每个章节固定有3个模块 (需要根据实际数据来判断)
        const totalModulesInCurrentChapter = 3; // 占位符，需要根据数据确定

        if (currentModuleIndex < totalModulesInCurrentChapter - 1) {
            // 还有下一模块
            this.updateState({ currentModuleIndex: currentModuleIndex + 1 });
            console.log(`前进到当前章节下一模块: ${this.state.currentChapter}-${this.state.currentModuleIndex}`);
            return { finishedChapter: false, nextChapter: null };
        } else {
            // 当前章节已完成所有模块
            const nextChapter = currentChapter + 1;
             // 假设总共有4章
            const totalChapters = 4; // 占位符，需要根据实际章节数量确定

            if (nextChapter <= totalChapters) {
                // 进入下一章节的第一个模块
                this.updateState({
                    currentChapter: nextChapter,
                    currentModuleIndex: 0
                });
                 console.log(`前进到下一章节: ${this.state.currentChapter}-${this.state.currentModuleIndex}`);
                 return { finishedChapter: true, nextChapter: nextChapter };
            } else {
                 // 所有章节都完成了
                 console.log("恭喜，所有章节已完成!");
                 // 可以设置一个完成标记或跳转到结束界面
                 return { finishedChapter: true, nextChapter: null }; // 表示已完成所有章节
            }
        }
    }
}