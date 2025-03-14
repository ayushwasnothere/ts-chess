import BKing from "./BKing.tsx";
import WKing from "./WKing";

interface GameOverProps {
  onClickNewGame: () => void;
  onClickOtherGame: () => void;
  gameMode: "ai" | "player";
  gameOver: [string, string, boolean];
}
export default function GameOver({
  onClickNewGame,
  onClickOtherGame,
  gameMode,
  gameOver,
}: GameOverProps) {
  console.log(gameOver);
  return (
    <div className="flex flex-col justify-start items-center gap-4">
      <div className="text-white font-bold text-5xl pb-5 font-[poppins] text-center ">
        {gameOver[1] === "d"
          ? "Game Draw!"
          : gameOver[1] === "b"
            ? "White Wins!"
            : "Black Wins!"}
      </div>
      <div className="w-[109px] h-[264px]">
        {gameOver[1] === "d" ? (
          <div />
        ) : gameOver[1] === "b" ? (
          <WKing />
        ) : (
          <BKing />
        )}
      </div>
      <div className="flex flex-col gap-4 md:flex-row ">
        <button
          className="p-4 px-8 text-2xl font-semibold drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] rounded-xl text-[#373855] bg-[#f5f5f5]"
          onClick={onClickNewGame}
        >
          New Game
        </button>
        <button
          className="p-4 px-8 text-2xl font-semibold drop-shadow-[0_0_15px_rgba(255,255,255,1)] rounded-xl text-white bg-[#373855] shadow-black"
          onClick={onClickOtherGame}
        >
          {gameMode === "ai" ? "2 Player" : "VS Fish"}
        </button>
      </div>
    </div>
  );
}
