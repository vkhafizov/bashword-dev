document.addEventListener('DOMContentLoaded', async () => {
    // Инициализация словаря
    await DICTIONARY.initPromise;
    
    // Проверка наличия сохраненной игры
    const savedState = GameStorage.load();
    const continueBtn = document.getElementById('continue-game');
    
    if (!savedState || savedState.isGameOver) {
      continueBtn.disabled = true;
      continueBtn.style.opacity = '0.5';
    } else {
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
    }
    
    // Обработчики для кнопок меню
    continueBtn.addEventListener('click', () => {
      window.location.href = 'game.html';
    });
    
    document.getElementById('new-game').addEventListener('click', () => {
      // Очищаем сохраненное состояние и переходим к игре
      GameStorage.clearState();
      window.location.href = 'game.html';
    });
    
    // Отображение прогресс-бара
    renderProgressBar();
    
    // Настройка модальных окон
    setupModals();
  });
  
  function renderProgressBar() {
    const statsJson = localStorage.getItem('gameStats');
    const stats = statsJson ? JSON.parse(statsJson) : { gamesWon: 0 };
    const wordsGuessed = stats.gamesWon || 0;
    
    // Определяем уровень пользователя
    const currentLevel = DICTIONARY.determineUserLevel ? DICTIONARY.determineUserLevel() : 1;
    const prevLevel = currentLevel - 1;
    const nextLevel = currentLevel + 1;
    const prevThreshold = prevLevel * 25;
    const nextThreshold = currentLevel * 25;
    const progressPercent = Math.min(100, ((wordsGuessed - prevThreshold) / (nextThreshold - prevThreshold)) * 100);
    
    // Получаем контейнер прогресс-бара
    const progressBarContainer = document.getElementById('progress-bar');
    
    // Создаем элементы прогресс-бара
    progressBarContainer.innerHTML = `
      <div class="progress-line"></div>
      <div class="progress-fill" style="width: ${progressPercent}%"></div>
      
      <div class="circle-container">
        <div class="progress-circle filled">${prevLevel > 0 ? (prevLevel*25) : '0'}</div>
      </div>
      
      <div class="circle-container">
        <div class="progress-circle current">${currentLevel*25}</div>
      </div>
      
      <div class="circle-container">
        <div class="progress-circle">${currentLevel < 10 ? (nextLevel*25) : '∞'}</div>
      </div>
    `;
  }
  
  function setupModals() {
    // Кнопка бургер-меню
    const menuButton = document.getElementById('menu-button');
    const burgerModal = document.getElementById('burger-modal');
    
    menuButton.addEventListener('click', () => {
      burgerModal.classList.add('visible');
    });
    
    // Кнопки в бургер-меню
    document.getElementById('statistics-btn').addEventListener('click', () => {
      burgerModal.classList.remove('visible');
      document.getElementById('statistics-modal').classList.add('visible');
      renderStatistics();
    });
    
    document.getElementById('language-btn').addEventListener('click', () => {
      burgerModal.classList.remove('visible');
      document.getElementById('language-modal').classList.add('visible');
    });
    
    document.getElementById('about-btn').addEventListener('click', () => {
      burgerModal.classList.remove('visible');
      document.getElementById('about-modal').classList.add('visible');
    });
    
    // Обработчик для всех кнопок закрытия
    document.querySelectorAll('.close-button').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
          modal.classList.remove('visible');
        });
      });
    });
    
    // Закрытие модальных окон при клике вне содержимого
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('visible');
        }
      });
    });
    
    // Обработчик для кнопки справки
    document.querySelector('.help-button').addEventListener('click', () => {
      // Используем существующий модуль HelpModal из help.js
      if (typeof HelpModal !== 'undefined') {
        const helpModal = new HelpModal();
        helpModal.showModal();
      } else {
        console.error('HelpModal не загружен. Добавьте скрипт help.js в index.html');
      }
    });
  }
  
  function renderStatistics() {
    const statsContainer = document.getElementById('statistics-content');
    const statsJson = localStorage.getItem('gameStats');
    const stats = statsJson ? JSON.parse(statsJson) : { 
      gamesPlayed: 0, 
      gamesWon: 0, 
      currentStreak: 0, 
      bestStreak: 0 
    };
    
    // Вычисляем процент побед
    const winPercentage = stats.gamesPlayed > 0 
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
      : 0;
    
    // Уровень игрока
    const level = DICTIONARY.determineUserLevel ? DICTIONARY.determineUserLevel() : 1;
    
    statsContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
        <div class="stat-item">
          <div class="stat-value">${stats.gamesPlayed}</div>
          <div class="stat-label">Уйындар</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.gamesWon}</div>
          <div class="stat-label">Еңеүҙәр</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${winPercentage}%</div>
          <div class="stat-label">Еңеү %</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${level}</div>
          <div class="stat-label">Кимәл</div>
        </div>
      </div>
      <div style="margin-top: 1rem;">
        <div class="stat-item">
          <div class="stat-value">${stats.currentStreak}</div>
          <div class="stat-label">Ағымдағы теҙмә</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.bestStreak}</div>
          <div class="stat-label">Иң оҙон теҙмә</div>
        </div>
      </div>
    `;
  }