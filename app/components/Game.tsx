"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  GameState,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_SIZE,
} from "@/types/game";
import { GameInstructions } from "@/components/GameInstructions";

interface GameProps {
  gameState: GameState;
  playerNumber: 1 | 2;
  onPaddleMove: (direction: "up" | "down" | "stop") => void;
}

export function Game({ gameState, playerNumber, onPaddleMove }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  // Handles keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["w", "s", "arrowup", "arrowdown"].includes(key)) {
        e.preventDefault();

        if (keysPressed.current.has(key)) return;
        keysPressed.current.add(key);

        if (key === "w" || key === "arrowup") {
          onPaddleMove("up");
        } else if (key === "s" || key === "arrowdown") {
          onPaddleMove("down");
        }
      }
    },
    [onPaddleMove]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["w", "s", "arrowup", "arrowdown"].includes(key)) {
        e.preventDefault();
        keysPressed.current.delete(key);

        // Check if any movement key is still pressed
        const upPressed =
          keysPressed.current.has("w") || keysPressed.current.has("arrowup");
        const downPressed =
          keysPressed.current.has("s") || keysPressed.current.has("arrowdown");

        if (upPressed) {
          onPaddleMove("up");
        } else if (downPressed) {
          onPaddleMove("down");
        } else {
          onPaddleMove("stop");
        }
      }
    },
    [onPaddleMove]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Renders game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clears canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draws center line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draws paddles
    const { player1, player2 } = gameState.paddles;

    // Player 1 paddle (left)
    ctx.fillStyle = playerNumber === 1 ? "#f4a7ff" : "#a4f4cf";
    ctx.fillRect(0, player1.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Player 2 paddle (right)
    ctx.fillStyle = playerNumber === 2 ? "#f4a7ff" : "#a4f4cf";
    ctx.fillRect(
      CANVAS_WIDTH - PADDLE_WIDTH,
      player2.y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    // Draws ball
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(
      gameState.ball.position.x + BALL_SIZE / 2,
      gameState.ball.position.y + BALL_SIZE / 2,
      BALL_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draws scores
    ctx.font = "bold 48px monospace";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.fillText(player1.score.toString(), CANVAS_WIDTH / 4, 60);
    ctx.fillText(player2.score.toString(), (CANVAS_WIDTH * 3) / 4, 60);
  }, [gameState, playerNumber]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-4 flex justify-between w-200 text-white">
        <div
          className={`text-lg ${playerNumber === 1 ? "text-fuchsia-300 font-bold" : "text-fuchsia-400"}`}
        >
          Player 1 {playerNumber === 1 && "(You)"}
        </div>
        <div
          className={`text-lg ${playerNumber === 2 ? "text-emerald-200 font-bold" : "text-emerald-400"}`}
        >
          Player 2 {playerNumber === 2 && "(You)"}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-gray-700 rounded-lg shadow-2xl"
      />

      <GameInstructions />
    </div>
  );
}
