import { useMemo, useState } from 'react';
import type { Lang } from '../i18n/types';
import type { Section } from '../content/types';
import { renderCode, tx } from '../content/types';
import { RichText } from './RichText';
import { CodeBlock } from './CodeBlock';
import { DemoHost } from './DemoHost';
import { defaultParams } from './Controls';

/** 三段式知识块:讲解 -> 代码 -> 渲染效果;参数由本层持有,代码与效果联动 */
export function KnowledgeBlock({ section, lang }: { section: Section; lang: Lang }) {
  const specs = section.params ?? [];
  const [values, setValues] = useState(() => defaultParams(specs));

  const rawSource = useMemo(() => {
    if (!section.code) return '';
    return typeof section.code.source === 'string'
      ? section.code.source
      : tx(section.code.source, lang);
  }, [section.code, lang]);

  const linked = specs.length > 0 && /\{\{\w+\}\}/.test(rawSource);
  const source = useMemo(
    () => (linked ? renderCode(rawSource, specs, values) : rawSource),
    [linked, rawSource, specs, values],
  );

  return (
    <section className="kblock" id={section.id} data-kblock={section.id}>
      <h2>{tx(section.title, lang)}</h2>
      <RichText nodes={section.body} lang={lang} />
      {section.code && (
        <CodeBlock codeLang={section.code.lang} source={source} linked={linked} />
      )}
      {section.demoId && (
        <DemoHost
          demoId={section.demoId}
          specs={specs}
          lang={lang}
          values={values}
          onValues={setValues}
        />
      )}
      {section.caption && <p className="demo-cap">{tx(section.caption, lang)}</p>}
    </section>
  );
}