'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface DataPoint {
  x: number;
  y: number;
}

export default function InteractiveChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateData = () => {
    const points: DataPoint[] = [];
    for (let i = 0; i < 50; i++) {
      points.push({
        x: i * 10,
        y: Math.random() * 300,
      });
    }
    return points;
  };

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setData(generateData());

    const animate = () => {
      if (!isAnimating) return;
      setData(prev =>
        prev.map((p, _i) => ({
          ...p,
          y: Math.max(0, Math.min(300, p.y + (Math.random() - 0.5) * 20)),
        }))
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [isAnimating]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e85d5d';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, canvas.height - point.y);
      } else {
        ctx.lineTo(point.x, canvas.height - point.y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#e85d5d';
    data.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, canvas.height - point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [data]);

  const handleRandomize = useCallback(() => {
    setData(generateData());
    drawChart();
  }, [drawChart]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div className="rounded-xl border-2 border-foreground/10 p-6 bg-foreground/5">
      <h3 className="text-lg font-bold mb-4">
        Interactive Chart (Client-Only)
      </h3>
      <p className="text-sm text-foreground/60 mb-4">
        This component uses &quot;use client&quot; directive - it only hydrates
        on the client. The server renders a placeholder, then this becomes
        interactive.
      </p>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="rounded-lg bg-background border border-foreground/10"
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="btn-primary"
        >
          {isAnimating ? 'Animating...' : 'Start Animation'}
        </button>
        <button
          onClick={stopAnimation}
          disabled={!isAnimating}
          className="btn-secondary"
        >
          Stop
        </button>
        <button onClick={handleRandomize} className="btn-outline">
          Randomize
        </button>
      </div>
    </div>
  );
}
