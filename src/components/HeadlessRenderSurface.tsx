'use client';

import React, { useEffect, useRef } from 'react';
import { HeadlessRenderBridge } from '../video/renderBridge';

export const HeadlessRenderSurface: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bridge = new HeadlessRenderBridge(ctx);
    (window as any).chartAnimatorBridge = bridge;

    return () => {
      if ((window as any).chartAnimatorBridge === bridge) {
        delete (window as any).chartAnimatorBridge;
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black overflow-hidden select-none">
      <canvas
        id="chart-render-canvas"
        ref={canvasRef}
        width={1080}
        height={1920}
        className="w-[270px] h-[480px] bg-neutral-900 shadow-2xl border border-neutral-800"
      />
    </div>
  );
};
