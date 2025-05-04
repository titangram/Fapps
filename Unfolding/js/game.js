import MemoryGame from './games/MemoryGame.js';
import InterpretationGame from './games/InterpretationGame.js';
import MatchingGame from './games/MatchingGame.js';

// 八卦数据
const baguaData = [
    { name: '乾', symbol: '☰', meaning: '天，刚健，创始' },
    { name: '坤', symbol: '☷', meaning: '地，柔顺，包容' },
    { name: '震', symbol: '☳', meaning: '雷，动，长子' },
    { name: '巽', symbol: '☴', meaning: '风，入，长女' },
    { name: '坎', symbol: '☵', meaning: '水，险，中男' },
    { name: '离', symbol: '☲', meaning: '火，丽，中女' },
    { name: '艮', symbol: '☶', meaning: '山，止，少男' },
    { name: '兑', symbol: '☱', meaning: '泽，悦，少女' }
];

// 64卦数据
const sixtyFourGuaData = [
    { name: '乾', symbol: '☰☰', meaning: '天，刚健，创始' },
    { name: '坤', symbol: '☷☷', meaning: '地，柔顺，包容' },
    { name: '屯', symbol: '☵☳', meaning: '水雷屯，艰难，开始' },
    { name: '蒙', symbol: '☶☵', meaning: '山水蒙，启蒙，教育' },
    { name: '需', symbol: '☵☰', meaning: '水天需，等待，需求' },
    { name: '讼', symbol: '☰☵', meaning: '天水讼，争讼，诉讼' },
    { name: '师', symbol: '☷☵', meaning: '地水师，军队，领导' },
    { name: '比', symbol: '☵☷', meaning: '水地比，亲近，团结' }
];

class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameArea = document.getElementById('game-area');
        this.navItems = document.querySelectorAll('.nav-item');
        this.setupEventListeners();
        this.showHome();
    }

    setupEventListeners() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const gameType = item.id;
                this.switchGame(gameType);
                this.updateActiveNav(item);
            });
        });
    }

    updateActiveNav(activeItem) {
        this.navItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    showHome() {
        this.gameArea.innerHTML = `
            <div class="home-poster">
                <div class="poster-content">
                    <h1 class="poster-title">易经玄学</h1>
                    <div class="bagua-symbol">☯</div>
                    <p class="poster-text">探索宇宙奥秘</p>
                    <p class="poster-text">领悟人生真谛</p>
                    <div class="yin-yang">
                        <div class="yin"></div>
                        <div class="yang"></div>
                    </div>
                </div>
            </div>
        `;
    }

    switchGame(gameType) {
        if (this.currentGame) {
            this.currentGame.cleanup();
        }

        switch (gameType) {
            case 'memory-game':
                this.currentGame = new MemoryGame(baguaData);
                break;
            case 'interpretation-game':
                this.currentGame = new InterpretationGame(baguaData);
                break;
            case 'matching-game':
                this.currentGame = new MatchingGame(sixtyFourGuaData);
                break;
        }

        if (this.currentGame) {
            this.currentGame.start();
        }
    }
}

// 初始化游戏管理器
const gameManager = new GameManager(); 