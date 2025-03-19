import BKing from "./BKing.tsx";
import WK from "./wk.tsx";

interface InfoBoxProps {
  history: { san: string; fen: string }[];
  flip: boolean;
  gameMode: "ai" | "player" | "online";
  onMoveClick: (moveIndex: number) => void;
  boardFlips: boolean;
  onClickFlip: () => void;
  onClickStart: () => void;
  onClickPrev: () => void;
  onClickNext: () => void;
  onClickEnd: () => void;
  onClickReset: () => void;
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
  onClickReset,
}: InfoBoxProps) {
  return (
    <div
      className={`h-full w-full md:rounded-xl md:bg-[#373855]/15 overflow-hidden select-none md:flex md:flex-col ${flip ? "md:flex-col-reverse" : ""}`}
    >
      <div className="w-full h-1/4 bg-white/60 hidden md:flex justify-start items-center gap-5 p-10">
        <div className="w-24 aspect-square rounded-full bg-white">
          {gameMode === "ai" ? (
            <img src="/stockfish/stockfish.webp" alt="Stockfish" />
          ) : (
            <BKing />
          )}
        </div>
        <div className="font-[poppins] font-semibold text-3xl">
          {gameMode === "ai" ? "Stockfish" : "Obsidian"}
        </div>
      </div>
      <div className="w-full h-2/4 flex flex-col overflow-hidden">
        <div className="fixed md:static w-full bottom-0 left-0 flex h-15 md:h-10 bg-white/40 cursor-pointer">
          <div
            className={`w-1/4 md:w-1/5 active:scale-95 transition-transform p-2 border-r border-slate-300 hover:bg-[#373855]/80 ${boardFlips ? "bg-[#373855]" : ""}`}
          >
            <img
              src="/buttons/flip.svg"
              alt="next"
              className={`w-full h-full scale-[65%] md:scale-100`}
              onClick={onClickFlip}
            />
          </div>
          <div
            className={`md:hidden w-1/4 md:w-1/5 active:scale-95 transition-transform p-2 border-r border-slate-300 hover:bg-[#373855]/80`}
          >
            <img
              src="/buttons/reset.svg"
              alt="prev"
              className={`w-full h-full scale-[65%] md:scale-100`}
              onClick={onClickReset}
            />
          </div>
          <div
            className={`hidden md:block w-1/4 md:w-1/5 active:scale-95 transition-transform p-2 border-r border-slate-300 hover:bg-[#373855]/80`}
          >
            <img
              src="/buttons/prev.svg"
              alt="prev"
              className={`w-full h-full scale-[65%] md:scale-100`}
              onClick={onClickStart}
            />
          </div>
          <div
            className="w-1/4 md:w-1/5 relative overflow-hidden flex p-2 justify-center border-r border-slate-300 active:scale-95 transition-transform hover:bg-[#373855]/80"
            onClick={onClickPrev}
          >
            <img
              src="/buttons/start.svg"
              alt="forward"
              className="md:scale-200"
            />
          </div>
          <div
            className="w-1/4 md:w-1/5 relative overflow-hidden flex p-2 justify-center border-r border-slate-300 active:scale-95 transition-transform hover:bg-[#373855]/80"
            onClick={onClickNext}
          >
            <img src="/buttons/end.svg" alt="rewind" className="md:scale-200" />
          </div>

          <div
            className={`hidden md:block w-1/4 md:w-1/5 active:scale-95 transition-transform p-2 border-r border-slate-300 hover:bg-[#373855]/80`}
          >
            <img
              src="/buttons/next.svg"
              alt="next"
              onClick={onClickEnd}
              className={`w-full h-full scale-[65%] md:scale-100`}
            />
          </div>
        </div>
        <div className="hidden w-full h-full md:flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      <div className="hidden w-full h-1/4 bg-white/60 md:flex justify-start items-center gap-5 p-10">
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
