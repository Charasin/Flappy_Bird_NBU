// Flappy Bird rewritten using the p5.js library

let audioCtx;
let flapAnimationFrames = 0;

// Bird properties
const bird = {
  x: 50,
  y: 0,
  width: 20,
  height: 20,
  gravity: 0.4,
  lift: -8,
  velocity: 0
};

// Pipe properties
const pipes = [];
const pipeWidth = 40; // wider pipes
// Faster movement and spawn rate for a snappier game
const pipeSpeed = 3;
const spawnInterval = 100;
const gapSize = 200; // distance between top and bottom pipe

// Cloud properties
const clouds = [
  { x: 80, y: 80, size: 20 },
  { x: 200, y: 60, size: 25 },
  { x: 280, y: 110, size: 18 }
];
let frame = 0;
let score = 0;
const buildings = [];
let paused = false;

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

function playLose() {
  playSound(220, 0.3);
}

function setup() {
  const canvas = createCanvas(320, 480);
  canvas.id('gameCanvas');
  canvas.parent(document.body);
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  restartGame();
  createCity();
  const btn = document.getElementById('pauseBtn');
  if (btn) {
    btn.addEventListener('click', togglePause);
  }
}

function drawBird() {
  const centerX = bird.x + bird.width / 2;
  const centerY = bird.y + bird.height / 2;
  const radius = bird.width / 2;

  // body
  fill('#ff0');
  noStroke();
  ellipse(centerX, centerY, bird.width, bird.height);

  // wings
  const flapping = flapAnimationFrames > 0;
  if (flapping) {
    triangle(
      centerX - radius / 2,
      centerY - 3,
      centerX - radius - 4,
      centerY - 8,
      centerX - radius - 4,
      centerY - 3
    );
    triangle(
      centerX + radius / 2,
      centerY - 3,
      centerX + radius + 4,
      centerY - 8,
      centerX + radius + 4,
      centerY - 3
    );
  } else {
    triangle(
      centerX - radius / 2,
      centerY,
      centerX - radius - 4,
      centerY - 5,
      centerX - radius - 4,
      centerY + 5
    );
    triangle(
      centerX + radius / 2,
      centerY,
      centerX + radius + 4,
      centerY - 5,
      centerX + radius + 4,
      centerY + 5
    );
  }

  // beak
  fill('#f90');
  triangle(
    bird.x + bird.width,
    centerY,
    bird.x + bird.width + 8,
    centerY - 3,
    bird.x + bird.width + 8,
    centerY + 3
  );

  // eyes
  const eyeY = centerY - radius / 3;
  const eyeOffset = radius / 2.5;
  fill('#fff');
  ellipse(centerX + eyeOffset, eyeY, 6, 6);
  fill('#000');
  ellipse(centerX + eyeOffset, eyeY, 3, 3);
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
  const top = random(margin, height - gapSize - margin);
  pipes.push({ x: width, top: top, bottom: top + gapSize });
}

function createCity() {
  let x = 0;
  while (x < width) {
    const w = random(20, 40);
    const h = random(40, 100);
    buildings.push({ x, w, h });
    x += w + random(5, 15);
  }
}

function updateClouds() {
  clouds.forEach(cloud => {
    cloud.x -= 0.6; // move clouds faster
    if (cloud.x + cloud.size * 2 < 0) {
      cloud.x = width + random(0, 50);
    }
  });
}

function drawClouds() {
  fill('#fff');
  noStroke();
  clouds.forEach(cloud => {
    // draw three overlapping circles for a round cloud
    ellipse(cloud.x, cloud.y, cloud.size, cloud.size);
    ellipse(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.4, cloud.size, cloud.size);
    ellipse(cloud.x + cloud.size * 1.2, cloud.y, cloud.size, cloud.size);
  });
}

function drawCity() {
  fill('#666');
  noStroke();
  buildings.forEach(b => {
    rect(b.x, height - 40 - b.h, b.w, b.h);
  });
}

function drawPlains() {
  fill('#3cba54');
  noStroke();
  rect(0, height - 40, width, 40);
}

function drawPipes() {
  let colorVal = '#0f0';
  if (score >= 30) {
    colorVal = 'yellow';
  } else if (score >= 20) {
    colorVal = 'blue';
  } else if (score >= 10) {
    colorVal = 'red';
  }

  const radius = pipeWidth / 2;
  pipes.forEach(pipe => {
    const ctx = drawingContext;
    const grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
    grad.addColorStop(0, colorVal);
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(1, colorVal);
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.rect(pipe.x, 0, pipeWidth, pipe.top - radius);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pipe.x + radius, pipe.top - radius, radius, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pipe.x + radius, pipe.bottom + radius, radius, 0, Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(pipe.x, pipe.bottom + radius, pipeWidth, height - pipe.bottom - radius);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(pipe.x + pipeWidth * 0.15, 0, pipeWidth * 0.2, pipe.top - radius);
    ctx.fillRect(pipe.x + pipeWidth * 0.15, pipe.bottom + radius, pipeWidth * 0.2, height - pipe.bottom - radius);
  });
}

function updatePipes() {
  pipes.forEach(pipe => (pipe.x -= pipeSpeed));
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

function togglePause() {
  paused = !paused;
  const btn = document.getElementById('pauseBtn');
  if (btn) {
    btn.textContent = paused ? 'Resume' : 'Pause';
  }
}

function drawScore() {
  fill('#000');
  noStroke();
  textSize(24);
  textStyle(BOLD);
  text(`Score: ${score}`, 10, 25);
}

function draw() {
  clear();
  background('#70c5ce');
  drawCity();
  drawPlains();
  if (flapAnimationFrames > 0) {
    flapAnimationFrames--;
  }
  if (!paused) {
    updateClouds();
    updateBird();
    updatePipes();
  }
  drawClouds();
  drawBird();
  drawPipes();
  drawScore();
  if (!paused) {
    if (detectCollision()) {
      playLose();
      restartGame();
    }
    frame++;
  } else {
    fill('#000');
    textSize(32);
    textAlign(CENTER, CENTER);
    text('PAUSED', width / 2, height / 2);
  }
}

function keyPressed() {
  if (key === 'p' || key === 'P') {
    togglePause();
    return;
  }
  if (!paused && (key === ' ' || keyCode === UP_ARROW)) {
    bird.velocity = bird.lift;
    playFlap();
    flapAnimationFrames = 5;
  }
}

function mousePressed() {
  if (!paused) {
    bird.velocity = bird.lift;
    playFlap();
    flapAnimationFrames = 5;
  }
}

