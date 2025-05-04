// 记忆游戏组件
class MemoryGame {
    constructor(data) {
        this.data = data;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
    }

    start() {
        const gameArea = document.getElementById('game-area');
        this.cards = this.createCards();
        this.shuffleCards();
        
        gameArea.innerHTML = `
            <div class="memory-container">
                ${this.cards.map(card => `
                    <div class="memory-card" data-symbol="${card.symbol}">
                        <div class="memory-card-inner">
                            <div class="memory-card-front"></div>
                            <div class="memory-card-back">${card.symbol}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.setupEventListeners();
    }

    createCards() {
        const cards = [];
        this.data.forEach(item => {
            cards.push({ symbol: item.symbol, matched: false });
            cards.push({ symbol: item.symbol, matched: false });
        });
        return cards;
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    setupEventListeners() {
        const cards = document.querySelectorAll('.memory-card');
        cards.forEach(card => {
            card.addEventListener('click', () => this.flipCard(card));
        });
    }

    flipCard(card) {
        if (this.flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
            card.classList.add('flipped');
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                this.checkMatch();
            }
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const symbol1 = card1.dataset.symbol;
        const symbol2 = card2.dataset.symbol;

        if (symbol1 === symbol2) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;

            if (this.matchedPairs === this.data.length) {
                setTimeout(() => {
                    alert('恭喜你完成了记忆游戏！');
                    this.start();
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        this.flippedCards = [];
    }

    cleanup() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = '';
    }
}

export default MemoryGame; 