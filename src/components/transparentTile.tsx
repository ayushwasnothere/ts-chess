export default function TransparentTile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-center items-center z-50 fixed bg-gray-950/15 w-screen h-screen backdrop-blur-[2px] ${className}`}
    >
      {children}
    </div>
  );
}
