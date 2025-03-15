import Socials from "./socials";

interface SidebarProps {
  onClickNewGame: () => void;
  onClickRestart: () => void;
}
export default function Sidebar({
  onClickNewGame,
  onClickRestart,
}: SidebarProps) {
  return (
    <div className="fixed md:static h-30 md:h-screen w-full flex flex-col justify-center md:justify-between bg-[#373855] md:bg-transparent items-center">
      <div className="flex justify-center items-center w-full md:bg-[#373855]/10 md:pt-10">
        <img
          src="/misc/logoW.svg"
          alt="logo"
          className="w-20 md:w-40 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] md:py-10"
        />
      </div>
      <div className="bg-[#373855] w-full text-white h-full hidden md:flex flex-col justify-center items-center text-center text-4xl font-[poppins] font-bold">
        <div
          onClick={onClickNewGame}
          className="hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] w-full h-fit py-5 hover:bg-white/20 items-center active:scale-95 transition-transform hover:scale-105"
        >
          New Game
        </div>
        <div
          onClick={onClickRestart}
          className="hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] w-full h-fit py-5 hover:bg-white/20 items-center active:scale-95 transition-transform hover:scale-105"
        >
          Restart
        </div>
        <a
          href="https://github.com/ayushwasnothere/ts-chess/issues/new"
          target="_blank"
          className="w-full h-fit py-5 hover:bg-white/20 items-center hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] active:scale-95 transition-transform hover:scale-105"
        >
          Report Bug
        </a>
      </div>
      <div className="hidden bg-[#373855] gap-6 w-full h-full justify-end md:flex flex-col py-8">
        <Socials />
        <div className="text-center text-sm font-[JetBrains_Mono] text-white">
          A game/website by citxruzz
        </div>
      </div>
    </div>
  );
}
