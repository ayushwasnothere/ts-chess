export default function Background() {
  return (
    <div className="-z-50 fixed w-screen h-screen bg-white flex justify-center items-center overflow-hidden">
      <div className="absolute top-[5%] left-[5%] w-[380px] aspect-square rounded-full bg-[#3D4AEB] blur-[320px] opacity-80"></div>
      <div className="absolute top-[5%] left-[5%] w-[200px] aspect-square rounded-full bg-[#3D4AEB] blur-[100px] opacity-90"></div>
      <div className="absolute bottom-[5%] right-[5%] w-[20%] aspect-square rounded-full bg-[#3D4AEB] blur-[320px] opacity-60"></div>
      <div className="absolute bottom-[5%] right-[5%] w-[10%] aspect-square rounded-full bg-[#3D4AEB] blur-[100px] opacity-90"></div>
    </div>
  );
}
