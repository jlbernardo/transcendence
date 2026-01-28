"use client";

import Link from "next/link";

interface GameOverProps {
  winner: 1 | 2;
  playerNumber: 1 | 2;
  onPlayAgain: () => void;
}

export function GameOver({ winner, playerNumber, onPlayAgain }: GameOverProps) {
  const isWinner = winner === playerNumber;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div
        className={`text-6xl font-bold mb-8 ${isWinner ? "text-green-300" : "text-red-300"}`}
      >
        {isWinner ? "YOU WIN!" : "YOU LOSE"}
      </div>

      <div className="text-2xl mb-8 text-amber-200">
        Player {winner} wins the game!
      </div>

      <div className="flex gap-4">
        <Link
          href="/home"
          className="px-8 py-4 bg-amber-500/80 hover:bg-amber-500 text-amber-100 text-xl font-semibold rounded-lg transition-colors"
        >
          Go Back
        </Link>
        <button
          onClick={onPlayAgain}
          className="px-8 py-4 bg-fuchsia-950 hover:bg-fuchsia-900/80 text-amber-100 text-xl font-semibold rounded-lg transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
