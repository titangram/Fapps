class IChingExplorer {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.collectedHexagrams = new Set();
        this.currentLevel = 1;
        
        this.init();
    }

    init() {
        // 设置画布大小
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // 绑定事件
        this.canvas.addEventListener('click', this.handleClick.bind(this));

        // 开始游戏循环
        this.gameLoop();
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 检查是否点击到卦象
        this.checkHexagramClick(x, y);
    }

    checkHexagramClick(x, y) {
        // 这里将实现卦象点击检测逻辑
        // 暂时使用简单的示例
        if (this.currentLevel <= 64) {
            this.collectedHexagrams.add(this.currentLevel);
            this.score++;
            this.currentLevel++;
            this.updateUI();
        }
    }

    updateUI() {
        document.getElementById('score').textContent = `卦象收集：${this.score}/64`;
        document.getElementById('hint').textContent = `当前探索：第${this.currentLevel}卦`;
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制当前卦象
        this.drawCurrentHexagram();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    drawCurrentHexagram() {
        // 这里将实现卦象绘制逻辑
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = '24px Microsoft YaHei';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`第${this.currentLevel}卦`, this.canvas.width/2, this.canvas.height/2);
    }
}

// 启动游戏
window.onload = () => {
    new IChingExplorer();
}; 