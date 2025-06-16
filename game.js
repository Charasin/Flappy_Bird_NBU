const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// Audio context for simple sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Track wing animation frames
let flapAnimationFrames = 0;

function playSound(freq, duration) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playFlap() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 200;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.25);
}

function playScore() {
  playSound(660, 0.15);
}

function playVictory() {
  playSound(880, 0.2);
}

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
const pipeSpeed = 1.5;
const spawnInterval = 130;
const gapSize = 200; // distance between top and bottom pipe

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
  // wings
  const flapping = flapAnimationFrames > 0;
  ctx.fillStyle = '#ff0';
  ctx.beginPath();
  if (flapping) {
    ctx.moveTo(centerX - radius / 2, centerY - 3);
    ctx.lineTo(centerX - radius - 4, centerY - 8);
    ctx.lineTo(centerX - radius - 4, centerY - 3);
  } else {
    ctx.moveTo(centerX - radius / 2, centerY);
    ctx.lineTo(centerX - radius - 4, centerY - 5);
    ctx.lineTo(centerX - radius - 4, centerY + 5);
  }
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  if (flapping) {
    ctx.moveTo(centerX + radius / 2, centerY - 3);
    ctx.lineTo(centerX + radius + 4, centerY - 8);
    ctx.lineTo(centerX + radius + 4, centerY - 3);
  } else {
    ctx.moveTo(centerX + radius / 2, centerY);
    ctx.lineTo(centerX + radius + 4, centerY - 5);
    ctx.lineTo(centerX + radius + 4, centerY + 5);
  }
  ctx.closePath();
  ctx.fill();
  // beak
  ctx.fillStyle = '#f90';
  ctx.beginPath();
  ctx.moveTo(bird.x + bird.width, centerY);
  ctx.lineTo(bird.x + bird.width + 8, centerY - 3);
  ctx.lineTo(bird.x + bird.width + 8, centerY + 3);
  ctx.closePath();
  ctx.fill();
  // eyes
  const eyeY = centerY - radius / 3;
  const eyeOffset = radius / 2.5;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(centerX + eyeOffset, eyeY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(centerX + eyeOffset, eyeY, 1.5, 0, Math.PI * 2);
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
  const margin = 10;
  const top = Math.random() * (height - gapSize - margin * 2) + margin;
  pipes.push({
    x: width,
    top: top,
    bottom: top + gapSize
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
  let color = '#0f0';
  if (score >= 30) {
    color = 'yellow';
  } else if (score >= 20) {
    color = 'blue';
  } else if (score >= 10) {
    color = 'red';
  }
  ctx.fillStyle = color;
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
    playScore();
    if (score % 10 === 0) {
      playVictory();
    }
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

function restartGame() {
  pipes.length = 0;
  bird.y = height / 2;
  bird.velocity = 0;
  score = 0;
  frame = 0;
  createPipe();
}

function drawScore() {
  ctx.fillStyle = '#000';
  ctx.font = 'bold 24px "Comic Sans MS", cursive';
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  if (flapAnimationFrames > 0) {
    flapAnimationFrames--;
  }
  updateClouds();
  updateBird();
  updatePipes();
  drawClouds();
  drawBird();
  drawPipes();
  drawScore();
  if (detectCollision()) {
    restartGame();
  }
  frame++;
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    bird.velocity = bird.lift;
    playFlap();
    flapAnimationFrames = 5;
  }
});
document.addEventListener('mousedown', () => {
  bird.velocity = bird.lift;
  playFlap();
  flapAnimationFrames = 5;
});

restartGame();
requestAnimationFrame(gameLoop);
