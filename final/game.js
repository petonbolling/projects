// Game variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerWidth = 50;
const playerHeight = 50;
let playerX = (canvas.width - playerWidth) / 2;
const playerSpeed = 7;

const blockWidth = 50;
const blockHeight = 50;
const blockSpeed = 3;
let blocks = [];

let score = 0; // Initialize score

// Key tracking
let leftArrowPressed = false;
let rightArrowPressed = false;

// Event listeners for keyboard input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") leftArrowPressed = true;
    if (e.key === "ArrowRight") rightArrowPressed = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") leftArrowPressed = false;
    if (e.key === "ArrowRight") rightArrowPressed = false;
});

// Player object
const player = {
    x: playerX,
    y: canvas.height - playerHeight - 10,
    width: playerWidth,
    height: playerHeight,
    draw: function () {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    move: function () {
        if (leftArrowPressed && this.x > 0) this.x -= playerSpeed;
        if (rightArrowPressed && this.x < canvas.width - this.width) this.x += playerSpeed;
    }
};

// Block object
function createBlock() {
    const x = Math.random() * (canvas.width - blockWidth);
    blocks.push({ x: x, y: 0, width: blockWidth, height: blockHeight });
}

function drawBlocks() {
    ctx.fillStyle = "red";
    blocks.forEach(block => {
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
}

function moveBlocks() {
    blocks.forEach(block => {
        block.y += blockSpeed;
    });
}

function checkCollision() {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (
            player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y
        ) {
            alert("Game Over! Final Score: " + score);
            document.location.reload(); // Restart the game
        }
    }
}

// Logic Error: Incorrect score update
function updateScore() {
    // This logic mistakenly checks that a block has fallen beyond the top (block.y <= 0)
    // instead of checking if it has fallen off the bottom of the screen.
    blocks = blocks.filter(block => {
        if (block.y <= 0) {  // Error: this should be `block.y >= canvas.height`
            score++; // Increase the score
            return false; // Remove the block
        }
        return true; // Keep the block
    });
}

// Draw the score on the canvas
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 30); // Display score at the top left
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.move();
    player.draw();
    drawBlocks();
    moveBlocks();
    checkCollision();
    updateScore();
    drawScore();

    if (Math.random() < 0.02) { // 2% chance to create a new block each frame
        createBlock();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
