"use client";

import { useState } from "react";
import { GameInstructions } from "@/components/GameInstructions";
import { LoadingPong } from "./LoadingPong";

interface LobbyProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  isConnected: boolean;
  error: string | null;
}

export function Lobby({
  onCreateRoom,
  onJoinRoom,
  isConnected,
  error,
}: LobbyProps) {
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState<"menu" | "join">("menu");

  const handleJoin = () => {
    if (roomCode.trim()) {
      onJoinRoom(roomCode.trim().toUpperCase());
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-2xl mb-4">Connecting to server...</div>
        {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-100"></div> */}
        <LoadingPong visible={true}/>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-amber-100">
      <h1 className="text-6xl font-bold mb-12 text-amber-200">1 vs 1</h1>

      {error && (
        <div className="bg-red-600/80 border border-red-400 text-orange-200 px-4 py-2 rounded mb-6">
          {error}
        </div>
      )}

      {mode === "menu" ? (
        <div className="flex flex-col gap-4">
          <button
            onClick={onCreateRoom}
            className="px-8 py-4 bg-fuchsia-950 hover:bg-fuchsia-950/70 text-amber-100 text-xl font-semibold rounded-lg transition-colors"
          >
            Create Game
          </button>
          <button
            onClick={() => setMode("join")}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-500/70 text-amber-100 text-xl font-semibold rounded-lg transition-colors"
          >
            Join Game
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter Room Code"
            maxLength={6}
            className="px-4 py-3 text-2xl text-center border-2 border-amber-200 rounded-lg focus:border-fuchsia-900 focus:outline-none uppercase tracking-widest w-72"
          />
          <div className="flex gap-4">
            <button
              onClick={() => setMode("menu")}
              className="px-6 py-3 bg-fuchsia-950/80 hover:bg-fuchsia-950 text-white font-semibold rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleJoin}
              disabled={!roomCode.trim()}
              className="px-6 py-3 bg-amber-400/80 hover:bg-amber-400 disabled:bg-gray-500/60 disabled:cursor-not-allowed font-semibold rounded-lg transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      )}

      <GameInstructions />
    </div>
  );
}
