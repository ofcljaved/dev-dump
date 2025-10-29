'use client';

import { useCallback, useEffect, useRef } from "react";

interface Plus {
  x: number;
  y: number;
  size: number;
  baseOpac: number;
  currOpac: number;
  rotation: number;
}

interface DrawPlus extends Plus {
  ctx: CanvasRenderingContext2D;
}

const SIZE = 20;
const MIN_OPACITY = 0.3;
const MAX_OPACITY = 0.8;

export default function TrailPage() {
  const cRef = useRef<HTMLCanvasElement>(null);
  const pluses = useRef<Plus[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  const drawPlus = useCallback(({ ctx, x, y, size, currOpac, rotation }: DrawPlus) => {
    ctx.save();// ALWAYS SAVE THE CONTEXT
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.strokeStyle = `rgba(51, 51, 51, ${currOpac})`;
    ctx.lineWidth = 7.5;
    ctx.stroke();
    ctx.restore();// ALWAYS RESTORE THE CONTEXT
  }, []);

  const generatePlus = useCallback((width: number, height: number) => {
    const pluses: Plus[] = [];
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
        pluses.push({
          x,
          y,
          size: SIZE,
          baseOpac: opacity,
          currOpac: opacity,
          rotation: 0,
        });
      }
    }
    return pluses;
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

    pluses.current = generatePlus(width, height);

  }, [cRef]);

  const animate = useCallback(() => {
    const cnvs = cRef.current;
    if (!cnvs) return;
    const ctx = cnvs.getContext("2d");
    if (!ctx) return;

    const { width, height } = cnvs.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);

    for (const plus of pluses.current) {
      const dx = mouse.current.x - plus.x;
      const dy = mouse.current.y - plus.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2 * SIZE) {
        plus.currOpac += (1 - plus.currOpac) * 0.2;
        plus.rotation += (Math.PI - plus.rotation);
      } else {
        plus.currOpac += (plus.baseOpac - plus.currOpac) * 0.2;
        plus.rotation += (0 - plus.rotation) * 0.05;
      }
      drawPlus({ ctx, ...plus });
    }
  }, []);

  useEffect(() => {
    const cnvs = cRef.current;
    if (!cnvs) return;

    const controller = new AbortController();
    const { signal } = controller;
    let frameId: number;

    setupCanvas();

    const loop = () => {
      frameId = requestAnimationFrame(loop);
      animate();
    };
    loop();

    window.addEventListener("resize", setupCanvas, { signal });

    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mq.addEventListener("change", setupCanvas, { signal });

    cnvs.addEventListener("mousemove", (e) => {
      const rect = cnvs.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    }, { signal });

    return () => {
      controller.abort();
      cancelAnimationFrame(frameId);
    }
  }, [setupCanvas, animate]);

  return (
    <main className="grid place-items-center relative">
      <canvas ref={cRef} className="bg-black w-full max-w-xl aspect-video" />
    </main>
  )
}

