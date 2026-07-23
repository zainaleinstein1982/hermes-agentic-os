import { useEffect, useRef } from 'react';

export default function HermesOrb({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      // Outer glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.45);
      grad.addColorStop(0, `rgba(0,212,255,${active ? 0.18 : 0.06})`);
      grad.addColorStop(0.5, `rgba(0,212,255,${active ? 0.06 : 0.02})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, W * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Concentric rings
      const rings = [
        { r: W * 0.38, alpha: 0.12, dash: [4, 8], rotate: t * 0.3 },
        { r: W * 0.32, alpha: 0.18, dash: [8, 4], rotate: -t * 0.5 },
        { r: W * 0.25, alpha: 0.25, dash: [2, 6], rotate: t * 0.8 },
        { r: W * 0.18, alpha: 0.35, dash: [6, 3], rotate: -t * 1.1 },
      ];
      rings.forEach(({ r, alpha, dash, rotate }) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotate);
        ctx.setLineDash(dash);
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Frequency bars (arc segments)
      const numBars = 48;
      for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * Math.PI * 2 - Math.PI / 2;
        const barH = active
          ? (8 + Math.sin(t * 3 + i * 0.4) * 6 + Math.random() * 4) * 0.5
          : (2 + Math.sin(t * 1.5 + i * 0.4) * 1.5) * 0.5;
        const r1 = W * 0.33;
        const r2 = r1 + barH;
        const x1 = cx + Math.cos(angle) * r1;
        const y1 = cy + Math.sin(angle) * r1;
        const x2 = cx + Math.cos(angle) * r2;
        const y2 = cy + Math.sin(angle) * r2;
        ctx.strokeStyle = `rgba(0,212,255,${active ? 0.7 : 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Scan line
      const scanAngle = (t * 0.8) % (Math.PI * 2) - Math.PI / 2;
      const scanGrad = ctx.createConicalGradient
        ? null
        : null;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(scanAngle);
      const lineGrad = ctx.createLinearGradient(0, 0, W * 0.36, 0);
      lineGrad.addColorStop(0, 'rgba(0,212,255,0.7)');
      lineGrad.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W * 0.36, 0);
      ctx.stroke();
      ctx.restore();

      // Core glow
      const coreSize = active ? 12 + Math.sin(t * 4) * 3 : 8 + Math.sin(t * 2) * 2;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize * 2.5);
      coreGrad.addColorStop(0, 'rgba(255,255,255,1)');
      coreGrad.addColorStop(0.3, 'rgba(0,212,255,0.9)');
      coreGrad.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Center dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Cardinal tick marks
      const ticks = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      ticks.forEach((a) => {
        const r1 = W * 0.39;
        const r2 = W * 0.43;
        ctx.strokeStyle = 'rgba(0,212,255,0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.stroke();
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      className="block"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
