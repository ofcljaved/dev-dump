'use client';

import { useForceRenderer } from "@/hooks/use-force-renderer";
import { cn } from "@/lib/utils"
import { ClipReveal } from "@/app/ui/clip-reveal/components/reveal"
import { RotateCw } from "lucide-react";

export default function ClipRevealPage() {
  const { key, forceRenderer } = useForceRenderer();

  return (
    <main className={cn("grid relative")}>
      <Controls handleRefresh={forceRenderer} />
      <ClipReveal key={key} />
    </main>
  )
}

interface ControlsProps {
  handleRefresh: () => void;
}

function Controls({ handleRefresh }: ControlsProps) {
  return (
    <div
      className={cn(
        "mix-blend-difference",
        "z-[99999] absolute right-6 top-6 grid grid-flow-col items-center border py-1",
        "before:pointer-events-none after:pointer-events-none",
        "before:absolute before:-inset-x-4 before:-inset-y-px before:border-y before:border-neutral-400",
        "after:absolute after:-inset-y-4 after:-inset-x-px after:border-x after:border-neutral-400",
      )}>
      <button
        onClick={handleRefresh}
        className="outline-none transition-all duration-300 flex gap-1.5 items-center px-4 cursor-pointer focus-visible:ring-4 focus-visible:ring-neutral-300"
      >
        <RotateCw className="size-6" />
      </button>
    </div>
  )
}
