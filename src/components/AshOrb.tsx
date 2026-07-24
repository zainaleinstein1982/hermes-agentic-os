import { useEffect, useRef } from 'react';

interface Props {
  active?: boolean;
  size?: number;
}

export default function AshOrb({ active = false, size = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Track active in a ref so the animation loop reads the latest value
  // without needing to restart the requestAnimationFrame loop.
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    let t = 0;
    let raf = 0;

    const draw = () => {
      const a = activeRef.current;
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // Outer aura
      const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.48);
      aura.addColorStop(0, `rgba(124,138,255,${a ? 0.2 : 0.1})`);
      aura.addColorStop(0.4, `rgba(176,138,255,${a ? 0.08 : 0.04})`);
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, W * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // Soft rotating rings
      const rings = [
        { r: W * 0.4, alpha: 0.08, dash: [3, 10], speed: 0.2 },
        { r: W * 0.33, alpha: 0.14, dash: [6, 6], speed: -0.35 },
        { r: W * 0.26, alpha: 0.2, dash: [2, 8], speed: 0.5 },
      ];
      rings.forEach(({ r, alpha, dash, speed }) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * speed);
        ctx.setLineDash(dash);
        ctx.strokeStyle = `rgba(124,138,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Orbital particles
      const numParticles = 6;
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + t * 0.6;
        const r = W * 0.36;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        const pSize = a ? 2.5 + Math.sin(t * 2 + i) * 1.5 : 1.5;
        ctx.fillStyle = `rgba(176,138,255,${a ? 0.8 : 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Waveform arc (when active)
      if (a) {
        const numBars = 64;
        for (let i = 0; i < numBars; i++) {
          const angle = (i / numBars) * Math.PI * 2 - Math.PI / 2;
          const wave = Math.sin(t * 4 + i * 0.3) * 0.5 + Math.sin(t * 7 + i * 0.5) * 0.3;
          const barH = 4 + wave * 10 + 6;
          const r1 = W * 0.3;
          const r2 = r1 + barH;
          ctx.strokeStyle = `rgba(124,138,255,${0.4 + wave * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
          ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
          ctx.stroke();
        }
      }

      // Core — soft breathing glow
      const coreR = (a ? 14 : 10) + Math.sin(t * 2) * (a ? 4 : 2);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
      core.addColorStop(0, 'rgba(255,255,255,0.95)');
      core.addColorStop(0.2, 'rgba(176,138,255,0.8)');
      core.addColorStop(0.5, 'rgba(124,138,255,0.4)');
      core.addColorStop(1, 'rgba(124,138,255,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Center dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
    // Empty dep array — animation loop starts ONCE on mount and never restarts
  }, []);

  return <canvas ref={canvasRef} width={size} height={size} className="block" />;
}
