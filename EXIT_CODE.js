// Примерна функция за изход за играта Flappy Bird
// Извикайте exitGame() да спрете анимационния цикъл.

let animationId;

function gameLoop() {
  // ... съществуващата логика за обновяване и рисуване на играта ...
  animationId = requestAnimationFrame(gameLoop);
}

function exitGame() {
  cancelAnimationFrame(animationId);
  // Тук може да се извърши допълнително почистване, например премахване на слушатели на събития
}
