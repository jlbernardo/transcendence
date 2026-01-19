import {
  GameState,
  Ball,
  Paddle,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_SIZE,
  BALL_SPEED,
  PADDLE_SPEED,
  WINNING_SCORE,
} from '../types/game.js';

export class GameEngine {
  private state: GameState;
  private player1Direction: 'up' | 'down' | 'stop' = 'stop';
  private player2Direction: 'up' | 'down' | 'stop' = 'stop';

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      ball: this.createBall(),
      paddles: {
        player1: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2, score: 0 },
        player2: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2, score: 0 },
      },
      status: 'waiting',
    };
  }

  private createBall(direction?: 1 | -1): Ball {
    const angle = (Math.random() - 0.5) * Math.PI / 2;
    const dir = direction ?? (Math.random() > 0.5 ? 1 : -1);

    return {
      position: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
      },
      velocity: {
        dx: Math.cos(angle) * BALL_SPEED * dir,
        dy: Math.sin(angle) * BALL_SPEED,
      },
    };
  }

  getState(): GameState {
    return this.state;
  }

  startGame(): void {
    this.state.status = 'playing';
    this.state.ball = this.createBall();
  }

  setPlayerDirection(player: 1 | 2, direction: 'up' | 'down' | 'stop'): void {
    if (player === 1)
      this.player1Direction = direction;
	else
      this.player2Direction = direction;
  }

  update(): void {
    if (this.state.status !== 'playing')
		return;

    this.updatePaddle(1, this.player1Direction);
    this.updatePaddle(2, this.player2Direction);

    this.updateBall();
    this.checkScoring();
    this.checkWinner();
  }

  private updatePaddle(player: 1 | 2, direction: 'up' | 'down' | 'stop'): void {
    const paddle = player === 1 ? this.state.paddles.player1 : this.state.paddles.player2;

    if (direction === 'up')
      paddle.y = Math.max(0, paddle.y - PADDLE_SPEED);
	else if (direction === 'down')
      paddle.y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, paddle.y + PADDLE_SPEED);
  }

  private updateBall(): void {
    const ball = this.state.ball;

    ball.position.x += ball.velocity.dx;
    ball.position.y += ball.velocity.dy;

    // Wall collision (top/bottom)
    if (ball.position.y <= 0 || ball.position.y >= CANVAS_HEIGHT - BALL_SIZE) {
      ball.velocity.dy = -ball.velocity.dy;
      // Clamps position
      ball.position.y = Math.max(0, Math.min(CANVAS_HEIGHT - BALL_SIZE, ball.position.y));
    }

    this.checkPaddleCollision();
  }

  private checkPaddleCollision(): void {
    const { player1, player2 } = this.state.paddles;

    this.handleSinglePaddleCollision(player1, true);
    this.handleSinglePaddleCollision(player2, false);
  }

  private handleSinglePaddleCollision(paddle: Paddle, isLeftPaddle: boolean): void {
    const ball = this.state.ball;
    const paddleX = isLeftPaddle ? PADDLE_WIDTH : CANVAS_WIDTH - PADDLE_WIDTH;
    const ballEdgeX = isLeftPaddle ? ball.position.x : ball.position.x + BALL_SIZE;
    const movingTowardPaddle = isLeftPaddle ? ball.velocity.dx < 0 : ball.velocity.dx > 0;
    const collision = isLeftPaddle ? ballEdgeX <= paddleX : ballEdgeX >= paddleX;

    if (collision &&
      ball.position.y + BALL_SIZE >= paddle.y &&
      ball.position.y <= paddle.y + PADDLE_HEIGHT &&
      movingTowardPaddle) {
        ball.velocity.dx = -ball.velocity.dx;
        ball.position.x = isLeftPaddle ? PADDLE_WIDTH : CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE;

        // Adds spin based on where the ball hits the paddle
        const hitPosition = (ball.position.y + BALL_SIZE / 2 - paddle.y) / PADDLE_HEIGHT;
        ball.velocity.dy = (hitPosition - 0.5) * BALL_SPEED * 2;

        this.increaseSpeed();
    }
  }

  private increaseSpeed(): void {
    const ball = this.state.ball;
    const speedMultiplier = 1.05;
    const maxSpeed = BALL_SPEED * 2;

    const currentSpeed = Math.sqrt(ball.velocity.dx ** 2 + ball.velocity.dy ** 2);
    if (currentSpeed < maxSpeed) {
      ball.velocity.dx *= speedMultiplier;
      ball.velocity.dy *= speedMultiplier;
    }
  }

  private checkScoring(): void {
    const ball = this.state.ball;

    // Player 2 scores (ball went past left side)
    if (ball.position.x < 0) {
      this.state.paddles.player2.score++;
      this.state.ball = this.createBall(-1);
    }

    // Player 1 scores (ball went past right side)
    if (ball.position.x > CANVAS_WIDTH) {
      this.state.paddles.player1.score++;
      this.state.ball = this.createBall(1);
    }
  }

  private checkWinner(): void {
    const { player1, player2 } = this.state.paddles;

    if (player1.score >= WINNING_SCORE) {
      this.state.status = 'finished';
      this.state.winner = 1;
    }
    else if (player2.score >= WINNING_SCORE) {
      this.state.status = 'finished';
      this.state.winner = 2;
    }
  }
}
