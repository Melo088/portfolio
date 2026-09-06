import { useEffect, useRef } from 'react';

/**
 * Cinta infinita de skills que reacciona a la velocidad de scroll
 * (estilo React Bits "Scroll Velocity"): avanza sola a velocidad base y
 * acelera / invierte dirección según lo rápido que se haga scroll.
 * Lee la velocidad publicada por SmoothScroll en el dataset del <html>,
 * con fallback a delta de scrollY si Lenis no está activo.
 */
interface Props {
  items: readonly string[];
  /** px/frame de velocidad base. */
  baseSpeed?: number;
  /** true para que la fila avance hacia la izquierda. */
  reverse?: boolean;
  className?: string;
}

export default function VelocityTicker({
  items,
  baseSpeed = 0.6,
  reverse = false,
  className = '',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let offset = 0;
    let raf = 0;
    let lastScrollY = window.scrollY;
    let fallbackVelocity = 0;

    function frame() {
      // Velocidad de Lenis si está disponible; si no, derivada de scrollY.
      const published = document.documentElement.dataset.scrollVelocity;
      let velocity: number;
      if (published !== undefined) {
        velocity = parseFloat(published) || 0;
      } else {
        const y = window.scrollY;
        fallbackVelocity = fallbackVelocity * 0.9 + (y - lastScrollY) * 0.1;
        lastScrollY = y;
        velocity = fallbackVelocity;
      }

      const dir = reverse ? -1 : 1;
      const boost = Math.max(-6, Math.min(6, velocity * 0.35));
      offset += dir * (baseSpeed + boost);

      // El contenido está duplicado: envolver en la mitad = loop perfecto.
      const half = track!.scrollWidth / 2;
      if (half > 0) {
        offset = ((offset % half) + half) % half;
      }
      track!.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [baseSpeed, reverse]);

  const row = items.map((item, i) => (
    <span key={i} className="mx-6 inline-flex items-center gap-12 whitespace-nowrap">
      <span className="text-condensed text-4xl font-black uppercase md:text-6xl">
        {item}
      </span>
      <span className="text-muted select-none text-2xl" aria-hidden="true">
        •
      </span>
    </span>
  ));

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{row}</div>
        <div className="flex shrink-0 items-center">{row}</div>
      </div>
    </div>
  );
}
