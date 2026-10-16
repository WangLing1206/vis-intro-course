import { useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../i18n/types';
import type { ParamSpec, ParamValues } from '../content/types';
import { useLang } from '../i18n/LangContext';
import { loadDemo } from '../demos/registry';
import { ParamBar, defaultParams } from './Controls';

interface Props {
  demoId: string;
  specs?: ParamSpec[];
  lang: Lang;
  values?: ParamValues;
  onValues?: (v: ParamValues) => void;
}

export function DemoHost({ demoId, specs = [], lang, values: ext, onValues }: Props) {
  const { t } = useLang();
  const boxRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inner, setInner] = useState(() => defaultParams(specs));
  const values = ext ?? inner;
  const valuesKey = useMemo(() => JSON.stringify(values), [values]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => setVisible(es[0]?.isIntersecting ?? false),
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    setLoading(true);
    setFailed(false);
    loadDemo(demoId)
      .then((mod) => {
        if (cancelled || !boxRef.current) return;
        try {
          dispose = mod.mount(boxRef.current, { lang, params: JSON.parse(valuesKey) });
        } catch {
          if (!cancelled) setFailed(true);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      try {
        dispose?.();
      } catch {
        /* ignore */
      }
    };
  }, [visible, demoId, lang, valuesKey]);

  const change = (k: string, v: string | number) => {
    if (onValues) onValues({ ...values, [k]: v });
    else setInner((o) => ({ ...o, [k]: v }));
  };

  return (
    <div className="demo">
      <ParamBar specs={specs} values={values} lang={lang} onChange={change} />
      <div className="demo-body" ref={boxRef}>
        {loading && !failed && <div className="demo-err">{t('demo.loading')}</div>}
        {failed && <div className="demo-err">{t('demo.error')}</div>}
      </div>
    </div>
  );
}