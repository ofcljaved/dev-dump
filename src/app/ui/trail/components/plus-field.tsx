'use client';

import { usePlusField } from "@/app/ui/trail/hooks/use-plus-field";
import { cn } from "@/lib/utils";

interface PlusFieldProps extends React.ComponentProps<"canvas"> { }

export function PlusField({ className, ...props }: PlusFieldProps) {
  const { canvasRef } = usePlusField();

  return (
    <canvas
      ref={canvasRef}
      className={cn("bg-transparent w-full max-w-xl aspect-video", className)}
      {...props}
    />
  )
}

