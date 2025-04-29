// 配对游戏组件
class MatchingGame {
    constructor(data) {
        this.data = data;
        this.selectedSymbol = null;
        this.selectedMeaning = null;
        this.matchedPairs = 0;
    }

    start() {
        const gameArea = document.getElementById('game-area');
        const shuffledData = this.shuffleArray([...this.data]);
        
        gameArea.innerHTML = `
            <div class="matching-container">
                <div class="symbols">
                    ${shuffledData.map(item => {
                        const upper = item.symbol.slice(0, 1);
                        const lower = item.symbol.slice(1, 2);
                        return `
                            <div class="symbol-card" data-symbol="${item.symbol}">
                                <div class="gua-container">
                                    <div class="gua">${upper}</div>
                                    <div class="gua">${lower}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="meanings">
                    ${this.shuffleArray([...shuffledData]).map(item => `
                        <div class="meaning-card" data-symbol="${item.symbol}">
                            ${item.meaning}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    setupEventListeners() {
        const symbolCards = document.querySelectorAll('.symbol-card');
        const meaningCards = document.querySelectorAll('.meaning-card');

        symbolCards.forEach(card => {
            card.addEventListener('click', () => this.selectCard(card, 'symbol'));
        });

        meaningCards.forEach(card => {
            card.addEventListener('click', () => this.selectCard(card, 'meaning'));
        });
    }

    selectCard(card, type) {
        if (card.classList.contains('matched')) return;

        if (type === 'symbol') {
            if (this.selectedSymbol) {
                this.selectedSymbol.classList.remove('selected');
            }
            this.selectedSymbol = card;
        } else {
            if (this.selectedMeaning) {
                this.selectedMeaning.classList.remove('selected');
            }
            this.selectedMeaning = card;
        }

        card.classList.add('selected');

        if (this.selectedSymbol && this.selectedMeaning) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const symbol = this.selectedSymbol.dataset.symbol;
        const meaning = this.selectedMeaning.dataset.symbol;

        if (symbol === meaning) {
            this.selectedSymbol.classList.add('matched');
            this.selectedMeaning.classList.add('matched');
            this.matchedPairs++;

            if (this.matchedPairs === this.data.length) {
                setTimeout(() => {
                    alert('恭喜你完成了配对游戏！');
                    this.start();
                }, 500);
            }
        } else {
            this.selectedSymbol.classList.add('incorrect');
            this.selectedMeaning.classList.add('incorrect');
            setTimeout(() => {
                this.selectedSymbol.classList.remove('selected', 'incorrect');
                this.selectedMeaning.classList.remove('selected', 'incorrect');
            }, 1000);
        }

        this.selectedSymbol = null;
        this.selectedMeaning = null;
    }

    cleanup() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = '';
    }
}

export default MatchingGame; 