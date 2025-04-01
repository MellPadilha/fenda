let player;
let obstacles = [];
let gravity = 0.6;
let jumpPower = -10;
let gameSpeed = 3;
let currentDimension = 'top';
let spawnRate = 60; // Frames entre novos obstáculos

function setup() {
  createCanvas(600, 400);
  player = new Player();
}

function draw() {
  background(0);
  
  // Dimensão visual atual
  if (player.dimension === 'top') {
    background(0, 0, 255); // Azul para dimensão superior
  } else {
    background(255, 0, 0); // Vermelho para dimensão inferior
  }
  
  player.update();
  player.show();
  
  // Gerar obstáculos
  if (frameCount % spawnRate === 0) {
    obstacles.push(new Obstacle());
  }
  
  // Atualizar e mostrar obstáculos
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();
    
    if (obstacles[i].hits(player)) {
      console.log('Game Over!'); // Aqui pode ter uma lógica de reset
      noLoop();
    }
    
    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    player.switchDimension();
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
