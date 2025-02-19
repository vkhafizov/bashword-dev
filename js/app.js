document.addEventListener("DOMContentLoaded", async () => {
  await DICTIONARY.initPromise;
  window.game = new Game();
  const keyboard = new Keyboard(window.game);
  
  const resultButton = document.querySelector('.result-button');
  resultButton.addEventListener('click', (e) => {
    e.preventDefault();
    const currentGame = window.game;
    const history = encodeURIComponent(JSON.stringify(currentGame.attempts));
    window.location.href = `result.html?word=${currentGame.word}&attempts=${currentGame.attempts.length}&time=${Math.floor((Date.now() - currentGame.startTime) / 1000)}&history=${history}`;
  });
});
