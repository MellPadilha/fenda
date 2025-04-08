let player;
let obstacles = [];
let gravity = 0.6;
let jumpPower = -10;
let gameSpeed = 3;
let currentDimension = 'top';
let spawnRate = 60;
let points = 0;

let isGlitching = false;
let glitchStartFrame = 0;
let glitchDuration = 120;
let nextGlitch = 600;

let gameState = 'init';
let countdown = 3;
let countdownStartFrame;
let blink = true;

let glitchOnSpeedUp = false;

function setup() {
  createCanvas(600, 400);
  player = new Player();
  frameRate(60);
}

function draw() {
  if (gameState === 'init') {
    background('#424242');
    if (frameCount % 60 < 30) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(32);
      text("Press SPACE to Init", width / 2, height / 2);
    }
    return;
  }

  if (gameState === 'countdown') {
    background('#424242');
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(64);
    let count = countdown - int((frameCount - countdownStartFrame) / 60);
    if (count > 0) {
      text(count, width / 2, height / 2);
    } else if (count === 0) {
      text("GO!", width / 2, height / 2);
    } else {
      gameState = 'playing';
    }
    return;
  }

  if (gameState === 'gameover') {
    background('#424242');
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("Game Over!", width / 2, height / 2 - 20);
    textSize(24);
    text("Press SPACE to Restart", width / 2, height / 2 + 30);
    player.show();
    return;
  }

  // Jogando...
  if (glitchOnSpeedUp && frameCount % 10 < 5) {
    background(0);
  } else {
    background('#424242');
  }

  if (glitchOnSpeedUp && frameCount - glitchStartFrame > 30) {
    glitchOnSpeedUp = false;
  }

  // Mostrar pontos no topo esquerdo
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Pontos: " + points, 10, 10);

  // Glitch aleatório
  if (frameCount === nextGlitch) {
    isGlitching = true;
    glitchStartFrame = frameCount;
    nextGlitch = frameCount + int(random(600, 1200));
  }

  if (isGlitching) {
    if (random() < 0.5) {
      fill(0);
      rect(0, 0, width, height);
    }
    if (frameCount - glitchStartFrame > glitchDuration) {
      isGlitching = false;
    }
  }

  // Aumentar velocidade a cada 5 segundos
  if (frameCount % 300 === 0) {
    gameSpeed += 1;
    glitchOnSpeedUp = true;
    glitchStartFrame = frameCount;
  }

  player.update();
  player.show();

  // Obstáculos
  if (frameCount % spawnRate === 0) {
    obstacles.push(new Obstacle());
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    if (obstacles[i].hits(player)) {
      gameState = 'gameover';
      noLoop();
      setTimeout(() => {
        loop();
      }, 500);
    }

    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (gameState === 'init' && key === ' ') {
    gameState = 'countdown';
    countdownStartFrame = frameCount;
    obstacles = [];
    points = 0;
    gameSpeed = 3;
    player = new Player();
  } else if (gameState === 'gameover' && key === ' ') {
    gameState = 'init';
    obstacles = [];
    points = 0;
    gameSpeed = 3;
    player = new Player();
  } else if (gameState === 'playing' && key === ' ') {
    player.switchDimension();
    points++;
  }
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
           player.x + player.size > this.x &&
           player.x < this.x + this.width;
  }

  show() {
    rect(this.x, this.y, this.width, this.height);
  }
}
