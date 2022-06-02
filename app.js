//! Sounds
var INTRO_S = new Audio();
INTRO_S.src = "sounds/intro.mp3";

var LIFE_LOST_S = new Audio();
LIFE_LOST_S.src = "sounds/life-lost.mp3";

var GAME_OVER_S = new Audio;
GAME_OVER_S.src = "sounds/game-over.mp3";

var BALL_PADDLE_S = new Audio();
BALL_PADDLE_S.src = "sounds/ball-paddle.mp3";

var BALL_BLOCK_S = new Audio();
BALL_BLOCK_S.src = "sounds/ball-block.mp3";

var BALL_WALL_S = new Audio();
BALL_WALL_S.src = "sounds/ball-wall.mp3";

var GAME_FINISH_S = new Audio();
GAME_FINISH_S.src = "sounds/game-finish.mp3";

//! Basic stuff
const playSection = document.querySelector(".play-section");
const playBtn = document.querySelector(".play-btn");
const levelDisplay = document.querySelector(".level-display");
const gameArea = document.querySelector(".game-area");
const reloadBtn1 = document.querySelector(".reload-btn1");
const reloadBtn2 = document.querySelector(".reload-btn2");
const pauseBtn = document.querySelector(".pause-btn");
const pauseMenu = document.querySelector(".pause-menu");

const life = document.querySelector(".life");
const points = document.querySelector(".points");
const level = document.querySelector(".level");
const gameOverDisplay = document.querySelector(".game-over");
const winDisplay = document.querySelector(".win-display");

const soundON = document.querySelector(".sound-on");
const soundOFF = document.querySelector(".sound-off");

playBtn.onclick = () => {
    INTRO_S.play();
    playSection.classList.add("fadeOut");
    playBtn.disabled = true;
    levelDisplay.classList.replace("fadeOut", "fadeIn");
    setTimeout(() => {
        levelDisplay.classList.replace("top-50", "top-0");
        levelDisplay.classList.replace("translate-middle", "translate-middle-x");
    }, 800);
    setTimeout(() => {
        loop();
    }, 5000);
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
const BALL_RADIUS = 10;
const SCORE_UNIT = 10;
const MAX_LEVEL = 5;
let SCORE = 0;
let LIFE = 5; //* Player has 5 lives.
let LEVEL = 1;
let GAME_OVER = false;
// let paddleX = (cvs.width - PADDLE_WIDTH) / 2
let leftArrow = false;
let rightArrow = false;
let isLevelDone;

//! Setting info
level.textContent = LEVEL;
points.textContent = SCORE;
life.textContent = LIFE;

//! Creating the paddle
const paddle = {
    x: cvs.width / 2 - PADDLE_WIDTH / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 8
}

//! Drawing the paddle
function drawPaddle() {
    ctx.fillStyle = "#A97155";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#8FBDD3";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//! Controling the paddle
document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37 || e.keyCode === 65) {
        leftArrow = true;
    } else if (e.keyCode === 39 || e.keyCode === 68) {
        rightArrow = true;
    }
});
document.addEventListener("keyup", function (e) {
    if (e.keyCode === 37 || e.keyCode === 65) {
        leftArrow = false;
    } else if (e.keyCode === 39 || e.keyCode === 68) {
        rightArrow = false;
    }
});

// document.addEventListener("mousemove", function(e) {
//     var relativeX = e.clientX - cvs.left;
//     if (relativeX > 0 && relativeX < cvs.width) {
//         paddleX = relativeX - PADDLE_WIDTH / 2;
//     }
// });
// && paddleX < cvs.width - PADDLE_WIDTH


//! Moving the paddle
function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

//! Creating the ball
const ball = {
    x: cvs.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 5,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

//! Drawing the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#8FBDD3";
    ctx.fill();
    ctx.strokeStyle = "#A97155";
    ctx.stroke()
    ctx.closePath();
}

//! Moving the ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

//! Ball and wall collision detection
function ballwallcollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        BALL_WALL_S.play();
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        BALL_WALL_S.play();
        ball.dy = -ball.dy
    }
    if (ball.y + ball.radius > cvs.height) {
        if (!isLevelDone) {
            LIFE_LOST_S.play();
            LIFE--;
            life.textContent = LIFE;
            resetBall();
        }
    }
}

