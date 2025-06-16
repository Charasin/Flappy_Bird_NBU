const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// Bird properties
const bird = {
  x: 50,
  y: height / 2,
  width: 20,
  height: 20,
  gravity: 0.4,
  lift: -10,
  velocity: 0
};

// Pipe properties
const pipes = [];
const pipeWidth = 40;
const pipeGap = 150;
const pipeSpeed = 1.5;
const pipeInterval = 120;
let frame = 0;
let score = 0;

function drawBird() {
  ctx.fillStyle = '#ff0';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  if (bird.y + bird.height > height) {
    bird.y = height - bird.height;
    bird.velocity = 0;
  }
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }
}

function createPipe() {
  const topHeight = Math.random() * (height - pipeGap - 60) + 20;
  pipes.push({
    x: width,
    top: topHeight,
    bottom: topHeight + pipeGap
  });
}

function drawPipes() {
  ctx.fillStyle = '#0f0';
  pipes.forEach(pipe => {
    // top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    // bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, height - pipe.bottom);
  });
}

function updatePipes() {
  pipes.forEach(pipe => pipe.x -= pipeSpeed);
  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }
  if (frame % pipeInterval === 0) {
    createPipe();
  }
}

function detectCollision() {
  for (let pipe of pipes) {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      return true;
    }
  }
  return false;
}

function drawScore() {
  ctx.fillStyle = '#000';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  updateBird();
  updatePipes();
  drawBird();
  drawPipes();
  drawScore();
  if (detectCollision()) {
    alert('Game Over! Your score: ' + score);
    document.location.reload();
    return;
  }
  frame++;
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    bird.velocity = bird.lift;
  }
});
document.addEventListener('mousedown', () => {
  bird.velocity = bird.lift;
});

createPipe();
requestAnimationFrame(gameLoop);
