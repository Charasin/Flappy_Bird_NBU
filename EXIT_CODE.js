// Example exit functionality for the Flappy Bird game
// Call exitGame() to stop the animation loop.

let animationId;

function gameLoop() {
  // ... existing game update and drawing logic ...
  animationId = requestAnimationFrame(gameLoop);
}

function exitGame() {
  cancelAnimationFrame(animationId);
  // Additional cleanup could be done here, such as removing event listeners
}