//! Reseting the ball
function resetBall() {
    ball.x = paddle.x + PADDLE_WIDTH / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

//! Ball and paddle collision detection
function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {
        BALL_PADDLE_S.play();
        //! check where the ball hit at the paddle
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        //! normalise the values
        collidePoint = collidePoint / (paddle.width / 2);
        //! calculate the angle of the ball
        let angle = collidePoint * Math.PI / 3;
        //! changing direction
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

//! Creating the bricks
const brick = {
    row: 3,
    column: 9,
    width: 100,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 20,
    fillColor: "#8FBDD3",
    strokeColor: "#A97155"
}

let bricks = [];

function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = []
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}

createBricks();

//! Drawing bricks
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            //! if the brick isn't broken
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

//! Ball and brick collision detection
function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            //! if the brick isn't broken
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    BALL_BLOCK_S.play();
                    ball.dy = -ball.dy;
                    b.status = false //* the brick is broken
                    SCORE += SCORE_UNIT;
                    points.textContent = SCORE;
                }
            }
        }
    }
}

//! Game over function
function gameOver() {
    if (LIFE <= 0) {
        GAME_OVER_S.play();
        cvs.style.cursor = "default";
        levelDisplay.classList.add("anim-class");
        gameArea.classList.add("anim-class");
        levelDisplay.classList.add("blur-effect");
        gameArea.classList.add("blur-effect");
        gameOverDisplay.classList.replace("fadeOut", "fadeIn");
        GAME_OVER = true;
    }
}

//! level up function
function levelUp() {
    isLevelDone = true;

    //! chech if all the bricks are broken
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }

    if (isLevelDone) {
        if (LEVEL >= MAX_LEVEL) {
            GAME_OVER = true;
            GAME_FINISH_S.play();
            cvs.style.cursor = "default";
            levelDisplay.classList.add("anim-class");
            gameArea.classList.add("anim-class");
            levelDisplay.classList.add("blur-effect");
            gameArea.classList.add("blur-effect");
            winDisplay.classList.replace("fadeOut", "fadeIn");
            return;
        }
        LEVEL++;
        level.textContent = LEVEL;
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall()
        SCORE = 0;
        points.textContent = SCORE;

    }
}

//! Draw function
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();
}

//! Update function
function update() {
    movePaddle();
    moveBall();
    ballwallcollision();
    ballPaddleCollision();
    ballBrickCollision();
    gameOver();
    levelUp();
}

//! Game loop
function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    draw();
    if (isPaused) {
        pauseGame();
    } else {
        resumeGame();
    }
    if (!GAME_OVER) {
        requestAnimationFrame(loop);
    }
}

//! Reloding website
reloadBtn1.onclick = () => {
    location.reload();
}
reloadBtn2.onclick = () => {
    location.reload();
}

//! Sound Manager
soundOFF.addEventListener("click", audioManager);
soundON.addEventListener("click", audioManager);
document.addEventListener("keydown", function (e) {
    if (e.keyCode === 77) {
        audioManager();
    }
});

function audioManager() {
    //! Change image
    if (soundOFF.classList.contains("fadeOut")) {
        soundON.classList.add("fadeOut");
        soundOFF.classList.replace("fadeOut", "fadaIn");
    } else if (soundON.classList.contains("fadeOut")) {
        soundON.classList.remove("fadeOut");
        soundOFF.classList.remove("fadeIn");
        soundOFF.classList.add("fadeOut");
    }

    //! Mute and unmute sound
    INTRO_S.muted = INTRO_S.muted ? false : true;
    LIFE_LOST_S.muted = LIFE_LOST_S.muted ? false : true;
    GAME_OVER_S.muted = GAME_OVER_S.muted ? false : true;
    GAME_FINISH_S.muted = GAME_FINISH_S.muted ? false : true;
    BALL_BLOCK_S.muted = BALL_BLOCK_S.muted ? false : true;
    BALL_PADDLE_S.muted = BALL_PADDLE_S.muted ? false : true;
    BALL_WALL_S.muted = BALL_WALL_S.muted ? false : true;
}

//! Pause functionlity
let isPaused = false;

pauseBtn.onclick = () => {
    if (!isPaused) {
        isPaused = true;
    } else {
        isPaused = false;
    }
}

document.addEventListener("keydown", function (e) {
    if (e.keyCode === 27) {
        if (!isPaused) {
            isPaused = true;
        } else {
            isPaused = false;
        }
    }
})

function pauseGame() {
    void(0);
    cvs.style.cursor = "default";
    levelDisplay.classList.add("anim-class");
    gameArea.classList.add("anim-class");
    levelDisplay.classList.add("blur-effect");
    gameArea.classList.add("blur-effect");
    pauseMenu.classList.replace("fadeOut", "fadeIn");
}

function resumeGame() {
    pauseMenu.classList.replace("fadeIn", "fadeOut");
    levelDisplay.classList.remove("blur-effect");
    gameArea.classList.remove("blur-effect");
    cvs.style.cursor = "none";
    update();
}