import GameBoard from "@/components/GameBoard";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-600">
        🎓 Quiz Battle Cards
      </h1>
      <GameBoard />
    </main>
  );
}
