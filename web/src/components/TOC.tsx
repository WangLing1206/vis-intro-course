import { useEffect, useState } from 'react';
import type { Lang } from '../i18n/types';
import type { Section } from '../content/types';
import { tx } from '../content/types';

export function TOC({ sections, lang }: { sections: Section[]; lang: Lang }) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((e): e is HTMLElement => !!e);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [sections]);
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className="toc" aria-label="sections">
      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          className={active === s.id ? 'on' : ''}
          onClick={() => jump(s.id)}
        >
          {tx(s.title, lang)}
        </button>
      ))}
    </nav>
  );
}