const DICTIONARY = {
    words: [],      // для проверки допустимых слов
    gameWords: [],  // для выбора загадываемых слов

determineUserLevel() {
    const statsJson = localStorage.getItem('gameStats');
    const stats = statsJson ? JSON.parse(statsJson) : { gamesWon: 0 };
    const wordsGuessed = stats.gamesWon || 0;
    
    // Определяем уровень на основе количества отгаданных слов
    // По 25 слов на уровень
    if (wordsGuessed < 25) return 1;
    if (wordsGuessed < 50) return 2;
    if (wordsGuessed < 75) return 3;
    if (wordsGuessed < 100) return 4;
    if (wordsGuessed < 125) return 5;
    if (wordsGuessed < 150) return 6;
    if (wordsGuessed < 175) return 7;
    if (wordsGuessed < 200) return 8;
    if (wordsGuessed < 225) return 9;
    return 10; // Максимальный уровень
},
    
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
            const level = this.determineUserLevel();
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
