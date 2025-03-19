import { useEffect, useState } from "react";
import "./App.css";
import Background from "./components/background";
import Board from "./components/board";
import GameMenu from "./components/gameMenu";
import Sidebar from "./components/sidebar";
import playSound from "./components/sounds";
import { useWebSocket } from "./utils/WebSocketContext";

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [elo, setElo] = useState([600]);
  const [gameMode, setGameMode] = useState<"ai" | "player" | "online">(
    "player",
  );
  const [gameOver, setGameOver] = useState<[string, string, boolean]>([
    "",
    "",
    false,
  ]);
  const [reset, setReset] = useState(false);
  const [size, setSize] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [myColor, setMyColor] = useState<"w" | "b" | "">("");

  const { messages } = useWebSocket();

  useEffect(() => {
    if (messages.length === 0) return;
    const msg = messages[messages.length - 1];
    const data = JSON.parse(msg);
    if (data.type === "start") {
      setShowMenu(false);
      setMyColor(data.color[0]);
      setGameMode("online");
    } else if (data.type === "close") {
      setGameOver([String(data.message), myColor === "w" ? "b" : "w", true]);
    }
  }, [messages]);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width <= 768) {
        setMobile(true);
      } else {
        setMobile(false);
      }

      const newSize =
        width <= 768 && width < height
          ? width
          : width > height
            ? (height * 80) / 100
            : (width * 80) / 100;

      setSize(newSize);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (gameOver[2]) {
      playSound("game_end");
      setTimeout(() => {
        setShowMenu(true);
      }, 2000);
    }
  }, [gameOver]);
  useEffect(() => {
    if (reset) {
      setShowMenu(false);
    }
  }, [reset]);
  return (
    <div className="h-screen w-screen">
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
        setGameOver={setGameOver}
        setReset={setReset}
      />
      <div className="fixed w-screen h-screen overflow-auto md:grid md:grid-cols-[1fr_4fr]">
        <Sidebar
          onClickNewGame={() => {
            setShowMenu(true);
          }}
          onClickRestart={() => {
            setReset(true);
          }}
        />
        <Board
          gameMode={gameMode}
          elo={elo[0]}
          setGameOver={setGameOver}
          reset={reset}
          setReset={setReset}
          size={size}
          mobile={mobile}
          gameOver={gameOver}
          setShowMenu={setShowMenu}
          myColor={myColor}
        />
      </div>
    </div>
  );
}

export default App;
