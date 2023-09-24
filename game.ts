import {
  canvas,
  canvasWidth,
  canvasHeight,
  drawRect,
  drawBall,
  drawLine,
  drawScore,
  drawText,
} from "./drawFunctions";

import { user, comp, midLine, ball } from "./gameObjects";

import { Rect, Line, Ball } from "./interfaces";

class PongGame {
  gameOver: boolean;
  userWon: boolean;
  compWon: boolean;
  framePerSec: number;
  isPaused: boolean;

  constructor() {
    this.gameOver = false;
    this.userWon = false;
    this.compWon = false;
    this.framePerSec = 50;
    this.isPaused = false;
  }

  pauseGame(duration: number): void {
    this.isPaused = true;
    setTimeout(() => {
      this.isPaused = false;
    }, duration);
  }

  collision(ball: Ball, player: Rect): boolean {
    const playerTop: number = player.y;
    const playerBottom: number = player.y + player.h;
    const playerLeft: number = player.x;
    const playerRight: number = player.x + player.w;

    const ballTop: number = ball.y - ball.r;
    const ballBottom: number = ball.y + ball.r;
    const ballLeft: number = ball.x - ball.r;
    const ballRight: number = ball.x + ball.r;

    return (
      ballRight > playerLeft &&
      ballTop < playerBottom &&
      ballLeft < playerRight &&
      ballBottom > playerTop
    );
  }

  resetBall(): void {
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;
    ball.velocityX *= -1;
  }

  movePaddle(event: MouseEvent): void {
    let pos: DOMRect = canvas.getBoundingClientRect();
    user.y = event.clientY - pos.top - user.h / 2;
  }

  updateScore(): void {
    if (ball.x - ball.r < 0) {
      comp.score++;
      this.resetBall();
      this.pauseGame(150);
    } else if (ball.x + ball.r > canvasWidth) {
      user.score++;
      this.resetBall();
      this.pauseGame(150);
    }
  }

  checkGameStatus(): void {
    if (user.score === 2) {
      this.userWon = true;
      this.gameOver = true;
    } else if (comp.score === 2) {
      this.compWon = true;
      this.gameOver = true;
    }
  }

  update(): void {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    let computerLevel: number = 0.1;

    comp.y += (ball.y - (comp.y + comp.h / 2)) * computerLevel;

    if (ball.y + ball.r >= canvasHeight || ball.y + ball.r <= 0) {
      ball.velocityY *= -1;
    }

    let player: Rect = ball.x < canvasWidth / 2 ? user : comp;

    if (this.collision(ball, player)) {
      // where the ball hits the player
      let collidePoint: number = ball.y - (player.y + player.h / 2);

      // normalization
      collidePoint = collidePoint / (player.h / 2);

      // calculate the angle in Radian
      let angleRad: number = (Math.PI / 4) * collidePoint;

      let direction: number = ball.x < canvasWidth / 2 ? 1 : -1;

      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = direction * ball.speed * Math.sin(angleRad);

      ball.speed += 0.2;
    }

    this.updateScore();
    this.checkGameStatus();
  }

  render(): void {
    if (this.gameOver) {
      drawRect(0, 0, canvasWidth, canvasHeight, "#B2C6E4");
      drawLine(
        canvasWidth / 2,
        0,
        canvasWidth / 2,
        canvasHeight / 2 - 40,
        midLine.color
      );
      drawLine(
        canvasWidth / 2,
        canvasHeight / 2 + 40,
        canvasWidth / 2,
        canvasHeight,
        midLine.color
      );

      if (this.userWon) {
        drawText("Game Over, You Win!", "#003366");
      } else if (this.compWon) {
        drawText("Game Over, You Lose!", "#003366");
      }
    } else {
      drawRect(0, 0, canvasWidth, canvasHeight, "#B2C6E4");
      drawRect(user.x, user.y, user.w, user.h, user.color);
      drawRect(comp.x, comp.y, comp.w, comp.h, comp.color);
      drawLine(
        midLine.startX,
        midLine.startY,
        midLine.endX,
        midLine.endY,
        midLine.color
      );
      drawBall(ball.x, ball.y, ball.r, ball.color);
      drawScore(user.score.toString(), -50, 70, "#201E3A");
      drawScore(comp.score.toString(), 50, 70, "#201E3A");
    }
  }

  game(): void {
    if (!this.isPaused) {
      this.update();
    }
    this.render();
  }

  startGame(): void {
    canvas.addEventListener("mousemove", this.movePaddle);

    setInterval(() => this.game(), 1000 / this.framePerSec);
  }
}

export default PongGame;
