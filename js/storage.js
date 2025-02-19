class GameStorage {
  static save(gameState) {
      localStorage.setItem("gameState", JSON.stringify(gameState));
  }

  static load() {
      const state = localStorage.getItem("gameState");
      return state ? JSON.parse(state) : null;
  }

  static clearState() {
      localStorage.removeItem("gameState");
  }
}
