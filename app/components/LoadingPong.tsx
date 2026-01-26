"use client";

interface LoadingPongProps {
  visible: boolean
}

export function LoadingPong({ visible }: LoadingPongProps) {
  if (!visible) 
    return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <svg viewBox="0 0 128 128" className="w-32 h-32" aria-hidden >
        {/* Ball */}
        <g transform="translate(64 80)">
            <circle r="10" className="fill-white animate-ball-y" />
        </g>

        {/* Paddle */}
        <g transform="translate(64 92)">
            <rect x="-30" y="-2" width="60" height="4" rx="1" ry="1" className="fill-white" />
        </g>
        </svg>
    </div>
  );
}
