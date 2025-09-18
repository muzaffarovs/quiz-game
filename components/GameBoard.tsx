"use client";
import React, { useEffect, useRef, useState } from "react";
import Scoreboard from "./Scoreboard";
import Card from "./Card";

type Q = { text: string; points: number; color: "green" | "yellow" | "red" };

const makePlaceholders = (n = 30): Q[] =>
  Array.from({ length: n }).map((_, i) => {
    const idx = i + 1;
    // spread difficulties roughly
    const color = idx % 3 === 1 ? "green" : idx % 3 === 2 ? "yellow" : "red";
    const points = color === "green" ? 1 : color === "yellow" ? 2 : 3;
    return { text: `Placeholder question ${idx}`, points, color } as Q;
  });

export default function GameBoard() {
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [scores, setScores] = useState({ TeamA: 0, TeamB: 0 });
  const [currentTeam, setCurrentTeam] = useState<"TeamA" | "TeamB">("TeamA");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const target = 15;

  useEffect(() => {
    let mounted = true;
    fetch("/questions.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Q[]) => {
        if (!mounted) return;
        if (!Array.isArray(data) || data.length < 1) {
          // fallback to placeholders if file missing or empty
          const ph = makePlaceholders(30);
          setQuestions(ph);
          setAnswered(new Array(ph.length).fill(false));
          setFetchError(
            "questions.json empty or invalid — using placeholders."
          );
        } else {
          // ensure 30 items: pad with placeholders if less than 30
          let arr = data.slice();
          if (arr.length < 30)
            arr = arr.concat(makePlaceholders(30 - arr.length));
          setQuestions(arr);
          setAnswered(new Array(arr.length).fill(false));
        }
      })
      .catch((err) => {
        console.error("Failed to load /questions.json:", err);
        // fallback to placeholders and show an error
        const ph = makePlaceholders(30);
        setQuestions(ph);
        setAnswered(new Array(ph.length).fill(false));
        setFetchError("Failed to load /questions.json — using placeholders.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(null);
  }

  function startTimer() {
    clearTimer();
    setTimeLeft(30);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return null;
        if (t <= 1) {
          clearTimer();
          onTimeout();
          return null;
        }
        return t - 1;
      });
    }, 1000);
  }

  function onFlip(index: number) {
    if (answered[index]) return;
    setActiveIdx(index);
    startTimer();
  }

  function switchTeam() {
    setCurrentTeam((prev) => (prev === "TeamA" ? "TeamB" : "TeamA"));
  }

  // keep this as is
  function onCorrect(index: number) {
    if (index !== activeIdx) return;
    const q = questions[index];
    setScores((prev) => ({
      ...prev,
      [currentTeam]: prev[currentTeam] + q.points,
    }));
    setAnswered((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
    clearTimer();
    setActiveIdx(null);
    switchTeam();
  }

  // 🔴 REPLACE your old onIncorrect with this
  function onIncorrect(index: number) {
    if (index !== activeIdx) return;
    setAnswered((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
    clearTimer();
    setActiveIdx(null);
    switchTeam();
  }

  // 🔴 REPLACE your old onTimeout with this
  function onTimeout() {
    if (activeIdx === null) return;
    setAnswered((prev) => {
      const copy = [...prev];
      copy[activeIdx] = true;
      return copy;
    });
    clearTimer();
    setActiveIdx(null);
    switchTeam();
  }

  const winner =
    scores.TeamA >= target
      ? "Team A"
      : scores.TeamB >= target
      ? "Team B"
      : null;

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <Scoreboard
        scores={scores}
        target={target}
        currentTeam={currentTeam}
        timeLeft={timeLeft}
      />

      {loading ? (
        <div className="py-20 text-center">Loading questions…</div>
      ) : (
        <>
          {fetchError && (
            <div className="max-w-4xl w-full text-sm text-yellow-800 bg-yellow-100 px-4 py-2 rounded">
              {fetchError} — check <code>/public/questions.json</code> or the
              network tab.
            </div>
          )}

          {winner ? (
            <div className="max-w-4xl w-full bg-white rounded-xl shadow p-6 text-center">
              <h2 className="text-3xl font-bold">🎉 {winner} Wins!</h2>
              <p className="mt-2">
                Final — Team A: {scores.TeamA} • Team B: {scores.TeamB}
              </p>
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => {
                    setScores({ TeamA: 0, TeamB: 0 });
                    setAnswered(new Array(questions.length).fill(false));
                    setActiveIdx(null);
                    setCurrentTeam("TeamA");
                    clearTimer();
                  }}
                >
                  Play Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold">
                Click a numbered card to reveal the question.
              </p>

              <div className="max-w-5xl w-full grid grid-cols-5 gap-4 mt-4">
                {questions.map((q, i) => (
                  <Card
                    key={i}
                    index={i}
                    number={i + 1}
                    question={q.text}
                    points={q.points}
                    color={q.color}
                    active={activeIdx === i}
                    answered={answered[i]}
                    onFlip={onFlip}
                    onCorrect={onCorrect}
                    onIncorrect={onIncorrect}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
