'use client';

import { RotateCw, Hash, } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react";
import { useForceRenderer } from "@/hooks/use-force-renderer"
import { Tabs } from "@/app/ui/tabs/components/tabs"

export default function TabsPage() {
  const { key, forceRenderer } = useForceRenderer();
  const [isSlow, setIsSlow] = useState(false);

  const handleSpeedChange = () => {
    setIsSlow(p => !p);
  }

  return (
    <main className="grid place-items-center relative">
      <Controls handleRefresh={forceRenderer} handleSpeedChange={handleSpeedChange} slow={isSlow} />
      <Tabs isSlow={isSlow} key={key} />
    </main>
  )
}

interface ControlsProps {
  handleRefresh: () => void;
  handleSpeedChange: () => void;
  slow: boolean;
}

function Controls({ handleRefresh, handleSpeedChange, slow }: ControlsProps) {
  return (
    <div
      className={cn(
        "absolute right-6 top-6 grid grid-flow-col items-center border py-1",
        "before:pointer-events-none after:pointer-events-none",
        "before:absolute before:-inset-x-4 before:-inset-y-px before:border-y before:border-neutral-400",
        "after:absolute after:-inset-y-4 after:-inset-x-px after:border-x after:border-neutral-400",
      )}>
      <button
        onClick={handleSpeedChange}
        className="outline-none transition-all duration-300 flex gap-1.5 items-center border rounded-full px-4 py-1.5 cursor-pointer border-transparent focus-visible:ring-4 focus-visible:ring-neutral-300">
        <Hash className="size-4" />
        <span>{slow ? '0.25x' : '1x'}</span>
        <span>Toggle Speed</span>
      </button>
      <div className="h-full w-px bg-neutral-400" />
      <button
        onClick={handleRefresh}
        className="outline-none transition-all duration-300 flex gap-1.5 items-center border px-4 cursor-pointer border-transparent focus-visible:ring-4 focus-visible:ring-neutral-300"
      >
        <RotateCw className="size-4" />
      </button>
    </div>
  )
}
