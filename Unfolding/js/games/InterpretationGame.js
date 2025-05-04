// 解读游戏组件
class InterpretationGame {
    constructor(data) {
        this.data = data;
        this.currentIndex = 0;
        this.score = 0;
    }

    start() {
        const gameArea = document.getElementById('game-area');
        this.currentIndex = 0;
        this.score = 0;
        this.showQuestion();
    }

    showQuestion() {
        const gameArea = document.getElementById('game-area');
        const currentItem = this.data[this.currentIndex];
        const options = this.getRandomOptions(currentItem);

        gameArea.innerHTML = `
            <div class="interpretation-container">
                <div class="current-symbol">${currentItem.symbol}</div>
                <div class="options">
                    ${options.map(option => `
                        <button class="option-btn" data-correct="${option === currentItem.meaning}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    getRandomOptions(correctItem) {
        const options = [correctItem.meaning];
        const otherMeanings = this.data
            .filter(item => item !== correctItem)
            .map(item => item.meaning);
        
        while (options.length < 4) {
            const randomIndex = Math.floor(Math.random() * otherMeanings.length);
            const option = otherMeanings[randomIndex];
            if (!options.includes(option)) {
                options.push(option);
            }
        }

        return this.shuffleArray(options);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    setupEventListeners() {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => this.checkAnswer(button));
        });
    }

    checkAnswer(button) {
        const isCorrect = button.dataset.correct === 'true';
        button.classList.add(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            this.score++;
        }

        setTimeout(() => {
            this.currentIndex++;
            if (this.currentIndex < this.data.length) {
                this.showQuestion();
            } else {
                this.showResult();
            }
        }, 1000);
    }

    showResult() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <div class="interpretation-container">
                <h2>游戏结束</h2>
                <p>你的得分：${this.score}/${this.data.length}</p>
                <button class="restart-btn">重新开始</button>
            </div>
        `;

        document.querySelector('.restart-btn').addEventListener('click', () => this.start());
    }

    cleanup() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = '';
    }
}

export default InterpretationGame; 