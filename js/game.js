class Game {
    constructor() {
        this.word = "";
        this.attempts = [];
        this.currentAttempt = "";
        this.maxAttempts = 6;
        this.isGameOver = false;
        this.eventListeners = new Map();
        this.letterStates = new Map(); // Добавляем отслеживание состояния букв
        this.init();
        this.startTime = Date.now();
    }

    updateLetterStates(attempt) {
        attempt.split('').forEach((letter, index) => {
            const currentState = this.letterStates.get(letter.toLowerCase());
            const newState = this.getLetterStatus(letter, index);
            
            // Обновляем состояние только если оно лучше предыдущего
            if (!currentState || 
                (currentState === 'absent' && (newState === 'present' || newState === 'correct')) ||
                (currentState === 'present' && newState === 'correct')) {
                this.letterStates.set(letter.toLowerCase(), newState);
            }
        });   
        
        this.emit('letterStatesUpdated', { letterStates: this.letterStates });
    }

    init() {
        const savedState = GameStorage.load();
        if (savedState) {
            Object.assign(this, savedState);
            // Восстанавливаем Map из массива
            this.letterStates = new Map(savedState.letterStates || []);
            // Сообщаем клавиатуре о восстановленных состояниях
            this.emit('letterStatesUpdated', { letterStates: this.letterStates });
        } else {
            this.word = DICTIONARY.getRandomWord();
            this.letterStates = new Map();
        }
        this.render();
        this.emit('gameInit', { word: this.word });
    }

    // Event handling system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => callback(data));
        }
    }

    addLetter(letter) {
        if (this.currentAttempt.length < this.word.length && !this.isGameOver) {
            this.currentAttempt += letter;
            this.render();
            this.emit('letterAdded', { letter, currentAttempt: this.currentAttempt });
        }
    }

    removeLetter() {
        if (this.currentAttempt.length > 0) {
            const removedLetter = this.currentAttempt.slice(-1);
            this.currentAttempt = this.currentAttempt.slice(0, -1);
            this.render();
            this.emit('letterRemoved', { letter: removedLetter, currentAttempt: this.currentAttempt });
        }
    }

    submitAttempt() {
        if (this.currentAttempt.length !== this.word.length) {
            this.showMessage("Һүҙ тулы түгел!", "warning");
            return;
        }
        if (!DICTIONARY.isValidWord(this.currentAttempt)) {
            this.showMessage("Ундай һүҙ юҡ!", "error");
            return;
        }
    
        this.attempts.push(this.currentAttempt);
        this.updateLetterStates(this.currentAttempt);
        
        const timeTaken = Date.now() - this.startTime;
        const historyParam = encodeURIComponent(JSON.stringify(this.attempts));
        const gameStats = {
            word: this.word,
            attempts: this.attempts.length,
            time: timeTaken
        };
    
        if (this.currentAttempt.toLowerCase() === this.word.toLowerCase()) {
            this.isGameOver = true;
            this.showMessage("Дөрөҫ!", "success");
            this.emit('gameWon', { attempts: this.attempts.length });
            setTimeout(() => {
                window.location.href = `result.html?win=true&word=${this.word}&attempts=${this.attempts.length}&time=${timeTaken}&history=${historyParam}`;
            }, 1500);
        } else if (this.attempts.length >= this.maxAttempts) {
            this.isGameOver = true;
            this.showMessage(`Уйын бөттө!`, "info");
            this.emit('gameLost', { word: this.word });
            setTimeout(() => {
                window.location.href = `result.html?win=false&word=${this.word}&attempts=${this.attempts.length}&time=${timeTaken}&history=${historyParam}`;
            }, 1500);
        }
    
        this.currentAttempt = "";
        this.saveState();
        this.render();
        this.emit('attemptSubmitted', { 
            attempt: this.analyzeAttempt(this.attempts[this.attempts.length - 1])
        });
    
    }

    analyzeAttempt(attempt) {
        return attempt.split('').map((letter, index) => ({
            letter,
            status: this.getLetterStatus(letter, index)
        }));
    }

    getLetterStatus(letter, position) {
        if (letter.toLowerCase() === this.word[position].toLowerCase()) {
            return 'correct';
        }
        if (this.word.toLowerCase().includes(letter.toLowerCase())) {
            return 'present';
        }
        return 'absent';
    }

   showMessage(text, type = 'info') {
    const message = document.createElement("div");
    message.className = `message message-${type}`;
    message.textContent = text;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2500);
}

saveState() {
    const state = {
        word: this.word,
        attempts: this.attempts,
        currentAttempt: this.currentAttempt,
        isGameOver: this.isGameOver,
        letterStates: Array.from(this.letterStates.entries()) // Сохраняем состояния букв
    };
    GameStorage.save(state);
    this.emit('stateSaved', state);
}

    render() {
        const board = document.getElementById("board");
        board.innerHTML = "";

        for (let i = 0; i < this.maxAttempts; i++) {
            const row = this.createRow(i);
            board.appendChild(row);
        }

        this.emit('boardRendered', {
            attempts: this.attempts,
            currentAttempt: this.currentAttempt
        });
    }

    createRow(rowIndex) {
        const row = document.createElement("div");
        row.className = "row";

        const attempt = rowIndex < this.attempts.length ? this.attempts[rowIndex] 
                    : rowIndex === this.attempts.length ? this.currentAttempt 
                    : "";

        for (let j = 0; j < this.word.length; j++) {
            const tile = this.createTile(attempt, j, rowIndex);
            row.appendChild(tile);
        }

        return row;
    }

    createTile(attempt, position, rowIndex) {
        const tile = document.createElement("div");
        tile.className = "tile";
        
        if (attempt[position]) {
            tile.textContent = attempt[position];
            if (rowIndex < this.attempts.length) {
                tile.classList.add(this.getLetterStatus(attempt[position], position));
            }
        }

        return tile;
    }

    // New methods for game statistics
    getStatistics() {
        return {
            gamesPlayed: this.attempts.length > 0 ? 1 : 0,
            currentStreak: this.isGameOver && !this.hasLost() ? 1 : 0,
            averageAttempts: this.attempts.length,
            winPercentage: this.hasWon() ? 100 : 0
        };
    }

    hasWon() {
        return this.isGameOver && this.attempts[this.attempts.length - 1].toLowerCase() === this.word.toLowerCase();
    }

    hasLost() {
        return this.isGameOver && !this.hasWon();
    }

    reset() {
        this.word = DICTIONARY.getRandomWord();
        this.attempts = [];
        this.currentAttempt = "";
        this.isGameOver = false;
        this.letterStates.clear(); // Очищаем состояния букв
        this.saveState();
        this.render();
        this.emit('gameReset', { word: this.word });
    }
}
