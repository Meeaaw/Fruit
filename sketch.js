let squares = [];
let fruits = [
  { img: null, slicedImg: null, keyCode: 37 }, // Banana left
  { img: null, slicedImg: null, keyCode: 39 }, // Apple right
  { img: null, slicedImg: null, keyCode: 38 }, // Orange Up
  { img: null, slicedImg: null, keyCode: 40 }, // Coconut Down
];
let gameOver = false;
let losingPointHeight = 20;
let startTime;
let speed = 2;
let timeElapsed = 0;
let speedIncreaseInterval = 20;
let wood, basket;
let gameStart = false;
let score = 0;
let sound, slice, gameover;

function preload() {
  fruits[0].img = loadImage('Banana.png');
  fruits[0].slicedImg = loadImage('BananaSliced.png');
  fruits[1].img = loadImage('Apple.png');
  fruits[1].slicedImg = loadImage('AppleSliced.png');
  fruits[2].img = loadImage('Orange.png');
  fruits[2].slicedImg = loadImage('OrangeSliced.png');
  fruits[3].img = loadImage('Coconut.png');
  fruits[3].slicedImg = loadImage('CoconutSliced.png');
  wood = loadImage('wood2.jpg');
  basket = loadImage('basket.png');
  mainscreen = loadImage('title.png');
  gamescreen = loadImage('gamescreen.png');
  endscreen = loadImage('endscreen.png');
  sound = loadSound('youtube_QjysZ3X-OrM_audio.mp3');
  slice = loadSound('fruitsliceaudio.mp3');
  gameover = loadSound('GameOver_audio.mp3'); 
}

function setup() {
  createCanvas(600, 600);
  frameRate(60);
  startTime = millis();
  
  sound.loop();
}

function draw() {
  if (!gameStart) {
    background(0);
    image(mainscreen, 0, 0, width, height);
    fill(144, 238, 144, 200);
    rect(width / 2 - 170, height / 2 , 350, 70, 10);
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Press Enter to Start!', width / 2, height / 1.8);
    return;
  }

  background(gamescreen);
  image(basket, 0, 530, 600, 50);

  if (gameOver) {
    image(endscreen, 0, 0, width, height);

    fill(144, 238, 144, 200);
    rect(width / 2 - 150, height / 2 + 40, 300, 80, 10);

    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text(`Score: ${score}`, width / 2, height / 2 + 60);
    text('Press R to Restart', width / 2, height / 2 + 90);
     if (sound.isPlaying()) {
      sound.stop();
      gameover.play();
    }
    noLoop();
    return;
  }

  fill(255, 50, 50);
  rect(0, height - losingPointHeight, width, losingPointHeight);

  timeElapsed = (millis() - startTime) / 1000;
  let elapsedTime = timeElapsed.toFixed(1);

  fill(144, 238, 144, 200);
  rect(width - 150, 5, 200, 40, 5); 
  rect(5, 5, 140, 40, 5);          

  textSize(24);
  fill(0);
  textAlign(RIGHT, TOP);
  text(`Time: ${elapsedTime}s`, width - 10, 10);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 10, 10);

  let speedMultiplier = Math.floor(timeElapsed / speedIncreaseInterval);
  speed = 2 + speedMultiplier * 2;

  if (frameCount % 60 === 0) {
    let fruit = random(fruits);
    squares.push({
      x: random(width - 50),
      y: 0,
      img: fruit.img,
      slicedImg: fruit.slicedImg,
      keyCode: fruit.keyCode,
      sliced: false,
    });
  }

  for (let i = squares.length - 1; i >= 0; i--) {
    let square = squares[i];
    square.y += speed;

    if (square.sliced) {
      image(square.slicedImg, square.x, square.y, 50, 50);
    } else {
      image(square.img, square.x, square.y, 50, 50);
    }

    if (square.y + 50 >= height - losingPointHeight) {
      gameOver = true;
    }
  }
}

function keyPressed() {
  if (!gameStart) {
    gameStart = true;
    startTime = millis();
    score = 0; 
    loop();
    return;
  }

  if (gameOver && keyCode === 82) { 
    gameOver = false;
    squares = [];
    startTime = millis();
    score = 0;
    
     if (gameover.isPlaying()) {
      gameover.stop();
    }
     if (!sound.isPlaying()) {
      sound.loop();
    }
    
    loop();
    return;
  }
   let matched = false;

  for (let i = squares.length - 1; i >= 0; i--) {
    let square = squares[i];

    if (keyCode === square.keyCode) {
        matched = true;
      square.sliced = true;
      score += 10; 
      
      slice.rate(2.4);
      slice.play(); 


      setTimeout(() => {
        squares.splice(i, 1);
      }, 200);
      break;
    }
  }
   if (!matched) {
    score = max(0, score - 5);
  }
}