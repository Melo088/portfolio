import { useRef, useState } from 'react';
import { site } from '../data/site';

/**
 * Correo a prueba de scrapers: el HTML servido no contiene ni la dirección
 * ni un mailto válido. La dirección vive en base64 (site.emailB64) y solo se
 * ensambla al interactuar; queda visible debajo del botón. La etiqueta del
 * botón tampoco es el correo.
 *
 * Datos del honeypot de Spencer Mortensen (2026): texto plano y mailto sin
 * protección se cosecharon el 100% de las veces; ensamblar en JS y exigir
 * interacción bloqueó el 100% de los 700+ spammers medidos.
 *
 * El botón imita a MagneticLink (misma píldora y mismo tirón magnético) para
 * que no se distinga del resto de CTAs.
 */
interface Props {
  /** 'solid' = píldora de tinta (footer), 'link' = enlace de texto (about). */
  variant?: 'solid' | 'link';
  label?: string;
  /** Cuánto sigue al puntero (0–1), igual que MagneticLink. */
  strength?: number;
}

export default function EmailReveal({ variant = 'solid', label = 'Email me', strength = 0.35 }: Props) {
  const [email, setEmail] = useState<string | null>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  function reveal() {
    const value = atob(site.emailB64);
    setEmail(value);
    window.location.href = `mailto:${value}`;
  }

  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== 'mouse') return;
    const inner = innerRef.current;
    if (!inner) return;
    const rect = e.currentTarget.getBoundingClientRect();
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

  const base = 'select-none cursor-pointer';
  const look =
    variant === 'solid'
      ? 'pill text-sm font-semibold tracking-tight transition-[box-shadow,opacity] hover:opacity-90 !px-5 !py-3'
      : 'link-reveal w-fit';

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={reveal}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`${base} ${look}`}
        data-cursor
      >
        <span ref={innerRef} className="block">
          {label}
        </span>
      </button>
      <span aria-live="polite" className="mono text-fg-3 text-[11px]">
        {email ? (
          <a href={`mailto:${email}`} className="link-reveal">
            {email}
          </a>
        ) : null}
      </span>
    </span>
  );
}
