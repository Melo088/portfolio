import { useEffect, useRef, useState } from 'react';

/**
 * Reveal de texto palabra a palabra (estilo React Bits "Blur Text"):
 * cada palabra entra desenfocada y desplazada, con stagger, cuando el
 * elemento entra en viewport.
 */
interface Props {
  text: string;
  /** Retardo inicial en ms antes de la primera palabra. */
  delay?: number;
  /** Stagger entre palabras en ms. */
  step?: number;
  className?: string;
}

export default function BlurReveal({ text, delay = 0, step = 60, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {/* aria-label is not allowed on a generic span: expose the text to
          assistive tech through a visually hidden copy instead. */}
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span
            className="inline-block will-change-transform"
            style={{
              filter: shown ? 'blur(0)' : 'blur(8px)',
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateY(0)' : 'translateY(0.6em)',
              transition:
                'filter 0.6s ease, opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: `${delay + i * step}ms`,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
