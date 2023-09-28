"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drawFunctions_1 = require("./drawFunctions");
const gameObjects_1 = require("./gameObjects");
class PongGame {
    constructor() {
        this.gameOver = false;
        this.userWon = false;
        this.compWon = false;
        this.framePerSec = 50;
        this.isPaused = false;
        this.renderingStopped = false;
    }
    pauseGame(duration) {
        this.isPaused = true;
        setTimeout(() => {
            this.isPaused = false;
        }, duration);
    }
    collision(ball, player) {
        const playerTop = player.y;
        const playerBottom = player.y + player.h;
        const playerLeft = player.x;
        const playerRight = player.x + player.w;
        const ballTop = ball.y - ball.r;
        const ballBottom = ball.y + ball.r;
        const ballLeft = ball.x - ball.r;
        const ballRight = ball.x + ball.r;
        return (ballRight > playerLeft &&
            ballTop < playerBottom &&
            ballLeft < playerRight &&
            ballBottom > playerTop);
    }
    resetBall() {
        gameObjects_1.ball.x = drawFunctions_1.canvasWidth / 2;
        gameObjects_1.ball.y = drawFunctions_1.canvasHeight / 2;
        gameObjects_1.ball.velocityX *= -1;
    }
    movePaddle(event) {
        let pos = drawFunctions_1.canvas.getBoundingClientRect();
        gameObjects_1.user.y = event.clientY - pos.top - gameObjects_1.user.h / 2;
    }
    updateScore() {
        if (gameObjects_1.ball.x - gameObjects_1.ball.r < 0) {
            gameObjects_1.comp.score++;
            this.resetBall();
            this.pauseGame(150);
        }
        else if (gameObjects_1.ball.x + gameObjects_1.ball.r > drawFunctions_1.canvasWidth) {
            gameObjects_1.user.score++;
            this.resetBall();
            this.pauseGame(150);
        }
    }
    checkGameStatus() {
        if (gameObjects_1.user.score === 2) {
            this.userWon = true;
            this.gameOver = true;
        }
        else if (gameObjects_1.comp.score === 2) {
            this.compWon = true;
            this.gameOver = true;
        }
    }
    update() {
        gameObjects_1.ball.x += gameObjects_1.ball.velocityX;
        gameObjects_1.ball.y += gameObjects_1.ball.velocityY;
        let computerLevel = 0.1;
        gameObjects_1.comp.y += (gameObjects_1.ball.y - (gameObjects_1.comp.y + gameObjects_1.comp.h / 2)) * computerLevel;
        if (gameObjects_1.ball.y + gameObjects_1.ball.r > drawFunctions_1.canvasHeight || gameObjects_1.ball.y + gameObjects_1.ball.r < 10) {
            gameObjects_1.ball.velocityY *= -1;
        }
        let player = gameObjects_1.ball.x < drawFunctions_1.canvasWidth / 2 ? gameObjects_1.user : gameObjects_1.comp;
        if (this.collision(gameObjects_1.ball, player)) {
            // where the ball hits the player
            let collidePoint = gameObjects_1.ball.y - (player.y + player.h / 2);
            // normalization
            collidePoint = collidePoint / (player.h / 2);
            // calculate the angle in Radian
            let angleRad = (Math.PI / 4) * collidePoint;
            let direction = gameObjects_1.ball.x < drawFunctions_1.canvasWidth / 2 ? 1 : -1;
            gameObjects_1.ball.velocityX = direction * gameObjects_1.ball.speed * Math.cos(angleRad);
            gameObjects_1.ball.velocityY = direction * gameObjects_1.ball.speed * Math.sin(angleRad);
            gameObjects_1.ball.speed += 0.2;
        }
        this.updateScore();
        this.checkGameStatus();
    }
    render() {
        if (this.gameOver) {
            (0, drawFunctions_1.drawRect)(0, 0, drawFunctions_1.canvasWidth, drawFunctions_1.canvasHeight, "#B2C6E4");
            (0, drawFunctions_1.drawLine)(drawFunctions_1.canvasWidth / 2, 0, drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight / 2 - 40, gameObjects_1.midLine.color);
            (0, drawFunctions_1.drawLine)(drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight / 2 + 40, drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight, gameObjects_1.midLine.color);
            if (this.userWon) {
                (0, drawFunctions_1.drawText)("Game Over, You Win!", "#003366");
            }
            else if (this.compWon) {
                (0, drawFunctions_1.drawText)("Game Over, You Lose!", "#003366");
            }
            this.renderingStopped = true;
        }
        else {
            (0, drawFunctions_1.drawRect)(0, 0, drawFunctions_1.canvasWidth, drawFunctions_1.canvasHeight, "#B2C6E4");
            (0, drawFunctions_1.drawRect)(gameObjects_1.user.x, gameObjects_1.user.y, gameObjects_1.user.w, gameObjects_1.user.h, gameObjects_1.user.color);
            (0, drawFunctions_1.drawRect)(gameObjects_1.comp.x, gameObjects_1.comp.y, gameObjects_1.comp.w, gameObjects_1.comp.h, gameObjects_1.comp.color);
            (0, drawFunctions_1.drawLine)(gameObjects_1.midLine.startX, gameObjects_1.midLine.startY, gameObjects_1.midLine.endX, gameObjects_1.midLine.endY, gameObjects_1.midLine.color);
            (0, drawFunctions_1.drawBall)(gameObjects_1.ball.x, gameObjects_1.ball.y, gameObjects_1.ball.r, gameObjects_1.ball.color);
            (0, drawFunctions_1.drawScore)(gameObjects_1.user.score.toString(), -50, 70, "#201E3A");
            (0, drawFunctions_1.drawScore)(gameObjects_1.comp.score.toString(), 50, 70, "#201E3A");
        }
    }
    game() {
        if (!this.isPaused) {
            this.update();
        }
        this.render();
    }
    startGame() {
        drawFunctions_1.canvas.addEventListener("mousemove", this.movePaddle);
        if (!this.renderingStopped)
            setInterval(() => this.game(), 1000 / this.framePerSec);
    }
}
exports.default = PongGame;
