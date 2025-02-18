const DICTIONARY = {
    words: [],      // для проверки допустимых слов
    gameWords: [],  // для выбора загадываемых слов
    
    async init() {
        try {
            // Загружаем основной словарь для проверки слов
            const response = await fetch('data/dictionary.txt');
            if (!response.ok) throw new Error('Словарь не найден');
            const text = await response.text();
            this.words = text.split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0);

            // Загружаем словарь выбранного уровня
            const level = localStorage.getItem('selectedLevel') || '1';
            const levelResponse = await fetch(`data/dictionary-${level}.txt`);
            if (!levelResponse.ok) throw new Error('Словарь уровня не найден');
            const levelText = await levelResponse.text();
            this.gameWords = levelText.split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0);

        } catch (error) {
            console.error('Ошибка загрузки словаря:', error);
            // Резервные слова если файлы не загрузились
            this.words = ['һөйөү', 'китап', 'тырыш', 'бысаҡ', 'етмеш', 'бәхет', 'заман', 'илһам'];
            this.gameWords = this.words;
        }
    },

    isValidWord(word) {
        if (!this.words.length) return false;
        return this.words.includes(word.toLowerCase());
    },

    getRandomWord() {
        if (!this.gameWords.length) return 'китап';
        return this.gameWords[Math.floor(Math.random() * this.gameWords.length)];
    }
};

DICTIONARY.initPromise = DICTIONARY.init();