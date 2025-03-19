import { memo } from "react";
import { motion } from "framer-motion";

export const OnlineSetting = memo(
  ({
    fadeIn,
    setShowOnlineSetting,
    setShowSelectMode,
    setCode,
    onJoinRoom,
    onCreateRoom,
  }: {
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
    setShowOnlineSetting: (value: boolean) => void;
    setShowSelectMode: (value: boolean) => void;
    setCode: (value: number) => void;
    onJoinRoom: () => void;
    onCreateRoom: () => void;
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
            setShowOnlineSetting(false);
            setShowSelectMode(true);
          }}
        />
        <div className="relative flex flex-col justify-center items-center">
          <div className="pt-10 font-[poppins] text-white/90 font-semibold text-2xl flex justify-center flex-col items-center gap-10">
            <div className="text-5xl px-10 text-center">Online Play!</div>
            <input
              type="number"
              placeholder="Code"
              className="appearance-none rounded-lg text-center w-50 py-2 px-5 bg-white text-black/50 font-[JetBrains_Mono] font-semibold border-2 border-slate-200"
              onChange={(e) => {
                setCode(Number(e.target.value));
              }}
            />
            <button
              className="active:scale-95 transition-transform p-4 px-8 text-xl font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] rounded-xl text-white bg-[#373855]"
              onClick={() => {
                setShowSelectMode(false);
                onJoinRoom();
              }}
            >
              Join Room
            </button>
            <div>or</div>
            <button
              className="active:scale-95 transition-transform p-4 px-5 text-xl font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] rounded-xl text-[#373855] bg-[#f5f5f5]"
              onClick={() => {
                setShowSelectMode(false);
                onCreateRoom();
              }}
            >
              Create Room
            </button>
          </div>
        </div>
      </motion.div>
    );
  },
);
