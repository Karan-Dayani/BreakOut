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
let paddleX = (cvs.width - PADDLE_WIDTH)/2
let leftArrow = false;
let rightArrow = false;

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
    if (e.keyCode === 37) {
        leftArrow = true;
    } else if (e.keyCode === 39) {
        rightArrow = true;
    }
});
document.addEventListener("keyup", function (e) {
    if (e.keyCode === 37) {
        leftArrow = false;
    } else if (e.keyCode === 39) {
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
    speed: 4,
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
        ball.dx = - ball.dx;
    }
    if (ball.y - ball.radius < 0 ) {
        ball.dy = - ball.dy
    }
    if (ball.y + ball.radius > cvs.height) {
        resetBall();
    }
}

//! Reseting the ball
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

//! Ball and paddle collision detection
function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {
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

//! Draw function
function draw() {
    drawPaddle();
    drawBall();
}

//! Update function
function update() {
    movePaddle();
    moveBall();
    ballwallcollision();
    ballPaddleCollision();
}

//! Game loop
function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    draw();
    update();
    requestAnimationFrame(loop);
}