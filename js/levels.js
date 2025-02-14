class LevelSelect {
    constructor() {
        this.init();
    }

    init() {
        const buttons = document.querySelectorAll('.level-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const level = button.dataset.level;
                localStorage.setItem('selectedLevel', level);
                window.location.href = 'index.html';
            });
        });
    }
}

new LevelSelect();