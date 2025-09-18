"use client";
import React from "react";

type CardProps = {
  index: number;
  number: number;
  question: string;
  points: number;
  color: "green" | "yellow" | "red";
  active: boolean;
  answered: boolean;
  onFlip: (index: number) => void;
  onCorrect: (index: number) => void;
  onIncorrect: (index: number) => void;
};

export default function Card({
  index,
  number,
  question,
  points,
  color,
  active,
  answered,
  onFlip,
  onCorrect,
  onIncorrect,
}: CardProps) {
  const frontBg =
    color === "green"
      ? "bg-green-500"
      : color === "yellow"
      ? "bg-yellow-400"
      : "bg-red-600";

  return (
    <div
      // make this relative so absolute children position correctly
      className={`relative w-36 h-44 ${
        answered ? "opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
      onClick={() => {
        if (!active && !answered) onFlip(index);
      }}
    >
      <div className={`perspective w-full h-full`}>
        <div
          className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
            active ? "rotate-y-180" : ""
          }`}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-xl text-white text-2xl font-bold shadow-lg backface-hidden ${frontBg}`}
          >
            {number}
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-white rounded-xl p-3 flex flex-col justify-between text-center text-black shadow-lg rotate-y-180 backface-hidden">
            <div className="text-sm overflow-auto">{question}</div>

            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCorrect(index);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded-lg"
              >
                ✅ Correct
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIncorrect(index);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                ❌ Wrong
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Done badge */}
      {answered && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
          Done
        </div>
      )}
    </div>
  );
}
