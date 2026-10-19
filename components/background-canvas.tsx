"use client";

import { useEffect, useRef } from "react";
import type { Pointer, Painter } from "./background-painters";
import { createAurora, createParticles } from "./background-painters";


export function BackgroundCanvas({ variant }: { variant: "aurora" | "particles" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const painterRef = useRef<Painter | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const pointerRef = useRef<Pointer>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const painter = variant === "particles" ? createParticles() : createAurora();
    painterRef.current = painter;

    const { width, height } = sizeRef.current;
    if (width && height) painter.resize(width, height);
  }, [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tooSmall = window.matchMedia("(max-width: 767px)").matches;
    const wantsLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (tooSmall || wantsLessMotion) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    let raf = 0;
    let lastFrame = 0;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current = { width, height };

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      painterRef.current?.resize(width, height);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);

      const dt = lastFrame === 0 ? 16 : now - lastFrame;
      lastFrame = now;

      const { width, height } = sizeRef.current;

      if (painterRef.current?.opaque) {
        ctx.fillStyle = "#050a1f";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      painterRef.current?.paint(ctx, dt, pointerRef.current);
    };

    const onMouseMove = (event: MouseEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
    };
    const onMouseLeave = () => {
      pointerRef.current = { x: 0, y: 0, active: false };
    };
    const onClick = (event: MouseEvent) => {
      painterRef.current?.onPointerDown?.(event.clientX, event.clientY);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      lastFrame = 0;
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className={variant === "particles" ? "particles-static" : "aurora-static"} />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-page/30 via-transparent to-page" />
    </div>
  );
}