import { useEffect, useRef, useState } from 'react';

/** Hero 画布:动态 import three,失败或无 WebGL 时降级为静态底 */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import('../three/hero')
      .then((m) => {
        if (cancelled || !ref.current) return;
        try {
          dispose = m.mountHero(ref.current);
        } catch {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      try {
        dispose?.();
      } catch {
        /* ignore */
      }
    };
  }, []);

  if (failed) return <div className="hero-fallback" aria-hidden />;
  return <canvas ref={ref} aria-hidden />;
}