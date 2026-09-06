import { useEffect, useRef, useState } from 'react';

/**
 * Cursor de dos capas: un punto que sigue al puntero al instante y un
 * anillo que lo persigue con lag (lerp en rAF). El anillo crece sobre
 * elementos interactivos y se estira con la velocidad del puntero.
 * Solo se activa con puntero fino y sin prefers-reduced-motion.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnabled(
      window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!enabled || !dot || !ring) return;

    document.documentElement.classList.add('cursor-active');

    const pos = { x: -100, y: -100 }; // puntero real
    const lag = { x: -100, y: -100 }; // posición del anillo
    let hoverScale = 1;
    let currentScale = 1;
    let visible = false;
    let raf = 0;

    function frame() {
      lag.x += (pos.x - lag.x) * 0.16;
      lag.y += (pos.y - lag.y) * 0.16;
      currentScale += (hoverScale - currentScale) * 0.18;

      // El anillo se estira sutilmente en la dirección del movimiento.
      const vx = pos.x - lag.x;
      const vy = pos.y - lag.y;
      const speed = Math.min(Math.hypot(vx, vy) / 90, 0.28);
      const angle = Math.atan2(vy, vx);

      dot!.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      ring!.style.transform =
        `translate(${lag.x}px, ${lag.y}px) translate(-50%, -50%) ` +
        `rotate(${angle}rad) scale(${currentScale * (1 + speed)}, ${currentScale * (1 - speed)}) ` +
        `rotate(${-angle}rad)`;

      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        lag.x = pos.x;
        lag.y = pos.y;
        dot!.style.opacity = '1';
        ring!.style.opacity = '';
      }
    }

    function onOver(e: PointerEvent) {
      const hit = (e.target as Element | null)?.closest?.('a, button, [data-cursor]');
      hoverScale = hit ? 1.7 : 1;
      ring!.style.borderStyle = hit ? 'dashed' : 'solid';
    }

    function onLeaveWindow() {
      visible = false;
      dot!.style.opacity = '0';
      ring!.style.opacity = '0';
    }

    dot.style.opacity = '0';
    ring.style.opacity = '0';
    raf = requestAnimationFrame(frame);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
      document.documentElement.classList.remove('cursor-active');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
