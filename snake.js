const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const retryButton = document.getElementById("retryButton");
const resetButton = document.getElementById("resetButton");
const welcomeButton = document.getElementById("welcomeButton");
const welcomeScreen = document.getElementById("welcomeScreen");
const gameContainer = document.getElementById("gameContainer");
const highScoreContainer = document.getElementById("highScoreContainer");
const leftButton = document.getElementById("leftButton");
const upButton = document.getElementById("upButton");
const rightButton = document.getElementById("rightButton");
const downButton = document.getElementById("downButton");

const box = 20;
let snake = [];
let food;
let score;
let d;
let game;
let highScore = localStorage.getItem("highScore") || 0;

function initGame() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    score = 0;
    d = null;
    document.body.classList.remove('game-over');
}

document.addEventListener("keydown", direction);
leftButton.addEventListener("click", () => setDirection("LEFT"));
upButton.addEventListener("click", () => setDirection("UP"));
rightButton.addEventListener("click", () => setDirection("RIGHT"));
downButton.addEventListener("click", () => setDirection("DOWN"));

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        setDirection("LEFT");
    } else if (event.keyCode == 38 && d != "DOWN") {
        setDirection("UP");
    } else if (event.keyCode == 39 && d != "LEFT") {
        setDirection("RIGHT");
    } else if (event.keyCode == 40 && d != "UP") {
        setDirection("DOWN");
    }
}

function setDirection(dir) {
    if (dir == "LEFT" && d != "RIGHT") {
        d = "LEFT";
    } else if (dir == "UP" && d != "DOWN") {
        d = "UP";
    } else if (dir == "RIGHT" && d != "LEFT") {
        d = "RIGHT";
    } else if (dir == "DOWN" && d != "UP") {
        d = "DOWN";
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreContainer.textContent = `Рекорд: ${highScore}`;
        }
        retryButton.style.display = "block";
        document.body.classList.add('game-over');
        return;
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function startGame() {
    initGame();
    startButton.style.display = "none";
    retryButton.style.display = "none";
    game = setInterval(draw, 100);
}

function showGameScreen() {
    welcomeScreen.style.display = "none";
    gameContainer.style.display = "flex";
    highScoreContainer.textContent = `Рекорд: ${highScore}`;
}

function resetHighScore() {
    highScore = 0;
    localStorage.setItem("highScore", highScore);
    highScoreContainer.textContent = `Рекорд: ${highScore}`;
    alert("Рекордът е нулиран!");
}

welcomeButton.addEventListener("click", showGameScreen);
startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetHighScore);
