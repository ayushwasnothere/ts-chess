import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "./ui/slider";
import TransparentTile from "./transparentTile";
import WKing from "./WKing";
import { GameOver } from "./gameOver";
import { OnlineSetting } from "./onlineSetting";
import { useWebSocket } from "@/utils/WebSocketContext";
import { Waiting } from "./waiting";

interface GameMenuProps {
  onClickPlayer: () => void;
  onChangeSlider: (value: number[]) => void;
  defaultSliderValue: number[];
  onClickPlay: () => void;
  showMenu?: boolean;
  gameMode?: "ai" | "player" | "online";
  gameOver: [string, string, boolean];
  setGameOver: (value: [string, string, boolean]) => void;
  setReset: (value: boolean) => void;
}
export default function GameMenu({
  onClickPlayer,
  onChangeSlider,
  defaultSliderValue,
  onClickPlay,
  showMenu,
  gameMode,
  gameOver,
  setGameOver,
  setReset,
}: GameMenuProps) {
  const [showStockfishSetting, setShowStockfishSetting] = useState(false);
  const [showOnlineSetting, setShowOnlineSetting] = useState(false);
  const [showSelectMode, setShowSelectMode] = useState(!gameOver[2]);
  const [code, setCode] = useState<number | null>();
  const [showWaiting, setShowWaiting] = useState(false);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };
  const { sendMessage, messages, isConnected } = useWebSocket();

  useEffect(() => {
    if (!showMenu) {
      setShowSelectMode(false);
      setShowStockfishSetting(false);
      setShowOnlineSetting(false);
      setShowWaiting(false);
    }
  }, [showMenu]);
  useEffect(() => {
    if (
      showMenu &&
      !showStockfishSetting &&
      !showOnlineSetting &&
      !showSelectMode &&
      !showWaiting
    ) {
      setShowSelectMode(true);
    }
  }, [showMenu]);

  useEffect(() => {
    if (messages.length === 0) return;
    const msg = messages[messages.length - 1];
    const data = JSON.parse(msg);
    if (data.type === "create" && data.success) {
      setCode(data.roomId);
      setShowOnlineSetting(false);
      setShowWaiting(true);
    } else if (data.type === "join" && data.success) {
      setShowOnlineSetting(false);
    }
  }, [messages]);
  const SelectMode = useMemo(() => {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex justify-center"
      >
        <div className="font-[poppins] flex flex-col justify-start items-center gap-4">
          <div className="text-white font-bold text-5xl pb-5 font-[poppins] text-center">
            New Game
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              className="p-4 px-8 text-xl font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] rounded-xl text-[#373855] bg-[#f5f5f5]"
              onClick={onClickPlayer}
            >
              2 Player
            </button>
            <button
              className="p-4 px-8 text-xl font-bold drop-shadow-[0_0_15px_rgba(255,255,255,1)] rounded-xl text-white bg-[#373855] shadow-black"
              onClick={() => {
                setShowStockfishSetting(true);
                setShowSelectMode(false);
              }}
            >
              VS Fish
            </button>
          </div>
          <button
            className="p-4 px-8 text-xl font-bold drop-shadow-[0_0_15px_rgba(255,255,255,1)] rounded-xl text-white bg-[#2ecc71] shadow-black"
            onClick={() => {
              setShowOnlineSetting(true);
              setShowSelectMode(false);
            }}
          >
            Online!
          </button>
        </div>
        <div className="h-[264px] w-[109px] hidden md:block lg:block">
          <WKing />
        </div>
      </motion.div>
    );
  }, [onClickPlayer]);

  return (
    <div className={`${showMenu ? "" : "hidden"}`}>
      <TransparentTile>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
          className="m-10 w-fit h-fit justify-center overflow-hidden flex bg-gradient-to-br from-[#373855]/50 to-[#373855]/50 p-10 rounded-lg"
        >
          {gameOver[2] && !showStockfishSetting && !showOnlineSetting && (
            <GameOver
              onClickNewGame={() => {
                if (gameMode === "online") {
                  setGameOver(["", "", false]);
                  setShowOnlineSetting(true);
                  return;
                }
                setReset(true);
              }}
              onClickOtherGame={() => {
                setGameOver(["", "", false]);
                setShowSelectMode(true);
              }}
              gameMode={gameMode as "ai" | "player"}
              gameOver={gameOver}
            />
          )}
          {showStockfishSetting && (
            <StockFishSetting
              {...{
                defaultSliderValue,
                onChangeSlider,
                onClickPlay,
                fadeIn,
                setShowStockfishSetting,
                setShowSelectMode,
              }}
            />
          )}
          {showWaiting && (
            <Waiting
              {...{
                setShowOnlineSetting,
                setShowWaiting,
                code: code as number,
                fadeIn,
              }}
            />
          )}
          {showOnlineSetting && (
            <OnlineSetting
              {...{
                fadeIn,
                setShowOnlineSetting,
                setShowSelectMode,
                onJoinRoom: () => {
                  if (isConnected) {
                    const msg = JSON.stringify({ type: "join", roomId: code });
                    sendMessage(msg);
                  }
                },
                onCreateRoom: () => {
                  if (isConnected) {
                    const msg = JSON.stringify({ type: "create" });
                    sendMessage(msg);
                  }
                },
                setCode,
              }}
            />
          )}
          {!showOnlineSetting &&
            !showStockfishSetting &&
            showSelectMode &&
            !gameOver[2] &&
            SelectMode}
        </motion.div>
      </TransparentTile>
    </div>
  );
}

const StockFishSetting = memo(
  ({
    defaultSliderValue,
    onChangeSlider,
    onClickPlay,
    fadeIn,
    setShowStockfishSetting,
    setShowSelectMode,
  }: {
    defaultSliderValue: number[];
    onChangeSlider: (value: number[]) => void;
    onClickPlay: () => void;
    setShowStockfishSetting: (value: boolean) => void;
    setShowSelectMode: (value: boolean) => void;
    fadeIn: {
      hidden: {
        opacity: number;
        y: number;
      };
      visible: {
        opacity: number;
        y: number;
        transition: {
          duration: number;
          ease: string;
        };
      };
      exit: {
        opacity: number;
        y: number;
        transition: {
          duration: number;
          ease: string;
        };
      };
    };
  }) => {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <img
          src="/buttons/back.svg"
          alt="Back"
          className="w-8 cursor-pointer fixed z-100"
          onClick={() => {
            setShowStockfishSetting(false);
            setShowSelectMode(true);
          }}
        />
        <div className="relative flex flex-col justify-center items-center">
          <img
            src="/stockfish/stockfish.webp"
            alt="Stockfish"
            className="w-30 pb-4"
          />
          <div className="font-[poppins] text-white/90 font-semibold text-2xl flex justify-center flex-col items-center gap-2">
            <div>Stockfish</div>
            <div className="text-xl">{defaultSliderValue}</div>
            <Slider
              min={200}
              max={3200}
              defaultValue={[100]}
              step={200}
              className="w-64 py-6"
              onValueChange={onChangeSlider}
              value={defaultSliderValue}
            />
            <button
              className="p-4 px-8 text-xl font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] rounded-xl text-[#373855] bg-[#f5f5f5]"
              onClick={() => {
                setShowStockfishSetting(false);
                onClickPlay();
              }}
            >
              Play
            </button>
          </div>
        </div>
      </motion.div>
    );
  },
);
