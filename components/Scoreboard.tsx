"use client";
import React from "react";

type ScoreboardProps = {
  scores: { TeamA: number; TeamB: number };
  target: number;
  currentTeam: "TeamA" | "TeamB";
  timeLeft: number | null;
};

export default function Scoreboard({
  scores,
  target,
  currentTeam,
  timeLeft,
}: ScoreboardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-between bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-md">
      <div className="flex items-center gap-6">
        <div className="text-lg font-bold">🎯 First to {target}</div>
        <div className="text-sm text-gray-300 mr-5">
          Turn: <span className="font-semibold">{currentTeam}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xl font-semibold">Team A: {scores.TeamA}</div>
        <div className="text-xl font-semibold">Team B: {scores.TeamB}</div>
        <div className="text-sm">
          {timeLeft !== null ? (
            <span className="px-3 py-1 bg-white text-black rounded-lg font-medium">
              {timeLeft}s
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-700 rounded-lg">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
