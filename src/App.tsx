import { useEffect, useState } from "react";
import "./App.css";
import Background from "./components/background";
import Board from "./components/board";
import GameMenu from "./components/gameMenu";
import Sidebar from "./components/sidebar";

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [elo, setElo] = useState([600]);
  const [gameMode, setGameMode] = useState<"ai" | "player">("player");
  const [gameOver, setGameOver] = useState<[string, string, boolean]>([
    "",
    "",
    false,
  ]);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (gameOver[2]) {
      setShowMenu(true);
    }
  }, [gameOver]);
  useEffect(() => {
    if (reset) {
      setShowMenu(false);
    }
  }, [reset]);
  return (
    <>
      <Background />
      <GameMenu
        defaultSliderValue={elo}
        onChangeSlider={setElo}
        onClickPlayer={() => {
          setReset(true);
          setGameMode("player");
        }}
        onClickPlay={() => {
          setReset(true);
          setGameMode("ai");
        }}
        showMenu={showMenu}
        gameMode={gameMode}
        gameOver={gameOver}
        setReset={setReset}
      />
      <div className="w-screen h-screen justify-center items-center overflow-hidden flex gap-10 flex-col md:grid md:grid-cols-[1fr_4fr]">
        <Sidebar />
        <Board
          gameMode={gameMode}
          elo={elo[0]}
          setGameOver={setGameOver}
          reset={reset}
          setReset={setReset}
        />
      </div>
    </>
  );
}

export default App;
