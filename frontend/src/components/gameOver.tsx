import { memo } from "react";
import BKing from "./BKing.tsx";
import WKing from "./WKing";

interface GameOverProps {
  onClickNewGame: () => void;
  onClickOtherGame: () => void;
  gameMode?: "ai" | "player";
  gameOver: [string, string, boolean];
}
export const GameOver = memo(
  ({ onClickNewGame, onClickOtherGame, gameOver }: GameOverProps) => {
    return (
      <div className="flex flex-col justify-start items-center gap-4 font-[poppins]">
        <div className="text-white font-bold text-3xl md:text-5xl pb-3 md:pb-5 font-[poppins] text-center ">
          {gameOver[1] === "d"
            ? "Game Draw!"
            : gameOver[1] === "b"
              ? "White Wins!"
              : "Black Wins!"}
        </div>
        <div className={`md:w-[109px] w-[54px] `}>
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
            className="p-2 md:p-4 md:px-8 px-4 text-lg md:text-2xl font-semibold drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] rounded-xl text-[#373855] bg-[#f5f5f5]"
            onClick={onClickNewGame}
          >
            Rematch
          </button>
          <button
            className="font-[poppins] p-2 md:p-4 md:px-8 px-4 text-lg md:text-2xl font-semibold drop-shadow-[0_0_15px_rgba(255,255,255,1)] rounded-xl text-white bg-[#373855] shadow-black"
            onClick={onClickOtherGame}
          >
            New Game
          </button>
        </div>
      </div>
    );
  },
);
