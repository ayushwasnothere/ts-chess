import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Waiting = memo(
  ({
    code,
    fadeIn,
    setShowOnlineSetting,
    setShowWaiting,
  }: {
    code: number;
    setShowWaiting: (value: boolean) => void;
    setShowOnlineSetting: (value: boolean) => void;
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
    const [dots, setDots] = useState(".");
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((dots) => {
          if (dots === "...") return ".";
          return dots + ".";
        });
      }, 800);
      return () => {
        clearInterval(interval);
      };
    }, []);
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
            setShowWaiting(false);
            setShowOnlineSetting(true);
          }}
        />
        <div className="relative flex flex-col justify-center items-center">
          <div className="pt-10 font-[poppins] text-white/90 font-semibold text-2xl flex justify-center flex-col items-center gap-10">
            <div className="text-5xl px-10 text-center text-white">Status</div>
            <div className="text-white/70">Room id:</div>
            <div className="text-[#2ecc71] drop-shadow-glow font-[poppins] text-5xl font-bold">
              {code}
            </div>
            <div className="font-[JetBrains_Mono] text-center w-40 break-words">
              Waiting for opponent{dots}
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);
