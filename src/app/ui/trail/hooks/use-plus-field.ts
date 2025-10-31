import { useCallback, useEffect, useRef } from "react";
import { PLUS_CONSTANTS, lerp, seededRandom, seed } from "@/app/ui/trail/utils";
import type { DrawPlus, Plus } from "@/app/ui/trail/types";

export function usePlusField(cols: number, rows: number) {
  const cRef = useRef<HTMLCanvasElement>(null);
  const pluses = useRef<Plus[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  const drawPlus = useCallback(({ ctx, x, y, size, currOpac, currRotate, currColor: { h, s, l } }: DrawPlus) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(currRotate);
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${currOpac})`;
    ctx.lineWidth = size / 3;
    ctx.stroke();
    ctx.restore();
  }, []);

  const generatePlus = useCallback((width: number, height: number) => {
    const { SIZE, SPACING_MULTIPLIER, MIN_OPACITY, MAX_OPACITY, MAX_GRADE, MIN_LIGHT, MAX_LIGHT } = PLUS_CONSTANTS;
    const plusList: Plus[] = [];
    const spacing = SIZE * SPACING_MULTIPLIER;
    //const cols = Math.floor(width / spacing);
    //const rows = Math.floor(height / spacing);
    const gridWidth = (cols - 1) * spacing;
    const gridHeight = (rows - 1) * spacing;
    const offsetX = (width - gridWidth) / 2;
    const offsetY = (height - gridHeight) / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const rand = seededRandom(i, j);
        const opacity = rand * (MAX_OPACITY - MIN_OPACITY) + MIN_OPACITY;
        const grade = Math.floor(rand * (MAX_GRADE * 2 + 1)) - MAX_GRADE;
        const rotation = grade * (Math.PI / 2);
        const light = Math.floor(MIN_LIGHT + rand * (MAX_LIGHT - MIN_LIGHT));
        const clr = { h: 0, s: 0, l: light };

        plusList.push({
          x: spacing * i + offsetX,
          y: spacing * j + offsetY,
          size: SIZE,
          baseOpac: opacity,
          currOpac: opacity,
          baseRotate: rotation,
          currRotate: 0,
          baseColor: { ...clr },
          currColor: { ...clr },
        });
      }
    }
    return plusList;
  }, [cols, rows]);

  const setupCanvas = useCallback(() => {
    const cnvs = cRef.current;
    if (!cnvs) return;

    const ctx = cnvs.getContext("2d");
    if (!ctx) return;

    const DPR = window.devicePixelRatio;
    const { width, height } = cnvs.getBoundingClientRect();
    cnvs.width = width * DPR;
    cnvs.height = height * DPR;
    ctx.scale(DPR, DPR);
    ctx.save();

    pluses.current = generatePlus(width, height);
  }, [cRef, generatePlus]);

  const animate = useCallback(() => {
    const cnvs = cRef.current;
    if (!cnvs) return false;

    const ctx = cnvs.getContext("2d");
    if (!ctx) return false;

    const { SIZE, HOVER_RADIUS_MULTIPLIER, FADE_IN_SPEED, FADE_OUT_SPEED, COLOR_LERP_SPEED, ROTATE_LERP_SPEED } =
      PLUS_CONSTANTS;

    let isDirty = false;

    const { width, height } = cnvs.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);

    for (const plus of pluses.current) {
      const dx = mouse.current.x - plus.x;
      const dy = mouse.current.y - plus.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < HOVER_RADIUS_MULTIPLIER * SIZE) {
        plus.currOpac += (1 - plus.currOpac) * FADE_IN_SPEED;
        plus.currRotate = plus.baseRotate;
        const randHue = seed(plus.x, plus.y) % 30;
        plus.currColor = { h: Math.abs(randHue), s: 80, l: 55 };
      } else {
        plus.currOpac += (plus.baseOpac - plus.currOpac) * FADE_OUT_SPEED;
        plus.currRotate += (0 - plus.currRotate) * ROTATE_LERP_SPEED;
        plus.currColor.h = lerp(plus.currColor.h, plus.baseColor.h, COLOR_LERP_SPEED);
        plus.currColor.s = lerp(plus.currColor.s, plus.baseColor.s, COLOR_LERP_SPEED);
        plus.currColor.l = lerp(plus.currColor.l, plus.baseColor.l, COLOR_LERP_SPEED);
      }

      if (
        Math.abs(plus.currOpac - plus.baseOpac) > 0.001 ||
        Math.abs(plus.currRotate) > 0.001 ||
        Math.abs(plus.currColor.h - plus.baseColor.h) > 0.5
      ) {
        isDirty = true;
      }

      drawPlus({ ctx, ...plus });
    }
    return isDirty;
  }, [drawPlus]);

  useEffect(() => {
    const cnvs = cRef.current;
    if (!cnvs) return;

    const controller = new AbortController();
    const { signal } = controller;
    let frameId: number | null = null;
    let isAnimating = false;
    let idleTimeout: number | null = null;

    setupCanvas();
    animate();

    const { IDLE_TIMEOUT, KICK_FRAMES } = PLUS_CONSTANTS;

    function startLoop() {
      if (isAnimating) return;
      isAnimating = true;

      if (idleTimeout) clearTimeout(idleTimeout);

      let kickFrames = KICK_FRAMES;
      function kick() {
        const stillChanging = animate();
        if (kickFrames-- > 0 || stillChanging) {
          frameId = requestAnimationFrame(kick);
        } else {
          frameId = requestAnimationFrame(loop);
        }
      }
      kick();
    }

    function stopLoop() {
      isAnimating = false;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
    }

    function loop() {
      if (!isAnimating) return;
      const stillChanging = animate();

      if (stillChanging) {
        frameId = requestAnimationFrame(loop);
      } else {
        idleTimeout = window.setTimeout(stopLoop, IDLE_TIMEOUT);
      }
    };


    const handlePointerMove = (e: MouseEvent) => {
      const rect = cnvs.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;

      startLoop();
    };

    const handlePointerLeave = () => {
      mouse.current.x = Infinity;
      mouse.current.y = Infinity;

      startLoop();
    };

    cnvs.addEventListener("pointermove", handlePointerMove, { signal });
    cnvs.addEventListener("pointerleave", handlePointerLeave, { signal });

    window.addEventListener("resize", () => {
      setupCanvas();
      animate();

    }, { signal });

    return () => {
      controller.abort();
      stopLoop();
    }
  }, [setupCanvas, animate, cols, rows]);

  return {
    canvasRef: cRef,
  }
};

