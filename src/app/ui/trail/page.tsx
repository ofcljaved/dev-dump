'use client';

import { useCallback, useEffect, useRef } from "react";

interface Plus {
  x: number;
  y: number;
  size: number;
  baseOpac: number;
  currOpac: number;
  baseRotate: number;
  currRotate: number;
  baseColor: { h: number, s: number, l: number };
  currColor: { h: number, s: number, l: number };
}

interface DrawPlus extends Plus {
  ctx: CanvasRenderingContext2D;
}

const SIZE = 10;
const MIN_OPACITY = 0.3;
const MAX_OPACITY = 0.7;
const MAX_GRADE = 5;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function TrailPage() {
  const cRef = useRef<HTMLCanvasElement>(null);
  const pluses = useRef<Plus[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  const drawPlus = useCallback(({ ctx, x, y, size, currOpac, currRotate, currColor: { h, s, l } }: DrawPlus) => {
    ctx.save();// ALWAYS SAVE THE CONTEXT
    ctx.translate(x, y);
    ctx.rotate(currRotate);
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${currOpac})`;
    ctx.lineWidth = SIZE / 3;
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
        const grade = Math.floor(rand * (MAX_GRADE * 2 + 1)) - MAX_GRADE;
        const rotation = grade * (Math.PI / 2);
        const light = Math.floor(40 + rand * 30);
        const clr = { h: 0, s: 0, l: light };
        pluses.push({
          x,
          y,
          size: SIZE,
          baseOpac: opacity,
          currOpac: opacity,
          baseRotate: rotation,
          currRotate: 0,
          baseColor: clr,
          currColor: clr,
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
        plus.currRotate = plus.baseRotate;
        const randHue = (Math.sin(plus.x * 12.9898 + plus.y * 78.233) * 43758.5453) % 30;
        plus.currColor = { h: Math.abs(randHue), s: 80, l: 55 };
      } else {
        plus.currOpac += (plus.baseOpac - plus.currOpac) * 0.05;
        plus.currRotate += (0 - plus.currRotate) * 0.05;
        plus.currColor.h = lerp(plus.currColor.h, plus.baseColor.h, 0.03);
        plus.currColor.s = lerp(plus.currColor.s, plus.baseColor.s, 0.03);
        plus.currColor.l = lerp(plus.currColor.l, plus.baseColor.l, 0.03);
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

    cnvs.addEventListener("mouseleave", () => {
      mouse.current.x = Infinity;
      mouse.current.y = Infinity;
    }, { signal });

    return () => {
      controller.abort();
      cancelAnimationFrame(frameId);
    }
  }, [setupCanvas, animate]);

  return (
    <main className="grid place-items-center relative">
      <canvas ref={cRef} className="bg-transparent w-full max-w-xl aspect-video" />
    </main>
  )
}

