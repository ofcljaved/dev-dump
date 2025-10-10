import { cn } from "@/lib/utils"

export function ClipReveal() {
  return (
    <>
      <div className="absolute inset-0 bg-[#3d065f] -z-1 grid place-items-center">
        <h1 className="text-white text-4xl animate-hide font-black">Hello</h1>
      </div>
      <div
        style={{
          clipPath: "polygon(45% 20%, 45% 20%, 45% 20%, 45% 20%, 45% 50%, 60% 50%, 60% 50%, 60% 50%, 60% 80%, 60% 80%, 60% 50%, 45% 50%, 45% 50%, 45% 50%)",
        }}
        className={cn(
          "h-full w-full grid place-items-center text-[clamp(26px,10vw,120px)] uppercase font-black bg-[#fff1eb] text-[#3d065f] animate-reveal",
        )}
      >
        <h1 className="grid place-items-center leading-[95%]">
          <span className="text-[clamp(36px,15vw,158px)]">Clip</span>
          Reveal
        </h1>
      </div>
    </>
  )
}
