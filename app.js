const playSection = document.querySelector(".play-section");
const playBtn = document.querySelector(".play-btn");
const levelDisplay = document.querySelector(".level-display");
const gameArea = document.querySelector(".game-area");

playBtn.onclick = () => {
    playSection.classList.add("fadeOut");
    levelDisplay.classList.replace("fadeOut", "fadeIn");
    setTimeout(() => {
        levelDisplay.classList.replace("top-50", "top-0");
        levelDisplay.classList.replace("translate-middle", "translate-middle-x");
    }, 800);
    gameArea.classList.replace("fadeOut", "fadeIn");
}

//! Main Game Code
//! Selecting canvas element
const cvs = document.querySelector("#breakout");
const ctx = cvs.getContext("2d");

//! Making line thick when drawing to canvas
ctx.lineWidth = 3;

//! Variable and constants
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
let leftArrow = false;
let rightArrow = false;

//! Creating the paddle
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx : 8
}

//! Drawing the paddle
function drawPaddle() {
    ctx.fillStyle = "#A97155";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#8FBDD3";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//! Controling the paddle
document.addEventListener("keydown", function(e) {
    if (e.keyCode === 37) {
        leftArrow = true;
    } else if (e.keyCode === 39) {
        rightArrow = true;
    }
});
document.addEventListener("keyup", function(e) {
    if (e.keyCode === 37) {
        leftArrow = false;
    } else if (e.keyCode === 39) {
        rightArrow = false;
    }
});

//! Moving the paddle
function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

//! Draw function
function draw() {
    drawPaddle();
}

//! Update function
function update() {
    movePaddle();
}

//! Game loop
function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    draw();
    update();
    requestAnimationFrame(loop);
}
loop();