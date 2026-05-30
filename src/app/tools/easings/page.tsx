"use client"

import { motion, cubicBezier } from "motion/react"
import { RotateCw } from "lucide-react";
import { useForceRenderer } from "@/hooks/use-force-renderer";

interface EasingCurve {
  name: string;
  easing: readonly [number, number, number, number];
}
const EASING_CURVES: EasingCurve[] = [
  { name: "Ease In Quad", easing: [.55, .085, .68, .53] },
  { name: "Ease In Cubic", easing: [.550, .055, .675, .19] },
  { name: "Ease In Quart", easing: [.895, .03, .685, .22] },
  { name: "Ease In Quint", easing: [.755, .05, .855, .06] },
  { name: "Ease In Expo", easing: [.95, .05, .795, .035] },
  { name: "Ease In Circ", easing: [.6, .04, .98, .335] },
  { name: "Ease Out Quad", easing: [.25, .46, .45, .94] },
  { name: "Ease Out Cubic", easing: [.215, .61, .355, 1] },
  { name: "Ease Out Quart", easing: [.165, .84, .44, 1] },
  { name: "Ease Out Quint", easing: [.23, 1, .32, 1] },
  { name: "Ease Out Expo", easing: [.19, 1, .22, 1] },
  { name: "Ease Out Circ", easing: [.075, .82, .165, 1] },
  { name: "Ease In Out Quad", easing: [.455, .03, .515, .955] },
  { name: "Ease In Out Cubic", easing: [.645, .045, .355, 1] },
  { name: "Ease In Out Quart", easing: [.77, 0, .175, 1] },
  { name: "Ease In Out Quint", easing: [.86, 0, .07, 1] },
  { name: "Ease In Out Expo", easing: [1, 0, 0, 1] },
  { name: "Ease In Out Circ", easing: [.785, .135, .15, .86] },
] as const;

export default function EasingPage() {
  return (
    <main className="p-8 grid gap-6 grid-cols-2">
      <h1 className="col-span-full text-3xl text-center font-semibold">Easing Curves</h1>
      {EASING_CURVES.map((curve) => (
        <AnimatedBox key={curve.name} easing={curve} />
      ))}
    </main>
  )
}

const AnimatedBox = ({ easing }: { easing: EasingCurve }) => {
  const { key, forceRenderer } = useForceRenderer();
  return (
    <div className="rounded-lg border border-neutral-800 p-4 space-y-2">
      <div className="flex gap-2">
        <h2 className="text-xl">{easing.name}</h2>
        <button onClick={forceRenderer}>
          <RotateCw className="size-6" />
        </button>
      </div>
      <motion.div
        key={key}
        initial={{ rotate: 0, left: '0%' }}
        animate={{ rotate: 360, left: '85%' }}
        transition={{ duration: 1, ease: cubicBezier(...easing.easing) }}
        className="relative size-20 rounded bg-red-600"
      />
    </div>
  )
}

