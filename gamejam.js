let player;
let obstacles = [];
let gravity = 0.6;
let jumpPower = -10;
let gameSpeed = 3;
let spawnRate = 60;
let points = 0;

// Glitch
let isGlitching = false;
let glitchStartFrame = 0;
let glitchDuration = 120;
let nextGlitch = 600;

// Batida
let hitEffect = false;
let hitStartFrame = 0;
let hitDuration = 30;

// Estados
let showInitMessage = true;
let countdown = 3;
let countdownStartFrame = 0;
let gameStarted = false;
let showGo = false;

function setup() {
  createCanvas(600, 400);
  resetGame();
}

function draw() {
  background('#424242');

  if (showInitMessage) {
    let blinkAlpha = abs(sin(frameCount * 0.05)) * 255;
    fill(255, blinkAlpha);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press Space to Init", width / 2, height / 2);
    return;
  }

  if (!gameStarted) {
    let elapsedFrames = frameCount - countdownStartFrame;

    if (elapsedFrames < 180) {
      fill(255);
      textSize(64);
      textAlign(CENTER, CENTER);

      if (elapsedFrames < 60) {
        text("3", width / 2, height / 2);
      } else if (elapsedFrames < 120) {
        text("2", width / 2, height / 2);
      } else if (elapsedFrames < 180) {
        text("1", width / 2, height / 2);
      }

      return;
    } else if (!showGo) {
      showGo = true;
      setTimeout(() => {
        gameStarted = true;
      }, 800);
    } else {
      fill(255);
      textSize(64);
      textAlign(CENTER, CENTER);
      text("GO!", width / 2, height / 2);
      return;
    }
  }

  if (hitEffect) {
    if ((frameCount - hitStartFrame) % 10 < 5) {
      background(255, 0, 0);
    }

    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2);

    if (frameCount - hitStartFrame > hitDuration) {
      setTimeout(() => {
        resetGame();
      }, 2000);
    }
    return;
  }

  if (isGlitching && random() < 0.5) {
    fill(0);
    rect(0, 0, width, height);
  }

  if (frameCount % 300 === 0) {
    gameSpeed += 1;
  }

  if (frameCount === nextGlitch) {
    isGlitching = true;
    glitchStartFrame = frameCount;
    nextGlitch = frameCount + int(random(600, 1200));
  }

  if (frameCount - glitchStartFrame > glitchDuration) {
    isGlitching = false;
  }

  player.update();
  player.show();

  if (frameCount % spawnRate === 0) {
    obstacles.push(new Obstacle());
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    if (obstacles[i].hits(player)) {
      hitEffect = true;
      hitStartFrame = frameCount;
      return;
    }

    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    }
  }

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Pontos: " + points, 10, 10);
}

function keyPressed() {
  if (showInitMessage && key === ' ') {
    showInitMessage = false;
    countdownStartFrame = frameCount;
    return;
  }

  if (gameStarted && key === ' ') {
    player.switchDimension();
    points++;
  }
}

function resetGame() {
  player = new Player();
  obstacles = [];
  gameSpeed = 3;
  points = 0;
  isGlitching = false;
  nextGlitch = 600;
  glitchStartFrame = 0;
  hitEffect = false;
  hitStartFrame = 0;
  gameStarted = false;
  showGo = false;
  showInitMessage = true;
}

class Player {
  constructor() {
    this.size = 30;
    this.x = 100;
    this.y = height / 4 - this.size / 2;
    this.dimension = 'top';
  }

  update() {
    this.y = this.dimension === 'top' ? height / 4 - this.size / 2 : 3 * height / 4 - this.size / 2;
  }

  switchDimension() {
    this.dimension = this.dimension === 'top' ? 'bottom' : 'top';
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Obstacle {
  constructor() {
    this.width = 20;
    this.height = 40;
    this.x = width;
    this.dimension = random(['top', 'bottom']);
    this.y = this.dimension === 'top' ? height / 4 - this.height / 2 : 3 * height / 4 - this.height / 2;
  }

  update() {
    this.x -= gameSpeed;
  }

  offscreen() {
    return this.x + this.width < 0;
  }

  hits(player) {
    return this.dimension === player.dimension &&
           player.x < this.x + this.width &&
           player.x + player.size > this.x;
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }
}
