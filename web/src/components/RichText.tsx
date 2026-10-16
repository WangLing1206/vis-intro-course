import type { Lang } from '../i18n/types';
import type { ProseNode } from '../content/types';
import { tx } from '../content/types';

/** 受控正文渲染:只允许 p/h3/olist/figure,样式收敛于 prose.css */
export function RichText({ nodes, lang }: { nodes: ProseNode[]; lang: Lang }) {
  return (
    <div className="prose">
      {nodes.map((n, i) => {
        if (n.t === 'p') return <p key={i}>{tx(n.x, lang)}</p>;
        if (n.t === 'h3') return <h3 key={i}>{tx(n.x, lang)}</h3>;
        if (n.t === 'olist')
          return (
            <ol key={i}>
              {n.x[lang].map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ol>
          );
        return (
          <figure key={i}>
            <img src={`${import.meta.env.BASE_URL}${n.src}`} alt={tx(n.alt, lang)} />
            <figcaption>{tx(n.alt, lang)}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}