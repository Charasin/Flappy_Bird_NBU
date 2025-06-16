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
  lift: -8,
  velocity: 0
};

// Pipe properties
const pipes = [];
const pipeWidth = 20;
const pipeEdgeSize = 40;
const pipeSpeed = 1.5;
const spawnInterval = 130;

// Cloud properties
const clouds = [
  { x: 80, y: 80, size: 20 },
  { x: 200, y: 60, size: 25 },
  { x: 280, y: 110, size: 18 }
];
let frame = 0;
let score = 0;

function drawBird() {
  const centerX = bird.x + bird.width / 2;
  const centerY = bird.y + bird.height / 2;
  const radius = bird.width / 2;
  // body
  ctx.fillStyle = '#ff0';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  // beak
  ctx.fillStyle = '#f90';
  ctx.beginPath();
  ctx.moveTo(bird.x + bird.width, centerY);
  ctx.lineTo(bird.x + bird.width + 8, centerY - 3);
  ctx.lineTo(bird.x + bird.width + 8, centerY + 3);
  ctx.closePath();
  ctx.fill();
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
  const topHeight = pipeEdgeSize;
  pipes.push({
    x: width,
    top: topHeight,
    bottom: height - pipeEdgeSize
  });
}

function updateClouds() {
  clouds.forEach(cloud => {
    cloud.x -= 0.3;
    if (cloud.x + cloud.size * 2 < 0) {
      cloud.x = width + Math.random() * 50;
    }
  });
}

function drawClouds() {
  ctx.fillStyle = '#fff';
  clouds.forEach(cloud => {
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.size, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(cloud.x + cloud.size, cloud.y - cloud.size, cloud.size, Math.PI, Math.PI * 2);
    ctx.arc(cloud.x + cloud.size * 2, cloud.y, cloud.size, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
  });
}

function drawPipes() {
  ctx.fillStyle = '#0f0';
  const radius = pipeWidth / 2;
  pipes.forEach(pipe => {
    // top pipe body
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top - radius);
    // top pipe cap
    ctx.beginPath();
    ctx.arc(pipe.x + radius, pipe.top - radius, radius, Math.PI, 0);
    ctx.fill();

    // bottom pipe cap
    ctx.beginPath();
    ctx.arc(pipe.x + radius, pipe.bottom + radius, radius, 0, Math.PI);
    ctx.fill();
    // bottom pipe body
    ctx.fillRect(pipe.x, pipe.bottom + radius, pipeWidth, height - pipe.bottom - radius);
  });
}

function updatePipes() {
  pipes.forEach(pipe => pipe.x -= pipeSpeed);
  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }
  if (frame % spawnInterval === 0) {
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
  updateClouds();
  updateBird();
  updatePipes();
  drawClouds();
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
