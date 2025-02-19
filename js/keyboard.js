class Keyboard {
    constructor(game) {
        this.game = game;
        this.keyElements = new Map();
        this.confirmButton = null;
        this.init();
        this.setupGameListeners();
    }

    init() {
        // Используем существующий div keyboard
        const keyboardContainer = document.getElementById("keyboard");
        keyboardContainer.innerHTML = "";
        
        
        // Add confirm button
        this.confirmButton = document.createElement("button");
        this.confirmButton.className = "confirm-button";
        this.confirmButton.textContent = "Тикшерергә";
        this.confirmButton.addEventListener("click", () => this.game.submitAttempt());
        keyboardContainer.appendChild(this.confirmButton);

        // Создаем ряды клавиатуры прямо в контейнере
        KEYBOARD_LAYOUT.forEach(row => {
            const rowEl = document.createElement("div");
            rowEl.className = "keyboard-row";
            
            row.forEach(key => {
                const button = document.createElement("button");
                button.className = "key";
                button.textContent = key;
                button.addEventListener("click", () => this.game.addLetter(key));
                this.keyElements.set(key.toLowerCase(), button);
                rowEl.appendChild(button);
            });

            if (row === KEYBOARD_LAYOUT[KEYBOARD_LAYOUT.length - 1]) {
                rowEl.appendChild(this.createSpecialKey("backspace"));
            }
            
            const savedState = GameStorage.load();
            if (savedState && savedState.letterStates) {
            const letterStates = new Map(savedState.letterStates);
            this.updateKeyboardColors(letterStates);
        }


            keyboardContainer.appendChild(rowEl);
        });

        // Add keyboard event listeners
        document.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                this.game.removeLetter();
            } else if (KEYBOARD_LAYOUT.flat().includes(e.key.toLowerCase())) {
                this.game.addLetter(e.key.toLowerCase());
            }
        });

        // Add listener for current attempt changes
        this.game.on('letterAdded', () => this.updateConfirmButton());
        this.game.on('letterRemoved', () => this.updateConfirmButton());
    }

    updateConfirmButton() {
        if (this.game.currentAttempt.length === this.game.word.length) {
            this.confirmButton.classList.add('active');
        } else {
            this.confirmButton.classList.remove('active');
        }
    }

    createSpecialKey(type) {
        const key = SPECIAL_KEYS.find(k => k.id === type);
        const button = document.createElement("button");
        button.className = `key key-${type}`;
        button.textContent = key.text;
        if (type === "backspace") {
            button.addEventListener("click", () => this.game.removeLetter());
        }
        return button;
    }

    setupGameListeners() {
        this.game.on('letterStatesUpdated', ({ letterStates }) => {
            this.updateKeyboardColors(letterStates);
        });
        this.game.on('gameReset', () => {
            this.resetKeyboardColors();
            this.updateConfirmButton();
        });
    }

    updateKeyboardColors(letterStates) {
        letterStates.forEach((state, letter) => {
            const keyElement = this.keyElements.get(letter);
            if (keyElement) {
                keyElement.classList.remove('correct', 'present', 'absent');
                keyElement.classList.add(state);
            }
        });
    }

    resetKeyboardColors() {
        this.keyElements.forEach(keyElement => {
            keyElement.classList.remove('correct', 'present', 'absent');
        });
    }
}
