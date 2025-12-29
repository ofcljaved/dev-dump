'use client'

import { cn } from "@/lib/utils"
import { useLayoutEffect, useState } from "react"
import { MouseEventHandler } from "react"

export default function TrailPage() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove: MouseEventHandler<HTMLElement> = (e) => {
    setPos({ x: e.clientX, y: e.clientY });
  }

  useLayoutEffect(() => {
    setPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);

  return (
    <main
      className={cn(
        "grid h-svg w-screen relative",
        "[&>img]:col-span-full [&>img]:row-span-full [&>img]:m-auto",
      )}
      onMouseMove={handleMouseMove}
    >
      <img src="/i1.png" />
      <img
        src="/i2.jpg"
        style={{
          clipPath: `circle(10vmax at ${pos.x}px ${pos.y}px)`,
        }}
      />
    </main>
  )
}

