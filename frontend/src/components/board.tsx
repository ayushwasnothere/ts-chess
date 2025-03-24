import { useState, useEffect, useCallback } from "react";
import Chessground from "react-chessground";
import "/src/utils/chessground.css";
import { Chess, Square } from "chess.js";
import { Color, Key, MovableOptions } from "../utils/types";
import ChessBoardUI from "./chessBoardContainer";
import InfoBox from "./infobox";
import { throttle } from "lodash";
import playSound from "./sounds";
import { useWebSocket } from "@/utils/WebSocketContext";

interface BoardProps {
  gameMode: "ai" | "player" | "online";
  elo: number;
  setGameOver: (value: [string, string, boolean]) => void;
  reset: boolean;
  setReset: (value: boolean) => void;
  size: number;
  mobile: boolean;
  setShowMenu: (value: boolean) => void;
  gameOver: [string, string, boolean];
  myColor: "w" | "b" | "";
}

export default function Board({
  gameMode,
  elo,
  setGameOver,
  reset,
  setReset,
  size,
  mobile,
  setShowMenu,
  myColor,
}: BoardProps) {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [history, setHistory] = useState<{ san: string; fen: string }[]>([]);
  const [turn, setTurn] = useState("w");
  const [aiThinking, setAiThinking] = useState(false);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [orientation, setOrientation] = useState(
    myColor === "" ? "white" : myColor === "w" ? "white" : "black",
  );
  const [pendingMove, setPendingMove] = useState<[string, string] | null>(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [stockfish, setStockfish] = useState<Worker>();
  const [viewonly, setViewonly] = useState(false);
  const [boardFlips, setBoardFlips] = useState(true);
  const [current, setCurrent] = useState(0);

  const { isConnected, messages, sendMessage } = useWebSocket();
  useEffect(() => {
    if (messages.length === 0) return;
    const msg = messages[messages.length - 1];
    const data = JSON.parse(msg);
    if (data.type === "move") {
      onMove(data.move.from, data.move.to);
    }
  }, [messages]);

  useEffect(() => {
    if (myColor === "" || myColor === "w") {
      setOrientation("white");
    } else {
      setOrientation("black");
    }
  }, [myColor]);

  useEffect(() => {
    if (reset) {
      chess.reset();
      setFen(chess.fen());
      setHistory([]);
      setTurn("w");
      setLastMove(null);
      setOrientation("white");
      setGameOver(["", "", false]);
      setReset(false);
    }
  }, [reset, chess, setGameOver, setReset]);

  useEffect(() => {
    if (fen === history[history.length - 1]?.fen) {
      setViewonly(false);
    }
  }, [fen, history]);

  useEffect(() => {
    const engine = new Worker(
      typeof WebAssembly == "object"
        ? "/stockfish/stockfish-nnue-16.js"
        : "/stockfish/stockfish.js",
    );
    if (engine) {
      engine.postMessage("uci");
      engine.onmessage = (event) => {
        if (event.data === "uciok") {
          setStockfish(engine);
        }
      };
    }
    return () => {
      engine.terminate();
    };
  }, []);

  useEffect(() => {
    if (gameMode === "ai" && turn === "b" && !aiThinking && !viewonly) {
      makeAIMove();
    }
  }, [turn, gameMode, aiThinking, viewonly]);

  const isValidFEN = (fen: string) => {
    try {
      new Chess(fen);
      return true;
    } catch {
      return false;
    }
  };

  const makeAIMove = () => {
    const currentFEN = chess.fen();
    if (!isValidFEN(currentFEN)) {
      console.warn("Invalid FEN detected, retrying...");
      setTimeout(() => {
        makeAIMove();
      }, 1000);
      return;
    }
    if (stockfish === undefined) return;
    if (gameMode === "ai" && chess.turn() === "b" && !aiThinking && !viewonly) {
      setAiThinking(true);
      stockfish.postMessage("uci");
      stockfish.postMessage("setoption name UCI_LimitStrength value true");
      stockfish.postMessage(`setoption name UCI_Elo value ${elo}`);
      stockfish.postMessage(`position fen ${currentFEN}`);
      stockfish.postMessage("go movetime 3000");
      stockfish.onmessage = (event) => {
        if (event.data.includes("bestmove")) {
          const bestMove = event.data.split(" ")[1];
          onMove(bestMove.substring(0, 2), bestMove.substring(2, 4));
          setAiThinking(false);
        }
      };
    }
  };

  const onMove = (from: string, to: string) => {
    const moves = chess.moves({ square: from as Square, verbose: true });

    if (
      (chess.turn() === "w" && gameMode === "ai") ||
      gameMode === "player" ||
      (gameMode === "online" && chess.turn() === myColor)
    ) {
      for (const move of moves) {
        if (move.from === from && move.to === to && move.promotion) {
          setPendingMove([from, to]);
          setShowPromotion(true);
          return;
        }
      }
    }

    const move = chess.move({ from, to });
    if (move.flags.includes("c")) {
      playSound("capture");
    } else if (move.flags.includes("k") || move.flags.includes("q")) {
      playSound("castle");
    } else {
      playSound("move");
    }
    if (move) {
      setLastMove([from, to]);
      setFen(chess.fen());
      const newHistory = [
        history.slice(
          0,
          gameMode === "online" ? history.length + 1 : current + 1,
        ),
        { san: move.san, fen: chess.fen() },
      ].flat();
      setHistory(newHistory);
      setCurrent(newHistory.length);
      setTurn(chess.turn());
      setOrientation(
        gameMode === "online"
          ? myColor === "w"
            ? "white"
            : "black"
          : gameMode === "ai" || !boardFlips
            ? "white"
            : chess.turn() === "w"
              ? "white"
              : "black",
      );
      if (isConnected && gameMode === "online") {
        sendMessage(JSON.stringify({ type: "move", move: { from, to } }));
      }
      if (chess.isGameOver()) {
        const gameStatus = chess.isCheckmate()
          ? "Checkmate!"
          : chess.isStalemate()
            ? "Stalemate!"
            : chess.isInsufficientMaterial()
              ? "Insufficient Material Draw!"
              : chess.isThreefoldRepetition()
                ? "Threefold Repetition Draw!"
                : chess.isDrawByFiftyMoves()
                  ? "50-Move Draw!"
                  : "Game Over";
        return setGameOver([
          gameStatus as string,
          chess.isCheckmate() ? (chess.turn() as string) : "d",
          true,
        ]);
      }
    }
  };
  const calcMovable = () => {
    const dests = new Map();
    chess.board().forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        if (square) {
          const s = `${"abcdefgh"[colIndex]}${8 - rowIndex}`;
          const moves = chess.moves({ square: s as Square, verbose: true });

          if (moves.length > 0) {
            dests.set(
              s,
              moves.map((m) => m.to),
            );
          }
        }
      });
    });
    return {
      free: false,
      dests,
      color: myColor === "" ? "both" : myColor === "w" ? "white" : "black",
    } as MovableOptions;
  };

  const promotion = (piece: string) => {
    if (!pendingMove) return;
    const [from, to] = pendingMove;

    const move = chess.move({ from, to, promotion: piece });
    if (move) {
      playSound("promote");
      setFen(chess.fen());
      const newHistory = [
        history.slice(0, current + 1),
        { san: move.san, fen: chess.fen() },
      ].flat();
      setHistory(newHistory);
      setCurrent(newHistory.length - 1);
      setTurn(chess.turn());
      setOrientation(chess.turn() === "w" ? "white" : "black");
      setLastMove([from, to]);
    }

    setShowPromotion(false);
    setPendingMove(null);
  };

  const getLastMove = (index: number): [string, string] | null => {
    const history = chess.history({ verbose: true });

    if (index < 0 || index >= history.length) return null;

    const moveObj = history[index];

    return [moveObj.from, moveObj.to];
  };

  const goToMove = useCallback(
    throttle((move: number) => {
      if (aiThinking) {
        setCurrent(history.length);
        return;
      }
      if (move == current) return;
      if (move === history.length - 1) {
        if (history[move].san.includes("x")) {
          playSound("capture");
        } else if (history[move].san.includes("-")) {
          playSound("castle");
        } else if (history[move].san.includes("=")) {
          playSound("promote");
        } else {
          playSound("move");
        }
        setViewonly(false);
        if (gameMode !== "online") {
          chess.load(history[move].fen);
        }
        setLastMove(history[move]?.san ? getLastMove(move) : null);
        setFen(history[move].fen);
        setTurn(chess.turn());
        return chess.fen();
      }
      if (history[move]) {
        if (history[move].san.includes("x")) {
          playSound("capture");
        } else if (history[move].san.includes("-")) {
          playSound("castle");
        } else if (history[move].san.includes("=")) {
          playSound("promote");
        } else {
          playSound("move");
        }

        setViewonly(true);
        if (gameMode !== "online") chess.load(history[move].fen);
        setLastMove(history[move]?.san ? getLastMove(move) : null);
        setFen(history[move].fen);
        setTurn(chess.turn());
      }
    }, 100),
    [history, chess, aiThinking],
  );
  return (
    <div className="fixed md:static top-1/4 flex h-screen w-full flex-col justify-center items-center md:gap-0 md:flex-row md:items-start">
      <div className="w-full h-screen flex justify-center pt-10 md:pt-0 items-center md:px-10">
        <ChessBoardUI>
          <div className={`relative aspect-square w-[${size}px]`}>
            <div className="bg-white z-100 absolute w-full h-full opacity-10 pointer-events-none"></div>
            <Chessground
              key={mobile && fen ? "mobile" : "desktop"}
              width={size}
              height={size}
              fen={fen}
              onMove={onMove}
              movable={calcMovable()}
              lastMove={lastMove as Key[]}
              orientation={orientation as Color}
              turnColor={turn == "w" ? "white" : "black"}
              style={{ borderRadius: mobile ? "" : "5px" }}
              coordinates={!mobile}
            />
            {showPromotion && (
              <div className="absolute top-1/2 left-1/2 -translate-1/2 bg-[#eee] p-2 justify-evenly rounded-sm flex flex-row gap-1 z-100 md:rounded-lg md:p-5 md:gap-10">
                {["q", "r", "b", "n"].map((p) => (
                  <button
                    key={p}
                    className="text-lg w-[50px] aspect-square cursor-pointer bg-white flex items-center justify-center rounded-sm md:w-30 md:rounded-lg"
                    onClick={() => promotion(p)}
                  >
                    <img
                      src={`/pieces/${turn}${p.toUpperCase()}.svg`}
                      alt={p}
                      className="aspect-square w-[40px] md:w-20"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </ChessBoardUI>
      </div>
      <div className="w-full h-screen md:px-10 md:pr-30 md:py-20">
        <InfoBox
          history={history}
          flip={orientation === "white" ? false : true}
          gameMode={gameMode}
          onMoveClick={goToMove}
          boardFlips={boardFlips}
          onClickFlip={() => setBoardFlips(!boardFlips)}
          onClickStart={() => {
            setCurrent(0);
            goToMove(0);
          }}
          onClickPrev={() => {
            setCurrent((prev) => {
              const newCurrent = Math.max(0, prev - 1);
              goToMove(newCurrent);
              return newCurrent;
            });
          }}
          onClickNext={() => {
            setCurrent((prev) => {
              const newCurrent = Math.min(history.length - 1, prev + 1);
              goToMove(newCurrent);
              return newCurrent;
            });
          }}
          onClickEnd={() => {
            setCurrent((prev) => {
              const lastMove = history.length - 1;
              if (prev !== lastMove) {
                goToMove(lastMove);
              }
              return lastMove;
            });
            setFen(chess.fen());
            setViewonly(false);
          }}
          onClickReset={() => {
            setShowMenu(true);
          }}
        />
      </div>
    </div>
  );
}
