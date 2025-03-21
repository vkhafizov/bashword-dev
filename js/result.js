function startNewGame() {
    localStorage.removeItem('gameState');
    window.location.href = 'index.html';
}

function selectLevel() {
    localStorage.removeItem('gameState');
    localStorage.removeItem('selectedLevel');
    window.location.href = 'levels.html';
}

function shareResult() {
    const word = document.getElementById('word-reveal').textContent.replace('Һүҙ: ', '');
    const attempts = document.getElementById('attempts-count').textContent;
    const time = document.getElementById('time-taken').textContent;
    
    // Текст для шеринга
    const shareText = `Башҡортса һүҙ уйынын уйнаным!\n\nҺүҙ: ${word}\nТырышыу: ${attempts}\nВаҡыт: ${time}\n\nУйнап ҡарағыҙ: https://t.me/bashword_dev_bot/bashword_dev`;
    
    // Создаем скриншот результатов
    const resultContent = document.getElementById('result-content');
    
    // Определяем, находимся ли мы в Telegram
    const isTelegram = navigator.userAgent.indexOf('Telegram') !== -1;
    
    // Используем html2canvas если доступен
    if (typeof html2canvas !== 'undefined') {
        html2canvas(resultContent).then(canvas => {
            canvas.toBlob(blob => {
                if (navigator.share && blob && !isTelegram) {
                    // Стандартный шеринг для обычных браузеров
                    navigator.share({
                        title: 'Башҡортса һүҙ уйыны',
                        text: shareText,
                        files: [new File([blob], 'bashword-result.png', { type: 'image/png' })]
                    }).catch(error => {
                        // Если произошла ошибка, предлагаем поделиться через Telegram
                        shareThroughTelegram(shareText);
                    });
                } else if (isTelegram) {
                    // Если мы в Telegram, используем прямую ссылку для шеринга
                    shareThroughTelegram(shareText);
                } else {
                    // Если нет Web Share API, предлагаем поделиться через Telegram
                    shareThroughTelegram(shareText);
                }
            });
        });
    } else {
        // Если html2canvas не загружен, предлагаем поделиться через Telegram
        shareThroughTelegram(shareText);
    }
}

// Функция для шеринга через Telegram
function shareThroughTelegram(text) {
    const encodedText = encodeURIComponent(text);
    const telegramUrl = `https://t.me/share/url?url=&text=${encodedText}`;
    
    // Открываем окно для шеринга через Telegram
    window.open(telegramUrl, '_blank');
}

class Results {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.resultData = {
            isWin: this.urlParams.get('win') === 'true',
            word: this.urlParams.get('word'),
            attempts: this.urlParams.get('attempts'),
            timeTaken: this.urlParams.get('time'),
            attemptsHistory: JSON.parse(decodeURIComponent(this.urlParams.get('history') || '[]'))
        };
        this.init();
    }

    init() {
        this.updateUI();
        this.updateGameStats();
        this.renderAttemptsHistory();
        
        // Проверяем результат и скрываем кнопку шеринга при поражении
        if (!this.resultData.isWin) {
            document.getElementById('share-container').style.display = 'none';
        }
    }

    renderAttemptsHistory() {
        const board = document.getElementById('attempts-board');
        board.innerHTML = '';

        this.resultData.attemptsHistory.forEach(attempt => {
            const row = document.createElement('div');
            row.className = 'history-row';

            attempt.split('').forEach((letter, index) => {
                const tile = document.createElement('div');
                tile.className = 'history-tile';
                tile.textContent = letter;
                tile.classList.add(this.getLetterStatus(letter, index, this.resultData.word));
                row.appendChild(tile);
            });

            board.appendChild(row);
        });
    }

    getLetterStatus(letter, position, word) {
        if (letter.toLowerCase() === word[position].toLowerCase()) {
            return 'correct';
        }
        if (word.toLowerCase().includes(letter.toLowerCase())) {
            return 'present';
        }
        return 'absent';
    }

    updateUI() {
        // Обновляем основные элементы UI
        document.getElementById('result-message').textContent = 
            this.resultData.isWin ? 'Афарин!' : 'Ярай инде, \nҡайғырма';
        document.getElementById('word-reveal').textContent = 
            `Һүҙ: ${this.resultData.word}`;
        document.getElementById('attempts-count').textContent = 
            this.resultData.attempts || '0';
        document.getElementById('time-taken').textContent = 
            this.resultData.timeTaken ? Math.floor(this.resultData.timeTaken / 1000) + 'с' : '0с';
    }

    updateGameStats() {
        // Обновляем статистику в localStorage
        const stats = this.getStats();
        stats.gamesPlayed++;
        
        if (this.resultData.isWin) {
            stats.gamesWon++;
            stats.currentStreak++;
            stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
        } else {
            stats.currentStreak = 0;
        }

        this.saveStats(stats);
    }

    getStats() {
        const defaultStats = {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            bestStreak: 0
        };

        const savedStats = localStorage.getItem('gameStats');
        return savedStats ? JSON.parse(savedStats) : defaultStats;
    }

    saveStats(stats) {
        localStorage.setItem('gameStats', JSON.stringify(stats));
    }

    startNewGame() {
        // Очищаем состояние текущей игры
        localStorage.removeItem('gameState');
        // Возвращаемся на главную страницу
        window.location.href = 'index.html';
    }
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const results = new Results();
    
    // Добавляем обработчик для кнопки новой игры
    document.querySelector('.continue-button')
        .addEventListener('click', () => results.startNewGame());
});
