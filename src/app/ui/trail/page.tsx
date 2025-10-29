'use client';

import { useCallback, useEffect, useRef } from "react";


interface PlusT {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  opacity: number;
}
const SIZE = 20;
const MIN_OPACITY = 0.3;
const MAX_OPACITY = 0.8;

export default function TrailPage() {
  const cRef = useRef<HTMLCanvasElement>(null);

  const drawPlus = useCallback(({ ctx, x, y, size, opacity }: PlusT) => {
    ctx.save();// ALWAYS SAVE THE CONTEXT
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.strokeStyle = `rgba(51, 51, 51, ${opacity})`;
    ctx.lineWidth = 7.5;
    ctx.stroke();
    ctx.restore();// ALWAYS RESTORE THE CONTEXT
  }, []);

  const setupCanvas = useCallback(() => {
    const cnvs = cRef.current;
    if (!cnvs) return;

    const ctx = cnvs.getContext("2d");
    if (!ctx) return;

    const DPR = window.devicePixelRatio;
    const { width, height } = cnvs.getBoundingClientRect();

    // Canvas Scaling logic for that CRISP look
    cnvs.width = width * DPR;
    cnvs.height = height * DPR;
    ctx.scale(DPR, DPR);
    ctx.save();

    ctx.clearRect(0, 0, width, height);

    const spacing = SIZE * 3;
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);
    const gridWidth = (cols - 1) * spacing;
    const gridHeight = (rows - 1) * spacing;
    const offsetX = (width - gridWidth) / 2;
    const offsetY = (height - gridHeight) / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = spacing * i + offsetX;
        const y = spacing * j + offsetY;
        const seed = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
        const rand = seed - Math.floor(seed);
        const opacity = rand * (MAX_OPACITY - MIN_OPACITY) + MIN_OPACITY;

        drawPlus({ ctx, x, y, size: SIZE, opacity });
      }
    }

  }, [cRef]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setupCanvas();

    window.addEventListener("resize", setupCanvas, { signal });

    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mq.addEventListener("change", setupCanvas, { signal });

    return () => controller.abort();
  }, [setupCanvas]);

  return (
    <main className="grid place-items-center relative">
      <canvas ref={cRef} className="bg-black w-full max-w-xl aspect-video" />
    </main>
  )
}

