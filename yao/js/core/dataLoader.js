// js/core/dataLoader.js

// 存储加载后的所有数据
const gameData = {
    trigrams: [],
    hexagrams: [],
    lessons: {}, // 按章节存储课程内容
    exercises: {} // 按章节/模块存储练习题
};

// 定义内部使用的 localStorage 键名 (State Manager 使用)
const INTERNAL_STORAGE_KEY_FOR_STATE_MANAGER = 'yijingLearningProgress';


/**
 * 从指定的 JSON 文件路径加载数据
 * @param {string} filePath - JSON 文件的路径
 * @returns {Promise<object>} - 返回一个 Promise，解析为加载到的数据
 */
async function fetchJson(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            // 抛出更详细的错误，包含状态码和路径
            const error = new Error(`HTTP error! status: ${response.status} from ${filePath}`);
            error.status = response.status; // 添加状态码属性
            error.filePath = filePath;     // 添加文件路径属性
            throw error;
        }
        // 尝试解析 JSON
        const jsonData = await response.json();
        // 返回解析后的数据
        return jsonData;
    } catch (error) {
        // 这里的错误可能是网络错误、HTTP错误（如404），或者是 SyntaxError (JSON 解析错误)
        console.error(`Error loading or parsing data from ${filePath}:`, error);
        throw error; // 重新抛出错误以便上层调用者处理
    }
}

/**
 * 加载所有游戏所需的数据 (从多个分开的 JSON 文件加载)
 * @returns {Promise<object>} - 返回一个 Promise，解析为加载到的所有数据
 */
export async function loadData() {
    console.log("开始加载分开的游戏数据...");
    try {
        // 加载基础卦象数据
        // 请确保 js/data/trigrams.json 和 js/data/hexagrams.json 存在且内容正确
        gameData.trigrams = await fetchJson('js/data/trigrams.json');
        console.log("trigrams.json 加载成功"); // 添加日志确认
        gameData.hexagrams = await fetchJson('js/data/hexagrams.json');
         console.log("hexagrams.json 加载成功"); // 添加日志确认


        // 加载课程和练习数据 (加载 Chapter 1 的数据)
        // 请确保这些 JSON 文件和路径是存在的
        gameData.lessons.ch1 = await fetchJson('js/data/lessons/ch1_intro.json');
         console.log("ch1_intro.json 加载成功"); // 添加日志确认
        gameData.exercises.ch1 = await fetchJson('js/data/exercises/ch1_exercises.json');
         console.log("ch1_exercises.json 加载成功"); // 添加日志确认


        // === 暂时注释掉 Chapters 2 和 3 的数据加载 ===
        // 请在需要时填充对应的 JSON 文件内容，并在这里取消注释
        // gameData.lessons.ch2 = await fetchJson('js/data/lessons/ch2_intro.json');
        // console.log("ch2_intro.json 加载成功");
        // gameData.exercises.ch2 = await fetchJson('js/data/exercises/ch2_exercises.json');
        // console.log("ch2_exercises.json 加载成功");

        // gameData.lessons.ch3 = await fetchJson('js/data/lessons/ch3_intro.json');
        // console.log("ch3_intro.json 加载成功");
        // gameData.exercises.ch3 = await fetchJson('js/data/exercises/ch3_exercises.json');
        // console.log("ch3_exercises.json 加载成功");
         // =========================================


        console.log("所有必要的游戏数据加载成功！", gameData); // 修改日志提示
        return gameData; // 返回加载到的数据
    } catch (error) {
        console.error("加载游戏数据过程中发生错误:", error);
        console.error("请检查上述最后一条加载成功的日志后面的文件是否存在及内容是否为有效的 JSON 格式。");
        console.error("请确保通过本地 Web 服务器运行此应用 (例如 http://localhost:8000)，而不是直接打开 file:// 路径。");

        throw error; // 向上层抛出错误，让 app.js 知道加载失败了
    }
}

/**
 * 获取已加载的游戏数据
 * @returns {object} - 返回存储游戏数据的对象
 */
export function getData() {
    // 返回一个副本，避免外部直接修改原始数据（可选）
    // return JSON.parse(JSON.stringify(gameData));
    return gameData; // 目前直接返回引用即可
}