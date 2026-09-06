import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Scroll suave con inercia (Lenis). Publica la velocidad de scroll en
 * `document.documentElement.dataset.scrollVelocity` para que otros
 * islands (p. ej. el ticker de skills) reaccionen a ella sin acoplarse.
 * Desactivado con prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.1, autoRaf: true, anchors: true });
    const onScroll = (instance: Lenis) => {
      document.documentElement.dataset.scrollVelocity = instance.velocity.toFixed(3);
    };
    lenis.on('scroll', onScroll);

    return () => {
      lenis.destroy();
      delete document.documentElement.dataset.scrollVelocity;
    };
  }, []);

  return null;
}
