
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird
let birdWidth = 34; // width/height ratio
let birdHeight = 24;
let birdX = birdWidth/8; // width/8
let birdY = birdHeight/2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,

}
//pipes
let pipeArray = [];
let pipeWidth = 64; // width/height 284/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardHeight;
let pipeY= 0;

let topPipeImg;
let bottomPipeImg


//game physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4; 

let gameOver = false;
let score = 0;

//getting canvas by id board
window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d") // drawing on the board

    //draw bird
    // context.fillStyle ="green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 secs
    document.addEventListener("keydown", moveBird);//when you tap on key, itll move
}

//clearing frames and draw bird everytime
function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);//apply gravity to current bird.y, or make sure it doesnt go past the top
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height){
        gameOver = true;
    } 


    //pipes
    for (let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX // shifts the pipe
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are two pipes, one point for each set
            pipe.passed = true;
        }

        if (detectCollision(bird,pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
            pipeArray.shift();//removes first element from array
    }

    //score
    context.fillStyle="white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes(){
    if (gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); 
    //currently the y position is 0, 512/4 = 128, 0-128= -128
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x : pipeX,
        y: randomPipeY,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x : pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
    
}

function moveBird(e) {
    if (e.code == "Space" || e.code =="ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY =-6;
        //reset game
        if (gameOver){ //resert everything back
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }

}

function detectCollision(a,b) {
    //check collision between two rectangles
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}