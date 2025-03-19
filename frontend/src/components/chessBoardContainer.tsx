const ChessBoardUI = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-hidden bg-white/10 md:backdrop-blur-[15px] md:rounded-[10px] md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] aspect-square w-fit">
      {children}
    </div>
  );
};

export default ChessBoardUI;
