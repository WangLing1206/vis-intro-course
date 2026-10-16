import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Lang } from './types';
import zh, { type ZhDict } from './zh';
import en from './en';

export type DictKey = keyof ZhDict;
const DICTS: Record<Lang, Record<DictKey, string>> = { zh, en };
const STORE_KEY = 'vis-lang';

function initLang(): Lang {
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q === 'zh' || q === 'en') return q;
  // HashRouter 下也支持 #/?lang=en 形式
  const h = window.location.hash.match(/[?&]lang=(zh|en)/);
  if (h) return h[1] as Lang;
  const s = localStorage.getItem(STORE_KEY);
  return s === 'en' ? 'en' : 'zh';
}

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** t('nav.home') 或 t('chapter.kicker', { n: 1 }) */
  t: (k: DictKey, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<LangCtx>({ lang: 'zh', setLang: () => {}, t: (k) => k });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initLang);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORE_KEY, l);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);
  const t = useCallback(
    (k: DictKey, vars?: Record<string, string | number>) => {
      let s: string = DICTS[lang][k] ?? zh[k] ?? k;
      if (vars) for (const [key, v] of Object.entries(vars)) s = s.replace(`{${key}}`, String(v));
      return s;
    },
    [lang],
  );
  const v = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LangCtx {
  return useContext(Ctx);
}