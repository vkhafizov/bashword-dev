class Keyboard {
    constructor(game) {
        this.game = game;
        this.keyElements = new Map(); // Добавляем для подсветки
        this.init();
        this.setupGameListeners(); // Добавляем для подсветки
    }

    init() {
        const keyboard = document.getElementById("keyboard");
        keyboard.innerHTML = "";
        KEYBOARD_LAYOUT.forEach((row, i) => {
            const rowEl = document.createElement("div");
            rowEl.className = "keyboard-row";
            if (i === KEYBOARD_LAYOUT.length - 1) {
                rowEl.appendChild(this.createSpecialKey("enter"));
            }
            row.forEach(key => {
                const button = document.createElement("button");
                button.className = "key";
                button.textContent = key;
                button.addEventListener("click", () => this.game.addLetter(key));
                this.keyElements.set(key.toLowerCase(), button); // Добавляем для подсветки
                rowEl.appendChild(button);
            });
            if (i === KEYBOARD_LAYOUT.length - 1) {
                rowEl.appendChild(this.createSpecialKey("backspace"));
            }
            keyboard.appendChild(rowEl);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.game.submitAttempt();
            } else if (e.key === "Backspace") {
                this.game.removeLetter();
            } else if (KEYBOARD_LAYOUT.flat().includes(e.key.toLowerCase())) {
                this.game.addLetter(e.key.toLowerCase());
            }
        });
    }

    createSpecialKey(type) {
        const key = SPECIAL_KEYS.find(k => k.id === type);
        const button = document.createElement("button");
        button.className = `key key-${type}`;
        button.textContent = key.text;
        
        if (type === "enter") {
            button.addEventListener("click", () => this.game.submitAttempt());
        } else if (type === "backspace") {
            button.addEventListener("click", () => this.game.removeLetter());
        }
        
        return button;
    }

    // Добавляем новые методы для подсветки
    setupGameListeners() {
        this.game.on('letterStatesUpdated', ({ letterStates }) => {
            this.updateKeyboardColors(letterStates);
        });

        this.game.on('gameReset', () => {
            this.resetKeyboardColors();
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