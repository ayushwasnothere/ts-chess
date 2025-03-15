import BKing from "./BKing.tsx";
import WK from "./wk.tsx";

interface InfoBoxProps {
  history: { san: string; fen: string }[];
  flip: boolean;
  gameMode: "ai" | "player";
  onMoveClick: (moveIndex: number) => void;
  boardFlips: boolean;
  onClickFlip: () => void;
  onClickStart: () => void;
  onClickPrev: () => void;
  onClickNext: () => void;
  onClickEnd: () => void;
}
export default function InfoBox({
  history,
  flip,
  gameMode,
  onMoveClick,
  boardFlips,
  onClickFlip,
  onClickStart,
  onClickPrev,
  onClickNext,
  onClickEnd,
}: InfoBoxProps) {
  return (
    <div
      className={`h-full w-full rounded-xl bg-[#373855]/15 overflow-hidden hidden select-none md:flex md:flex-col ${flip ? "md:flex-col-reverse" : ""}`}
    >
      <div className="w-full h-1/4 bg-white/60 flex justify-start items-center gap-5 p-10">
        <div className="w-24 aspect-square rounded-full bg-white">
          {gameMode === "ai" ? (
            <img src="/stockfish.webp" alt="Stockfish" />
          ) : (
            <BKing />
          )}
        </div>
        <div className="font-[poppins] font-semibold text-3xl">
          {gameMode === "ai" ? "Stockfish" : "Obsidian"}
        </div>
      </div>
      <div className="w-full h-2/4 flex flex-col overflow-hidden">
        <div className="w-full flex h-10 bg-white/40 cursor-pointer">
          <img
            src="/flip.svg"
            alt="next"
            className={`w-1/5 p-2 border-r-2 border-slate-300 hover:bg-[#373855]/80 active:scale-95 transition-transform ${boardFlips ? "bg-[#373855]" : ""}`}
            onClick={onClickFlip}
          />
          <img
            src="/prev.svg"
            alt="prev"
            className="w-1/5 p-2 border-r border-slate-300 active:scale-95 transition-transform hover:bg-[#373855]/80"
            onClick={onClickStart}
          />
          <div
            className="w-1/5 relative overflow-hidden flex p-2 justify-center border-r border-slate-300 active:scale-95 transition-transform hover:bg-[#373855]/80"
            onClick={onClickPrev}
          >
            <img src="/start.svg" alt="forward" className="scale-200" />
          </div>
          <div
            className="w-1/5 relative overflow-hidden flex p-2 justify-center border-r border-slate-300 active:scale-95 transition-transform hover:bg-[#373855]/80"
            onClick={onClickNext}
          >
            <img src="/end.svg" alt="rewind" className="scale-200" />
          </div>
          <img
            src="/next.svg"
            alt="next"
            className="w-1/5 p-2 hover:bg-[#373855]/80 active:scale-95 transition-transform"
            onClick={onClickEnd}
          />
        </div>
        <div className="w-full h-full flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {history
            .reduce((acc, move, index) => {
              if (index % 2 === 0) {
                acc.push([move.san]);
              } else {
                acc[acc.length - 1].push(move.san);
              }
              return acc;
            }, [] as string[][])
            .map((pair, index) => (
              <div key={index} className="text-md grid grid-cols-[1fr_2fr_2fr]">
                <div
                  className={`text-center w-full py-1 bg-gray-400/15 border-b-2 border-gray-300 font-[poppins]`}
                >
                  {index + 1}
                </div>
                <div
                  className={`pl-8 w-full bg-gray-400/20 border-r border-b border-gray-300 font-[poppins] hover:bg-gray-400/80 py-1 ${index % 2 ? "bg-gray-400/30" : "bg-gray-400/20"}`}
                  onClick={() => onMoveClick(index * 2)}
                >
                  {pair[0]}
                </div>
                <div
                  className={`pl-8 w-full bg-gray-400/20 py-1 border-b border-gray-300 hover:bg-gray-400/80 font-[poppins] ${index % 2 ? "bg-gray-400/20" : "bg-gray-400/30"}`}
                  onClick={() => onMoveClick(index * 2 + 1)}
                >
                  {pair[1] || ""}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="w-full h-1/4 bg-white/60 flex justify-start items-center gap-5 p-10">
        <div className="w-24 aspect-square rounded-full bg-black">
          <WK />
        </div>
        <div className="font-[poppins] font-semibold text-3xl">
          {gameMode === "ai" ? "You" : "Frost"}
        </div>
      </div>
    </div>
  );
}
