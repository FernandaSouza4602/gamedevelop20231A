//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; 
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; 
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; 
let velocityY = 0; 
let gravity = 0.4;

let gameOver = false;
let score = 0;
let maxScore = 0;

//sound
const som_hit = new Audio();
som_hit.src = './efeitos/hit.wav';
const som_ponto = new Audio();
som_ponto.src = './efeitos/ponto.wav';
const som_pulo = new Audio();
som_pulo.src = './efeitos/pulo.wav';
const som_theme = new Audio();
som_theme.src = './efeitos/theme.mp3';
const som_gameOver = new Audio();
som_gameOver.src = './efeitos/gameOver.wav';

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
   
   //load images
   birdImg = new Image();
   birdImg.src = "./flappybird.png";
   birdImg.onload = function() {
       context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
   }

   topPipeImg = new Image();
   topPipeImg.src = "./toppipe.png";

   bottomPipeImg = new Image();
   bottomPipeImg.src = "./bottompipe.png";

   requestAnimationFrame(update);
   setInterval(placePipes, 1500); 
   document.addEventListener("keydown", moveBird);
  

} 


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

  
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; 
            pipe.passed = true;
            som_ponto.play();
        }

        if (detectCollision(bird, pipe)) {
            som_hit.play();
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }

    //score
    context.fillStyle = "white";
    context.font="45px Sans Serif";
    context.fillText(score, 5, 45);

    if (score>maxScore) {
       maxScore = score; 
    }else{
        maxScore = maxScore
    }

    if (gameOver) {
        context.fillText("GAME OVER", 45, 300);
        context.fillText(("Max score: "), 45, 350)
        context.fillText(("Max score: ",maxScore), 280, 350)
        som_gameOver.play();
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        //jump
        velocityY = -6;
        som_pulo.play();

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&  
           a.x + a.width > b.x &&  
           a.y < b.y + b.height && 
           a.y + a.height > b.y; 
}