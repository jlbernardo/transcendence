"use client";

import { GameInstructions } from "./GameInstructions";

interface PlayerStatusIndicatorProps {
  playerLabel: string;
  isCurrentPlayer: boolean;
  isReady: boolean;
  isJoined: boolean;
}

function PlayerStatusIndicator({
  playerLabel,
  isCurrentPlayer,
  isReady,
  isJoined,
}: PlayerStatusIndicatorProps) {
  const getStatusColor = () => {
    if (isCurrentPlayer) return isReady ? "bg-green-500" : "bg-yellow-500";
    if (isReady) return "bg-green-500";
    if (isJoined) return "bg-yellow-500";
    return "bg-gray-600";
  };

  const getStatusText = () => {
    if (isCurrentPlayer) return isReady ? "Ready!" : "You";
    if (isReady) return "Ready!";
    if (isJoined) return "Waiting...";
    return "Not joined";
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`w-6 h-6 rounded-full mb-2 ${getStatusColor()}`} />
      <span className="text-sm text-amber-100">{playerLabel}</span>
      <span className="text-xs text-amber-100/60">{getStatusText()}</span>
    </div>
  );
}

interface WaitingRoomProps {
  roomId: string;
  playerNumber: 1 | 2;
  onReady: () => void;
  onLeave: () => void;
  opponentJoined: boolean;
  myReady: boolean;
  opponentReady: boolean;
}

export function WaitingRoom({
  roomId,
  playerNumber,
  onReady,
  onLeave,
  opponentJoined,
  myReady,
  opponentReady,
}: WaitingRoomProps) {
  const handleGoBack = () => {
    onLeave();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 px-4 py-2 bg-fuchsia-950/80 hover:bg-fuchsia-950 text-amber-100 font-semibold rounded-lg transition-colors"
      >
        Go Back
      </button>

      <h2 className="text-4xl font-bold mb-8 text-amber-400">Waiting Room</h2>

      <div className="bg-black/70 rounded-lg py-8 px-15 mb-8">
        <div className="text-center mb-4">
          <div className="text-amber-100/80 text-sm mb-5">Room Code</div>
          <div className="text-4xl font-mono font-bold tracking-widest text-amber-300 mb-5 ml-3">
            {roomId}
            <button
              onClick={() => {
              navigator.clipboard.writeText(roomId);
              const copy = document.getElementById('copy-icon');
              const toast = document.getElementById('toast-icon');
                if (copy && toast) {
                toast.classList.remove('invisible', 'opacity-0');
                toast.classList.add('opacity-100', 'transition-opacity', 'duration-300');
                copy.classList.add('invisible', 'opacity-0');
                copy.classList.remove('opacity-100');
                setTimeout(() => {
                  copy.classList.remove('invisible', 'opacity-0');
                  copy.classList.add('opacity-100', 'transition-opacity', 'duration-300');
                  toast.classList.add('invisible', 'opacity-0');
                  toast.classList.remove('opacity-100');
                }, 1000);
                }
              }}
              className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded hover:bg-amber-400/20 transition-colors relative"
              title="Copy room code"
            >
              <svg
              id="copy-icon"
              className="w-5 h-5 text-amber-300 absolute"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
              </svg>
              <svg
              id="toast-icon"
              className="w-5 h-5 text-green-500 absolute invisible"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12l5 5L20 7"
              />
              </svg>
            </button>
          </div>
          <div className="text-center text-amber-100/80 text-sm">
          Share this code with your friend
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center">
        <div className="text-lg mb-2">
          You are{" "}
          <span className="font-bold text-fuchsia-300/90">Player {playerNumber}</span>
        </div>
        <div className="text-lg">
          {opponentJoined ? (
            <span className="text-green-300/90">Opponent has joined!</span>
          ) : (
            <span className="text-yellow-400">Waiting for opponent...</span>
          )}
        </div>
      </div>

      {/* Player status indicators */}
      <div className="flex gap-8 mb-8">
        <PlayerStatusIndicator
          playerLabel="Player 1"
          isCurrentPlayer={playerNumber === 1}
          isReady={playerNumber === 1 ? myReady : opponentReady}
          isJoined={playerNumber === 1 || opponentJoined}
        />
        <PlayerStatusIndicator
          playerLabel="Player 2"
          isCurrentPlayer={playerNumber === 2}
          isReady={playerNumber === 2 ? myReady : opponentReady}
          isJoined={playerNumber === 2 || opponentJoined}
        />
      </div>

      {opponentJoined && !myReady && (
        <button
          onClick={onReady}
          className="mt-4 px-8 py-4 bg-green-500 hover:bg-green-700 text-white text-xl font-semibold rounded-lg transition-colors animate-pulse"
        >
          Ready to Play!
        </button>
      )}

      {myReady && !opponentReady && (
        <div className="mt-4 text-yellow-400 text-lg">
          Waiting for opponent to be ready...
        </div>
      )}

      <GameInstructions />
    </div>
  );
}
