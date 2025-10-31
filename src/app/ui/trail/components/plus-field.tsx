'use client';

import { usePlusField } from "@/app/ui/trail/hooks/use-plus-field";
import { cn } from "@/lib/utils";
import { useTweaks } from "@/hooks/use-tweaks";
import { PLUS_CONSTANTS } from "@/app/ui/trail/utils";

const { SIZE, SPACING_MULTIPLIER } = PLUS_CONSTANTS;
export function PlusField({ className, ...props }: React.ComponentProps<"canvas">) {
  const { cols, rows } = useTweaks('config', {
    cols: { value: 20, min: 5, max: 40 },
    rows: { value: 10, min: 3, max: 20 },
  });

  const { canvasRef } = usePlusField(cols, rows);
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${(cols * SIZE * SPACING_MULTIPLIER) + (SIZE * SPACING_MULTIPLIER)}px`,
        height: `${(rows * SIZE * SPACING_MULTIPLIER) + (SIZE * SPACING_MULTIPLIER)}px`,
      }}
      className={cn("bg-transparent w-full", className)}
      {...props}
    />
  )
}

