import { useRef, type ReactNode } from 'react';

/**
 * Enlace/CTA magnético: dentro del área del elemento, el contenido se
 * desplaza hacia el puntero (estilo React Bits "Magnet"); al salir,
 * vuelve a su sitio con una transición elástica.
 */
interface Props {
  href: string;
  children: ReactNode;
  /** 'solid' = bloque blanco, 'outline' = borde. */
  variant?: 'solid' | 'outline';
  download?: boolean;
  external?: boolean;
  /** Cuánto sigue al puntero (0–1). */
  strength?: number;
  className?: string;
}

export default function MagneticLink({
  href,
  children,
  variant = 'outline',
  download = false,
  external = false,
  strength = 0.35,
  className = '',
}: Props) {
  const innerRef = useRef<HTMLSpanElement>(null);

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const inner = innerRef.current;
    if (!inner) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    inner.style.transition = 'transform 0.15s ease-out';
    inner.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  }

  function onLeave() {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
    inner.style.transform = 'translate(0, 0)';
  }

  const base =
    'inline-block select-none text-sm font-bold uppercase tracking-widest';
  const look =
    variant === 'solid'
      ? 'bg-paper text-ink hover:bg-paper/90'
      : 'border border-paper/40 text-paper hover:border-paper';

  return (
    <a
      href={href}
      download={download || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`${base} ${look} px-7 py-4 transition-colors ${className}`}
      data-cursor
    >
      <span ref={innerRef} className="block">
        {children}
      </span>
    </a>
  );
}
