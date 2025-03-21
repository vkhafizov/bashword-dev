class HelpModal {
  constructor() {
    this.init();
  }

  init() {
    // Create help button
    const helpButton = document.createElement('button');
    helpButton.className = 'help-button';
    helpButton.innerHTML = '<img src="assets/pics/question.png" alt="Ярҙам" style="width: 24px; height: 24px;">';
    helpButton.setAttribute('aria-label', 'Уйын ҡағиҙәләре');
    document.body.appendChild(helpButton);

    // Create modal structure
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
      <div class="help-content">
        <div class="help-header">
          <h2>Уйын ҡағиҙәләре</h2>
          <button class="close-button" aria-label="Ябырға">×</button>
        </div>
        <div class="help-body">
          <p>Һеҙҙең 6 тырышыу менән һүҙҙе белергә мөмкинлегегеҙ бар.</p>
          <p>Һәр тырышыуҙан һуң, хәрефтәрҙең төҫө үҙгәрә һәм һүҙгә нисек яҡын икәнегеҙҙе күрһәтә.</p>
          
          <div class="help-example">
            <div class="word-row">
              <div class="letter-tile correct">Ҡ</div>
              <div class="letter-tile">А</div>
              <div class="letter-tile">Ғ</div>
              <div class="letter-tile">Ы</div>
              <div class="letter-tile">Ҙ</div>
            </div>
            <p><strong>Ҡ</strong> хәрефе һүҙҙә бар һәм дөрөҫ урында тора.</p>

            <div class="word-row">
              <div class="letter-tile">Б</div>
              <div class="letter-tile present">А</div>
              <div class="letter-tile">Л</div>
              <div class="letter-tile">Ы</div>
              <div class="letter-tile">Ҡ</div>
            </div>
            <p><strong>А</strong> хәрефе һүҙҙә бар, әммә башҡа урында тора.</p>

            <div class="word-row">
              <div class="letter-tile">Й</div>
              <div class="letter-tile">О</div>
              <div class="letter-tile absent">М</div>
              <div class="letter-tile">А</div>
              <div class="letter-tile">Ҡ</div>
            </div>
            <p><strong>М</strong> хәрефе һүҙҙә юҡ.</p>
          </div>
        </div>
        <div class="help-footer">
          <p>Көн һайын яңы һүҙ уйнап ҡарағыҙ!</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Add event listeners
    helpButton.addEventListener('click', () => this.showModal());
    modal.querySelector('.close-button').addEventListener('click', () => this.hideModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideModal();
      }
    });
  }

  showModal() {
    const modal = document.querySelector('.help-modal');
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  hideModal() {
    const modal = document.querySelector('.help-modal');
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

// Initialize help modal when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new HelpModal();
});
